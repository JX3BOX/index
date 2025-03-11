<template>
    <div class="m-notice-box">
        <div class="m-notice-list" v-loading="loading">
            <div class="m-notice-types">
                <el-radio-group v-model="subtype">
                    <el-radio label="">全部</el-radio>
                    <el-radio v-for="(label, key) in notice_types" :key="key" :label="key">{{ label }}</el-radio>
                </el-radio-group>
            </div>
            <div class="m-notice-filter">
                <el-input placeholder="请输入搜索内容" v-model="search" class="m-notice-search">
                    <span slot="prepend">关键词</span>
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <div class="m-archive-list" v-if="data && data.length">
                <ul class="u-list">
                    <li class="u-item" v-for="(item, i) in data" :key="i">
                        <!-- Banner -->
                        <a class="u-banner" :href="'/notice/' + item.ID" :target="target">
                            <img :src="showBanner(item.post_banner, item.post_subtype)" />
                        </a>

                        <h3 class="u-post" :class="{ isSticky: item.sticky }">
                            <a
                                class="u-title"
                                :style="isHighlight(item.color)"
                                :href="'/notice/' + item.ID"
                                :target="target"
                                >{{ item.post_title || "无标题" }}</a
                            >
                        </h3>

                        <!-- 字段 -->
                        <div class="u-content u-desc">{{ item.post_excerpt || item.post_title }}</div>

                        <!-- 作者 -->
                        <div class="u-other">
                            <span class="u-author" v-if="isAdmin">
                                <img
                                    class="u-author-avatar"
                                    :src="showAvatar(item.author_info.user_avatar)"
                                    :alt="item.author_info.display_name"
                                />
                                <a class="u-author-name" :href="authorLink(item.post_author)" target="_blank">{{
                                    item.author_info.display_name
                                }}</a>
                            </span>
                            <time class="u-time">{{ dateFormat(item.post_modified) }}</time>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="m-archive-null" v-else><i class="el-icon-warning-outline"></i> 暂时还没有相关内容</div>
            <el-pagination
                class="m-archive-pages"
                background
                layout="prev, pager, next"
                :current-page.sync="page"
                :page-size="per"
                :total="total"
                :hide-on-single-page="true"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
import User from "@jx3box/jx3box-common/js/user";
import { getPosts } from "@/service/cms";
import { getRelativeTime } from "@/utils/dateFormat";
import { __ossMirror, __imgPath, __ossRoot, __Root } from "@jx3box/jx3box-common/data/jx3box";
import {
    showAvatar,
    authorLink,
    showBanner,
    publishLink,
    buildTarget,
    getAppType,
} from "@jx3box/jx3box-common/js/utils";
import notice_types from "@/assets/data/notice_types.json";
export default {
    name: "TopicList",
    props: [],
    components: {},
    data: function () {
        return {
            loading: false, //加载状态

            data: [], //数据列表
            page: 1, //当前页数
            total: 1, //总条目数
            pages: 1, //总页数
            per: 10, //每页条目

            search: "",
            client: this.$store.state.client, //版本选择
            isAdmin: false,
            notice_types,
            subtype: "",
        };
    },
    computed: {
        params: function () {
            let params = {
                per: this.per,
                page: ~~this.page || 1,
                sticky: 1,
                type: "notice",
            };
            let optionalParams = ["search", "client", "subtype"];
            optionalParams.forEach((item) => {
                if (this[item]) {
                    params[item] = this[item];
                }
            });
            return params;
        },
        target: function () {
            return buildTarget();
        },
        // 根据栏目定义
        defaultBanner: function () {
            return __imgPath + "image/banner/null.png";
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getPosts(this.params, this)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage: function (i) {
            window.scrollTo(0, 0);
        },
        showBanner: function (val, subtype) {
            if (val) {
                return showBanner(val);
            } else {
                return __imgPath + "image/banner/notice" + subtype + ".png?v=1";
            }
        },

        dateFormat: function (val) {
            return getRelativeTime(new Date(val));
        },
        showAvatar: function (val) {
            return showAvatar(val);
        },
        authorLink: function (val) {
            return authorLink(val);
        },
        postLink: function (val) {
            return location.origin + "/notice/" + val;
        },
        isHighlight: function (val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
    },
    watch: {
        subtype: function () {
            this.search = "";
        },
        params: {
            deep: true,
            immediate: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
    },
    created: function () {
        let params = new URLSearchParams(location.search);
        this.page = params.get("page") || 1;
        this.subtype = params.get("subtype") || "";
    },
    mounted: function () {
        this.isAdmin = User.isAdmin();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/notice/list.less";
</style>
