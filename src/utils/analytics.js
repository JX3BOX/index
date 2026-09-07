import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getTokenFromUrl } from "@jx3box/jx3box-common/js/utils";
import {
    createAnalyticsCore,
    createCompositeRuleResolver,
    createEventQueue,
    createIdentity,
    createQueueStorage,
    createRemoteRuleResolver,
    createTrafficSink,
    createVue3AnalyticsPlugin,
} from "@jx3box/jx3box-common/js/analytics.js";
import { createPageTracker, DEFAULT_LAYOUT_VERSION } from "./page-tracking";
import packageInfo from "../../package.json";

const INDEX_PAGE_KEY = "index.home";
const INDEX_ROUTE_NAME = "index";
const INDEX_ROUTE_PATTERN = "/index";
function trimSlash(value) {
    return String(value || "")
        .trim()
        .replace(/\/+$/, "");
}

function isEnabledFlag(value) {
    return ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase());
}

export function isIndexAnalyticsPreview(runtime = window) {
    const search = String((runtime.location && runtime.location.search) || "");
    return /(?:^|[?&])jx3box_analytics_preview=1(?:&|$)/.test(search);
}

export function resolveCmsApiBase() {
    const serviceBase = isEnabledFlag(process.env.VUE_APP_PROXY_ENABLE)
        ? `${trimSlash(process.env.VUE_APP_PROXY_PREFIX || "/__proxy")}/cms`
        : trimSlash(process.env.VUE_APP_CMS_API || JX3BOX.__cms);
    return /\/api\/cms$/i.test(serviceBase) ? serviceBase : `${serviceBase}/api/cms`;
}

export function resolveWebEnvironment(runtime = window) {
    const navigator = runtime.navigator || {};
    const userAgent = String(navigator.userAgent || "");
    const navigatorPlatform = String(navigator.platform || "");
    let platform = "unknown";

    if (/ArkWeb|HarmonyOS|OpenHarmony/i.test(userAgent)) platform = "harmony";
    else if (/iPhone|iPad|iPod/i.test(userAgent)) platform = "ios";
    else if (/Android/i.test(userAgent)) platform = "android";
    else if (/Windows/i.test(userAgent)) platform = "windows";
    else if (/Macintosh|MacIntel/i.test(userAgent) || navigatorPlatform === "MacIntel") platform = "macos";
    else if (/Linux/i.test(userAgent)) platform = "linux";

    const client =
        ["harmony", "ios", "android"].includes(platform) || /Mobile|Tablet/i.test(userAgent) ? "mobile_web" : "pc_web";
    return { client, platform };
}

export function resolveWebVersion(runtime = window) {
    return (
        runtime.__APP_VERSION__ ||
        process.env.VUE_APP_VERSION ||
        process.env.VITE_APP_VERSION ||
        packageInfo.version ||
        "unknown"
    );
}

function createHeadersProvider(runtime) {
    return function analyticsHeaders() {
        try {
            const token =
                getTokenFromUrl() ||
                runtime.localStorage.getItem("__token") ||
                runtime.localStorage.getItem("token") ||
                "";
            if (!token) return {};
            return {
                Authorization: `Basic ${runtime.btoa(`${token}:cms common request`)}`,
            };
        } catch (error) {
            return {};
        }
    };
}

function isIndexRuleRequest(request) {
    return (
        !!request &&
        request.page_key === INDEX_PAGE_KEY &&
        request.route_name === INDEX_ROUTE_NAME &&
        request.route_pattern === INDEX_ROUTE_PATTERN
    );
}

function constrainTrafficRule(rule) {
    if (!rule || typeof rule !== "object") return null;
    return {
        enabled: rule.enabled === true,
        page_key: rule.page_key,
        route_pattern: rule.route_pattern,
        sample_rate: rule.sample_rate,
        event_types: Array.isArray(rule.event_types) && rule.event_types.includes("page_view") ? ["page_view"] : [],
        require_public_target: rule.require_public_target === true,
        rule_version: rule.rule_version,
    };
}

function createIndexOnlyResolver(remoteResolver, constrainRule) {
    return async function resolveIndexRule(request) {
        // `/tv`、`/download` 以及未来新增路由都在发起配置请求前失败关闭。
        if (!isIndexRuleRequest(request)) return null;
        const rule = await remoteResolver(request);
        return constrainRule(rule);
    };
}

export function createIndexAnalytics(store, router, options = {}) {
    const runtime = options.runtime || window;
    const getLayoutVersion = () =>
        router.currentRoute?.value?.meta?.analytics?.layout_version || DEFAULT_LAYOUT_VERSION;
    // 管理端 iframe 只展示页面基准图；命中固定 flag 时不读取 identity、
    // Journal、UA，也不创建任何 Analytics/Traffic 资源。
    if (isIndexAnalyticsPreview(runtime)) {
        const tracker = createPageTracker({ runtime, getLayoutVersion });
        return {
            analytics: null,
            identity: null,
            queue: null,
            plugin: {
                install(app) {
                    app.directive("track-page", {});
                    app.use(tracker);
                },
            },
        };
    }
    const cmsApiBase = options.cmsApiBase || resolveCmsApiBase();
    const trackingBase = `${trimSlash(cmsApiBase)}/system/stat/tracking/v2`;
    const trafficBase = `${trimSlash(cmsApiBase)}/system/traffic`;
    const environment = resolveWebEnvironment(runtime);
    const headersProvider = createHeadersProvider(runtime);

    const trafficSink = createTrafficSink({
        runtime,
        endpoint: `${trafficBase}/visits/batch`,
        credentials: "include",
        headersProvider,
    });
    const identity = createIdentity({ runtime });
    const queue = createEventQueue({
        runtime,
        storage: createQueueStorage({ storage: runtime.localStorage }),
        sinks: [trafficSink],
    });
    const ruleResolver = createCompositeRuleResolver({
        tracking: async () => null,
        traffic: createIndexOnlyResolver(
            createRemoteRuleResolver({
                runtime,
                endpoint: `${trafficBase}/config`,
                credentials: "include",
            }),
            constrainTrafficRule
        ),
    });
    const analytics = createAnalyticsCore({
        runtime,
        identity,
        queue,
        ruleResolver,
        enabled: options.enabled,
        product: "jx3box",
        project: "index",
        client: environment.client,
        surface: environment.client,
        platform: environment.platform,
        gameClient: () => (store.state.client === "origin" ? "origin" : "std"),
        webVersion: resolveWebVersion(runtime),
        displayMode: "browser",
        sampleSalt: "jx3box-analytics-v1",
    });
    const trafficPlugin = createVue3AnalyticsPlugin(analytics, {
        runtime,
        router,
    });

    const tracker = createPageTracker({ runtime, identity, endpoint: trackingBase, headersProvider, getLayoutVersion });
    const plugin = {
        install(app) {
            app.directive("track-page", trafficPlugin.directives.trackPage);
            app.use(tracker);
        },
        destroy() {
            tracker.unmount();
            trafficPlugin.destroy();
        },
    };

    return {
        analytics,
        identity,
        plugin,
        queue,
    };
}
