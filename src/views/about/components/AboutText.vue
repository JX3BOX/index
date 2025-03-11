<template>
    <div class="m-about-text" :class="'m-about-' + type" v-loading="loading">
        <div class="m-about-meta">
            <a :href="'/notice/' + id" target="_blank" v-if="isSuperAdmin">编辑</a>
        </div>
        <div v-html="data"></div>
    </div>
</template>

<script>
import { getArticle } from "@/service/about.js";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "AboutText",
    props: {
        customType: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            data: "",
            loading: false,
            isSuperAdmin: User.isSuperAdmin(),
        };
    },
    computed: {
        id: function () {
            return this.$route.meta.article_id;
        },
    },
    methods: {
        loadData: function () {
            this.loading = true;
            this.data = "";
            this.id &&
                getArticle(this.id)
                    .then((data) => {
                        this.data = data;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
        },
    },
    watch: {
        "$route.name": {
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/text.less";
</style>
