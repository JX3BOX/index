import { $next, $cms } from "@jx3box/jx3box-common/js/api";
export function getGameReporter(params) {
    return $next().get("/api/game/reporter/horse", {
        params,
    });
}

// 赤兔 的卢
export function getHorseReporter(type, server) {
    const params = {
        pageIndex: 1,
        pageSize: 50,
        server,
        type,
        subtype: "share_msg",
    };
    return $next().get("/api/game/reporter/horse", {
        params,
    });
}

export function getUserInfo() {
    return $cms().get("/api/cms/user/my/info");
}
