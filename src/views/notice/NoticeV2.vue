<template>
    <div class="p-notice-v2">
        <Header :overlayEnable="true"></Header>
        <div class="p-notice-container">
            <div class="wp">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
        <Footer darkMode></Footer>
        <div class="m-bg m-bg-left"></div>
        <div class="m-bg m-bg-right"></div>
    </div>
</template>

<script>
export default {
    name: "Notice",
    data: function () {
        return {};
    },
    methods: {},
};
</script>

<style lang="less">
@import "~@/assets/css/notice/index.less";
</style>
