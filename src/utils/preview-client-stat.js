// 仅替换公共头的统计入口，正常访问继续调用 UI 包原实现。
import * as clientStat from "@jx3box/jx3box-ui/src/utils/client-stat";
import { isTrackingPreview } from "./page-tracking";
export const checkClientStatOnVisible = (...args) => {
    if (!isTrackingPreview()) return clientStat.checkClientStatOnVisible(...args);
};
export const installClientStatReporting = (...args) => {
    if (!isTrackingPreview()) return clientStat.installClientStatReporting(...args);
};
export const ensureClientInstanceId = (...args) =>
    isTrackingPreview() ? null : clientStat.ensureClientInstanceId(...args);
export const resolveClientTrafficPermission = (...args) =>
    isTrackingPreview() ? Promise.resolve({ allowed: false }) : clientStat.resolveClientTrafficPermission(...args);
export const resolveCurrentClientSurface = (...args) => clientStat.resolveCurrentClientSurface(...args);
