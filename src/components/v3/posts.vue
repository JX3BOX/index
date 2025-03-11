<template>
    <div class="m-v2-post m-sideblock">
        <div class="m-guide-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-management"></i>
                <span class="u-title">最新作品</span>
                <mini-bread class="u-bread" name="index_topics" />
            </div>
            <div class="u-right">
                <a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-v2-post-box">
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
            <div class="m-v2-post-wrapper" v-loading="loading">
                <div class="m-v2-post-content" v-if="isPost">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(item.post_type, item.ID)"
                        :target="target"
                        v-reporter="{
                            data: {
                                href: reportLink(getLink(item.post_type, item.ID)),
                                category: item.post_type,
                                aggregate: aggregate,
                            },
                            caller: 'index_lastest_artwork_click',
                        }"
                    >
                        <el-image
                            class="u-avatar"
                            :src="showPostAvatar(item)"
                            fit="cover"
                            :alt="item.author_info && item.author_info.display_name"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ formatTypeName(item.post_type) }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.post_author)" target="_blank">{{
                                (item.author_info && item.author_info.display_name) || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ dateFormat(item.post_modified) }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.post_title || "无标题" }}
                        </span>
                    </a>
                </div>
                <div v-else-if="isWiki" class="m-v2-post-content">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(item.type, item.source_id)"
                        :target="target"
                        v-reporter="{
                            data: {
                                href: reportLink(getLink(item.type, item.source_id)),
                                category: item.type,
                                aggregate: aggregate,
                            },
                            caller: 'index_lastest_artwork_click',
                        }"
                    >
                        <el-image class="u-avatar" :src="showWikiAvatar(item)" fit="cover"></el-image>
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
                <div v-else class="m-v2-post-content">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="item.link || getLink(item.type, item.source_id)"
                        :target="target"
                        v-reporter="{
                            data: {
                                href: reportLink(item.link || getLink(item.type, item.source_id)),
                                category: item.type,
                                aggregate: aggregate,
                            },
                            caller: 'index_lastest_artwork_click',
                        }"
                    >
                        <el-image class="u-avatar" :src="showWikiAvatar(item)" fit="cover"></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ formatOtherTypeName(item.type) }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                                item.user_nickname || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ dateFormat(item.updated) }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.title || "无标题" }}
                        </span>
                    </a>
                </div>
            </div>
            <div class="m-v2-post-more">
                <a
                    :href="more_link"
                    class="u-more"
                    v-reporter="{
                        data: {
                            href: report_link,
                        },
                        caller: 'index_lastest_artwork_more',
                    }"
                    >查看更多&raquo;</a
                >
            </div>
        </div>
    </div>
</template>

