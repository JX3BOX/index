const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transformSync } = require("@babel/core");
const transformModulesCommonjs = require("@babel/plugin-transform-modules-commonjs");

const root = path.resolve(__dirname, "..");
const commonRoot = path.join(root, "node_modules/@jx3box/jx3box-common");
const commonPackage = require(path.join(commonRoot, "package.json"));
const fixture = JSON.parse(
    fs.readFileSync(path.join(commonRoot, "docs/fixtures/analytics-dual-sink-v1.json"), "utf8")
);
const moduleCache = new Map();

function loadPublishedModule(filename) {
    const resolved = path.resolve(filename);
    if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;
    const module = { exports: {} };
    moduleCache.set(resolved, module);
    const source = fs.readFileSync(resolved, "utf8");
    const compiled = transformSync(source, {
        babelrc: false,
        configFile: false,
        filename: resolved,
        plugins: [transformModulesCommonjs],
    }).code;
    const execute = vm.runInThisContext(
        `(function (require, module, exports, __filename, __dirname) { ${compiled}\n})`,
        { filename: resolved }
    );
    execute(
        (id) => {
            if (!id.startsWith(".")) return require(id);
            let dependency = path.resolve(path.dirname(resolved), id);
            if (!path.extname(dependency)) dependency += ".js";
            return loadPublishedModule(dependency);
        },
        module,
        module.exports,
        resolved,
        path.dirname(resolved)
    );
    return module.exports;
}

function createMemoryStorage() {
    const values = new Map();
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
        removeItem(key) {
            values.delete(key);
        },
    };
}

