<template>
    <section class="m-news bg-white p-6 shadow-sm border border-gray-200 border-opacity-60 mb-6">
        <div class="m-news__header flex items-center justify-between mb-6 gap-3">
            <a
                :href="more_link"
                class="text-xs font-black flex items-center text-gray-800 uppercase tracking-widest m-0"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src="@/assets/img/index/news.svg" alt="" svg-inline class="w-4 h-4 mr-2 text-indigo-500" />
                公告资讯
            </a>

            <div class="m-news__modes flex bg-gray-100 p-1 rounded-xl w-auto" role="tablist" aria-label="公告分类">
                <button
                    v-for="item in mode_list"
                    :key="item.value"
                    class="u-btn px-3 py-2 text-xs font-black rounded-lg transition-all border-0 bg-transparent cursor-pointer"
                    :class="
                        item.value === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    "
                    :aria-pressed="item.value === mode"
                    @click="switchMode(item.value)"
                >
                    {{ item.label }}
                </button>
            </div>
        </div>

        <div class="space-y-6">
            <a
                v-for="(item, i) in data"
                :key="`${mode}-${item.url || i}`"
                class="m-news__item group cursor-pointer block no-underline"
                :href="item.url || more_link"
                target="_blank"
                rel="noopener noreferrer"
            >
                <div class="flex items-center justify-between mb-2">
                    <span class="u-tag bg-indigo-50 text-indigo-500 uppercase">
                        {{ getTagText(item) }}
                    </span>
                    <span class="u-time text-xs font-mono text-gray-300 font-bold">{{ dateFormat(item.time) }}</span>
                </div>
                <div class="m-news__item-title text-sm font-black transition-colors" :style="itemStyle(item)">
                    {{ item.title }}
                </div>
            </a>

            <!-- <a
                class="text-xs text-gray-500 no-underline font-bold hover:text-indigo-600 inline-block"
                :href="more_link"
                target="_blank"
                rel="noopener noreferrer"
            >
                查看全部
            </a> -->
        </div>
    </section>
</template>

<script>
import { getPostsFree } from "@/service/index";
import dateFormat from "@/utils/dateFormat.js";
import { getChangelog, getGameNews } from "@/service/cms";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { all_map } from "@jx3box/jx3box-common/data/jx3_zlp.json";
import dayjs from "dayjs";

export default {
    name: "IndexNewsV5",
    data: function () {
        return {
            mode: "all",
            mode_list: [
                { label: "全部", value: "all" },
                { label: "魔盒", value: "box" },
                { label: "官方", value: "game" },
                { label: "技改", value: "skill_change" },
            ],

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
            box_links: {
                std: "/notice",
                origin: "/notice",
            },

            game_data: [],
            box_data: [],
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
            const list = [...this.game_data.slice(0, 3), ...this.box_data.slice(0, 2)];
            return list.slice(0, 5);
        },
        data: function () {
            if (this.mode === "all") return this.all_data;
            return this[this.mode + "_data"] || [];
        },
        zlp_map() {
            return all_map.reduce((obj, item) => {
                obj[item.value] = item.label;
                return obj;
            }, {});
        },
    },
    methods: {
        dateFormat: function (val) {
            return val ? dateFormat(val, "-") : "--";
        },
        switchMode: function (val) {
            this.mode = val;
        },
        loadGameData: function () {
            getGameNews({ client: this.client }).then((res) => {
                this.game_data = (res?.data?.data?.list || [])
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
                this.box_data = (res?.data?.data?.list || []).map((item) => {
                    item.title = item.post_title;
                    item.url = `/notice/${item.ID}`;
                    item.time = new Date(item.post_modified);
                    item.type = "box";
                    return item;
                });
            });
        },
        loadSkillChangeData: function () {
            getChangelog({ client: this.client }).then((res) => {
                this.skill_change_data = (res?.data?.data?.list || []).slice(0, 5).map((item) => {
                    item.title = `【${this.zlp_map[item.zlp]}】${item.title}`;
                    item.url = item.link || getLink("bps", item.post_id);
                    item.time = new Date(item.date);
                    item.type = "skill_change";
                    return item;
                });
            });
        },
        getTagText: function (item) {
            if (item?.type === "box" || this.mode === "box") return "魔盒";
            if (item?.type === "skill_change" || this.mode === "skill_change") return "技改";

            const title = item?.title || "";
            if (title.includes("维护")) return "维护";
            if (title.includes("更新")) return "更新";
            return "公告";
        },
        itemStyle(item) {
            if (item?.color) {
                return {
                    fontWeight: "700",
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
.m-news {
    border-radius: 2rem;
    .m-news__item-title {
        display: block;
        white-space: nowrap;
        // text-overflow: ellipsis;
        overflow: hidden;
        color: #334155;
    }

    .u-tag {
        font-size: 9px;
        padding: 2px 8px;
        border-radius: 4px;
        letter-spacing: 0.01em;
    }

    .m-news__item:hover .m-news__item-title {
        color: @primary;
    }

    .u-time {
        font-weight: 700;
        font-size: 10px;
        color: #cbd;
    }
}
@media screen and (max-width: @phone) {
    .m-news {
        border-radius: 1.25rem;
        padding: 1.25rem;

        .m-news__header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 1.25rem;
        }

        .m-news__modes {
            width: 100%;
        }

        .u-btn {
            flex: 1;
        }
    }
}
</style>
