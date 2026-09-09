import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getTokenFromUrl } from "@jx3box/jx3box-common/js/utils";
import { createIdentity } from "@jx3box/jx3box-common/js/analytics.js";
import { createPageTracker, DEFAULT_LAYOUT_VERSION } from "@jx3box/jx3box-common/js/page-tracking.js";
import { resolveGameClient } from "./game-client";
import packageInfo from "../../package.json";

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

export function createIndexPageTracking(router, options = {}) {
    const runtime = options.runtime || window;
    const getLayoutVersion = () =>
        router.currentRoute?.value?.meta?.analytics?.layout_version || DEFAULT_LAYOUT_VERSION;
    // 管理端 iframe 只展示页面基准图；命中固定 flag 时不读取 identity、
    // Journal、UA，也不创建任何 Analytics/Traffic 资源。
    if (isIndexAnalyticsPreview(runtime)) {
        const tracker = createPageTracker({ runtime, router, getLayoutVersion });
        return {
            identity: null,
            plugin: {
                install(app) {
                    app.use(tracker);
                },
            },
        };
    }
    const cmsApiBase = options.cmsApiBase || resolveCmsApiBase();
    const trackingBase = `${trimSlash(cmsApiBase)}/system/stat/tracking/v2`;
    const headersProvider = createHeadersProvider(runtime);
    const identity = createIdentity({ runtime });

    const tracker = createPageTracker({
        runtime, router, identity, endpoint: trackingBase, headersProvider, getLayoutVersion,
        // 本地联调显式指定所模拟的注册域名；线上使用当前域名。
        getDomain: () => ["localhost", "127.0.0.1", "[::1]", "::1"].includes(runtime.location.hostname)
            ? (resolveGameClient(runtime) === "origin" ? "origin.jx3box.com" : "www.jx3box.com")
            : runtime.location.hostname,
    });
    const plugin = {
        install(app) {
            app.use(tracker);
        },
        destroy() {
            tracker.destroy();
        },
    };

    return {
        identity,
        plugin,
    };
}
