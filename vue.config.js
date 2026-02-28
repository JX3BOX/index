const path = require("path");
const pkg = require("./package.json");
const { JX3BOX, SEO } = require("@jx3box/jx3box-common");
const Setting = require("./setting.json");
const VueProxyPlugin = require("@jx3box/jx3box-fe-proxy");

function resolve(dir) {
    return path.join(__dirname, dir);
}
const pages = {
    index: {
        title: "剑网3" + Setting.suffix,
        entry: "src/main.js",
        template: "public/index.html",
        filename: "index.html",
    },
    notice: {
        title: "公告资讯" + Setting.suffix,
        entry: "src/pages/notice.js",
        template: "public/index.html",
        filename: "notice/index.html",
    },
    tv: {
        title: "魔盒电视台" + Setting.suffix,
        entry: "src/pages/tv.js",
        template: "public/index.html",
        filename: "tv/index.html",
    },
    about: {
        title: "关于我们" + Setting.suffix,
        entry: "src/pages/about.js",
        template: "public/index.html",
        filename: "about/index.html",
    },
    post: {
        title: "作品" + Setting.suffix,
        entry: "src/pages/post.js",
        template: "public/index.html",
        filename: "post/index.html",
    },
    search: {
        title: "搜索" + Setting.suffix,
        entry: "src/pages/search.js",
        template: "public/index.html",
        filename: "search/index.html",
    },
    jx3: {
        title: "剑网3.com",
        entry: "src/pages/jx3.js",
        template: "public/index.html",
        filename: "jx3/index.html",
    }
};

module.exports = {
    //❤️ Multiple pages ~
    pages: pages,
    productionSourceMap: false,

    //❤️ Proxy ~
    devServer: {
        proxy: {
             ...VueProxyPlugin.generateBuiltinProxy(),
            // 专门为直接的 /api/next2/ 路径配置代理到 dev.next2.jx3box.com
            '/api/next2': {
                target: 'https://dev.next2.jx3box.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/next2': '/api/next2'
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            '/api/summary-any': {
                target: 'https://dev.next2.jx3box.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/next2': '/api/next2'
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            }
        },
        disableHostCheck: true,
        port: process.env.DEV_PORT || 12028, // 设置端口号
    },

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === "development" && "/") ||
        (process.env.BUILD_MODE == "preview" && `/${pkg.name}/`) ||
        //BY relative path
        (process.env.BUILD_MODE === "preview" && `/${pkg.name}/`) ||
        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        //BY root path or bind a domain
        (process.env.STATIC_PATH == "root" && "/") ||
        //for lost
        "/",
    transpileDependencies: [
        "@jx3box/jx3box-editor",
        "htmlparser2",
        "cheerio",
        "dom-serializer",
        "domelementtype",
        "domhandler",
        "domutils",
        "entities",
        "parse5",
        "parse5-htmlparser2-tree-adapter",
    ],
    chainWebpack: (config) => {
        // // it can improve the speed of the first screen, it is recommended to turn on preload
        // Object.keys(pages).forEach((name) => {
        //     config.plugin(`preload-${name}`).tap(() => [
        //         {
        //             rel: "preload",
        //             // to ignore runtime.js
        //             fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        //             include: "initial",
        //         },
        //     ]);
        // });

        // // when there are many pages, it will cause too many meaningless requests
        // config.plugins.delete("prefetch");

        // use svg locally
        // set svg-sprite-loader
        config.module.rule("svg").exclude.add(resolve("src/icons")).end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end();

        // // drop console.log
        // config.optimization.minimizer("terser").tap((args) => {
        //     args[0].terserOptions.compress.drop_console = true;
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap((options) => Object.assign(options, { limit: 10240, esModule: false }));

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        var preload_styles = [];
        preload_styles.push(
            path.resolve(__dirname, "./node_modules/csslab/base.less"),
            path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
            path.resolve(__dirname, "./src/assets/css/var.less"),
            path.resolve(__dirname, "./src/assets/css/search/var.less")
        );

        function addStyleResource(rule) {
            rule.use("style-resource").loader("style-resources-loader").options({
                patterns: preload_styles,
            });
        }
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
    },
};
