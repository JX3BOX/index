const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { transformSync } = require("@babel/core");
const source = fs.readFileSync(require.resolve("../src/utils/analytics.js"), "utf8");
const code = transformSync(source, {
    babelrc: false,
    configFile: false,
    plugins: [require("@babel/plugin-transform-modules-commonjs")],
}).code;
const calls = {};
const record =
    (name, result = {}) =>
    (options) => {
        calls[name] = options;
        return result;
    };
const common = {
    createIdentity: record("identity", { getInstanceId: () => "shared-instance" }),
};
const moduleObject = { exports: {} };
vm.runInThisContext(`(function(require,module,exports,process){${code}\n})`)(
    (name) => {
        if (name.endsWith("data/jx3box.json")) return { __cms: "https://cms.jx3box.com" };
        if (name.endsWith("js/utils")) return { getTokenFromUrl: () => "" };
        if (name.endsWith("js/analytics.js")) return common;
        if (name === "./game-client") return { resolveGameClient: () => "std" };
        if (name === "@jx3box/jx3box-common/js/page-tracking.js")
            return {
                DEFAULT_LAYOUT_VERSION: "web-v1",
                createPageTracker: record("tracker", { install() {}, destroy() {} }),
            };
        if (name.endsWith("package.json")) return { version: "4.0.0" };
        throw new Error(name);
    },
    moduleObject,
    moduleObject.exports,
    { env: { NODE_ENV: "production" } }
);
(async () => {
    const runtime = {
        location: { search: "" },
        navigator: { userAgent: "iPhone", platform: "iPhone" },
        localStorage: {
            getItem() {
                return "";
            },
        },
    };
    const router = { currentRoute: { value: { meta: { analytics: { layout_version: "index-home-v2" } } } } };
    const result = moduleObject.exports.createIndexPageTracking(router, { runtime });
    assert.equal(calls.tracker.getLayoutVersion(), "index-home-v2");
    assert.equal(calls.tracker.router, router);
    router.currentRoute.value = { meta: {} };
    assert.equal(calls.tracker.getLayoutVersion(), "web-v1");
    assert.equal(calls.tracker.identity.getInstanceId(), "shared-instance");
    assert(calls.tracker.endpoint.endsWith("/system/stat/tracking/v2"));
    assert.equal(router.__jx3boxAnalyticsRouterOwner__, undefined, "首页不占用 Traffic Router，交由公共头安装");
    assert.equal(result.queue, undefined, "首页不再创建独立 Traffic 队列");
    const installed = [];
    result.plugin.install({ directive: (name) => installed.push(name), use: () => installed.push("v2") });
    assert.deepEqual(installed, ["v2"], "首页不再注册重复的 track-page 指令");
    delete calls.identity;
    delete calls.queue;
    const preview = moduleObject.exports.createIndexPageTracking(
        {},
        { runtime: { location: { search: "?jx3box_analytics_preview=1" } } }
    );
    assert.equal(preview.identity, null);
    assert.equal(calls.identity, undefined);
    assert.equal(calls.queue, undefined);
    assert.equal(calls.tracker.identity, undefined, "预览只安装无采集布局桥");
    console.log("首页仅安装页面追踪，Traffic 交由公共头，预览隔离通过");
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
