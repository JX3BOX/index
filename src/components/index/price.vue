<template>
    <div class="m-price m-sideblock" v-if="client == 'std'">
        <div class="m-price-header m-sideblock-header">
            <div class="u-left">
                <i class="el-icon-s-marketing"></i> <a class="u-title" href="/app/price" target="_blank">金价走势</a
                ><el-select class="u-select" v-model="server" filterable placeholder="选择服务器" size="mini">
                    <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </div>

            <div class="u-right">
                <a href="/app/price" class="u-more" title="查看更多" target="_blank">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-price-content" v-if="data">
            <el-row :gutter="10">
                <el-col :span="8" v-for="(item, i) in data" :key="i">
                    <div class="u-item">
                        <span class="u-item-platform">
                            {{ platforms[item.platform] }}
                        </span>
                        <span class="u-item-value">
                            <b>{{ item.price ? item.price : "未知" }}</b
                            >金/￥
                        </span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="m-price-null" v-else>暂无数据</div>
    </div>
</template>

<script>
import servers from "@jx3box/jx3box-data/data/server/server_cn.json";
import { getPrice } from "@/service/spider";
export default {
    name: "price",
    props: [],
    data: function () {
        return {
            origin: "",
            servers,
            server: "蝶恋花",
            platforms: {
                official: "万宝楼",
                post: "贴吧",
                5173: "5173",
            },
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        data: function () {
            if (this.origin && this.origin[this.server]) {
                let data = this.origin[this.server]["today"];
                let output = [];
                for (let platform in data) {
                    let item = data[platform];
                    if (item && item.length) {
                        output.push({
                            platform,
                            price: Math.max(...data[platform]),
                        });
                    } else {
                        output.push({
                            platform,
                            price: "",
                        });
                    }
                }
                return output.reverse();
            } else {
                return "";
            }
        },
        my_server: function () {
            return this.$store.state.server;
        },
    },
    watch: {
        my_server: function (val) {
            if (val) this.server = val;
        },
    },
    methods: {
        getData() {
            return getPrice().then((res) => {
                if (!res.data.code) {
                    this.origin = res.data.data;
                }
            });
        },
        install() {
            this.getData();
        },
    },
    mounted: function () {},
    created: function () {
        this.install();
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/price.less";
</style>
