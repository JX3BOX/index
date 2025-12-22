<template>
    <div class="m-notice-content m-notice-content-single m-notice-content-v3">
        <!-- 头图 -->
        <div class="m-top-img">
            <div class="u-img"></div>
        </div>
        <!-- 返回列表 -->
        <div class="u-back" @click="goBack">返回</div>
        <!-- 侧边标题 -->
        <div class="u-left-title" v-show="show" :style="bottom">
            <span> {{ post.post_title }}</span>
        </div>
        <!-- 标题 -->
        <header class="m-single-header">
            <h1 class="m-single-title">{{ post.post_title }}</h1>

            <div class="m-single-info">
                <a :href="'/notice?subtype=' + post.post_subtype" class="u-type" target="_blank">{{
                    showType(post.post_subtype)
                }}</a>

                <span class="u-update" title="发布时间">
                    <time>最后更新 : {{ showDate(post.post_modified) }}</time>
                </span>
                <a :href="edit_link" class="u-type u-edit" v-if="isAdmin">
                    <i class="u-icon-edit el-icon-edit-outline"></i>
                    <span>编辑</span>
                </a>
                <Adminbutton />
            </div>
        </header>
        <!-- 内容 -->
        <div class="m-single-box">
            <div class="u-title-top"></div>
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
            <right-affix
                :postId="id"
                :postType="post.post_type"
                :postTitle="post.post_title"
                :showComment="id"
                @toComment="toComment($event)"
                :style="style"
            ></right-affix>

            <div class="m-single-comment" ref="commentView">
                <el-divider content-position="left">评论</el-divider>
                <Comment :id="id" category="post" v-if="id && !post.comment" />
                <el-alert title="作者没有开启评论功能" type="warning" show-icon v-else></el-alert>
            </div>
        </div>
        <!-- 管理 -->
        <Admin class="p-notice-admin" />
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import types from "@/assets/data/notice_types.json";
import { getPost } from "@/service/cms.js";
import { getStat, postStat } from "@jx3box/jx3box-common/js/stat.js";
import { showDate } from "@jx3box/jx3box-common/js/moment";
import { __visibleMap } from "@jx3box/jx3box-common/data/jx3box.json";
import { editLink } from "@jx3box/jx3box-common/js/utils";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import Adminbutton from "@jx3box/jx3box-common-ui/src/bread/Adminbutton.vue";
import Admin from "@jx3box/jx3box-common-ui/src/bread/Admin.vue";
import RightAffix from "@jx3box/jx3box-common-ui/src/single/right-affix.vue";
export default {
    name: "NoticeSingleV3",
    data: function () {
        return {
            show: false,
            style: {},
            bottom: {},

            loading: true,
            post: {},
            author: {},
            stat: {},
        };
    },
    components: {
        Article,
        Comment,
        Adminbutton,
        Admin,
        RightAffix,
    },
    computed: {
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
        id() {
            return this.$route.params.id;
        },
        isAdmin() {
            return User.isAdmin() || User.isSuperAdmin();
        },
        isEditor() {
            return User.isEditor();
        },
    },

    methods: {
        showDate,
        showType(val) {
            return types[val];
        },
        goBack() {
            this.$router.push({ name: "list" });
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
        toComment() {
            this.$nextTick(() => {
                const element = this.$refs.commentView;
                if (element) {
                    const offsetTop = element.offsetTop;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth",
                    });
                }
            });
        },
        handlerScroll() {
            let osTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (osTop >= 604) {
                this.style = { top: "64px" };
            } else {
                this.style = { top: 604 - osTop + "px" };
            }
            if (osTop >= 1000) {
                this.show = true;

                const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                const clientHeight = window.innerHeight;
                const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

                if (scrollTop + clientHeight >= scrollHeight - 80) {
                    this.bottom = {
                        bottom: "80px",
                    };
                } else {
                    this.bottom = {
                        bottom: "0px",
                    };
                }
            } else {
                this.show = false;
            }
        },
    },
    mounted() {
        this.load();
        document.addEventListener("scroll", this.handlerScroll);
    },
    beforeDestroy() {
        document.removeEventListener("scroll", this.handlerScroll);
    },
};
</script>
<style lang="less">
@import "~@/assets/css/notice/single-v3.less";
.m-notice-content-v3 {
    .u-edit {
        display:inline-flex;
        align-items: center;
        gap:5px;
        &:hover {
            color:gold !important;
        }
    }
}
</style>
