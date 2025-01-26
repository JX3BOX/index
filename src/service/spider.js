import { $cms, $node, $next, $helper } from "@jx3box/jx3box-common/js/https";
import axios from "axios";
import { __spider2, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
const $spider = axios.create({
    baseURL: __spider2,
});

// 日常 - os
function getDailyFromOs(params = {}) {
    params.status = 1;
    return $cms().get(`/api/cms/pvx/activity`, {
        params,
    });
}

// 日常
function getDaily(params) {
    return $cms({ mute: true }).get(`/api/cms/game/daily`, {
        params,
    });
}

// 美人图
function getMeirentu(server = "蝶恋花") {
    return $spider.get("/api/spider/meirentu", {
        params: {
            server: server,
        },
    });
}

function getMeirentuNew(params) {
    return $cms().get(`/api/cms/pvx/beauty-paint`, {
        params,
    });
}

// 游戏公告
function getGameNews(client) {
    return $spider.get("/api/spider/jx3news", {
        params: {
            client: client,
        },
    });
}

// 开服监控
function getServers() {
    return $spider.get("api/spider/server/server_state");
}

// 金价走势
function getPrice() {
    return $spider.get("/jx3price");
}

// 宠物福缘
function getPetLucky() {
    return axios.get(__dataPath + "pvx/pet/output/pet_lucky.json");
}

function getPets(petids, client = "std") {
    return $node().get(`/pets`, {
        params: {
            ids: petids.join(","),
            client,
        },
    });
}

// 园宅会赛
function getFurniture(params) {
    return $cms({ mute: true }).get(`/api/cms/game/furniture/match`, {
        params,
    });
}

// 家园声望
function getHomeReputation(date, server = "梦江南") {
    const params = {
        server: server, // 所有服务器数据一致
        upload_time: date + " 07:00:00",
        // 上传时间, 查询时请格式化为 2006-01-02 07:00:00，表示查询当天上报的物价
    };
    return $next().get("/api/next2/npc-shop/list", {
        params,
    });
}

// 获取物品
function getItem(item_id, client) {
    if (!item_id) return;
    let options = {
        url: `/api/item/${item_id}`,
        params: {
            client,
        },
    };
    return $helper({ mute: true })(options);
}
// 批量获取物品
function getItems(ids, client = "std") {
    const per = ids.length || 15;
    const params = {
        client,
        per,
    };
    const idString = ids.join(",");
    if (!idString) return;
    return $node().get(`/item_merged/id/${idString}`, {
        params,
    });
}

export {
    getGameNews,
    getServers,
    getPrice,
    getMeirentu,
    getDailyFromOs,
    getDaily,
    getPetLucky,
    getPets,
    getFurniture,
    getHomeReputation,
    getItem,
    getItems,
    getMeirentuNew
};
