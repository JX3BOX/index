<template>
    <div class="m-rank-collection m-rank m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-data"></i>
            <a class="u-title" href="/collection" target="_blank"
                >剑三小册热榜</a
            >
            <a
                href="/collection"
                class="u-more"
                title="查看更多"
                target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <ul class="u-list">
            <li v-for="(item, i) in data" :key="i">
                <a class="u-link" :href="item.id | postLink" target="_blank">
                    <span class="u-order" :class="highlight(i)">{{
                        i + 1
                    }}</span>
                    <span class="u-name">{{ item.title }}</span>
                    <span class="u-per">
                        <em class="u-count">+ {{ item.views }}</em>
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getRank,getCollections } from "@/service/rank.js";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import highlight from "@/utils/highlight";
export default {
    name: "collectionrank",
    props: [],
    data: function() {
        return {
            data: [],
            ids : [],
            views : []
        };
    },
    computed: {},
    methods: {
        highlight,
    },
    filters: {
        postLink: function(id) {
            return getLink("collection", id);
        },
    },
    created: function() {
        getRank("collection").then(([ids,views]) => {
            this.ids = ids
            this.views = views
            getCollections({ ids: ids, limit: ids.length }).then((res) => {
                let list = res.data.data.data || []
                let data = []
                list.forEach((item,i) => {
                    if (item) {
                        item.views = views[i]
                        data.push(item)
                    }
                });
                this.data = data;
            });
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/rank.less";
</style>
