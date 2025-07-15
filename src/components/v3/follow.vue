<!-- 关注我们 -->
<template>
    <div class="m-follow m-sideblock">
        <div class="m-follow-header m-sideblock-header">
            <div class="u-left"><i class="u-icon el-icon-info"></i><a class="u-title">关注我们</a></div>
        </div>
        <div class="m-follow-content">
            <div class="u-item">
                <img class="u-img" src="@/assets/img/mobile/mp.jpg" alt="公众号码" />
                <span class="u-txt"><span>微信公众号</span><b>剑三魔盒</b></span>
            </div>
            <div class="u-item">
                <img class="u-img" src="@/assets/img/mobile/miniprogram.jpg" alt="小程序码" />
                <span class="u-txt"><span>微信小程序</span><b>JX3BOX小助手</b></span>
            </div>
        </div>
        <div class="m-index-qqbot">
            <a href="/qqbot" class="u-home" target="_blank">
                <img class="u-pic" src="@/assets/img/left/qqbot.png" alt="QQ机器人" />
            </a>
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

    .u-item {
        .flex(x);
    }
    .u-img {
        .db;
        .size(100px);
        .r(6px);
    }
    .u-txt {
        .db;
        .x;
        .fz(12px);
        span {
            .db;
            transform: scale(0.8);
            color: #999;
        }
        b {
            .bold;
            .db;
            line-height: 1.6;
        }
    }
}
.m-index-qqbot {
    padding-bottom: 20px;
    .u-home {
        .flex;
        justify-content: center;
        align-items: center;
    }

    .u-pic {
        .db;
        .w(80%);
    }
}
</style>
