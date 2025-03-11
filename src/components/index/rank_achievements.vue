<template>
    <div class="m-rank-cj m-rank m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-data"></i>
            <a class="u-title" href="/cj" target="_blank">热门成就榜</a>
            <a href="/cj" class="u-more" title="查看更多" target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <ul class="u-list" v-if="data && data.length">
            <li v-for="(item, j) in data" :key="j">
                <a class="u-link" :href="item.ID | postLink" target="_blank">
                    <img class="u-icon" :src="item.IconID | iconLink" />
                    <span class="u-name">{{ item.Name }}</span>
                    <span class="u-per">
                        <em class="u-count">+ {{ item.views }}</em>
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getRank, getAchievements } from "@/service/rank";
import { getLink,iconLink } from "@jx3box/jx3box-common/js/utils";
import { __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "cjrank",
    props: [],
    data: function() {
        return {
            data: [],
            ids : [],
            views : []
        };
    },
    computed: {},
    methods: {},
    filters: {
        postLink: function(id) {
            return getLink("cj", id);
        },
        iconLink
    },
    created: function() {
        getRank("cj").then(([ids,views]) => {
            this.ids = ids
            this.views = views
            getAchievements({ ids: ids, limit: ids.length }).then((res) => {
                let list = res.data.data.achievements || []
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
