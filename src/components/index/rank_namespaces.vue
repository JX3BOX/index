<template>
    <div class="m-rank-collection m-rank m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-data"></i>
            <a class="u-title" href="/bbs/#/namespace" target="_blank"
                >热点铭牌</a
            >
            <a
                href="/bbs/#/namespace"
                class="u-more"
                title="查看更多"
                target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <ul class="u-list">
            <li v-for="(item, i) in data" :key="i">
                <a class="u-link" :href="item.link" target="_blank">
                    <span class="u-order" :class="highlight(i)">{{
                        i + 1
                    }}</span>
                    <span class="u-name">{{ item.key }}</span>
                    <span class="u-per">
                        <em class="u-count">+ {{ item.views }}</em>
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getRank,getNamespaces } from "@/service/rank.js";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import highlight from "@/utils/highlight";
export default {
    name: "namespacerank",
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
    created: function() {
        getRank("namespace").then(([ids,views]) => {
            this.ids = ids
            this.views = views
            ids && ids.length && getNamespaces({ ids: ids, per: ids.length }).then((res) => {
                let list = res.data.data.list || []
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
