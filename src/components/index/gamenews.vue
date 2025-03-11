<template>
    <div class="m-gamenews m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-message-solid"></i>
            <a class="u-title" :href="more_link" target="_blank">游戏更新</a>
            <a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                <i class="el-icon-more"></i>
            </a>
        </div>
        <ul class="m-sideblock-list u-list" v-if="data.length">
            <li v-for="(item, i) in data" :key="i">
                <em>{{ dateFormat(item.time) }}</em>
                <a :href="item.url | linkFormat" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getGameNews } from "@/service/spider";
import dateFormat from "@/utils/dateFormat.js";
export default {
    name: "gamenews",
    props: [],
    data: function () {
        return {
            data: [],
            more_links: {
                std: "https://jx3.xoyo.com/allnews/",
                origin: "https://jx3yq.xoyo.com/index/#/latest",
            },
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        more_link: function () {
            return this.more_links[this.client];
        },
    },
    methods: {
        dateFormat: function (val) {
            if (this.client == "std") {
                return val.replace("/", "-");
            } else {
                return dateFormat(new Date(~~val * 1000));
            }
        },
    },
    filters: {
        linkFormat: function (val) {
            if (val.startsWith("/")) {
                return "https://jx3.xoyo.com" + val;
            } else {
                return val;
            }
        },
    },
    mounted: function () {
        getGameNews(this.client).then((res) => {
            // 统一数据格式
            if (this.client == "std") {
                let data = res.data;
                this.data = data.slice(0, 5);
            } else {
                let data = res.data.data;
                let list = [];
                for (let group in data) {
                    list.push(...data[group].list);
                }
                list.forEach((item) => {
                    item.time = item.inputtime;
                });
                list.sort((a, b) => {
                    return ~~b.inputtime - ~~a.inputtime;
                });
                this.data = list.slice(0, 5);
            }
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/gamenews.less";
</style>
