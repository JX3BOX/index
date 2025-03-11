<template>
    <div class="m-v2-post m-sideblock">
        <div class="m-guide-header m-sideblock-header">
            <div class="u-left"><i class="u-icon el-icon-s-management"></i> <span class="u-title">最新百科</span></div>
            <div class="u-right">
                <a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-v2-post-box" v-loading="loading">
            <div class="m-v2-post-header">
                <el-tabs v-model="type">
                    <el-tab-pane name="all">
                        <span slot="label">全部</span>
                    </el-tab-pane>
                    <el-tab-pane
                        :label="item.label"
                        :name="item.slug"
                        v-for="(item, i) in links"
                        :key="i"
                    ></el-tab-pane>
                </el-tabs>
            </div>
            <template v-if="type === 'calendar'">
                <div class="m-v2-post-content">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink('calendar', item.id)"
                        :target="target"
                    >
                        <el-image class="u-avatar" :src="showAvatar(item)" fit="cover"></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ formatTypeName(type) }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                                (item.user_info && item.user_info.display_name) || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ dateFormat(item.created_at) }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.desc || "无标题" }}
                        </span>
                    </a>
                </div>
            </template>
            <div v-else class="m-v2-post-content">
                <a
                    class="u-post"
                    v-for="(item, i) in data"
                    :key="i"
                    :href="getLink(item.type, item.source_id)"
                    :target="target"
                >
                    <el-image class="u-avatar" :src="showAvatar(item)" fit="cover"></el-image>
                    <div class="u-info">
                        <i class="el-icon-collection-tag"></i>
                        <span class="u-type" target="_blank">{{ formatTypeName(item.type) }}</span>
                        ／
                        <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                            item.user_nickname || "匿名"
                        }}</span>
                        <span class="u-date">
                            <i class="el-icon-refresh"></i>
                            {{ wikiDate(item.updated) }}
                        </span>
                    </div>
                    <span class="u-title">
                        <i class="el-icon-reading"></i>
                        {{ item.title || "无标题" }}
                    </span>
                </a>
            </div>

            <div class="m-v2-post-more">
                <a :href="more_link" class="u-more">查看更多&raquo;</a>
            </div>
        </div>
    </div>
</template>

<script>
import { getWikiPosts } from "@/service/helper";
import { getRecentCalendar } from "@/service/cms";
import { buildTarget, authorLink, showAvatar, getLink, iconLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
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
                    label: "成就",
                    slug: "achievement",
                },
                {
                    label: "物品",
                    slug: "item",
                },

                {
                    label: "通识",
                    slug: "knowledge",
                },
                {
                    label: "任务",
                    slug: "quest",
                },
                {
                    label: "日历",
                    slug: "calendar",
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
            return this.type == "all" ? "/cj" : "/" + this.type;
        },
    },
    methods: {
        loadData: function () {
            let type = this.type == "all" ? "" : this.type;
            this.loading = true;
            if (this.type === "calendar") {
                getRecentCalendar({
                    per: 5,
                })
                    .then((res) => {
                        this.data = res.data.data.list || [];
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                getWikiPosts({
                    type,
                    limit: 5,
                    client: this.client,
                })
                    .then((res) => {
                        this.data = res.data.data.newest || [];
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        getLink,
        authorLink,
        formatTypeName: function (type) {
            return getTypeLabel(type);
        },
        dateFormat: function (val) {
            return showRecently(val);
        },
        showAvatar: function ({ user_avatar, user_info }) {
            let val = user_info ? user_info.user_avatar : user_avatar;
            return showAvatar(val);
        },
        iconLink,
        wikiDate: function (val) {
            return showRecently(new Date(val * 1000));
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
};
</script>

<style lang="less">
@import "../../assets/css/v2/posts.less";
</style>
