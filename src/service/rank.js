import { $next, $helper, $cms } from "@jx3box/jx3box-common/js/https";
import { getStatRank } from "@jx3box/jx3box-common/js/stat.js";

function getRank(type, days = "30days") {
    return getStatRank(type, "views", 10, "7days").then((res) => {
        let result = res.data || [];
        let views = [];
        let ids = [];
        result.forEach((item) => {
            let id = item.name;
            if (id.includes(type)) {
                id = id.slice(`${type}-`.length, id.length);
                ids.push(id);
                views.push(item.value[days]);
            }
        });
        return [ids, views];
    });
}

function getAchievements(params) {
    return $helper({ mute: true }).get("/api/achievements", {
        params: params,
    });
}

function getCollections(params) {
    return $helper({ mute: true }).get(`/api/post/collections`, {
        params: params,
    });
}
function getNamespaces(params) {
    return $cms({ mute: true }).get(`/api/cms/namespace`, {
        params: params,
    });
}

function getKnowledges(params) {
    return $helper({ mute: true }).get(`/api/knowledges`, {
        params: params,
    });
}

function getPapers(list) {
    return $next({ mute: true }).get("/api/question/user-exam-paper", {
        params: {
            list: list,
        },
    });
}

function getJx3datRank(limit = 10) {
    return $next({ mute: true }).get("/api/plugins/jx3dat/rank", {
        params: {
            pageSize: limit,
        },
    });
}

function getMacroRank(limit = 10) {
    return $next({ mute: true }).get("/api/macro/overview", {
        params: {
            size: limit,
            // _no_cache:1,
        },
    });
}

export {
    getAchievements,
    getCollections,
    getNamespaces,
    getKnowledges,
    getJx3datRank,
    getMacroRank,
    getPapers,
    getRank,
};
