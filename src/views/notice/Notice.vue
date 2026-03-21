<template>
    <div class="p-notice">
        <CommonHeader :overlayEnable="true" />
        <main class="m-main">
            <div class="m-left m-sidebar">
                <IndexLeftSidebar variant="notice" />
            </div>
            <section class="m-primary">
                <keep-alive v-if="$route.meta.keepAlive">
                    <router-view />
                </keep-alive>
                <router-view v-else />
            </section>
        </main>
        <CommonFooter />
    </div>
</template>

<script>
import IndexLeftSidebar from "@/components/IndexLeftSidebar.vue";

export default {
    name: "Notice",
    components: {
        IndexLeftSidebar,
    },
};
</script>

<style lang="less">
@import "@/assets/css/index/app.less";
.p-notice {
    .m-main {
        padding-top: 60px;
    }
    @media screen and (max-width:@phone){
        .m-sidebar{
            .none;
        }
    }
}
</style>
