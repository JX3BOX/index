<template>
    <div class="m-sideblock m-notice">
        <div class="m-sideblock-header">
            <i class="el-icon-s-opportunity"></i>
            <span class="u-title">魔盒更新</span>
            <a href="/notice" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                <i class="el-icon-more"></i>
            </a>
        </div>
        <ul class="m-sideblock-list u-list" v-if="data.length">
            <li v-for="(item, i) in data" :key="i">
                <em>{{ dateFormat(item.post_modified) }}</em>
                <a
                    :href="getLink(item)"
                    target="_blank"
                    rel="noopener noreferrer"
                    :style="{ color: item.color }"
                    :class="{ isHighlight: !!item.color }"
                    >{{ item.post_title }}</a
                >
            </li>
        </ul>
    </div>
</template>

<script>
import { getPosts } from "@/service/index";
import { dateFormat } from "@/utils/simpledate";
import User from "@jx3box/jx3box-common/js/user";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "notice",
    props: [],
    data: function () {
        return {
            data: [],
            isAdmin: User.isAdmin(),
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        dateFormat: function (val) {
            return dateFormat(val);
        },
        getLink: function (item) {
            return getLink("notice", item.ID);
        },
    },
    created: function () {
        getPosts(this.client, "notice", 5).then((res) => {
            this.data = res.data.data.list;
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/notice.less";
</style>
