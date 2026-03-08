<template>
    <router-view :class="pageClass" />
</template>

<script>
export default {
    name: "App",
    components: {},
    props: [],
    data: function () {
        return {};
    },
    computed: {
        pageClass() {
            return `page-${this.$route.name}`;
        },
    },
    mounted() {
        window._paq.push(['trackPageView']);
    },
};
</script>

<style lang="less">
@import "@/assets/css/app.less";
</style>
