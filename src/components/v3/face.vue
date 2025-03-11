<template>
    <div class="m-index-face m-sideblock">
        <div class="m-face-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-camera-solid"></i>
                <span class="u-title">妆造推荐</span>
            </div>
            <div class="u-right">
                <a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>

        <list-cross v-if="list.length" class="m-face-list" :list="list" :radius="0" :width="20">
            <template v-slot="data">
                <a :href="data.item.link" class="u-face" target="_blank"><img :src="showFacePic(data.item.img)" /></a>
            </template>
        </list-cross>
        <!-- <div class="m-face-list">
            <a v-for="(item, i) in data" :key="i" :href="item.link" class="u-face" target="_blank"
                ><img :src="showFacePic(item.img)"
            /></a>
        </div> -->
    </div>
</template>

<script>
import { getConfigBanner } from "@/service/cms";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
import ListCross from "@/components/common/ListCross.vue";
export default {
    name: "v3-face",
    props: [],
    components: { ListCross },
    data: function () {
        return {
            list: [],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        more_link() {
            return "https://www.jx3box.com/face";
        },
    },
    watch: {},
    methods: {
        showFacePic(url) {
            return getThumbnail(url, [320 * 2, 160 * 2]);
        },
    },
    mounted: function () {
        getConfigBanner({
            type: "slider",
            source_type: "face",
            client: this.client,
            per: 8,
            status: 1 
        }).then((res) => {
            this.list = res.data.data.list;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v3/face.less";
</style>
