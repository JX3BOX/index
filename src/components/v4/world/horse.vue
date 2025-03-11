<template>
    <div class="m-world-block m-world-horse">
        <div class="u-horse">
            <el-divider content-position="left">
                <span>抓马&nbsp;·&nbsp;</span>
                <el-select v-model="server">
                    <el-option v-for="(server, i) in servers" :key="i" :label="server" :value="server"></el-option>
                </el-select>
            </el-divider>
            <div class="u-item" key="dilu">
                <div class="u-horse-name-wrap">
                    <a class="u-horse-name" :href="getLink('的卢')" target="_blank">
                        <el-image :src="getImgSrc('的卢')" class="u-image"></el-image>
                    </a>
                    <span class="u-horse-name no-link">的卢</span>
                    <el-tooltip effect="dark" placement="top" popper-class="u-dilu-tip">
                        <template #content>
                            <div v-html="diluTip"></div>
                        </template>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    <i :class="diluLoading ? 'el-icon-loading' : 'el-icon-refresh'" @click="loadDiluData"></i>
                </div>
                <div class="u-times-info">
                    <span v-if="!diluHasExist" class="u-times-lately">本CD尚未刷新</span>
                    <template v-else>
                        <div class="u-map-name is-exist">{{ diluExistData.map }}</div>
                        <div class="u-times is-exist">{{ diluExistData.time }}</div>
                    </template>
                </div>
            </div>
            <div class="u-item" key="chitu">
                <div class="u-horse-name-wrap">
                    <a class="u-horse-name" :href="getLink('赤兔')" target="_blank">
                        <el-image :src="getImgSrc('赤兔')" class="u-image"></el-image>
                    </a>
                    <span class="u-horse-name no-link">赤兔</span>
                    <el-tooltip effect="dark" placement="top" popper-class="u-chitu-tip">
                        <template #content>
                            <div v-html="chituTip"></div>
                        </template>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    <i :class="chituLoading ? 'el-icon-loading' : 'el-icon-refresh'" @click="loadChituData"></i>
                </div>
                <div class="u-times-info">
                    <span v-if="!chituHasExist" class="u-times-lately">本CD尚未刷新</span>
                    <template v-else>
                        <div class="u-map-name is-exist">{{ chituExistData.map }}</div>
                        <div class="u-times is-exist">{{ chituExistData.time }}</div>
                    </template>
                </div>
            </div>
            <div class="u-item" v-for="item in list" :key="item.id">
                <div class="u-horse-name-wrap">
                    <a
                        class="u-horse-name"
                        :href="getLink(horse)"
                        target="_blank"
                        v-for="horse in item.horses"
                        :key="horse"
                    >
                        <el-tooltip class="item" effect="dark" :content="horse" placement="top">
                            <el-image :src="getImgSrc(horse)" class="u-image">
                                <div slot="error" class="image-slot">
                                    <img src="../../../assets/img/horse/horse_item_bg_sm.jpg" />
                                </div>
                            </el-image>
                        </el-tooltip>
                    </a>
                </div>
                <div class="u-times-info">
                    <div class="u-map-name">{{ item.map_name }}</div>
                    <div
                        class="u-times"
                        :class="(item.subtype === 'foreshow' || item.type !== 'horse') && 'u-times-lately'"
                    >
                        <span>{{ item.fromTime }}</span>
                        <span> ~ </span>
                        <span>{{ item.toTime }}</span>
                    </div>
                </div>
            </div>
            <!-- <div class="u-no-item" v-if="!list.length">暂无播报</div> -->
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import horseSites from "@/assets/data/horse_sites.json";
import horseBroadcast from "@/assets/data/horse_broadcast.json";
import { getGameReporter, getUserInfo, getHorseReporter } from "@/service/horse";
import dayjs from "@/utils/day";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "WorldHorse",
    data() {
        return {
            list: [],
            server: "",
            timer: null,
            chituMap: {
                方问: "鲲鹏岛",
                小赤: "阴山大草原",
                杨新: "黑戈壁",
            },
            // 赤兔本cd是否刷新
            chituHasExist: false,
            chituExistData: {
                map: "",
                time: "",
            },
            chituTip: `
             <p>CD: 周二7点 ~ 下周一7点。</p>
             <p>地图: 黑戈壁、阴山大草原、鲲鹏岛。</p>
             <p>必备: <卦文龟甲>交大战时有几率获得，赤兔刷新后再到信使处领取，有效期8天。</p>
            `,
            chituLoading: false,

            // 的卢本cd是否刷新
            diluHasExist: false,
            diluExistData: {
                map: "",
                time: "",
            },
            diluTip: `
             <p>CD: 每周一次，周一、三、五、六、日 10点 ~ 24点期间随机开启。</p>
             <p>地图: 随机刷新于某一野外场景。</p>
            `,
            diluLoading: false,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        servers: function () {
            if (this.client == "std") {
                return servers_std;
            } else {
                return servers_origin;
            }
        },
        params() {
            return {
                pageIndex: 1,
                pageSize: 50,
                server: this.server,
                type: "horse",
            };
        },
        isAsia() {
            // 是否是东八区
            const _timezone = this.$store.state.timezone;
            return _timezone === "Asia/Shanghai";
        },
    },
    watch: {
        server() {
            this.list = []; // 需要置空后重新计算cross的scrollWidth
            this.getGameReporter();
            this.loadChituData();
            this.loadDiluData();
        },
    },
    methods: {
        loadDiluData() {
            // 每周一、三、五、六、日 10：00-24：00期间随机开启
            // 开启前60分钟及开启时均有系统公告提醒
            // 同服务器每周只开启一次
            // 【的卢】随机刷新于某一野外场景
            const server = this.server;
            const type = "dilu-horse";
            this.diluLoading = true;
            getHorseReporter(type, server)
                .then((res) => {
                    const list = res.data?.data?.list || [];
                    if (!list.length) {
                        return;
                    }
                    // 最近刷新时间 返回的时间已经是东八区时间，其余对比时间同样需要换算到东八区时间
                    let created_at = dayjs(list?.[0].created_at || dayjs.tz());
                    if (!this.isAsia) {
                        created_at = dayjs.tz(list?.[0].created_at || dayjs.tz());
                    }
                    const now = dayjs.tz();
                    const now_day = now.day();
                    let cd_from_time = now.day(1).hour(10).minute(0).second(0).millisecond(0);
                    let cd_to_time = cd_from_time.add(1, "week").add(-10, "hour").add(-1, "millisecond");
                    if (now_day < 1) {
                        // 周日为0 / 为上一个CD
                        cd_from_time = dayjs.tz(cd_from_time).add(-1, "week");
                        cd_to_time = dayjs.tz(cd_to_time).add(-1, "week");
                    }
                    // 最近刷新时间是否在当前CD中
                    const isBetween = created_at.isBetween(cd_from_time, cd_to_time);
                    this.diluHasExist = isBetween;
                    if (isBetween) {
                        const content = list?.[0]?.content || "";
                        const mapName = content.match(/的卢已经出现在(\S*)中/)
                            ? content.match(/的卢已经出现在(\S*)中/)[1]
                            : "";
                        this.diluExistData = {
                            map: mapName,
                            time: created_at.format("YYYY-MM-DD HH:mm:ss"),
                        };
                    }
                })
                .finally(() => {
                    this.diluLoading = false;
                });
        },
        loadChituData() {
            // 周二7点到下周一7点为一个CD， 7天内随机刷一只，地图为黑戈壁、阴山大草原、鲲鹏岛
            const server = this.server;
            const type = "chitu-horse";
            this.chituLoading = true;
            getHorseReporter(type, server)
                .then((res) => {
                    const list = res.data?.data?.list || [];
                    if (!list.length) {
                        return;
                    }
                    // 最近刷新时间 返回的时间已经是东八区时间，其余对比时间同样需要换算到东八区时间
                    let created_at = dayjs(list?.[0].created_at || dayjs.tz());
                    if (!this.isAsia) {
                        created_at = dayjs.tz(list?.[0].created_at || dayjs.tz());
                    }
                    const now = dayjs.tz();
                    const now_day = now.day();
                    const now_hour = now.hour();
                    let cd_from_time = now.day(2).hour(7).minute(0).second(0).millisecond(0);
                    let cd_to_time = cd_from_time.add(1, "week").add(-1, "millisecond");
                    if (now_day <= 1 || (now_day === 2 && now_hour < 7)) {
                        // 周日为0、周一到周二7点之前的CD为上一个CD
                        cd_from_time = dayjs.tz(cd_from_time).add(-1, "week");
                        cd_to_time = dayjs.tz(cd_to_time).add(-1, "week");
                    }
                    // 最近刷新时间是否在当前CD中
                    const isBetween = created_at.isBetween(cd_from_time, cd_to_time);
                    this.chituHasExist = isBetween;
                    if (isBetween) {
                        const content = list?.[0]?.content || "";
                        const npc = /\]\[(.*)\]大声喊/.exec(content)[1].trim();
                        this.chituExistData = {
                            map: this.chituMap[npc] || "",
                            time: created_at.format("YYYY-MM-DD HH:mm:ss"),
                        };
                    }
                })
                .finally(() => {
                    this.chituLoading = false;
                });
        },
        getLink(horseName) {
            const itemId = horseBroadcast[horseName]?.itemId || 0;
            // 2 马具 1 坐骑
            const type = 1;
            return `/horse/${itemId}?type=${type}`;
        },
        getImgSrc(horseName) {
            const id = horseBroadcast[horseName]?.id || 0;
            return __imgPath + `horse/${this.client}/` + id + ".png";
        },
        getOriginDatas(item) {
            let mapId = "";
            let mapName = "";
            let coordinates = [];
            let result = {};
            let horses = [];
            if (item.type === "horse") {
                if (item.subtype === "npc_chat") {
                    // 预测
                    mapId = String(item.map_id);
                    mapName = item.map_name;
                    coordinates = horseSites[mapId].coordinates;
                    horses = horseSites[mapId].horses[item.horseIndex];
                } else {
                    // 播报
                    mapName = item.content.match(/在(\S*)出没/) ? item.content.match(/在(\S*)出没/)[1] : "";
                    for (let key in horseSites) {
                        if (horseSites[key].mapName === mapName) {
                            mapId = key;
                            coordinates = horseSites[key].coordinates;
                            horses = horseSites[mapId].horses.flat();
                        }
                    }
                }
                const coor = coordinates[0];
                result[mapId] = [
                    {
                        content: `${horses.join()}
                    <br />坐标：(${coor.x},${coor.y},${coor.z})`,
                        ...coor,
                    },
                ];
            } else {
                // 特殊马
                const { type, content } = item;
                if (type === "chitu-horse") {
                    horses = ["赤兔·飞虹"];
                    const npc = /\]\[(.*)\]大声喊/.exec(content)[1].trim();
                    mapName = this.chituMap[npc] || "";
                } else {
                    horses = ["的卢"];
                    mapName = content.match(/的卢已经出现在(\S*)中/) ? content.match(/的卢已经出现在(\S*)中/)[1] : "";
                }
            }
            const obj = {
                mapDatas: result,
                map_id: mapId,
                map_name: mapName,
                horses: horses,
            };
            return obj;
        },
        getGameReporter() {
            const params = this.params;
            getGameReporter(params).then((res) => {
                const data = res?.data?.data;
                const list = data?.list || [];
                // 三大马场只各取一条
                const myMap = new Map();
                const threeList = list.filter(
                    (item) => item.map_id && !myMap.has(item.map_id) && myMap.set(item.map_id, 1)
                );
                // 播报列表, 且取上报时间距离现在在15分钟之内的
                const bList = list.filter(
                    (item) =>
                        !item.map_id && (new Date().valueOf() - new Date(item.created_at).valueOf()) / 1000 / 60 <= 15
                );

                // 赤兔 的卢 播报 只取一条
                const chitulList = list
                    .filter((item) => {
                        return (
                            item.type === "chitu-horse" &&
                            (new Date().valueOf() - new Date(item.created_at).valueOf()) / 1000 / 60 <= 15
                        );
                    })
                    .slice(0, 1);
                const diluList = list
                    .filter((item) => {
                        return (
                            item.type === "dilu-horse" &&
                            (new Date().valueOf() - new Date(item.created_at).valueOf()) / 1000 / 60 <= 15
                        );
                    })
                    .slice(0, 1);

                const newThreeList = [];
                threeList.forEach((item) => {
                    // 三大马场拆分成四条
                    item.content.split("\n\n").forEach((content, index) => {
                        if (content && (content.match(/还有(\S*)分钟/) || content.match("即将出世"))) {
                            // 还有多少分钟
                            const minute = content.match(/还有(\S*)分钟/)
                                ? Number(content.match(/还有(\S*)分钟/)[1])
                                : 0;
                            // 如果上报时间+出现时间+15分钟在当前时间之前则过滤掉
                            const bol =
                                new Date(item.created_at).valueOf() + (minute + 15) * 60 * 1000 >= new Date().valueOf();
                            if (bol) {
                                newThreeList.push({
                                    ...item,
                                    id: index ? Number(index + item.id.toString()) : item.id,
                                    content: content,
                                    minute: minute,
                                    horseIndex: index,
                                });
                            }
                        }
                    });
                });
                const newList = newThreeList.concat(chitulList, diluList, bList);
                this.list = newList
                    .map((item) => {
                        let fromTime = "";
                        let toTime = "";
                        if (!!("minute" in item)) {
                            if (!this.isAsia) {
                                fromTime = dayjs
                                    .tz(new Date(item.created_at).valueOf() + (item.minute + 5) * 60 * 1000)
                                    .format("HH:mm");
                                toTime = dayjs
                                    .tz(new Date(item.created_at).valueOf() + (item.minute + 10) * 60 * 1000)
                                    .format("HH:mm");
                            } else {
                                fromTime = dayjs(
                                    new Date(item.created_at).valueOf() + (item.minute + 5) * 60 * 1000
                                ).format("HH:mm");
                                toTime = dayjs(
                                    new Date(item.created_at).valueOf() + (item.minute + 10) * 60 * 1000
                                ).format("HH:mm");
                            }
                        } else {
                            if (!this.isAsia) {
                                fromTime = dayjs
                                    .tz(new Date(item.created_at).valueOf() + 5 * 60 * 1000)
                                    .format("HH:mm");
                                toTime = dayjs.tz(new Date(item.created_at).valueOf() + 10 * 60 * 1000).format("HH:mm");
                            } else {
                                fromTime = dayjs(new Date(item.created_at).valueOf() + 5 * 60 * 1000).format("HH:mm");
                                toTime = dayjs(new Date(item.created_at).valueOf() + 10 * 60 * 1000).format("HH:mm");
                            }
                        }
                        return {
                            ...item,
                            ...this.getOriginDatas(item),
                            fromTime: fromTime,
                            toTime: toTime,
                        };
                    })
                    .sort((a, b) => this.convertTime(a.fromTime) - this.convertTime(b.fromTime));
                // console.log(this.list);
            });
        },
        convertTime(time) {
            const [hour, minute] = time.split(":").map(Number);
            return hour * 60 + minute;
        },
    },
    mounted() {
        // this.server = "长安城";
        if (User.isLogin()) {
            getUserInfo().then((res) => {
                this.server = res.data?.data?.jx3_server || "梦江南";
            });
        } else {
            this.server = "梦江南";
        }
        this.timer = setInterval(() => {
            this.getGameReporter();
        }, 30 * 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v4/world/horse.less";

.u-chitu-tip,
.u-dilu-tip {
    max-width: 200px;
}
</style>
