import { $helper, $next } from "@jx3box/jx3box-common/js/https";

// 今日财富
function getCode(client) {
    return $helper().get(`api/config_banner/code`, {
        params: {
            client: client,
            status: 1,
        },
    });
}

// 物品价格
function getItemPrice(params) {
    return $next().get(`api/item-groups/with-prices`, {
        params,
    });
}

function getSchoolRank(v) {
    return $helper().get(`/api/dps_group/${v}`);
}

function getWikiPosts(params) {
    return $helper().get(`/api/wiki/posts/newest`, {
        params: params,
    });
}

function getCollections(params) {
    return $helper().get(`/api/post/collections`, {
        params: params,
    });
}

export { getSchoolRank, getItemPrice, getWikiPosts, getCollections, getCode };
