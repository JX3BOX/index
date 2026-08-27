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
const routerSource = fs.readFileSync(path.join(root, "src/router/index.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "src/main.js"), "utf8");
const tvSource = fs.readFileSync(path.join(root, "src/views/tv/TV.vue"), "utf8");
const downloadSource = fs.readFileSync(path.join(root, "src/views/download/Download.vue"), "utf8");
const publicIndex = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

assert.strictEqual(packageInfo.dependencies["@jx3box/jx3box-common"], "9.5.2");
assert.strictEqual(installedCommon.version, "9.5.2");
assert(!packageInfo.dependencies["@jx3box/jx3box-common"].startsWith("^"));
assert(!packageInfo.dependencies["@jx3box/jx3box-common"].startsWith("file:"));
assert(!packageInfo.dependencies["@jx3box/jx3box-common"].startsWith("link:"));

assert(mainSource.includes("createIndexAnalytics(store, router)"));
assert(mainSource.includes("if (analyticsPlugin) app.use(analyticsPlugin)"));
assert(routerSource.includes('page_key: "index.home"'));
assert(routerSource.includes('route_pattern: "/index"'));
assert(routerSource.includes('route_path: "/index"'));
assert(routerSource.includes('layout_version: "index-home-v1"'));
assert.strictEqual((indexSource.match(/v-track-page=/g) || []).length, 1);
assert(indexSource.includes('page_key: "index.home"'));
assert(indexSource.includes('layout_version: "index-home-v1"'));
assert(!indexSource.includes("event_types"), "Router mode page directive must be metadata-only");
assert.strictEqual((indexSource.match(/v-track:exposure\.once=/g) || []).length, 7);
for (const moduleId of ["sidebar", "slider", "box", "joke", "activity", "posts", "world"]) {
    assert(indexSource.includes(`v-track-id="'index.${moduleId}'"`));
    assert(indexSource.includes(`module_id: '${moduleId}'`));
}
assert(!tvSource.includes("v-track-page"));
assert(!downloadSource.includes("v-track-page"));
assert(publicIndex.includes("clarity.ms/tag/"), "existing Clarity integration must remain untouched");
assert(publicIndex.includes("hm.baidu.com/hm.js"), "existing Baidu analytics must remain untouched");

for (const requiredApi of [
    "createAnalyticsCore",
    "createCompositeRuleResolver",
    "createEventQueue",
    "createIdentity",
    "createQueueStorage",
    "createRemoteRuleResolver",
    "createTrackingSink",
    "createTrafficSink",
    "createVue3AnalyticsPlugin",
]) {
    assert(utilitySource.includes(requiredApi), `${requiredApi} must be used by the index integration`);
}
assert(!utilitySource.includes("createAnalytics,"), "legacy Tracking-only client must not remain installed");
assert(!utilitySource.includes("createRemotePageResolver"));
assert(utilitySource.includes("jx3box_analytics_preview=1"));

const compiled = transformSync(utilitySource, {
    babelrc: false,
    configFile: false,
    plugins: [transformModulesCommonjs],
}).code;

let analyticsOptions = null;
let compositeOptions = null;
let identityOptions = null;
let pluginOptions = null;
let pluginClient = null;
let queueOptions = null;
let storageOptions = null;
let trackingSinkOptions = null;
let trafficSinkOptions = null;
const creationCounts = {
    analytics: 0,
    identity: 0,
    plugin: 0,
    queue: 0,
    storage: 0,
    trackingSink: 0,
    trafficSink: 0,
};
const remoteOptions = [];
const remoteCalls = [];
const identity = { key: "one-identity" };
const queue = { key: "one-journal" };
const analytics = { track() {} };

function broadRuleFor(endpoint) {
    const common = {
        enabled: true,
        page_key: "index.home",
        route_pattern: "/index",
        sample_rate: 1,
        event_types: ["page_view", "click", "exposure", "scroll_depth", "unexpected_event"],
        rule_version: "index-rule-v1",
    };
    if (endpoint.includes("/tracking/")) {
        return {
            ...common,
            layout_version: "index-home-v1",
            property_keys: ["module_id", "position", "depth_percent", "unexpected_property"],
            interaction_target_rules: [
                { target_key: "index.sidebar", validator: "safe_key" },
                { target_key: "outside.scope", validator: "safe_key" },
            ],
        };
    }
    return {
        ...common,
        require_public_target: true,
        query_targets: [{ query_key: "secret", target_type: "unsafe", validator: "safe_key" }],
    };
}

const moduleMocks = {
    "@jx3box/jx3box-common/data/jx3box.json": { __cms: "https://cms.jx3box.com/" },
    "@jx3box/jx3box-common/js/utils": { getTokenFromUrl: () => "url-token" },
    "@jx3box/jx3box-common/js/analytics.js": {
        createAnalyticsCore(options) {
            creationCounts.analytics += 1;
            analyticsOptions = options;
            return analytics;
        },
        createCompositeRuleResolver(options) {
            compositeOptions = options;
            return "composite-rule-resolver";
        },
        createEventQueue(options) {
            creationCounts.queue += 1;
            queueOptions = options;
            return queue;
        },
        createIdentity(options) {
            creationCounts.identity += 1;
            identityOptions = options;
            return identity;
        },
        createQueueStorage(options) {
            creationCounts.storage += 1;
            storageOptions = options;
            return "journal-storage";
        },
        createRemoteRuleResolver(options) {
            remoteOptions.push(options);
            return async function remoteResolver(request) {
                remoteCalls.push({ endpoint: options.endpoint, request });
                if (request.domain === "config-failure.example") return null;
                return broadRuleFor(options.endpoint);
            };
        },
        createTrackingSink(options) {
            creationCounts.trackingSink += 1;
            trackingSinkOptions = options;
            return "tracking-sink";
        },
        createTrafficSink(options) {
            creationCounts.trafficSink += 1;
            trafficSinkOptions = options;
            return "traffic-sink";
        },
        createVue3AnalyticsPlugin(client, options) {
            creationCounts.plugin += 1;
            pluginClient = client;
            pluginOptions = options;
            return "analytics-plugin";
        },
    },
    "../../package.json": { version: "4.0.0" },
};
const runtime = {
    __APP_VERSION__: "runtime-version",
    location: { hostname: "m.jx3box.com" },
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
    Object,
    Set,
})((id) => {
    if (!Object.prototype.hasOwnProperty.call(moduleMocks, id)) throw new Error(`Unexpected import: ${id}`);
    return moduleMocks[id];
}, utilityModule, utilityModule.exports);

async function run() {
    const utility = utilityModule.exports;
    assert.strictEqual(utility.resolveCmsApiBase(), "/__proxy/cms/api/cms");
    const router = { name: "single-router" };
    const result = utility.createIndexAnalytics({ state: { client: "origin" } }, router, { runtime });

    assert.strictEqual(result.analytics, analytics);
    assert.strictEqual(result.identity, identity);
    assert.strictEqual(result.queue, queue);
    assert.strictEqual(result.plugin, "analytics-plugin");
    assert.strictEqual(identityOptions.runtime, runtime);
    assert.strictEqual(storageOptions.storage, runtime.localStorage);
    assert.strictEqual(queueOptions.storage, "journal-storage");
    assert.deepStrictEqual(Array.from(queueOptions.sinks), ["tracking-sink", "traffic-sink"]);
    assert.strictEqual(queueOptions.runtime, runtime);
    assert.strictEqual(analyticsOptions.identity, identity);
    assert.strictEqual(analyticsOptions.queue, queue);
    assert.strictEqual(analyticsOptions.ruleResolver, "composite-rule-resolver");
    assert.strictEqual(analyticsOptions.client, "mobile_web");
    assert.strictEqual(analyticsOptions.surface, "mobile_web");
    assert.strictEqual(analyticsOptions.platform, "ios");
    assert.strictEqual(analyticsOptions.project, "index");
    assert.strictEqual(analyticsOptions.gameClient(), "origin");
    assert.strictEqual(analyticsOptions.webVersion, "runtime-version");
    assert.strictEqual(analyticsOptions.sampleSalt, "jx3box-analytics-v1");
    assert.strictEqual(pluginClient, analytics);
    assert.strictEqual(pluginOptions.router, router);
    assert.strictEqual(pluginOptions.runtime, runtime);

    assert.strictEqual(trackingSinkOptions.endpoint, "/__proxy/cms/api/cms/system/stat/tracking/batch");
    assert.strictEqual(trafficSinkOptions.endpoint, "/__proxy/cms/api/cms/system/traffic/visits/batch");
    assert.strictEqual(remoteOptions[0].endpoint, "/__proxy/cms/api/cms/system/stat/tracking/config");
    assert.strictEqual(remoteOptions[1].endpoint, "/__proxy/cms/api/cms/system/traffic/config");
    assert.strictEqual(
        trackingSinkOptions.headersProvider().Authorization,
        `Basic ${Buffer.from("url-token:cms common request").toString("base64")}`
    );
    assert.strictEqual(trafficSinkOptions.headersProvider, trackingSinkOptions.headersProvider);

    const request = {
        page_key: "index.home",
        route_name: "index",
        route_pattern: "/index",
        layout_version: "index-home-v1",
        project: "index",
        product: "jx3box",
        surface: "mobile_web",
        client: "mobile_web",
        game_client: "origin",
        domain: "m.jx3box.com",
    };
    const trackingRule = await compositeOptions.tracking(request);
    const trafficRule = await compositeOptions.traffic(request);
    assert.deepStrictEqual(Array.from(trackingRule.event_types), ["page_view", "click", "exposure", "scroll_depth"]);
    assert.deepStrictEqual(Array.from(trackingRule.property_keys), ["module_id", "position", "depth_percent"]);
    assert.deepStrictEqual(
        Array.from(trackingRule.interaction_target_rules, (item) => item.target_key),
        ["index.sidebar"]
    );
    assert.deepStrictEqual(Array.from(trafficRule.event_types), ["page_view"]);
    assert.strictEqual(trafficRule.require_public_target, true);
    assert.strictEqual(trafficRule.query_targets, undefined);

    const callCount = remoteCalls.length;
    assert.strictEqual(
        await compositeOptions.tracking({ ...request, route_name: "tv", route_pattern: "/tv", page_key: "" }),
        null
    );
    assert.strictEqual(
        await compositeOptions.traffic({ ...request, route_name: "download", route_pattern: "/download", page_key: "" }),
        null
    );
    assert.strictEqual(remoteCalls.length, callCount, "excluded routes must fail closed before remote config fetch");
    assert.strictEqual(await compositeOptions.tracking({ ...request, domain: "config-failure.example" }), null);

    for (const call of remoteCalls) {
        assert(!Object.prototype.hasOwnProperty.call(call.request, "query"));
        assert(!Object.prototype.hasOwnProperty.call(call.request, "hash"));
        assert(!Object.prototype.hasOwnProperty.call(call.request, "fullPath"));
    }

    assert.strictEqual(utility.isIndexAnalyticsPreview({ location: { search: "?jx3box_analytics_preview=1" } }), true);
    assert.strictEqual(
        utility.isIndexAnalyticsPreview({ location: { search: "?foo=1&jx3box_analytics_preview=1&bar=2" } }),
        true
    );
    assert.strictEqual(utility.isIndexAnalyticsPreview({ location: { search: "?jx3box_analytics_preview=10" } }), false);
    const countsBeforePreview = { ...creationCounts };
    const previewRuntime = {
        location: { search: "?jx3box_analytics_preview=1" },
        get localStorage() {
            throw new Error("preview must not read localStorage");
        },
        get navigator() {
            throw new Error("preview must not inspect UA");
        },
    };
    const previewResult = utility.createIndexAnalytics(
        { state: { client: "std" } },
        router,
        { runtime: previewRuntime }
    );
    assert.strictEqual(previewResult.analytics, null);
    assert.strictEqual(previewResult.identity, null);
    assert.strictEqual(previewResult.plugin, null);
    assert.strictEqual(previewResult.queue, null);
    assert.deepStrictEqual(creationCounts, countsBeforePreview, "preview must not create Analytics resources");

    console.log("index analytics checks passed");
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
