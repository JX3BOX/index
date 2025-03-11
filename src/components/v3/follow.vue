<!-- 关注我们 -->
<template>
    <div class="m-follow m-sideblock">
        <div class="m-follow-header m-sideblock-header">
            <div class="u-left"><i class="u-icon el-icon-info"></i><a class="u-title">关注我们</a></div>
        </div>
        <div class="m-follow-content">
            <img class="u-img" src="@/assets/img/mobile/mp.jpg" alt="公众号码" />
            <img class="u-img" src="@/assets/img/mobile/miniprogram.jpg" alt="小程序码" />
        </div>
    </div>
</template>

<script>
export default {
    name: "follow",
    data() {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less" scoped>
.m-follow-content {
    .flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;
    padding: 20px 10px;

    .u-img {
        .size(100px);
        .r(6px);
    }
}
</style>
