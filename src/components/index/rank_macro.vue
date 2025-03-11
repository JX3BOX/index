<template>
    <div class="m-rank-macro m-rank m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-data"></i>
            <a class="u-title" href="/macro" target="_blank">云端宏热榜</a>
            <a
                href="/macro/#/rank"
                class="u-more"
                title="查看更多"
                target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <ul class="u-list">
            <li v-for="(item, j) in data" :key="j">
                <a class="u-link" :href="item.pid | postLink" target="_blank">
                    <img class="u-xf" :src="item.xf | showIcon" />
                    <span class="u-name">{{ item.author }}#{{ item.v }}</span>
                    <span class="u-per">
                        <em class="u-count"
                            ><i class="el-icon-download"></i>
                            {{ item["7days"] }}</em
                        >
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getMacroRank } from "@/service/rank";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "macrorank",
    props: [],
    data: function() {
        return {
            data: [],
        };
    },
    computed: {},
    methods: {},
    filters: {
        postLink: function(pid) {
            return getLink("macro", pid);
        },
        showIcon: function(xfid) {
            let id = xfid || 0;
            return __imgPath + "image/xf/" + id + ".png";
        },
    },
    created: function() {
        getMacroRank().then((res) => {
            this.data = res.data.slice(0, 10);
        });
    },
    components: {},
};
</script>
