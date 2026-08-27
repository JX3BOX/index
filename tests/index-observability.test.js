const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transformSync } = require("@babel/core");
const transformModulesCommonjs = require("@babel/plugin-transform-modules-commonjs");

const root = path.resolve(__dirname, "..");
const packageInfo = require(path.join(root, "package.json"));
const installedCommon = require(path.join(root, "node_modules/@jx3box/jx3box-common/package.json"));
const utilitySource = fs.readFileSync(path.join(root, "src/utils/observability.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "src/main.js"), "utf8");
const spiderSource = fs.readFileSync(path.join(root, "src/service/spider.js"), "utf8");
const cmsSource = fs.readFileSync(path.join(root, "src/service/cms.js"), "utf8");
const searchSource = fs.readFileSync(path.join(root, "src/service/search.js"), "utf8");
const productionEnv = fs.readFileSync(path.join(root, ".env.production"), "utf8");
const publicIndex = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const publishedObserverSource = fs.readFileSync(
    path.join(root, "node_modules/@jx3box/jx3box-common/js/observability/client.js"),
    "utf8"
);

assert.strictEqual(packageInfo.dependencies["@jx3box/jx3box-common"], "9.5.2");
assert.strictEqual(installedCommon.version, "9.5.2");

assert(mainSource.includes("createIndexAnalytics(store, router)"));
assert(mainSource.includes("if (analyticsPlugin) app.use(analyticsPlugin)"));
assert(mainSource.includes("installIndexObserver(app, router)"));
assert(productionEnv.includes("VUE_APP_OBSERVABILITY_ENABLED=1"));
assert(publicIndex.includes("clarity.ms/tag/"));
assert(publicIndex.includes("hm.baidu.com/hm.js"));
assert(publishedObserverSource.includes('sessionNamespace: "observability"'));
assert(publishedObserverSource.includes('"jx3box:observability:error-queue:v1"'));
assert(publishedObserverSource.includes('"jx3box:observability:http-queue:v1"'));

assert(utilitySource.includes('projectKey: "index"'));
assert(utilitySource.includes('environment: "production"'));
assert(utilitySource.includes("setHttpObserver(observer)"));
assert(utilitySource.includes("createVue3ErrorObserverPlugin(observer)"));
assert(utilitySource.includes("observer.start()"));
assert(utilitySource.includes("captureRequestErrors: false"));
assert(!utilitySource.includes("jx3box_analytics_preview"), "preview flag must not enable or reconfigure Observer");
assert(spiderSource.includes('serviceKey: "spider"'));
assert.strictEqual((spiderSource.match(/telemetry: false/g) || []).length, 1);
assert.strictEqual((cmsSource.match(/telemetry: false/g) || []).length, 1);
assert(searchSource.includes("function getGsRequest()"));
assert(!searchSource.includes("const gsRequest = $next"));

for (const page of fs.readdirSync(path.join(root, "src/pages"))) {
    if (!page.endsWith(".js")) continue;
    const source = fs.readFileSync(path.join(root, "src/pages", page), "utf8");
    assert(!source.includes("installIndexObserver"), `${page} must remain outside the first Observer rollout`);
}

const compiled = transformSync(utilitySource, {
    babelrc: false,
    configFile: false,
    plugins: [transformModulesCommonjs],
}).code;

const compiledSearch = transformSync(searchSource, {
    babelrc: false,
    configFile: false,
    plugins: [transformModulesCommonjs],
}).code;

let gsFactoryCalls = 0;
const searchModule = { exports: {} };
vm.runInNewContext(`(function (require, module, exports) { ${compiledSearch}\n})`, { console })(
    (id) => {
        assert.strictEqual(id, "@jx3box/jx3box-common/js/api");
        return {
            $cms() {
                throw new Error("unused in lazy requester test");
            },
            $next(options) {
                gsFactoryCalls += 1;
                assert.strictEqual(options.domain, "https://gs.jx3box.com");
                assert.strictEqual(options.serviceKey, "gs");
                return {
                    get(url, config) {
                        return { url, config };
                    },
                };
            },
        };
    },
    searchModule,
    searchModule.exports
);
assert.strictEqual(gsFactoryCalls, 0, "GS requester must not be created before the host registers Observer");
assert.strictEqual(searchModule.exports.geSearch({ q: "first" }).url, "/api/search");
assert.strictEqual(searchModule.exports.geSearch({ q: "second" }).url, "/api/search");
assert.strictEqual(gsFactoryCalls, 1, "GS requester should be created lazily and reused");

function loadUtility(overrides = {}) {
    const calls = [];
    let observerOptions = null;
    const fakeObserver = {
        destroy() {
            calls.push("destroy");
        },
        registerDisposer(disposer) {
            calls.push("registerDisposer");
            assert.strictEqual(typeof disposer, "function");
        },
        start() {
            calls.push("start");
            return true;
        },
    };
    Object.assign(fakeObserver, overrides.fakeObserver || {});
    const analytics = {
        resolveCmsApiBase() {
            calls.push("resolveCmsApiBase");
            return "/api/cms";
        },
        resolveWebEnvironment(runtime) {
            calls.push("resolveWebEnvironment");
            return { client: "mobile_web", platform: runtime.testPlatform || "windows" };
        },
        resolveWebVersion() {
            calls.push("resolveWebVersion");
            return "4.0.0";
        },
    };
    const moduleMocks = {
        "@jx3box/jx3box-common/js/observability.js": {
            createClientObserver(options) {
                calls.push("createClientObserver");
                observerOptions = options;
                return fakeObserver;
            },
            createVue3ErrorObserverPlugin(observer) {
                calls.push("createVue3ErrorObserverPlugin");
                assert.strictEqual(observer, fakeObserver);
                return "vue-observer-plugin";
            },
        },
        "@jx3box/jx3box-common/js/api.js": {
            setHttpObserver(observer) {
                calls.push("setHttpObserver");
                assert.strictEqual(observer, fakeObserver);
                return () => calls.push("unregisterHttpObserver");
            },
        },
        "@/service/spider": {
            observeSpiderRequests(observer) {
                calls.push("observeSpiderRequests");
                assert.strictEqual(observer, fakeObserver);
            },
        },
        "./analytics": analytics,
        ...(overrides.moduleMocks || {}),
    };
    const utilityModule = { exports: {} };
    vm.runInNewContext(`(function (require, module, exports) { ${compiled}\n})`, {
        window: overrides.window || {},
        process: {
            env: {
                NODE_ENV: overrides.nodeEnv || "production",
                VUE_APP_OBSERVABILITY_ENABLED: overrides.enabledFlag || "1",
            },
        },
        console,
        Set,
    })((id) => {
        if (!Object.prototype.hasOwnProperty.call(moduleMocks, id)) throw new Error(`Unexpected import: ${id}`);
        return moduleMocks[id];
    }, utilityModule, utilityModule.exports);

    return {
        calls,
        fakeObserver,
        getObserverOptions: () => observerOptions,
        utility: utilityModule.exports,
    };
}

const disabled = loadUtility({ enabledFlag: "0" });
assert.strictEqual(disabled.utility.createIndexObserver({}, { runtime: {} }), null);
assert.deepStrictEqual(disabled.calls, [], "disabled Observer must not inspect UA/version or create resources");

const development = loadUtility({ nodeEnv: "development", enabledFlag: "1" });
assert.strictEqual(development.utility.createIndexObserver({}, { runtime: {} }), null);
assert.deepStrictEqual(development.calls, [], "non-production builds must stay disabled");

const enabled = loadUtility();
const router = { name: "router" };
const runtime = { testPlatform: "windows" };
assert.strictEqual(
    enabled.utility.createIndexObserver(router, { runtime, enabled: true, environment: "production" }),
    enabled.fakeObserver
);
const options = enabled.getObserverOptions();
assert.strictEqual(options.enabled, true);
assert.strictEqual(options.projectKey, "index");
assert.strictEqual(options.environment, "production");
assert.strictEqual(options.release, "4.0.0");
assert.strictEqual(options.webVersion, "4.0.0");
assert.strictEqual(options.client, "pc_web");
assert.strictEqual(options.platform, "windows");
assert.strictEqual(options.router, router);
assert.strictEqual(options.errorEndpoint, "/api/cms/system/stat/errors/batch");
assert.strictEqual(options.metricEndpoint, "/api/cms/system/stat/api-metrics/batch");
assert.strictEqual(options.captureWindow, true);
assert.strictEqual(options.captureRequestErrors, false);

const mobilePlatform = loadUtility();
const mobileEnvironment = mobilePlatform.utility.resolveIndexObserverEnvironment({ testPlatform: "ios" });
assert.strictEqual(mobileEnvironment.client, "pc_web");
assert.strictEqual(mobileEnvironment.platform, "unknown");

const installed = loadUtility();
const app = {
    use(plugin) {
        installed.calls.push(`app.use:${plugin}`);
    },
};
assert.strictEqual(
    installed.utility.installIndexObserver(app, router, {
        runtime,
        enabled: true,
        environment: "production",
    }),
    installed.fakeObserver
);
assert(installed.calls.includes("setHttpObserver"));
assert(installed.calls.includes("observeSpiderRequests"));
assert(installed.calls.includes("createVue3ErrorObserverPlugin"));
assert(installed.calls.includes("app.use:vue-observer-plugin"));
assert(installed.calls.includes("start"));

const failedInstall = loadUtility();
assert.strictEqual(
    failedInstall.utility.installIndexObserver(
        {
            use() {
                throw new Error("host plugin failure");
            },
        },
        router,
        { runtime, enabled: true, environment: "production" }
    ),
    null
);
assert(failedInstall.calls.includes("unregisterHttpObserver"));
assert(failedInstall.calls.includes("destroy"));

console.log("index observability checks passed");
