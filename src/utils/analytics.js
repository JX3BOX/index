import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getTokenFromUrl } from "@jx3box/jx3box-common/js/utils";
import {
    createAnalytics,
    createRemotePageResolver,
    createVue3AnalyticsPlugin,
} from "@jx3box/jx3box-common/js/analytics.js";
import packageInfo from "../../package.json";

function trimSlash(value) {
    return String(value || "")
        .trim()
        .replace(/\/+$/, "");
}

function isEnabledFlag(value) {
    return ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase());
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

    const client = ["harmony", "ios", "android"].includes(platform) || /Mobile|Tablet/i.test(userAgent)
        ? "mobile_web"
        : "pc_web";
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

export function createIndexAnalytics(store, options = {}) {
    const runtime = options.runtime || window;
    const cmsApiBase = options.cmsApiBase || resolveCmsApiBase();
    const trackingBase = `${trimSlash(cmsApiBase)}/system/stat/tracking`;
    const environment = resolveWebEnvironment(runtime);
    const resolvePage = createRemotePageResolver({
        runtime,
        endpoint: `${trackingBase}/config`,
        credentials: "include",
        cacheTtlMs: 60 * 1000,
    });
    const analytics = createAnalytics({
        runtime,
        endpoint: `${trackingBase}/batch`,
        resolvePage,
        enabled: options.enabled,
        product: "jx3box",
        client: environment.client,
        platform: environment.platform,
        gameClient: () => (store.state.client === "origin" ? "origin" : "std"),
        webVersion: resolveWebVersion(runtime),
        displayMode: "browser",
        sampleSalt: "jx3box-analytics-v1",
        credentials: "include",
        headersProvider: createHeadersProvider(runtime),
    });

    return {
        analytics,
        plugin: createVue3AnalyticsPlugin(analytics, { runtime }),
    };
}
