import {
    createClientObserver,
    createVue3ErrorObserverPlugin,
} from "@jx3box/jx3box-common/js/observability.js";
import { setHttpObserver } from "@jx3box/jx3box-common/js/api.js";
import { observeSpiderRequests } from "@/service/spider";
import { resolveCmsApiBase, resolveWebEnvironment, resolveWebVersion } from "./analytics";

const PC_PLATFORMS = new Set(["windows", "macos", "linux"]);

function isEnabledFlag(value) {
    return value === true || ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase());
}

export function isIndexObserverEnabled(options = {}) {
    const environment = options.environment || process.env.NODE_ENV;
    const enabled = options.enabled === undefined ? process.env.VUE_APP_OBSERVABILITY_ENABLED : options.enabled;
    return environment === "production" && isEnabledFlag(enabled);
}

export function resolveIndexObserverEnvironment(runtime = window) {
    const environment = resolveWebEnvironment(runtime);
    return {
        client: "pc_web",
        platform: PC_PLATFORMS.has(environment.platform) ? environment.platform : "unknown",
    };
}

export function createIndexObserver(router, options = {}) {
    // 开关判断必须先于 UA、版本、identity 和本地队列读取。
    if (!isIndexObserverEnabled(options)) return null;

    const runtime = options.runtime || window;
    const cmsApiBase = options.cmsApiBase || resolveCmsApiBase();
    const version = resolveWebVersion(runtime);
    const environment = resolveIndexObserverEnvironment(runtime);

    return createClientObserver({
        enabled: true,
        runtime,
        router,
        projectKey: "index",
        environment: "production",
        release: version,
        webVersion: version,
        client: environment.client,
        platform: environment.platform,
        errorEndpoint: `${cmsApiBase}/system/stat/errors/batch`,
        metricEndpoint: `${cmsApiBase}/system/stat/api-metrics/batch`,
        credentials: "include",
        captureWindow: true,
        captureRequestErrors: false,
    });
}

export function installIndexObserver(app, router, options = {}) {
    let observer = null;
    let unregisterHttpObserver = () => {};
    try {
        observer = createIndexObserver(router, options);
        if (!observer) return null;
        unregisterHttpObserver = setHttpObserver(observer);
        observer.registerDisposer(unregisterHttpObserver);
        observeSpiderRequests(observer);
        app.use(createVue3ErrorObserverPlugin(observer));
        if (!observer.start()) {
            observer.destroy();
            return null;
        }
        return observer;
    } catch (error) {
        // 观测能力必须失败关闭，不得阻断主应用启动。
        unregisterHttpObserver();
        if (observer && typeof observer.destroy === "function") observer.destroy();
        return null;
    }
}
