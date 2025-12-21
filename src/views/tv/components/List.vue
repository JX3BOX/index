<template>
    <div class="m-tv-list">
        <div class="wp">
            <template v-if="data && data.length">
                <a :href="item.link" class="m-item" v-for="(item, i) in data" :key="i" target="_blank">
                    <el-image class="u-img" :src="resolveImagePath(item.img)" fit="cover"></el-image>
                    <span class="u-mark"></span>
                </a>
            </template>
            <div class="m-null" v-else>
                <span class="u-text">~ 暂无对应历史头条 ~</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "List",
    props: ["data"],
    data: function () {
        return {};
    },
    methods: {
        resolveImagePath(str) {
            return str.replace(/oss\.jx3box\.com/g, "cdn.jx3box.com");
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tv/list.less";
</style>
