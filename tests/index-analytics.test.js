const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transformSync } = require("@babel/core");
const transformModulesCommonjs = require("@babel/plugin-transform-modules-commonjs");

const root = path.resolve(__dirname, "..");
const packageInfo = require(path.join(root, "package.json"));
const installedCommon = require(path.join(root, "node_modules/@jx3box/jx3box-common/package.json"));
const utilityPath = path.join(root, "src/utils/analytics.js");
const utilitySource = fs.readFileSync(utilityPath, "utf8");
const indexSource = fs.readFileSync(path.join(root, "src/views/index/Index.vue"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "src/main.js"), "utf8");
const tvSource = fs.readFileSync(path.join(root, "src/views/tv/TV.vue"), "utf8");
const downloadSource = fs.readFileSync(path.join(root, "src/views/download/Download.vue"), "utf8");
const publicIndex = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

assert.strictEqual(packageInfo.dependencies["@jx3box/jx3box-common"], "9.3.0");
assert.strictEqual(installedCommon.version, "9.3.0");
assert(!packageInfo.dependencies["@jx3box/jx3box-common"].startsWith("file:"));
assert(!packageInfo.dependencies["@jx3box/jx3box-common"].startsWith("link:"));

assert(mainSource.includes('createIndexAnalytics(store)'));
assert(mainSource.includes("app.use(analyticsPlugin)"));
assert.strictEqual((indexSource.match(/v-track-page=/g) || []).length, 1);
assert(indexSource.includes('page_key: "index.home"'));
assert(indexSource.includes('event_types: ["page_view", "click", "exposure", "scroll_depth"]'));
assert.strictEqual((indexSource.match(/v-track:exposure\.once=/g) || []).length, 7);
assert(!tvSource.includes("v-track-page"));
assert(!downloadSource.includes("v-track-page"));
assert(publicIndex.includes("clarity.ms/tag/"), "existing Clarity integration must remain untouched");
assert(publicIndex.includes("hm.baidu.com/hm.js"), "existing Baidu analytics must remain untouched");

const compiled = transformSync(utilitySource, {
    babelrc: false,
    configFile: false,
    plugins: [transformModulesCommonjs],
}).code;

let resolverOptions = null;
let analyticsOptions = null;
const moduleMocks = {
    "@jx3box/jx3box-common/data/jx3box.json": { __cms: "https://cms.jx3box.com/" },
    "@jx3box/jx3box-common/js/utils": { getTokenFromUrl: () => "url-token" },
    "@jx3box/jx3box-common/js/analytics.js": {
        createRemotePageResolver(options) {
            resolverOptions = options;
            return "page-resolver";
        },
        createAnalytics(options) {
            analyticsOptions = options;
            return { track() {} };
        },
        createVue3AnalyticsPlugin() {
            return "analytics-plugin";
        },
    },
    "../../package.json": { version: "4.0.0" },
};
const runtime = {
    __APP_VERSION__: "runtime-version",
    navigator: { userAgent: "Mozilla/5.0 (iPhone; Mobile)", platform: "iPhone" },
    localStorage: { getItem: () => null },
    btoa: (value) => Buffer.from(value).toString("base64"),
};
const utilityModule = { exports: {} };
vm.runInNewContext(`(function (require, module, exports) { ${compiled}\n})`, {
    window: runtime,
    process: {
        env: {
            VUE_APP_PROXY_ENABLE: "1",
            VUE_APP_PROXY_PREFIX: "/__proxy",
        },
    },
    console,
    Buffer,
})((id) => {
    if (!Object.prototype.hasOwnProperty.call(moduleMocks, id)) throw new Error(`Unexpected import: ${id}`);
    return moduleMocks[id];
}, utilityModule, utilityModule.exports);

const utility = utilityModule.exports;
assert.strictEqual(utility.resolveCmsApiBase(), "/__proxy/cms/api/cms");
const result = utility.createIndexAnalytics({ state: { client: "origin" } }, { runtime });
assert.strictEqual(result.plugin, "analytics-plugin");
assert.strictEqual(resolverOptions.endpoint, "/__proxy/cms/api/cms/system/stat/tracking/config");
assert.strictEqual(analyticsOptions.endpoint, "/__proxy/cms/api/cms/system/stat/tracking/batch");
assert.strictEqual(analyticsOptions.resolvePage, "page-resolver");
assert.strictEqual(analyticsOptions.client, "mobile_web");
assert.strictEqual(analyticsOptions.platform, "ios");
assert.strictEqual(analyticsOptions.gameClient(), "origin");
assert.strictEqual(analyticsOptions.webVersion, "runtime-version");
assert.strictEqual(
    analyticsOptions.headersProvider().Authorization,
    `Basic ${Buffer.from("url-token:cms common request").toString("base64")}`
);

console.log("index analytics checks passed");
