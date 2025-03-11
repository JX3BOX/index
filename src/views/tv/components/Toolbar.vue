<template>
    <div class="m-tv-toolbar">
        <!-- 工具条 -->
        <div class="m-toolbar">
            <!-- 筛选 -->
            <div class="m-toolbar-filter">
                <span class="u-label">筛选</span>
                <span class="u-button" :class="{ active: filter }" @click.stop="open('filter')">
                    {{ filterName }}
                </span>
            </div>
            <!-- 分页 -->
            <div class="m-toolbar-pagination">
                <span class="u-turn u-per" @click="turnPages('per')">上一页</span>
                <span class="u-turn u-next" @click="turnPages('next')">下一页</span>
                <span class="u-jump" :class="{ active: jump }" @click="open('jump')">页面跳转</span>
                <el-pagination
                    class="u-pagination"
                    :current-page="pageIndex"
                    :page-size.sync="pageSize"
                    @current-change="changePage"
                    :pager-count="9"
                    layout="pager"
                    :total="total"
                >
                </el-pagination>
            </div>
            <!-- 筛选弹出窗 -->
            <div class="m-popup m-popup-filter" v-show="filter">
                <div class="m-item" v-for="(item, i) in nav" :key="i" :class="{ active: source_type == i }">
                    <template v-if="!item.list">
                        <span class="u-title u-all" @click="change(i)" :class="{ active: source_type == 'all' }">
                            {{ item }}
                        </span>
                    </template>
                    <template v-else>
                        <span class="u-title">{{ item.name }}</span>
                        <span
                            v-for="(child, k) in item.list"
                            :key="k"
                            @click="change(k)"
                            class="u-nav"
                            :class="k == source_type ? 'active' : ''"
                        >
                            {{ child }}
                        </span>
                    </template>
                </div>
            </div>
            <!-- 跳转弹出窗 -->
            <div class="m-popup m-popup-jump" v-show="jump">
                <span class="u-label">跳转页数</span>
                <el-pagination
                    class="u-pagination"
                    :current-page="pageIndex"
                    :page-size.sync="pageSize"
                    @current-change="changePage"
                    :pager-count="5"
                    layout="pager"
                    :total="total"
                >
                </el-pagination>
                <el-input class="u-input" v-model="index" type="number" @keyup.enter.native="toJump" size="mini" />
                <span class="u-button" @click="toJump">确认</span>
            </div>
        </div>
        <!-- 遮罩 -->
        <div class="m-toolbar-mark" v-show="mark" @click="hide"></div>
    </div>
</template>

<script>
import { __postType, __wikiType, __appType, __gameType } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Toolbar",
    props: ["total", "pages"],
    data: function () {
        return {
            source_type: "all",

            pageIndex: 1,
            pageSize: 10,

            filter: false,
            jump: false,
            mark: false,
            index: "",
        };
    },
    computed: {
        nav() {
            return {
                all: "ALL全部",
                post: {
                    name: "常用",
                    list: { ...__postType },
                },
                wiki: {
                    name: "百科",
                    list: { ...__wikiType },
                },
                pvx: {
                    name: "PVX",
                    list: { ...__gameType },
                },
                app: {
                    name: "其他",
                    list: { ...__appType },
                },
            };
        },
        filterName() {
            const names = Object.values(this.nav).reduce((acc, cur) => {
                if (cur.list) acc = { ...acc, ...cur.list };
                return acc;
            }, {});
            return this.source_type == "all" ? this.nav[this.source_type] : names[this.source_type] || "";
        },
        client() {
            return this.$store.state.client;
        },
        params() {
            const _params = {
                client: this.client,
                type: "slider", 
                per: this.pageSize,
                page: this.pageIndex,
            };
            if (this.source_type !== "all") _params.source_type = this.source_type;
            return _params;
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (obj) {
                this.$emit("update", obj);
            },
        },
    },
    methods: {
        // 筛选
        change(i) {
            this.source_type = i;
            this.pageIndex = 1;
            this.filter = false;
            this.mark = false;
        },
        // element切换页面
        changePage(i) {
            this.pageIndex = ~~i;
        },
        // 跳转页面
        toJump() {
            if (this.index > this.pages) this.index = this.pages;
            if (this.index < 1) this.index = 1;
            this.changePage(this.index);
            this.jump = false;
            this.mark = false;
            this.index = "";
        },
        // 上下翻页
        turnPages(key) {
            if (key == "next") this.index = this.pageIndex < this.pages ? this.pageIndex + 1 : this.pages;
            if (key == "per") this.index = this.pageIndex > 1 ? this.pageIndex - 1 : 1;
            this.changePage(this.index);
        },
        // 打开弹窗
        open(key) {
            this[key] = !this[key];
            if (this.filter || this.jump) this.mark = true;
        },
        // 隐藏弹窗
        hide() {
            this.filter = false;
            this.jump = false;
            this.mark = false;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tv/toolbar.less";
</style>
