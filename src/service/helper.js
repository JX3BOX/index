import { $cms, $next } from "@jx3box/jx3box-common/js/api";

// 今日财富
function getCode(client) {
    return $cms().get(`api/config_banner/code`, {
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
    return $cms().get(`/api/dps_group/${v}`);
}

function getWikiPosts(params) {
    return $cms().get(`/api/wiki/posts/newest`, {
        params: params,
    });
}

function getCollections(params) {
    return $cms().get(`/api/post/collections`, {
        params: params,
    });
}

export { getSchoolRank, getItemPrice, getWikiPosts, getCollections, getCode };
