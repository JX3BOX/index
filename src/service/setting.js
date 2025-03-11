import { $cms, $helper, $next } from "@jx3box/jx3box-common/js/https";

function getConfig() {
    return $cms({ mute: true }).get("/api/cms/config");
}

function getMenuGroup(name) {
    return $cms({ mute: true }).get(`/api/cms/menu-group/${name}`, {});
}

function getMenuGroups(params) {
    return $cms({ mute: true }).get(`/api/cms/menu-group`, {
        params: params,
    });
}

function getHelperPnt() {
    return $helper({ mute: true }).get("/api/post/pending_total");
}

function getMenu(key) {
    return $cms().get(`/api/cms/config/menu/${key}`);
}

function recordBannerClick(params) {
    return $next().get(`/api/ggao`,{
        params: params,
    });
}

export { getConfig, getMenuGroup, getMenuGroups, getHelperPnt, getMenu, recordBannerClick };
