<template>
    <div class="m-world-block m-world-furniture">
        <el-divider content-position="left">家园</el-divider>
        <div class="m-furniture-list">
            <div class="m-furniture-item">
                <div class="u-title">园宅会赛·本期</div>
                <div class="u-item">
                    <div>加分属性</div>
                    <div class="u-furniture">
                        {{ (furnitureProperty && furnitureProperty.content) || "-" }}
                    </div>
                </div>
                <div class="u-item">
                    <div>评审分类</div>
                    <div class="u-furniture">
                        <a href="/furniture?match=1" target="_blank">{{
                            formatContent(furnitureCategory && furnitureCategory.content) || "-"
                        }}</a>
                    </div>
                </div>
            </div>
            <div class="m-furniture-item">
                <div class="u-title">园宅会赛·下期</div>
                <div class="u-item">
                    <div>加分属性</div>
                    <div class="u-furniture">
                        {{ nextCategory || "-" }}
                    </div>
                </div>
                <div class="u-item">
                    <div>评审分类</div>
                    <div class="u-furniture">
                        <a href="/furniture?match=1" target="_blank">
                            {{ nextProperty || "-" }}
                        </a>
                    </div>
                </div>
            </div>
            <!-- <div class="m-furniture-item">
                <div class="u-title">家园声望</div>
                <div class="m-reputation">
                    <a
                        class="u-reputation-item"
                        v-for="item in reputationList"
                        :key="item.id"
                        :href="getItemLink(item.id)"
                        target="_blank"
                    >
                        <div class="u-reputation">
                            <el-tooltip class="box-item" effect="dark" :content="item.Desc" placement="top">
                                <div class="u-reputation-item">
                                    <div class="u-reputation-icon" :class="`u-quality-${item.Quality}`">
                                        <img :src="iconLink(item.IconID)" :alt="item.Name" />
                                    </div>
                                    <span class="u-reputation-name">{{ item.Name }}</span>
                                </div>
                            </el-tooltip>
                        </div>
                    </a>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import dayjs from "@/utils/day";
import { getFurniture, getHomeReputation, getItems } from "@/service/spider";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "furniture",
    props: {
        date: {
            type: String,
            default: dayjs.tz().format("YYYY-MM-DD"),
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data() {
        return {
            furniture: [],
            reputation: {},
        };
    },
    computed: {
        reputationList() {
            return this.reputation?.list || [];
        },
        // 园宅会赛显示text
        furnitureCategory: function () {
            return this.furniture?.find((item) => item?.subtype === "category");
        },
        // 园宅会赛类型
        furnitureProperty: function () {
            return this.furniture?.find((item) => item?.subtype === "property");
        },
        furnitureNextMatch: function () {
            return this.furniture?.find((item) => item?.subtype === "next_match");
        },
        nextCategory: function () {
            const content = this.furnitureNextMatch?.content || "";
            let str = "";
            if (content) {
                str = content.split("\n")?.[0];
                if (str) {
                    str = str.split("：")?.[1];
                }
            }
            return str;
        },
        nextProperty: function () {
            const content = this.furnitureNextMatch?.content || "";
            let str = "";
            if (content) {
                str = content.split("\n")?.[1];
                if (str) {
                    str = str.split("：")?.[1];
                }
            }
            return str;
        },
    },
    watch: {
        date: {
            immediate: true,
            handler() {
                if (this.client === "std") {
                    this.loadFurniture();
                    // this.loadReputation();
                }
            },
        },
    },
    methods: {
        iconLink,
        getItemLink(id) {
            return `/item/view/${id}`;
        },
        // 家园声望
        loadReputation() {
            const cache = sessionStorage.getItem(`index_reputation_items`);
            if (cache) {
                const obj = JSON.parse(cache);
                if (obj.date === this.date) {
                    this.reputation = obj;
                    return;
                }
            }
            getHomeReputation(this.date, this.$store.state.server).then((res) => {
                const list = res.data?.data?.list || [];
                if (list.length) {
                    const ids = list.map((item) => {
                        return item.item_type_id + "_" + item.item_id;
                    });
                    this.loadItems(ids);
                }
            });
        },
        loadItems(ids) {
            // 读取本地数据
            if (!ids.length) return;
            getItems(ids).then((res) => {
                const list = res.data?.list || [];
                let newData = {
                    date: this.date,
                    list: list.map((item) => {
                        return {
                            id: item.id,
                            Name: item.Name,
                            IconID: item.IconID,
                            Quality: item.Quality,
                            Desc: /中(.*)\\\\\\/.exec(item.Desc)[1].trim(),
                        };
                    }),
                };
                this.reputation = newData;
                sessionStorage.setItem(`index_reputation_items`, JSON.stringify(newData));
            });
        },
        // 园宅会赛
        setFurniture(res) {
            let data = res.data.data;

            try {
                this.furniture = data;
            } catch (e) {
                this.furniture = [];
            }
        },
        loadFurniture: function () {
            try {
                let furniture = sessionStorage.getItem("furniture");

                furniture = furniture && JSON.parse(furniture);

                if (furniture) {
                    this.setFurniture(furniture);
                } else {
                    const params = {
                        subtypes: "category,property,next_match",
                        start: dayjs.tz().startOf("isoWeek").format("YYYY-MM-DD"),
                        end: dayjs.tz().endOf("isoWeek").format("YYYY-MM-DD"),
                    };
                    getFurniture(params).then((res) => {
                        this.setFurniture(res);

                        // 当家园会赛数据不存在时，不存储
                        if (res.data?.data?.length && res.data.data.every((item) => item)) {
                            sessionStorage.setItem("furniture", JSON.stringify(res));
                        }
                    });
                }
            } catch (e) {
                console.error(e);
                this.furniture = [];
            }
        },
        nl2br(str) {
            return str ? this.formatContent(str.replace(/\\n|\n/g, "<br>")) : "";
        },
        formatContent(str) {
            return str ? str.replace("+", "") : "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v4/world/furniture.less";
</style>
