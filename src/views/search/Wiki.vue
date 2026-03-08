<template>
    <div class="m-wiki m-post m-block" v-loading="loading">
        <ul class="u-list" v-if="data.length">
            <li class="u-item" v-for="(item, i) in data" :key="i">
                <a class="u-title" :href="formatURL(item)" target="_blank"
                    ><i class="u-client" :class="showClientCls(item.client)">{{ formatClient(item.client) }}</i
                    ><span class="u-text">{{ item.title || "无标题" }}</span></a
                >
                <span class="u-link"
                    ><time class="u-date">{{ formatDate(item.updated) }} </time><span class="u-type">{{ formatType(item.type) }} » {{ item.source.name }} › {{item.remark}}</span></span
                >
            </li>
        </ul>
        <el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
        <el-button class="m-archive-more" type="primary" :class="{ show: hasNextPage }" :loading="loading" @click="appendPage(++page)">加载更多</el-button>
        <el-pagination class="m-archive-pages" layout="prev, pager, next" background hide-on-single-page :page-size.sync="per" :total="total" :current-page="page" @current-change="changePage">
        </el-pagination>
    </div>
</template>

<script>
import dateFormat from "@/utils/dateFormat";

import { getWiki } from "@/service/search.js";
import { getPostLink } from "@/utils/common.js";
import { getTypeLabel } from "@jx3box/jx3box-common/js/utils";

import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Wiki",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [], //数据列表
            total: 1, //总条目数
            page: 1, //当前页数
            per: 10, //每页条目
        };
    },
    computed: {
        q: function () {
            return this.$store.state.q;
        },
        pages: function () {
            return Math.ceil(this.total / this.per);
        },
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
    },
    filters: {
    },
    methods: {
        loadData: function (i = 1, append = false) {
            this.loading = true;
            getWiki(this.q, i)
                .then((res) => {
                    if (append) {
                        this.data = this.data.concat(res.data.data.list || []);
                    } else {
                        window.scrollTo(0, 0);
                        this.data = res.data.data.list || [];
                    }
                    this.total = res.data.data.total;
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
        formatURL: function (item) {
            item.client = item.client || 'std'
            if(item){
                return getPostLink(item?.type, item?.source.id || item?.source.ID, item?.client);
            }else{
                return ''
            }
        },
        formatDate: function (date) {
            return dateFormat(new Date(date * 1000));
        },
        formatClient: function (val = "std") {
            val = val || "std";
            return __clients[val];
        },
        formatType: function (val) {
            return getTypeLabel(val) || "未知";
        },
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

