<template>
    <div class="p-notice-mini">
        <main class="m-notice-mini__main">
            <router-view v-slot="{ Component }">
                <keep-alive v-if="$route.meta.keepAlive">
                    <component :is="Component" />
                </keep-alive>
                <component :is="Component" v-else />
            </router-view>
        </main>
    </div>
</template>

<script>
export default {
    name: "NoticeMini",
};
</script>

<style lang="less">
@import "@/assets/css/index/app.less";

.p-notice-mini {
    min-height: 100vh;

    .m-notice-mini__main {
        width: min(100%, 760px);
        margin: 0 auto;
        padding: 12px 12px 20px;
    }
}
</style>
