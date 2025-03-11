<template>
    <div class="m-contact m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-promotion"></i
            ><span class="u-title">关注我们</span>
        </div>
        <div class="m-contact-content">
            <img class="u-wechat" src="../../assets/img/right/qrcode.png" alt="" />
            <div class="u-list">
                <span class="u-weibo u-item"
                    ><em>官方微博：</em
                    ><a href="https://weibo.com/jx3box" target="_blank"
                        >JX3BOX魔盒</a
                    ></span
                >
                <span class="u-weixin u-item"
                    ><em>微信公众号：</em><b>剑三魔盒</b></span
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "contact",
    props: [],
    data: function() {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/contact.less";
</style>