async function run() {
    assert.strictEqual(commonPackage.version, "9.5.2");
    assert.strictEqual(fixture.fixture_version, "analytics-dual-sink-v1");

    const analytics = loadPublishedModule(path.join(commonRoot, "js/analytics.js"));
    for (const api of [
        "createAnalyticsCore",
        "createCompositeRuleResolver",
        "createEventQueue",
        "createIdentity",
        "createNavigationController",
        "createQueueStorage",
        "createTrackingSink",
        "createTrafficSink",
    ]) {
        assert.strictEqual(typeof analytics[api], "function", `published 9.5.2 must export ${api}`);
    }

    const trackingProjection = analytics.projectTrackingEvent(fixture.canonical_event);
    const trafficProjection = analytics.projectTrafficEvent({
        ...fixture.canonical_event,
        ...fixture.traffic_finalization,
    });
    assert.deepStrictEqual(trackingProjection, fixture.tracking.request.events[0]);
    assert.deepStrictEqual(trafficProjection, fixture.traffic.request.events[0]);
    assert.strictEqual(trackingProjection.event_id, trafficProjection.event_id);
    assert.strictEqual(trackingProjection.event_id, fixture.canonical_event.event_id);

    const requests = [];
    const runtimeForSinks = {
        fetch: async function fetch(endpoint, options) {
            const body = JSON.parse(options.body);
            requests.push({ body, endpoint });
            const response = endpoint.includes("/tracking/") ? fixture.tracking.response : fixture.traffic.response;
            return {
                ok: true,
                status: 200,
                json: async () => response,
            };
        },
        navigator: {},
    };
    const trackingSink = analytics.createTrackingSink({
        runtime: runtimeForSinks,
        endpoint: "/system/stat/tracking/batch",
    });
    const trafficSink = analytics.createTrafficSink({
        runtime: runtimeForSinks,
        endpoint: "/system/traffic/visits/batch",
    });
    const trackingResult = await trackingSink.send([fixture.canonical_event], {});
    const trafficResult = await trafficSink.send(
        [{ ...fixture.canonical_event, ...fixture.traffic_finalization }],
        {}
    );
    assert.deepStrictEqual(requests[0].body, fixture.tracking.request);
    assert.deepStrictEqual(requests[1].body, fixture.traffic.request);
    assert.deepStrictEqual(trackingResult.confirmedEventIds, [fixture.canonical_event.event_id]);
    assert.deepStrictEqual(trafficResult.confirmedEventIds, [fixture.canonical_event.event_id]);

    const localStorage = createMemoryStorage();
    const sessionStorage = createMemoryStorage();
    let uuidCounter = 0;
    const runtime = {
        crypto: {
            randomUUID() {
                uuidCounter += 1;
                return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, "0")}`;
            },
        },
        document: { referrer: "" },
        localStorage,
        location: {
            hostname: "www.jx3box.com",
            href: "https://www.jx3box.com/index",
        },
        sessionStorage,
    };
    const storage = analytics.createQueueStorage({ storage: localStorage, now: () => 1000 });
    const journal = analytics.createEventQueue({
        runtime,
        storage,
        sinks: [
            {
                key: "tracking",
                accepts: () => true,
                send: async () => ({ deliveries: [] }),
            },
            {
                key: "traffic",
                accepts: (event) => event.event_type === "page_view",
                defer: (event) => event.event_type === "page_view",
                send: async () => ({ deliveries: [] }),
            },
        ],
        now: () => 1000,
        setTimeout: () => 1,
        clearTimeout: () => {},
    });
    const ruleResolver = analytics.createCompositeRuleResolver({
        tracking: async () => ({
            enabled: true,
            page_key: "index.home",
            route_pattern: "/index",
            layout_version: "index-home-v1",
            sample_rate: 1,
            event_types: ["page_view", "click", "exposure", "scroll_depth"],
            property_keys: ["module_id", "depth_percent"],
            rule_version: "tracking-index-v1",
        }),
        traffic: async () => ({
            enabled: true,
            page_key: "index.home",
            route_pattern: "/index",
            sample_rate: 1,
            event_types: ["page_view"],
            require_public_target: false,
            rule_version: "traffic-index-v1",
        }),
    });
    const strictTrafficRule = async () => ({
        enabled: true,
        page_key: "index.home",
        route_pattern: "/index",
        sample_rate: 1,
        event_types: ["page_view"],
        require_public_target: true,
        rule_version: "traffic-index-strict-v1",
    });
    const strictRequest = {
        page_key: "index.home",
        route_name: "index",
        route_pattern: "/index",
        layout_version: "index-home-v1",
        product: "jx3box",
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        game_client: "std",
        domain: "www.jx3box.com",
        route: {
            name: "index",
            route_pattern: "/index",
            params: {},
            query: { unknown_dynamic_id: "must-stay-local" },
        },
    };
    const strictComposite = analytics.createCompositeRuleResolver({
        tracking: async () => ({
            enabled: true,
            page_key: "index.home",
            route_pattern: "/index",
            layout_version: "index-home-v1",
            sample_rate: 1,
            event_types: ["page_view", "click"],
            property_keys: [],
            rule_version: "tracking-index-strict-v1",
        }),
        traffic: strictTrafficRule,
    });
    const strictResolved = await strictComposite.resolve(strictRequest);
    assert.deepStrictEqual(Object.keys(strictResolved.sink_rules), ["tracking"]);
    assert.strictEqual(strictResolved.public_target, undefined);
    const trafficOnlyStrict = analytics.createCompositeRuleResolver({ traffic: strictTrafficRule });
    assert.strictEqual(
        await trafficOnlyStrict.resolve(strictRequest),
        null,
        "require_public_target=true without an allowlisted public target must fail closed"
    );
    const core = analytics.createAnalyticsCore({
        runtime,
        identity: analytics.createIdentity({ runtime, now: () => 1000 }),
        queue: journal,
        ruleResolver,
        product: "jx3box",
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        now: () => 1000,
    });
    const navigation = analytics.createNavigationController({ client: core, runtime });
    const indexRoute = {
        name: "index",
        meta: {
            analytics: {
                page_key: "index.home",
                route_pattern: "/index",
                layout_version: "index-home-v1",
            },
        },
        matched: [{ path: "/" }],
        params: {},
        query: {},
    };
    await navigation.navigate(indexRoute, null, { navigation_id: "router:1" });
    let state = core.getState();
    assert.strictEqual(state.navigationOwner, "router");
    assert.strictEqual(state.page.route_pattern, "/index");
    assert.strictEqual(state.page.route_path, "/index");
    assert.strictEqual(state.queue.entries.length, 1, "one Router navigation must create one canonical page_view");
    assert.strictEqual(state.queue.entries[0].event.event_type, "page_view");
    assert.strictEqual(state.queue.entries[0].event.route_path, "/index");
    assert.deepStrictEqual(Object.keys(state.queue.entries[0].deliveries).sort(), ["tracking", "traffic"]);
    assert.strictEqual(state.queue.entries[0].deliveries.tracking.state, "pending");
    assert.strictEqual(state.queue.entries[0].deliveries.traffic.state, "deferred");

    await navigation.navigate(
        { name: "tv", meta: {}, matched: [{ path: "/tv" }], params: {}, query: {} },
        indexRoute,
        { navigation_id: "router:2" }
    );
    state = core.getState();
    assert.strictEqual(state.page, null);
    assert.strictEqual(state.queue.entries.length, 1, "excluded routes must not create a second page_view");
    assert.strictEqual(state.queue.entries[0].event.event_id, state.queue.eventIds[0]);

    await navigation.navigate(
        { name: "download", meta: {}, matched: [{ path: "/download" }], params: {}, query: {} },
        { name: "tv", meta: {}, matched: [{ path: "/tv" }], params: {}, query: {} },
        { navigation_id: "router:3" }
    );
    state = core.getState();
    assert.strictEqual(state.page, null);
    assert.strictEqual(state.queue.entries.length, 1, "download route must remain excluded from page_view capture");

    navigation.destroy();
    core.destroy();
    console.log("index published analytics contract checks passed");
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
