<template>
    <div class="m-world-v5-horse">
        <div class="m-world-v5-horse__item" :class="{ 'm-world-v5-horse__item--active': chituHasExist }">
            <el-tooltip effect="dark" placement="top" popper-class="u-chitu-tip">
                <template #content>
                    <div v-html="chituTip"></div>
                </template>
                <div class="u-icon-wrap">
                    <img class="u-icon" :src="getImgSrc('赤兔')" alt="赤兔" />
                </div>
            </el-tooltip>
            <div class="u-main">
                <div class="u-name">{{ chituName }}</div>
                <div class="u-desc">{{ chituDesc }}</div>
            </div>
            <button class="u-refresh" type="button" :disabled="chituLoading" @click="loadChituData">
                <i class="el-icon-refresh" :class="{ 'is-spinning': chituLoading }"></i>
            </button>
        </div>

        <div class="m-world-v5-horse__item" :class="{ 'm-world-v5-horse__item--active': diluHasExist }">
            <el-tooltip effect="dark" placement="top" popper-class="u-dilu-tip">
                <template #content>
                    <div v-html="diluTip"></div>
                </template>
                <div class="u-icon-wrap">
                    <img class="u-icon" :src="getImgSrc('的卢')" alt="的卢" />
                </div>
            </el-tooltip>
            <div class="u-main">
                <div class="u-name">{{ diluName }}</div>
                <div class="u-desc">{{ diluDesc }}</div>
            </div>
            <div v-if="!diluHasExist" class="u-status is-danger">
                <span>本CD尚未刷新</span>
                <button class="u-refresh" type="button" :disabled="diluLoading" @click="loadDiluData">
                    <i class="el-icon-refresh" :class="{ 'is-spinning': diluLoading }"></i>
                </button>
            </div>
            <button v-else class="u-refresh" type="button" :disabled="diluLoading" @click="loadDiluData">
                <i class="el-icon-refresh" :class="{ 'is-spinning': diluLoading }"></i>
            </button>
        </div>

        <div class="m-world-v5-horse__list">
            <div
                v-for="item in list"
                :key="item.id"
                class="m-world-v5-horse__item m-world-v5-horse__item--report"
                :class="{ 'm-world-v5-horse__item--active': isCurrentTimeInRange(item) }"
            >
                <div class="u-icons">
                    <el-tooltip v-for="horse in item.horses" :key="horse" :content="horse" placement="top">
                        <div class="u-icon-wrap">
                            <img class="u-icon" :src="getImgSrc(horse)" :alt="horse" />
                        </div>
                    </el-tooltip>
                </div>
                <div class="u-right">
                    <div class="u-name">{{ item.map_name }}</div>
                    <div class="u-desc">{{ item.fromTime }} ~ {{ item.toTime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "@/utils/day";
import horseSites from "@/assets/data/horse_sites.json";
import { getGameReporter, getHorseReporter } from "@/service/horse";
import horseBroadcast from "@/assets/data/horse_broadcast.json";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const { __imgPath } = JX3BOX;

export default {
    name: "IndexWorldHorseNoticeV5",
    props: {
        server: {
            type: String,
            default: "",
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data() {
        return {
            list: [],
            timer: null,
            chituMap: {
                方问: "鲲鹏岛",
                小赤: "阴山大草原",
                杨新: "黑戈壁",
            },
            chituHasExist: false,
            chituExistData: {
                map: "",
                line: "",
                time: "",
            },
            chituLoading: false,
            diluHasExist: false,
            diluExistData: {
                map: "",
                time: "",
            },
            diluLoading: false,
            chituTip: `
             <p>CD: 周二7点 ~ 下周一7点。</p>
             <p>地图: 黑戈壁、阴山大草原、鲲鹏岛。</p>
             <p>必备: <卦文龟甲>交大战时有几率获得，赤兔刷新后再到信使处领取，有效期8天。</p>
            `,
            diluTip: `
             <p>CD: 每周一次，周一、三、五、六、日 10点 ~ 24点期间随机开启。</p>
             <p>地图: 随机刷新于某一野外场景。</p>
            `,
        };
    },
    computed: {
        isAsia() {
            return this.$store.state.timezone === "Asia/Shanghai";
        },
        chituName() {
            return this.chituHasExist && this.chituExistData.map ? `赤兔 · ${this.chituExistData.map}` : "赤兔";
        },
        chituDesc() {
            if (!this.chituHasExist || !this.chituExistData.time) return "本CD尚未刷新";
            return this.chituExistData.time;
        },
        diluName() {
            return this.diluHasExist && this.diluExistData.map ? `的卢 · ${this.diluExistData.map}` : "的卢";
        },
        diluDesc() {
            if (!this.diluHasExist) return "--";
            return this.diluExistData.time || "--";
        },
    },
    watch: {
        server: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.loadAll();
            },
        },
    },
    methods: {
        getImgSrc(horseName) {
            const id = horseBroadcast[horseName] && horseBroadcast[horseName].id;
            if (!id) return "";
            return __imgPath + `horse/${this.client}/` + id + ".png";
        },
        parseLine(content) {
            if (!content) return "";
            const matched = content.match(/([一二三四五六七八九十]+线)/);
            return matched ? matched[1] : "";
        },
        loadAll() {
            this.loadGameReporter();
            this.loadChituData();
            this.loadDiluData();
        },
        convertTime(time) {
            const [hour, minute] = (time || "00:00").split(":").map(Number);
            return hour * 60 + minute;
        },
        isCurrentTimeInRange(item) {
            const from = this.convertTime(item && item.fromTime);
            const to = this.convertTime(item && item.toTime);
            const now = dayjs.tz();
            const nowMinute = now.hour() * 60 + now.minute();
            if (Number.isNaN(from) || Number.isNaN(to)) return false;
            if (from <= to) {
                return nowMinute >= from && nowMinute <= to;
            }
            return nowMinute >= from || nowMinute <= to;
        },
        getOriginDatas(item) {
            let mapId = "";
            let mapName = "";
            let coordinates = [];
            let horses = [];
            if (item.subtype === "npc_chat") {
                mapId = String(item.map_id || "");
                mapName = item.map_name || "";
                const site = mapId ? horseSites[mapId] : null;
                coordinates = (site && site.coordinates) || [];
                const horseGroup = site && site.horses && site.horses[item.horseIndex];
                horses = Array.isArray(horseGroup) ? horseGroup : [];
            } else {
                mapName = item.content && item.content.match(/在(\S*)出没/) ? item.content.match(/在(\S*)出没/)[1] : "";
                Object.keys(horseSites).forEach((key) => {
                    const site = horseSites[key];
                    if (!site || site.mapName !== mapName) return;
                    mapId = key;
                    coordinates = site.coordinates || [];
                    horses = (site.horses || []).flat();
                });
            }
            const coor = coordinates[0] || {};
            return {
                mapDatas: mapId
                    ? {
                          [mapId]: [
                              {
                                  content: `${horses.join()}<br />坐标：(${coor.x || 0},${coor.y || 0},${coor.z || 0})`,
                                  ...coor,
                              },
                          ],
                      }
                    : {},
                map_id: mapId,
                map_name: mapName,
                horses: horses,
            };
        },
        loadGameReporter() {
            if (!this.server) return;
            const params = {
                pageIndex: 1,
                pageSize: 50,
                server: this.server,
                type: "horse",
            };
            getGameReporter(params).then((res) => {
                const data = res?.data?.data || {};
                const list = data.list || [];
                const mapSet = new Map();
                const threeList = list.filter(
                    (item) => item.map_id && !mapSet.has(item.map_id) && mapSet.set(item.map_id, true)
                );
                const bList = list.filter((item) => {
                    const diff = (Date.now() - new Date(item.created_at).valueOf()) / 1000 / 60;
                    return !item.map_id && item.type === "horse" && diff <= 15;
                });

                const newThreeList = [];
                threeList.forEach((item) => {
                    (item.content || "").split("\n\n").forEach((content, index) => {
                        if (!content || (!content.match(/还有(\S*)分钟/) && !content.match("即将出世"))) return;
                        const minute = content.match(/还有(\S*)分钟/) ? Number(content.match(/还有(\S*)分钟/)[1]) : 0;
                        const isValid = new Date(item.created_at).valueOf() + (minute + 15) * 60 * 1000 >= Date.now();
                        if (!isValid) return;
                        newThreeList.push({
                            ...item,
                            id: index ? Number(index + item.id.toString()) : item.id,
                            content,
                            minute,
                            horseIndex: index,
                        });
                    });
                });

                const newList = newThreeList.concat(bList);
                this.list = newList
                    .map((item) => {
                        let fromTime = "";
                        let toTime = "";
                        if (Object.prototype.hasOwnProperty.call(item, "minute")) {
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
                        } else if (!this.isAsia) {
                            fromTime = dayjs.tz(new Date(item.created_at).valueOf() + 5 * 60 * 1000).format("HH:mm");
                            toTime = dayjs.tz(new Date(item.created_at).valueOf() + 10 * 60 * 1000).format("HH:mm");
                        } else {
                            fromTime = dayjs(new Date(item.created_at).valueOf() + 5 * 60 * 1000).format("HH:mm");
                            toTime = dayjs(new Date(item.created_at).valueOf() + 10 * 60 * 1000).format("HH:mm");
                        }
                        return {
                            ...item,
                            ...this.getOriginDatas(item),
                            fromTime,
                            toTime,
                        };
                    })
                    .sort((a, b) => this.convertTime(a.fromTime) - this.convertTime(b.fromTime));
            });
        },
        normalizeCreatedAt(rawTime) {
            let createdAt = dayjs(rawTime || dayjs.tz());
            if (!this.isAsia) {
                createdAt = dayjs.tz(rawTime || dayjs.tz());
            }
            return createdAt;
        },
        loadDiluData() {
            if (!this.server) return;
            this.diluLoading = true;
            getHorseReporter("dilu-horse", this.server)
                .then((res) => {
                    const list = res.data?.data?.list || [];
                    if (!list.length) {
                        this.diluHasExist = false;
                        return;
                    }

                    const latest = list[0];
                    const createdAt = this.normalizeCreatedAt(latest.created_at);

                    const now = dayjs.tz();
                    const nowDay = now.day();
                    let cdFrom = now.day(1).hour(10).minute(0).second(0).millisecond(0);
                    let cdTo = cdFrom.add(1, "week").add(-10, "hour").add(-1, "millisecond");
                    if (nowDay < 1) {
                        cdFrom = dayjs.tz(cdFrom).add(-1, "week");
                        cdTo = dayjs.tz(cdTo).add(-1, "week");
                    }

                    const isBetween = createdAt.isBetween(cdFrom, cdTo);
                    this.diluHasExist = isBetween;
                    if (isBetween) {
                        const content = latest.content || "";
                        const mapName = content.match(/的卢已经出现在(\S*)中/)
                            ? content.match(/的卢已经出现在(\S*)中/)[1]
                            : "";
                        this.diluExistData = {
                            map: mapName,
                            time: createdAt.format("YYYY-MM-DD HH:mm:ss"),
                        };
                    } else {
                        this.diluExistData = {
                            map: "",
                            time: "",
                        };
                    }
                })
                .finally(() => {
                    this.diluLoading = false;
                });
        },
        loadChituData() {
            if (!this.server) return;
            this.chituLoading = true;
            getHorseReporter("chitu-horse", this.server)
                .then((res) => {
                    const list = res.data?.data?.list || [];
                    if (!list.length) {
                        this.chituHasExist = false;
                        return;
                    }

                    const latest = list[0];
                    const createdAt = this.normalizeCreatedAt(latest.created_at);

                    const now = dayjs.tz();
                    const nowDay = now.day();
                    const nowHour = now.hour();
                    let cdFrom = now.day(2).hour(7).minute(0).second(0).millisecond(0);
                    let cdTo = cdFrom.add(1, "week").add(-1, "millisecond");
                    if (nowDay <= 1 || (nowDay === 2 && nowHour < 7)) {
                        cdFrom = dayjs.tz(cdFrom).add(-1, "week");
                        cdTo = dayjs.tz(cdTo).add(-1, "week");
                    }

                    const isBetween = createdAt.isBetween(cdFrom, cdTo);
                    this.chituHasExist = isBetween;
                    if (isBetween) {
                        const content = latest.content || "";
                        const npcMatch = /\]\[(.*)\]大声喊/.exec(content);
                        const npc = npcMatch ? npcMatch[1].trim() : "";
                        this.chituExistData = {
                            map: this.chituMap[npc] || "",
                            line: this.parseLine(content),
                            time: createdAt.format("YYYY-MM-DD HH:mm:ss"),
                        };
                    } else {
                        this.chituExistData = {
                            map: "",
                            line: "",
                            time: "",
                        };
                    }
                })
                .finally(() => {
                    this.chituLoading = false;
                });
        },
    },
    mounted() {
        this.timer = setInterval(() => {
            this.loadAll();
        }, 30 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="less">
.m-world-v5-horse {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.m-world-v5-horse__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 176px;
    overflow-y: auto;
    padding-right: 2px;
}

.m-world-v5-horse__item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #ffffff;
    padding: 10px;
    border-radius: 12px;
}

.m-world-v5-horse__item--active {
    border-left: 4px solid #fb7185;
    padding-left: 7px;
}

.m-world-v5-horse .u-icon-wrap {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.m-world-v5-horse .u-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.m-world-v5-horse .u-icons {
    display: inline-flex;
    gap: 6px;
    flex-shrink: 0;
    width: 102px;
    max-width: 102px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding-bottom: 2px;
}

.m-world-v5-horse .u-icons::-webkit-scrollbar {
    height: 4px;
}

.m-world-v5-horse .u-icons::-webkit-scrollbar-thumb {
    background: #d6dde8;
    border-radius: 999px;
}

.m-world-v5-horse .u-main {
    flex: 1;
    min-width: 0;
}

.m-world-v5-horse .u-right {
    flex: 1;
    min-width: 0;
    margin-left: auto;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.m-world-v5-horse .u-name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.m-world-v5-horse__item--active .u-name {
    color: #e11d48;
}

.m-world-v5-horse .u-desc {
    margin-top: 2px;
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.2;
    word-break: break-word;
}

.m-world-v5-horse .u-refresh {
    border: none;
    background: transparent;
    color: #cbd5e1;
    cursor: pointer;
    padding: 0 2px;
    font-size: 12px;
    line-height: 1;
}

.m-world-v5-horse .u-refresh:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.m-world-v5-horse .u-refresh .is-spinning {
    display: inline-block;
    animation: v5-horse-refresh-rotate 0.8s linear infinite;
}

.m-world-v5-horse .u-status {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.m-world-v5-horse .u-status.is-danger {
    color: #cbd5e1;
}

.u-chitu-tip,
.u-dilu-tip {
    max-width: 220px;
}

@keyframes v5-horse-refresh-rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
