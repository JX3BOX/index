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
    createAnalyticsCore: record("core", { track() {} }),
    createCompositeRuleResolver: record("resolver"),
    createIdentity: record("identity", { getInstanceId: () => "shared-instance" }),
    createEventQueue: record("queue"),
    createQueueStorage: record("storage"),
    createRemoteRuleResolver: () => async () => ({
        enabled: true,
        event_types: ["page_view", "click"],
        page_key: "index.home",
        route_pattern: "/index",
    }),
    createTrafficSink: record("traffic", { key: "traffic" }),
    createVue3AnalyticsPlugin: () => ({ directives: { trackPage: {} }, destroy() {} }),
};
const moduleObject = { exports: {} };
vm.runInThisContext(`(function(require,module,exports,process){${code}\n})`)(
    (name) => {
        if (name.endsWith("data/jx3box.json")) return { __cms: "https://cms.jx3box.com" };
        if (name.endsWith("js/utils")) return { getTokenFromUrl: () => "" };
        if (name.endsWith("js/analytics.js")) return common;
        if (name === "./page-tracking")
            return {
                DEFAULT_LAYOUT_VERSION: "web-v1",
                createPageTracker: record("tracker", { install() {}, unmount() {} }),
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
    const result = moduleObject.exports.createIndexAnalytics({ state: { client: "origin" } }, router, { runtime });
    assert.equal(calls.tracker.getLayoutVersion(), "index-home-v2");
    router.currentRoute.value = { meta: {} };
    assert.equal(calls.tracker.getLayoutVersion(), "web-v1");
    assert.deepEqual(calls.queue.sinks, [{ key: "traffic" }], "公共 SDK 继续负责 Traffic，旧 Tracking sink 已移除");
    assert.equal(calls.tracker.identity.getInstanceId(), "shared-instance");
    assert(calls.tracker.endpoint.endsWith("/system/stat/tracking/v2"));
    assert.equal(calls.core.gameClient(), "origin");
    assert.equal(await calls.resolver.tracking({}), null);
    assert.deepEqual(
        (await calls.resolver.traffic({ page_key: "index.home", route_name: "index", route_pattern: "/index" }))
            .event_types,
        ["page_view"]
    );
    assert.equal(await calls.resolver.traffic({ page_key: "index.tv", route_name: "tv", route_pattern: "/tv" }), null);
    const installed = [];
    result.plugin.install({ directive: (name) => installed.push(name), use: () => installed.push("v2") });
    assert.deepEqual(installed, ["track-page", "v2"], "保留 Traffic 页面元数据，v-track 由 V2 负责");
    delete calls.identity;
    delete calls.queue;
    const preview = moduleObject.exports.createIndexAnalytics(
        {},
        {},
        { runtime: { location: { search: "?jx3box_analytics_preview=1" } } }
    );
    assert.equal(preview.identity, null);
    assert.equal(calls.identity, undefined);
    assert.equal(calls.queue, undefined);
    assert.equal(calls.tracker.identity, undefined, "预览只安装无采集布局桥");
    console.log("首页 Traffic 保留、V2 接入、预览隔离通过");
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