<script>
import { getPosts } from "@/service/index";
import { getWikiPosts, getDbms, getBattles, getPzs } from "@/service/cms";
import { buildTarget, authorLink, showAvatar, getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { __postType, __wikiType } from "@jx3box/jx3box-common/data/jx3box.json";
import { showRecently } from "@/utils/moment";
import { formatTime } from "@/utils";
import Mini_bread from "../content/mini_bread.vue";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";
export default {
    name: "v2-post",
    props: [],
    data: function () {
        return {
            data: [],
            target: buildTarget(),
            type: "all",
            length: 7,
            links: [
                {
                    label: "宏库",
                    slug: "macro",
                },
                {
                    label: "职业",
                    slug: "bps",
                },
                {
                    label: "竞技",
                    slug: "pvp",
                },
                {
                    label: "副本",
                    slug: "fb",
                },
                {
                    label: "工具",
                    slug: "tool",
                },
                {
                    label: "成就",
                    slug: "achievement",
                },
                {
                    label: "物品",
                    slug: "item",
                },
                {
                    label: "任务",
                    slug: "quest",
                },
                {
                    label: "通识",
                    slug: "knowledge",
                },
                {
                    label: "数据",
                    slug: "pkg",
                    fn: "loadDbm",
                },
                {
                    label: "战斗",
                    slug: "battle",
                    fn: "loadBattle",
                },
                {
                    label: "日志",
                    slug: "jcl",
                    fn: "loadJcl",
                },
                {
                    label: "配装",
                    slug: "pz",
                    fn: "loadPz",
                },
            ],
            loading: false,
            aggregate: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        more_link: function () {
            return this.type == "all" ? "/bbs" : "/" + this.type;
        },
        isPost: function () {
            return Object.keys(__postType).includes(this.type) || this.type == "all";
        },
        isWiki() {
            return Object.keys(__wikiType).includes(this.type);
        },
        isOther() {
            return !this.isPost || !this.isWiki;
        },
        userId: function () {
            return User.getInfo().uid;
        },
        report_link: function () {
            const prefix = this.client == "std" ? "www" : "origin";
            return `${prefix}:${this.more_link}`;
        },
    },
    methods: {
        loadData: function () {
            let type = this.type == "all" ? "" : this.type;
            if (this.isPost) {
                this.loadPost(type);
            } else if (this.isWiki) {
                this.loadWiki(type);
            } else {
                const fn = this.links.find((item) => item.slug === this.type)?.fn;
                if (fn) {
                    this[fn]?.();
                }
            }
        },
        loadDbm() {
            this.loading = true;
            getDbms({
                per: this.length,
                client: this.client,
            })
                .then((res) => {
                    this.data = (res.data.data.list || []).map((item) => {
                        return {
                            ...item,
                            type: "pkg",
                            source_id: item.id,
                            user: item.pkg_user,
                            user_nickname: item.pkg_user?.display_name,
                            updated: new Date(item.updated_at).valueOf(),
                        };
                    });

                    this.aggregate = this.data.map((item) => this.reportLink(getLink(item.type, item.source_id)));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadBattle() {
            this.loading = true;
            getBattles({
                pageSize: this.length,
                pageIndex: 1,
                client: this.client,
                type: "tinymins",
            })
                .then((res) => {
                    this.data = (res.data.data.list || []).map((item) => {
                        return {
                            ...item,
                            type: "battle",
                            source_id: item.id,
                            updated: new Date(item.updated_at).valueOf(),
                            link: `/battle/#/combat/${item.id}`,
                        };
                    });

                    this.aggregate = this.data.map((item) => this.reportLink(item.link));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadJcl() {
            this.loading = true;
            getBattles({
                pageSize: this.length,
                pageIndex: 1,
                client: this.client,
                type: "jcl",
                subject: "team",
            })
                .then((res) => {
                    this.data = (res.data.data.list || []).map((item) => {
                        return {
                            ...item,
                            type: "jcl",
                            source_id: item.id,
                            updated: new Date(item.updated_at).valueOf(),
                            link: `/jcl/view?id=${item.id}`,
                        };
                    });

                    this.aggregate = this.data.map((item) => this.reportLink(item.link));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadPz() {
            this.loading = true;
            getPzs({
                per: this.length,
                client: this.client,
                global_level: 130,
                star: 1,
            })
                .then((res) => {
                    this.data = (res.data.data.list || []).map((item) => {
                        return {
                            ...item,
                            type: "pz",
                            source_id: item.id,
                            user: item.pz_author_info,
                            user_nickname: item.pz_author_info?.display_name,
                            updated: new Date(item.updated_at).valueOf(),
                        };
                    });

                    this.aggregate = this.data.map((item) => this.reportLink(getLink(item.type, item.source_id)));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getLink,
        authorLink,
        formatOtherTypeName(type) {
            return this.links.find((item) => item.slug === type)?.label || "未知";
        },
        formatTime,
        formatTypeName: function (type) {
            return getTypeLabel(type);
        },
        dateFormat: function (val) {
            return showRecently(val);
        },
        showPostAvatar: function (item) {
            let val = item.author_info && item.author_info.user_avatar;
            return showAvatar(val);
        },
        showWikiAvatar: function ({ user }) {
            let val = user ? user.user_avatar : "";
            return showAvatar(val);
        },
        wikiDate: function (val) {
            return showRecently(new Date(val * 1000));
        },
        loadPost: function (type) {
            this.loading = true;
            getPosts(this.client, type, this.length)
                .then((res) => {
                    this.data = res.data.data.list || [];

                    this.aggregate = this.data.map((item) => this.reportLink(getLink(item.post_type, item.ID)));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadWiki: function (type) {
            this.loading = true;
            getWikiPosts({
                type,
                per: this.length,
                client: this.client,
            })
                .then((res) => {
                    this.data = res.data.data.list || [];

                    this.aggregate = this.data.map((item) => this.reportLink(getLink(item.type, item.source_id)));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        sendReporter() {
            reportNow({
                caller: "index_lastest_artwork_load",
                data: {
                    aggregate: this.aggregate,
                    category: this.type,
                },
            });
        },
        reportLink(link) {
            const prefix = this.client == "std" ? "www" : "origin";
            return `${prefix}:${link}`;
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
