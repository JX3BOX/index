<template>
    <div class="m-slider-box">
        <div class="m-slider" v-if="ready" id="m-home-slider">
            <div
                class="u-slider"
                v-for="(item, i) in data"
                :key="i"
                :style="{ backgroundColor: item.bgcolor }"
            >
                <a class="u-pic" :href="item.link" :target="target">
                    <img :src="showSlider(item.img)" />
                </a>
            </div>
        </div>
        <div class="m-slider-thumbnail">
            <div
                class="u-thumbnail"
                :class="{active: active === i}"
                v-for="(item, i) in data"
                :key="i"
                :style="{ backgroundColor: item.bgcolor }"
                @click="setActive(i)"
            >
                <a class="u-pic">
                    <img :src="showThumbnail(item.img)" />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import {
    buildTarget,
    resolveImagePath,
    getThumbnail,
} from "@jx3box/jx3box-common/js/utils";
import { getSliders } from "@/service/cms";
export default {
    name: "slider",
    props: [],
    data: function () {
        return {
            data: [],
            active: 0,
            ratio : window.devicePixelRatio || 1,
        };
    },
    computed: {
        ready: function () {
            return this.data && this.data.length && !this.player_status;
        },
        player_status: function () {
            return (
                ~~this.$store.state.config.index_live_status ||
                ~~this.$store.state.config.index_video_status
            );
        },
        client: function () {
            return this.$store.state.client;
        },
        target: function () {
            return buildTarget();
        },
    },
    methods: {
        renderSlider: function () {
            $("#m-home-slider")
                .slick({
                    infinite: true,
                    autoplay: true,
                    dots: false,
                })
                .on("afterChange", () => {
                    this.active = $("#m-home-slider").slick(
                        "slickCurrentSlide"
                    );
                });
        },
        setActive: function (index) {
            this.active = index;
            $("#m-home-slider").slick("slickGoTo", index);
        },
        loadData: function () {
            return getSliders("slider", this.client, 10).then((res) => {
                this.data = res.data.data.list;
            });
        },
        init: function () {
            this.loadData().then(() => {
                this.renderSlider();
            });
        },

        showSlider(val){
            if(this.ratio == 1){
                return getThumbnail(val, [1100,280]);
            }else{
                // return getThumbnail(val, [1100,280]);
                return resolveImagePath(val)
            }
        },
        showThumbnail(val){
            return getThumbnail(val, "index_banner"); //[220, 60]
        }
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/slider.less";
</style>
