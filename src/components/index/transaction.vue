<template>
    <div class="m-index-transaction m-sideblock">
        <div class="m-sideblock-header">
            <a class="u-title" href="/item" target="_blank"><i class="u-icon el-icon-coin"></i> 全服交易行</a>
            <el-select class="u-server" v-model="server" placeholder="请选择服务器" size="mini">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
            <el-input class="u-search" placeholder="搜索" v-model="search" size="mini" @keyup.enter.native="goItemPage">
                <el-button slot="append" icon="el-icon-search" @click="goItemPage"></el-button>
            </el-input>
            <a href="/item" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                <i class="el-icon-more"></i>
            </a>
        </div>
        <div class="m-transaction-box">
            <div class="m-price-list" v-if="groups && groups.length">
                <el-carousel
                    indicator-position="none"
                    :autoplay="true"
                    :interval="3000"
                    height="200px"
                    direction="vertical"
                >
                    <el-carousel-item v-for="(group, key) in groups" :key="key">
                        <el-row :gutter="20">
                            <!-- <div class="u-group-title" v-text="group.label"></div> -->
                            <el-col :span="6" v-for="(item, k) in group.items" :key="k">
                                <a
                                    v-if="item"
                                    class="u-item"
                                    :class="`u-item-${key}`"
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
                                            <span
                                                class="u-trending"
                                                :class="item | showItemTrendingClass"
                                            >{{item | showItemTrending}}</span>
                                            <template v-if="item.sub_days_0_price">
                                                <!-- <span>今日：</span> -->
                                                <GamePrice :price="item.sub_days_0_price" />
                                            </template>
                                            <template
                                                v-else-if="!item.sub_days_0_price && item.sub_days_1_price"
                                            >
                                                <!-- <span>昨日：</span> -->
                                                <GamePrice :price="item.sub_days_1_price" />
                                            </template>
                                            <template
                                                v-else-if="!item.sub_days_0_price && !item.sub_days_1_price && item.sub_days_2_price"
                                            >
                                                <!-- <span>前日：</span> -->
                                                <GamePrice :price="item.sub_days_2_price" />
                                            </template>
                                            <span v-else>暂无价目</span>
                                        </span>
                                    </div>
                                </a>
                            </el-col>
                        </el-row>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<script>
import servers from "@jx3box/jx3box-data/data/server/server_std.json";
import GamePrice from "./GamePrice.vue";
import User from "@jx3box/jx3box-common/js/user";
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
            groups: [],
            server: "蝶恋花",
            servers: servers,
            search : ''
        };
    },
    methods: {
        loadData: function () {
            getItemPrice({
                server: this.server,
                keys: ["index1", "index2", "teshucailiao"],
            }).then((data) => {
                data = data.data;
                if (data.code === 200)
                    this.groups = Object.values(data.data.data) || [];
            });
        },
        goItemPage : function (){
            let host = location.origin
            window.open(`${host}/item/#/search/${this.search}?page=1`,'_blank')
        }
    },
    watch: {
        server: {
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    mounted: function () {
        if (User.isLogin()) {
            this.server = this.$store.state.server || "蝶恋花";
        }
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
};
</script>

<style lang="less">
@import "../../assets/css/index/transaction.less";
</style>
