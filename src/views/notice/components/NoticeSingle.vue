<template>
    <div class="m-notice-box">
        <!-- 内容 -->
        <div class="m-notice-single" v-loading="loading">
            <header class="m-single-header">
                <h1 class="m-single-title">{{ post.post_title }}</h1>

                <div class="m-single-info">
                    <span class="u-modate u-sub-block" title="发布时间">
                        <i class="el-icon-collection-tag"></i>
                        <a :href="'/notice?subtype=' + post.post_subtype" target="_blank">{{
                            showType(post.post_subtype)
                        }}</a>
                    </span>

                    <span class="u-modate u-sub-block" title="发布时间">
                        <i class="el-icon-date"></i>
                        <time>最后更新 : {{ showDate(post.post_modified) }}</time>
                    </span>

                    <span class="u-views u-sub-block" v-if="isAdmin">
                        <i class="el-icon-view"></i>
                        {{ stat.views || "-" }}
                    </span>

                    <a class="u-edit u-sub-block" :href="edit_link" v-if="isEditor">
                        <i class="u-icon-edit el-icon-edit-outline"></i>
                        <span>编辑</span>
                    </a>
                    <Adminbutton />
                </div>
            </header>

            <div class="m-single-exceprt" v-if="post.post_excerpt">{{ post.post_excerpt }}</div>

            <div class="m-single-post" v-if="post._check">
                <div class="m-single-content">
                    <Article :content="content" />
                </div>
            </div>
            <div class="m-single-null" v-else>
                <el-alert :title="null_tip" type="warning" show-icon></el-alert>
            </div>

            <Thx
                class="m-thx"
                :postId="id"
                postType="notice"
                :userId="user_id"
                :adminBoxcoinEnable="false"
                :userBoxcoinEnable="false"
            />

            <div class="m-single-comment">
                <el-divider content-position="left">评论</el-divider>
                <Comment :id="id" category="post" v-if="id && !post.comment" />
                <el-alert title="作者没有开启评论功能" type="warning" show-icon v-else></el-alert>
            </div>
        </div>
        <Admin class="p-notice-admin" />
    </div>
</template>

<script>
import types from "@/assets/data/notice_types.json";
import { getPost } from "@/service/cms.js";
import { getStat, postStat } from "@jx3box/jx3box-common/js/stat.js";
import { showDate } from "@jx3box/jx3box-common/js/moment";
import { editLink, getAppID } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { __visibleMap } from "@jx3box/jx3box-common/data/jx3box.json";
// components
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import Adminbutton from "@jx3box/jx3box-common-ui/src/bread/Adminbutton.vue";
import Admin from "@jx3box/jx3box-common-ui/src/bread/Admin.vue";

export default {
    name: "NoticeSingle",
    props: ["id"],
    components: {
        Article,
        Comment,
        Adminbutton,
        Admin,
    },
    data: function () {
        return {
            loading: true,
            post: {},
            author: {},
            stat: {},
            isAdmin: false,
            isEditor : false,
        };
    },
    computed: {
        // id: function () {
        //     let _list = location.pathname.split("/");
        //     if (_list.length > 2) {
        //         return ~~_list[2];
        //     }
        //     return false;
        // },
        user_id: function () {
            return this.post?.post_author || 0;
        },
        edit_link: function () {
            return editLink(this.post?.post_type, this.post?.ID);
        },
        content: function () {
            return this.post?.post_content || "";
        },
        null_tip: function () {
            let str = "作者设置了【";
            str += __visibleMap[this.post.visible];
            str += "】";
            return str;
        },
        client: function () {
            return this.$store.state.client || "std";
        },
    },
    watch: {
        id: {
            immediate: true,
            deep: true,
            handler: function (id) {
                if (id) this.load();
            },
        },
    },
    methods: {
        showDate,
        showType(val) {
            return types[val];
        },
        load() {
            this.loading = true;
            getPost(this.id, this)
                .then((res) => {
                    this.post = res.data.data;
                    document.title = this.post.post_title;
                })
                .finally(() => {
                    this.loading = false;
                });

            getStat("notice", this.id).then((res) => {
                this.stat = res.data;
            });
            postStat("notice", this.id);
        },
    },
    mounted: function () {
        this.isAdmin = User.isAdmin();
        this.isEditor = User.isEditor();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/notice/single.less";
</style>
