<template>
    <div class="m-v2-post m-sideblock">
        <div class="m-guide-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-management"></i>
            <span class="u-title">最新作品</span>
            <mini-bread class="u-bread" name="index_topics" />
            </div>
            <div class="u-right"><a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                <i class="el-icon-more"></i>
            </a></div>
        </div>
        <div class="m-v2-post-box">
            <div class="m-v2-post-header">
                <el-tabs v-model="type">
                    <el-tab-pane name="all">
                        <span slot="label">全部</span>
                    </el-tab-pane>
                    <el-tab-pane :label="item.label" :name="item.slug" v-for="(item, i) in links" :key="i"></el-tab-pane>
                </el-tabs>
            </div>
            <template>
                <div class="m-v2-post-content" v-loading="loading">
                    <a class="u-post" v-for="(item, i) in data" :key="i" :href="getLink(item.post_type, item.ID)" :target="target">
                        <el-image class="u-avatar" :src="showAvatar(item)" fit="cover" :alt="item.author_info && item.author_info.display_name"></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ formatTypeName(item.post_type)   }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.post_author)" target="_blank">{{
                                (item.author_info && item.author_info.display_name) || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ dateFormat(item.post_modified)  }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.post_title || "无标题" }}
                        </span>
                    </a>
                </div>
            </template>
            <div class="m-v2-post-more">
                <a :href="more_link" class="u-more">查看更多&raquo;</a>
            </div>
        </div>
    </div>
</template>

<script>
import { getPosts } from "@/service/index";
import { buildTarget, authorLink, showAvatar, getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { __postType } from "@jx3box/jx3box-common/data/jx3box.json";
import { showRecently } from "@/utils/moment";
import Mini_bread from "../content/mini_bread.vue";
export default {
    name: "v2-post",
    props: [],
    data: function () {
        return {
            data: [],
            target: buildTarget(),
            type: "all",
            links: [
                {
                    label: "宏库",
                    slug: "macro",
                },
                {
                    label: "插件",
                    slug: "jx3dat",
                },
                {
                    label: "副本",
                    slug: "fb",
                },
                {
                    label: "职业",
                    slug: "bps",
                },
                {
                    label: "工具",
                    slug: "tool",
                },

                {
                    label: "茶馆",
                    slug: "bbs",
                },
            ],
            loading: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        more_link: function () {
            return this.type == "all" ? "/bbs" : "/" + this.type;
        },
    },
    methods: {
        loadData: function () {
            let type = this.type == "all" ? "" : this.type;
            this.loading = true;
            getPosts(this.client, type, 5)
                .then((res) => {
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getLink,
        authorLink,
        formatTypeName: function (type) {
            return getTypeLabel(type);
        },
        dateFormat: function (val) {
            return showRecently(val);
        },
        showAvatar: function (item) {
            let val = item.author_info && item.author_info.user_avatar;
            return showAvatar(val);
        },
    },
    watch: {
        type: function () {
            this.loadData();
        },
    },
    mounted: function () {
        this.loadData();
    },
    components: {
        "mini-bread": Mini_bread,
    },
};
</script>

<style lang="less">
    @import "../../assets/css/v2/posts.less";
</style>
