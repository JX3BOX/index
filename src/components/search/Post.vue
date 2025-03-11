<template>
    <div class="m-post m-block" v-loading="loading">
        <ul class="u-list" v-if="data.length">
            <li class="u-item" v-for="(item, i) in data" :key="'item-' + i">
                <a class="u-title" v-bind:href="item | formatURL" target="_blank"
                    ><i class="u-client" :class="showClientCls(item.client)">{{ item.client | formatClient }}</i
                    ><span class="u-text">{{ item.post_title || "无标题" }}</span></a
                >
                <span class="u-link"
                    ><time class="u-date">{{ (item.post_modified || item.post_date) | formatDate }} @ {{ getAuthorName(item) }}</time><span class="u-type">{{ item.post_type | formatType }}</span></span
                >
                <!-- <span class="u-desc">{{ item.post_content | formatContent }}</span> -->
            </li>
        </ul>
        <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
        <el-button class="m-archive-more" type="primary" :class="{ show: hasNextPage }" :loading="loading" @click="appendPage(++page)" icon="el-icon-arrow-down">加载更多</el-button>
        <el-pagination class="m-archive-pages" layout="prev, pager, next" background hide-on-single-page :page-size.sync="per" :total="total" :current-page.sync="page" @current-change="changePage">
        </el-pagination>
    </div>
</template>

<script>
import dateFormat from "@/utils/dateFormat";

import { getPost } from "@/service/search";
import { getPostLink } from "@/utils/common.js";
import {getTypeLabel} from '@jx3box/jx3box-common/js/utils'

import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Post",
    data: function () {
        return {
            loading: false,
            data: [], //数据列表
            total: 1, //总条目数
            pages: 1, //总页数
            page: 1, //当前页数
            per: 10, //每页条目
        };
    },
    computed: {
        q: function () {
            return this.$store.state.q;
        },
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
    },
    filters: {
        formatURL: function (item) {
            item.client = item.client || 'std'
            return getPostLink(item.post_type, item.ID,item.client);
        },
        formatContent: function (content) {
            return (
                content &&
                content
                    .replace(/<[^>]*>|/g, "")
                    .replace(/&nbsp;/g, "")
                    .slice(0, 200)
            );
        },
        formatDate: function (date) {
            return dateFormat(new Date(date));
        },
        formatClient: function (val = "std") {
            val = val || "std";
            return __clients[val];
        },
        formatType : function (val){
            return getTypeLabel(val) || '未知'
        }
    },
    methods: {
        loadData: function (i = 1, append = false) {
            this.loading = true;
            getPost(this.q, i)
                .then((res) => {
                    if (append) {
                        this.data = this.data.concat(res.data.data.list || []);
                    } else {
                        window.scrollTo(0, 0);
                        this.data = res.data.data.list || [];
                    }
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage: function (i) {
            this.loadData(i);
        },
        appendPage: function (i) {
            this.loadData(i, true);
        },
        showClientCls: function (client = "std") {
            client = client || "std";
            return "i-client-" + client;
        },
        getAuthorName : function (item){
            return item.author_info?.display_name || item.author || "匿名"
        }
    },
    watch: {
        q: function () {
            this.page = 1;
            this.loadData();
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

