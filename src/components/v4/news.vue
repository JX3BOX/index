<template>
    <div class="m-news bg-white p-5 shadow-sm border border-gray-200 border-opacity-60 mb-6">
        <div class="m-news-header">
            <div class="u-left">
                <a
                    :href="more_link"
                    class="text-xs flex items-center text-gray-800 uppercase tracking-widest m-0"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="@/assets/img/index/news.svg" alt="" svg-inline class="w-4 h-4 mr-2 text-indigo-500" />
                    公告资讯
                </a>
            </div>
            <div class="u-right flex bg-gray-100 p-1 rounded-md w-max" role="tablist" aria-label="公告分类">
                <button
                    v-for="item in mode_list"
                    :key="item.value"
                    class="text-xs u-btn px-2 py-1 text-[11px] rounded transition-all border-0 bg-transparent cursor-pointer tracking-wider"
                    :class="
                        item.value === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    "
                    :aria-pressed="item.value === mode"
                    @click="switchMode(item.value)"
                >
                    {{ item.label }}
                </button>
            </div>
        </div>
        <ul class="m-news-list m-sideblock-list" v-if="data">
            <li v-for="(item, i) in data" :key="i">
                <em v-if="item.time" class="u-time font-sans tabular-nums">{{ dateFormat(item.time) }}</em>
                <a class="u-title" :href="item.url" target="_blank" rel="noopener noreferrer" :style="itemStyle(item)">{{
                    item.title
                }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
// import { getGameNews } from "@/service/spider";
import { getPostsFree } from "@/service/index";
import dateFormat from "@/utils/dateFormat.js";
import { getChangelog, getGameNews } from "@/service/cms";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { all_map } from "@jx3box/jx3box-common/data/jx3_zlp.json";
import dayjs from "dayjs";
export default {
    name: "IndexNews",
    components: {},
    data: function () {
        return {
            mode: "all",
            mode_list: [
                { label: "全部", value: "all" },
                { label: "游戏", value: "game" },
                { label: "技改", value: "skill_change" },
                { label: "魔盒", value: "box" },
            ],

            // 游戏
            all_links: {
                std: "https://jx3.xoyo.com/allnews/",
                origin: "https://jx3yq.xoyo.com/index/#/latest",
            },
            game_links: {
                std: "https://jx3.xoyo.com/allnews/",
                origin: "https://jx3yq.xoyo.com/index/#/latest",
            },
            skill_change_links: {
                std: "/pvp/changelog",
                origin: "/pvp/changelog",
            },
            game_data: [],

            // 魔盒
            box_links: {
                std: "/notice",
                origin: "/notice",
            },
            box_data: [],

            // 技改
            skill_change_data: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        more_link: function () {
            return this[this.mode + "_links"]?.[this.client] || "/";
        },
        all_data: function () {
            let list = [...this.game_data.slice(0, 3), ...this.box_data.slice(0, 2)];
            // list = list.sort((a, b) => {
            //     return b.time - a.time;
            // });
            return list.slice(0, 5);
        },
        data: function () {
            return this.mode == "all" ? this.all_data : this[this.mode + "_data"];
        },
        zlp_map() {
            // 生成对象 {key: value}
            return all_map.reduce((obj, item) => {
                obj[item.value] = item.label;
                return obj;
            }, {});
        },
    },
    methods: {
        dateFormat: function (val) {
            return dateFormat(val, "-");
        },
        linkFormat: function (val) {
            if (val.startsWith("/")) {
                return "https://jx3.xoyo.com" + val;
            } else {
                return val;
            }
        },
        switchMode: function (val) {
            this.mode = val;
        },
        loadGameData: function () {
            getGameNews({ client: this.client }).then((res) => {
                this.game_data = res?.data.data.list
                    .map((item) => {
                        item.time = dayjs(item.post_date).toDate();
                        item.type = "game";
                        item.title = item.post_title;
                        item.url = item.post_url;
                        return item;
                    })
                    .slice(0, 5);
            });
        },
        loadBoxData: function () {
            getPostsFree({
                client: this.client,
                type: "notice",
                per: 5,
                sticky: 1,
            }).then((res) => {
                this.box_data = res.data.data?.list?.map((item) => {
                    item.title = item.post_title;
                    item.url = `/notice/${item.ID}`;
                    item.time = new Date(item.post_modified);
                    item.type = "box";
                    return item;
                });
            });
        },
        loadSkillChangeData: function () {
            const params = {
                client: this.client,
            };
            getChangelog(params).then((res) => {
                this.skill_change_data = (res.data.data?.list || []).slice(0, 5).map((item) => {
                    item.title = `【${this.zlp_map[item.zlp]}】${item.title}`;
                    item.url = item.link || getLink("bps", item.post_id);
                    item.time = new Date(item.date);
                    item.type = "skill_change";
                    return item;
                });
            });
        },
        itemStyle(item) {
            if (item?.color) {
                return {
                    color: item.color,
                    fontWeight: "bold",
                };
            }
            return {};
        },
    },
    mounted: function () {
        this.loadGameData();
        this.loadBoxData();
        this.loadSkillChangeData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v4/news.less";
</style>
