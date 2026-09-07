<template>
    <div v-page-tracking="$route.path" class="c-page-tracking-root">
        <router-view :class="pageClass" />
    </div>
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
    mounted() {},
};
</script>

<style lang="less">
@import "@/assets/css/app.less";
.c-page-tracking-root {
    display: contents;
}
</style>
