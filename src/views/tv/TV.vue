<template>
    <div class="p-tv">
        <Header :overlayEnable="true"></Header>
        <!-- logo -->
        <div class="m-tv-title"></div>
        <!-- 内容 -->
        <div class="m-tv-content" :loading="loading">
            <!-- 列表 -->
            <List :data="list" />
            <!-- 操作条 -->
            <Toolbar :total="total" :pages="pages" @update="update" />
        </div>
        <!-- 盒子娘 -->
        <div class="m-jx3box">
            <img class="u-img" src="@/assets/img/tv/box.png" alt="盒子娘" />
        </div>
        <!-- 底部 -->
        <Footer darkMode></Footer>
    </div>
</template>

<script>
import List from "./components/List.vue";
import Toolbar from "./components/Toolbar.vue";
import { getConfigBanner } from "@/service/cms";
export default {
    name: "TV",
    components: { List, Toolbar },
    data: function () {
        return {
            list: [],
            params: {},
            loading: false,

            total: 0,
            pages: 0,
        };
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (obj) {
                this.load(obj);
            },
        },
    },
    methods: {
        load(params = this.params) {
            this.loading = true; 
            getConfigBanner(params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                    window.scrollTo(0, 0);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 筛选传值
        update(params) {
            this.params = params;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tv/index.less";
</style>
