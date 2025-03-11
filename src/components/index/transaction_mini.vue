<template>
    <div class="m-index-transaction m-sideblock" v-if="isReady">
        <div class="m-sideblock-header">
            <div class="u-left">
                <a class="u-title" href="/item" target="_blank"><i class="u-icon el-icon-s-shop"></i>交易价格</a>
                <el-select class="u-server" v-model="server" placeholder="请选择服务器" size="mini">
                    <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
                </el-select>
            </div>
            <div class="u-right">
                <a href="/item" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-transaction-box">
            <div class="m-price-list" v-if="data && data.length">
                <el-carousel
                    indicator-position="none"
                    :autoplay="true"
                    :interval="4000"
                    height="200px"
                    direction="vertical"
                >
                    <el-carousel-item v-for="(group, i) in groups" :key="i">
                        <div class="u-group" v-for="item in group" :key="item.item_id">
                            <a
                                v-if="item"
                                class="u-item"
                                :class="`u-item-${item.item_id}`"
                                :href="item.item_id | showItemLink"
                                target="_blank"
                            >
                                <div class="u-icon">
                                    <img :src="item.icon | iconLink" />
                                </div>
                                <div class="u-content">
                                    <span class="u-name">
                                        <span v-text="item.label"></span>
                                    </span>
                                    <span class="u-price">
                                        <span class="u-trending" :class="item | showItemTrendingClass">{{
                                            item | showItemTrending
                                        }}</span>
                                        <template v-if="item.sub_days_0_price">
                                            <!-- <span>今日：</span> -->
                                            <GamePrice :price="item.sub_days_0_price" />
                                        </template>
                                        <template v-else-if="!item.sub_days_0_price && item.sub_days_1_price">
                                            <!-- <span>昨日：</span> -->
                                            <GamePrice :price="item.sub_days_1_price" />
                                        </template>
                                        <template
                                            v-else-if="
                                                !item.sub_days_0_price &&
                                                !item.sub_days_1_price &&
                                                item.sub_days_2_price
                                            "
                                        >
                                            <!-- <span>前日：</span> -->
                                            <GamePrice :price="item.sub_days_2_price" />
                                        </template>
                                        <span v-else>暂无价目</span>
                                    </span>
                                </div>
                            </a>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import { getItemPrice } from "@/service/helper.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "transaction",
    props: [],
    components: {
        GamePrice,
    },
    data: function () {
        return {
            data: [],
            server: "",
            search: "",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
        servers: function () {
            if (this.client == "std") {
                return servers_std;
            } else {
                return servers_origin;
            }
        },
        my_server: function () {
            return this.$store.state.server;
        },
        groups: function () {
            const len = 5;
            let arr = [];
            let count = Math.ceil(this.data.length / len);
            for (let i = 0; i < count; i++) {
                arr.push([]);
            }
            for (let [i, item] of this.data.entries()) {
                let group = Math.floor(i / len);
                arr[group].push(item);
            }
            return arr;
        },
        isReady: function () {
            return this.client == "std"; //怀旧服暂不支持
        },
    },
    methods: {
        loadData: function () {
            getItemPrice(
                {
                    server: this.server,
                    keys: "baoxiang,wucaishi,mozhutu,chengjiushipin,chengjiushipin2",
                },
                this.client
            ).then((res) => {
                const { baoxiang, wucaishi, mozhutu, chengjiushipin, chengjiushipin2 } = res.data.data;
                let data = [
                    ...baoxiang.items,
                    ...wucaishi.items,
                    ...mozhutu.items,
                    ...chengjiushipin.items,
                    ...chengjiushipin2.items,
                ];
                this.data = data || [];
            });
        },
    },
    watch: {
        my_server: function (val) {
            if (val) this.server = val;
        },
        server: {
            immediate: true,
            handler(val) {
                val && this.loadData();
            },
        },
    },
    filters: {
        iconLink,
        showItemLink: function (val) {
            return `/item/#/view/${val}`;
        },
        showItemTrending: function (item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) {
                    return "▲";
                } else if (item.sub_days_0_price - item.sub_days_1_price < 0) {
                    return "▼";
                } else {
                    return "";
                }
            }
        },
        showItemTrendingClass: function (item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) {
                    return "up";
                } else if (item.sub_days_0_price - item.sub_days_1_price < 0) {
                    return "down";
                } else {
                    return "keep";
                }
            }
        },
    },
    mounted: function () {
        this.server = this.client == "origin" ? "缘起稻香" : "蝶恋花";
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/transaction_mini.less";
</style>
