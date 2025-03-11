<template>
    <div class="m-newpost m-sideblock">
        <div class="m-guide-header m-sideblock-header">
            <i class="u-icon el-icon-collection"></i>
            <span class="u-title">最新作品</span>
            <mini-bread class="u-bread" name="index_topics" />
            <a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                <i class="el-icon-more"></i>
            </a>
        </div>
        <div class="m-newpost-box">
            <div class="m-newpost-header m-sideblock-header">
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
            <template v-if="isWikiType">
                <div class="m-newpost-content" v-loading="loading">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(item.type, item.source_id)"
                        :target="target"
                    >
                        <el-image class="u-avatar" :src="item.user_avatar | showAvatar" fit="cover"></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ item.type | formatTypeName }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                                item.user_nickname || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ item.updated | wikiDate }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.title || "无标题" }}
                        </span>
                    </a>
                </div>
            </template>
            <template v-else-if="type === 'calendar'">
                <div class="m-newpost-content" v-loading="loading">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink('calendar', item.id)"
                        :target="target"
                    >
                        <el-image
                            class="u-avatar"
                            :src="(item.user_info && item.user_info.user_avatar) | showAvatar"
                            fit="cover"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ type | formatTypeName }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                                (item.user_info && item.user_info.display_name) || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ item.created_at | dateFormat}}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.desc || "无标题" }}
                        </span>
                    </a>
                </div>
            </template>
            <!-- <template v-else-if="type === 'pz'">
                <div class="m-newpost-content" v-loading="loading">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(type,item.id)"
                        :target="target"
                    >
                        <el-image
                            class="u-avatar"
                            :src="(item.pz_author_info && item.pz_author_info.user_avatar) | showAvatar"
                            fit="cover"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ type | formatTypeName }}</span>
                            ／
                            <span
                                class="u-author"
                                :href="authorLink(item.user_id)"
                                target="_blank"
                            >{{ item.pz_author_info && item.pz_author_info.display_name || '匿名'}}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ item.updated_at | dateFormat }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.title || "无标题" }}
                        </span>
                    </a>
                </div>
            </template>
            <template v-else-if="type === 'collection'">
                <div class="m-newpost-content" v-loading="loading">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(type,item.id)"
                        :target="target"
                    >
                        <el-image
                            class="u-avatar"
                            :src="(item.user_avatar) | showAvatar"
                            fit="cover"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ type | formatTypeName }}</span>
                            ／
                            <span
                                class="u-author"
                                :href="authorLink(item.user_id)"
                                target="_blank"
                            >{{ item.user_nickname || '匿名'}}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ item.updated | wikiDate }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.title || "无标题" }}
                        </span>
                    </a>
                </div>
            </template> -->
            <template v-else>
                <div class="m-newpost-content" v-loading="loading">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(item.post_type, item.ID)"
                        :target="target"
                    >
                        <el-image
                            class="u-avatar"
                            :src="(item.author_info && item.author_info.user_avatar) | showAvatar"
                            fit="cover"
                            :alt="item.author_info && item.author_info.display_name"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ item.post_type | formatTypeName }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.post_author)" target="_blank">{{
                                (item.author_info && item.author_info.display_name) || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ item.post_modified | dateFormat }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.post_title || "无标题" }}
                        </span>
                    </a>
                </div>
            </template>
            <div class="m-newpost-more">
                <a :href="more_link" class="u-more">查看更多&raquo;</a>
            </div>
        </div>
    </div>
</template>

<script>
import { getPosts } from "@/service/index";
import { getWikiPosts, getCollections } from "@/service/helper";
import { getPz, getMenus, getRecentCalendar } from "@/service/cms";
import { buildTarget, authorLink, showAvatar, getLink, iconLink,getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { __postType } from "@jx3box/jx3box-common/data/jx3box.json";
import { showRecently } from "@/utils/moment";
import Mini_bread from "../content/mini_bread.vue";
export default {
    name: "newpost",
    props: [],
    data: function() {
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
                // {
                //     label: "小册",
                //     slug: "collection",
                // },
                // {
                //     label: "配装",
                //     slug: "pz",
                // },
                {
                    label: "茶馆",
                    slug: "bbs",
                },
                {
                    label: "成就",
                    slug: "achievement",
                },
                {
                    label: "物品",
                    slug: "item",
                },
                // {
                //     label: "任务",
                //     slug: "quest",
                // },
                {
                    label: "通识",
                    slug: "knowledge",
                },
                {
                    label: "日历",
                    slug: "calendar"
                },
                {
                    label: "公告",
                    slug: "notice",
                },
            ],
            loading: false,

            wiki_types: ["achievement", "item", "knowledge", "quest"],
        };
    },
    computed: {
        isWikiType: function() {
            return this.wiki_types.includes(this.type);
        },
        client: function() {
            return this.$store.state.client;
        },
        more_link: function() {
            return this.type == "all" ? "/bbs" : "/" + this.type;
        },
    },
    methods: {
        loadData: function() {
            let type = this.type == "all" ? "" : this.type;
            this.loading = true;
            if (this.isWikiType) {
                getWikiPosts({
                    type,
                    limit: 10,
                    client: this.client,
                })
                    .then((res) => {
                        this.data = res.data.data.newest || [];
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                // if (this.type === "pz") {
                //     const params = {
                //         per: 10,
                //         page: 1,
                //         client: this.client,
                //         valid: 1,
                //     };
                //     getPz(params)
                //         .then((res) => {
                //             this.data = res.data.data.list || [];
                //         })
                //         .finally(() => {
                //             this.loading = false;
                //         });
                // } else if (this.type === "collection") {
                //     getCollections({
                //         limit: 10,
                //         page: 1,
                //     })
                //         .then((res) => {
                //             this.data = res.data.data.data || [];
                //         })
                //         .finally(() => {
                //             this.loading = false;
                //         });
                // } else {
                if (this.type === "calendar") {
                    getRecentCalendar({
                        user_info: 1,
                    })
                        .then((res) => {
                            this.data = res.data.data.list || [];
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                } else {
                    getPosts(this.client, type)
                        .then((res) => {
                            this.data = res.data.data.list || [];
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
                // }
            }
        },
        getLink,
        authorLink,
    },
    filters: {
        formatTypeName: function(type) {
            return getTypeLabel(type)
        },
        dateFormat: function(val) {
            return showRecently(val);
        },
        showAvatar: function(val) {
            return showAvatar(val);
        },
        iconLink,
        wikiDate: function(val) {
            return showRecently(new Date(val * 1000));
        },
    },
    watch: {
        type: function() {
            this.loadData();
        },
    },
    mounted: function() {
        this.loadData();
    },
    components: {
        "mini-bread": Mini_bread,
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/newpost.less";
</style>
