<template>
    <div class="m-about-text" :class="'m-about-' + type" v-loading="loading">
        <div v-html="data"></div>
    </div>
</template>

<script>
import { getArticle } from "@/service/about.js";
export default {
    name: "AboutText",
    data: function () {
        return {
            data: "",
            loading: false,
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
