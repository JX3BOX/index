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
        <CommonFooter></CommonFooter>
        <div class="m-bg m-bg-left"></div>
        <div class="m-bg m-bg-right"></div>
    </div>
</template>

<script>
import CommonFooter from "@jx3box/jx3box-common-ui/src/CommonFooter.vue";
export default {
    name: "Notice",
    components:{
        CommonFooter,
    },
    data: function () {
        return {};
    },
    methods: {},
};
</script>

<style lang="less">
@import "~@/assets/css/notice/index.less";
</style>
