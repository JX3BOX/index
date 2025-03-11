<template>
    <div class="m-ad">
        <el-carousel v-if="data.length" trigger="click" indicator-position="none" :interval="6000">
            <el-carousel-item v-for="(item, i) in data" :key="i">
                <a :href="item.link" rel="noopener" target="_blank"><img :src="item.img" /></a>
            </el-carousel-item>
        </el-carousel>
        <span class="u-mark"><i class="el-icon-info"></i> 推广</span>
    </div>
</template>

<script>
import { buildTarget, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { getConfigBanner } from "@/service/cms";
export default {
    name: "ad",
    props: [],
    data: function () {
        return {
            data: [],
        };
    },
    computed: {},
    methods: {},
    beforeCreate: function () {
        getConfigBanner({ client: this.client, type: "ad", status: 1  }).then((data) => {
            data.forEach((item) => {
                item.img = resolveImagePath(item.img);
            });
            this.data = data;
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/ad.less";
</style>
