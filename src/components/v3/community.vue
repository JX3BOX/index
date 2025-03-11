<template>
    <div class="m-v2-post m-sideblock m-v3-community">
        <div class="m-guide-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-comment"></i>
                <span class="u-title">最新讨论</span>
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
                <el-tabs v-model="category">
                    <el-tab-pane name="all">
                        <span slot="label">全部</span>
                    </el-tab-pane>
                    <el-tab-pane
                        :label="item.name"
                        :name="item.name"
                        v-for="(item, i) in categoryList"
                        :key="i"
                    ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="m-v2-post-wrapper" v-loading="loading">
                <div class="m-v2-post-content">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(appKey, item.id)"
                        :target="target"
                        v-reporter="{
                            data: {
                                href: reportLink(getLink(appKey, item.id)),
                                category: appKey,
                                aggregate: aggregate,
                            },
                            caller: 'index_lastest_artwork_click',
                        }"
                    >
                        <el-image
                            class="u-avatar"
                            :src="showPostAvatar(item.avatar)"
                            fit="cover"
                            :alt="item.user_name"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ item.category }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                                item.user_name || "匿名"
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ dateFormat(item.created_at) }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            <p class="u-content" v-html="br2nl(item.content)"></p>
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
import { getTopicList, getTopicBucket, getMixLatest } from "@/service/community";
import { buildTarget, authorLink, showAvatar, getLink } from "@jx3box/jx3box-common/js/utils";
import { showRecently } from "@/utils/moment";
import Mini_bread from "../content/mini_bread.vue";
import JX3_EMOTION from "@jx3box/jx3box-emotion";
export default {
    name: "community",
    props: [],
    data: function () {
        return {
            appKey: "community",
            data: [],
            categoryList: [],
            target: buildTarget(),
            category: "all",
            length: 8,
            loading: false,
            aggregate: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        more_link: function () {
            return this.category === "all" ? "/community" : `/community?category=${this.category}`;
        },
        report_link: function () {
            const prefix = this.client == "std" ? "www" : "origin";
            return `${prefix}:${this.more_link}`;
        },
    },
    methods: {
        async renderContent() {
            const ins = new JX3_EMOTION(val);
            return await ins._renderHTML();
        },
        // 获取分类
        getCategoryList() {
            getTopicBucket({ type: "community" }).then((res) => {
                this.categoryList = res.data.data;
            });
        },
        loadData: function () {
            this.loading = true;
            const category = this.category === "all" ? "" : this.category;
            // 主页使用单独的接口
            const fun = this.category === "all" ? getMixLatest : getTopicList;
            // getMixLatest接口不需要参数，为了方便不做特殊处理
            fun({
                category,
                pageSize: this.length,
            })
                .then((res) => {
                    let data = [];
                    let topic_list = [];
                    // 不同的接口，处理数据返回统一的格式
                    if (this.category === "all") {
                        topic_list = res.data.data.topic_list || [];
                        const reply_list = res.data.data.reply_list || [];
                        reply_list.forEach(async (item) => {
                            // 创建一个正则表达式来匹配<img>标签
                            var imgTagRegex = /<img[^>]*>/g;
                            // 使用正则表达式替换掉<img>标签
                            var text = item.content.replace(imgTagRegex, "[图片]");

                            // 加载表情包（回帖会有表情包）
                            const ins = new JX3_EMOTION(text);
                            const content = await ins._renderHTML();
                            data.push({
                                id: item.topic.id,
                                type: "reply",
                                created_at: item.latest_reply_at,
                                category: item.topic.category,
                                content: content || "无内容",
                                user_name: item.ext_user_info.display_name,
                                user_id: item.ext_user_info.user_id,
                                avatar: item.ext_user_info.avatar,
                            });
                        });
                    } else {
                        topic_list = res.data.data.list || [];
                    }

                    topic_list.forEach((item) => {
                        data.push({
                            id: item.id,
                            created_at: item.latest_reply_at || item.created_at,
                            type: "topic",
                            category: item.category,
                            content: item.title || "无内容",
                            user_name: item.ext_user_info.display_name,
                            user_id: item.ext_user_info.user_id,
                            avatar: item.ext_user_info.avatar,
                        });
                    });
                    this.data = data;
                    this.aggregate = this.data.map((item) => this.reportLink(getLink(this.appKey, item.id)));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        dateFormat: function (val) {
            return showRecently(val);
        },
        showPostAvatar: function (avatar) {
            return showAvatar(avatar);
        },
        reportLink(link) {
            const prefix = this.client == "std" ? "www" : "origin";
            return `${prefix}:${link}`;
        },
        getLink,
        authorLink,
        br2nl: function (val) {
            // 将<br> <br />转换为换行
            return val.replace(/<br\s*\/?>/g, "\n");
        },
    },
    watch: {
        category: function () {
            this.loadData();
        },
    },
    mounted: function () {
        this.getCategoryList();
        this.loadData();
    },
    components: {
        "mini-bread": Mini_bread,
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/posts.less";
.m-v3-community {
    .u-title {
        display: flex;
        // height: 28px;
        align-items: center;
        gap: 4px;
        overflow: hidden;
    }
    .u-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        margin: 0;
        align-items: center;
        * > {
            display: inline-block;
            margin: 0;
            padding: 0;
        }
        img {
            vertical-align: middle;
            position: relative;
            top: -1.5px;
            margin-right: 2px;
        }
    }
}
</style>
