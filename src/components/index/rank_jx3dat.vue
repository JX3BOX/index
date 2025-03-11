<template>
    <div class="m-rank-jx3dat m-rank m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-data"></i>
            <a class="u-title" href="/jx3dat" target="_blank">团控订阅号热榜</a>
            <a
                href="/jx3dat/#/rank"
                class="u-more"
                title="查看更多"
                target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <ul class="u-list">
            <li v-for="(item, j) in data" :key="j">
                <a class="u-link" :href="item.pid | postLink" target="_blank">
                    <i
                        class="u-trending"
                        :class="calcTrending(item.yesterday, item.before2)"
                    ></i>
                    <span class="u-name"
                        >{{ item.author
                        }}<span v-if="item.v != '默认版'"
                            >#{{ item.v }}</span
                        ></span
                    >
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
import { getJx3datRank } from "@/service/rank";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "jx3datrank",
    props: [],
    data: function() {
        return {
            data: [],
        };
    },
    computed: {},
    methods: {
        calcTrending: function(yesterday, before2) {
            return yesterday - before2 > 0
                ? "el-icon-caret-top"
                : "el-icon-caret-bottom";
        },
    },
    filters: {
        postLink: function(pid) {
            return getLink("jx3dat", pid);
        },
    },
    created: function() {
        getJx3datRank().then((res) => {
            this.data = res.data.slice(0, 10);
        });
    },
    components: {},
};
</script>
