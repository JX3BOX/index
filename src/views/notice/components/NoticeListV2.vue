<template>
    <div class="m-notice-content">
        <!-- 头图 -->
        <div class="m-top-img">
            <div class="u-img"></div>
        </div>
        <!-- 筛选 & 搜索 -->
        <div class="m-notice-toolbar">
            <div class="m-buttons">
                <span
                    class="u-button"
                    v-for="(item, i) in buttons"
                    :key="i"
                    @click="change(item)"
                    :class="[{ active: type == item.value }, item.key]"
                >
                    {{ item.name }}
                </span>
            </div>
            <el-input class="u-search" v-model.lazy="search" placeholder="请输入关键词搜索" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <!-- 列表 -->
        <div class="m-notice-box">
            <div class="m-notice-list" v-loading="loading">
                <router-link
                    class="m-list"
                    v-for="(item, i) in list"
                    :key="i"
                    :to="{ name: 'single', params: { id: item.ID } }"
                    target="_blank"
                >
                    <div class="u-line">
                        <span class="u-block" v-if="item.sticky"></span>
                    </div>
                    <div class="m-list-box">
                        <div class="u-info">
                            <span class="u-tag">{{ showTag(item) }}</span>
                            <h3 class="u-title">{{ item.post_title }}</h3>
                        </div>
                        <div class="u-time">
                            <span class="u-date">
                                {{ newTime(item.post_modified).day }}
                                <b>{{ newTime(item.post_modified).month }}</b>
                            </span>
                            <span class="u-year">{{ newTime(item.post_modified).year }}</span>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- 分页和跳转 -->
            <div class="p-notice-pagination" v-if="pages > 1">
                <el-pagination
                    class="m-pagination"
                    layout="pager"
                    :current-page.sync="page"
                    :page-size="per"
                    :total="total"
                    :pager-count="5"
                    @current-change="changePage"
                    :hide-on-single-page="true"
                />
                <div class="m-jump">
                    <el-input
                        v-model="index"
                        type="number"
                        class="u-input"
                        size="mini"
                        @keyup.enter.native="toJump"
                    ></el-input>
                    <span class="u-jump" @click="toJump">跳转</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getPosts } from "@/service/cms";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { showDate } from "@/utils/moment";
export default {
    name: "NoticeList",
    data: function () {
        return {
            loading: false, //加载状态

            list: [], //数据列表
            page: 1, //当前页数
            total: 1, //总条目数
            pages: 1, //总页数
            per: 5, //每页条目
            index: "", // 跳转页面

            client: this.$store.state.client, //版本选择
            search: "",
            subtype: [1, 2, 3, 4],
            type: "",

            buttons: [
                {
                    name: "全部",
                    key: "",
                    value: "",
                },
                {
                    name: "公告动态",
                    key: "notice",
                    value: 2,
                },
                {
                    name: "运营活动",
                    key: "information",
                    value: 1,
                },
                {
                    name: "功能更新",
                    key: "feature",
                    value: 3,
                },
                {
                    name: "兑换通知",
                    key: "message",
                    value: 4,
                },
            ],
        };
    },
    computed: {
        query() {
            return {
                client: this.client,
                search: this.search,
                subtype: !this.type ? "" : this.type,
            };
        },
        clientHeight() {
            return document.documentElement.clientHeight;
        },
        params: function () {
            let params = {
                per: this.per,
                page: ~~this.page || 1,
                sticky: 1,
                ...this.query,
                type: "notice",
            };
            Object.keys(params).forEach((item) => {
                if (!params[item]) delete params[item];
            });
            return params;
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getPosts(this.params, this)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 去详情页
        toDetail(id) {
            this.$router.push({ name: "single", params: { id } });
            window.scrollTo(0, 0);
        },
        changePage(i) {
            this.page = ~~i;
        },
        // 跳转
        toJump() {
            if (this.index > this.pages) this.index = this.pages;
            if (this.index < 1) this.index = 1;
            this.changePage(this.index);
            this.index = "";
        },
        // 切换类型
        change({ key, value }) {
            this.type = value;
            this.page = 1;

            this.$router.push({
                query: {
                    tab: key,
                },
            });
        },
        showDate,
        newTime(time) {
            const d = dayjs(time).locale("en");
            if (!d.isValid()) return null;
            return {
                day: d.format("DD/MM"),
                month: d.format("MMM."),
                year: d.format("YYYY"),
            };
        },
        showTag(row) {
            return this.buttons.find((item) => item.value == row.post_subtype)?.name;
        },
    },
    watch: {
        params: {
            deep: true,
            // immediate: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
        query() {
            this.page = 1;
        },
        clientHeight: {
            immediate: true,
            handler: function (height) {
                if (height > 1024) {
                    this.per = 7;
                    this.page = 1;
                }
                if (height > 1440) {
                    this.per = 12;
                    this.page = 1;
                }
            },
        },
    },
    mounted() {
        const tab = this.$route.query.tab;
        if (tab) {
            let type = this.buttons.find((item) => item.key == tab);
            if (type) {
                this.type = type.value;
            }
        } else {
            this.type = "";
            this.loadPosts();
        }
    },
};
</script>
<style lang="less">
@import "~@/assets/css/notice/list-v2.less";
</style>
