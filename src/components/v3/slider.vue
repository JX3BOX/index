<template>
    <div class="m-slider-box">
        <div class="m-tv-station">
            <div class="m-tv">
                <div class="m-tv-left">
                    <a
                        class="u-tv-label"
                        href="./tv"
                        target="_blank"
                        @mouseenter="addAni('tv', 'animate__flash')"
                        @mouseleave="resetAni('tv')"
                        ><i :class="ani.tv"></i>魔盒电视台</a
                    >
                    <mini-bread class="u-tv-notice" name="index_events" />
                </div>
                <div class="m-tv-right">
                    <a
                        class="u-tv-douyin u-tv-link"
                        href="https://www.douyin.com/user/MS4wLjABAAAAP3OHPy-BYsW6IMiPZfP1FP3J_zYAAYNVVlk9XyoKhOs"
                        target="_blank"
                        @mouseenter="addAni('douyin', 'animate__rotateIn')"
                        @mouseleave="resetAni('douyin')"
                    >
                        <img svg-inline src="@/assets/img/tv/douyin.svg" :class="ani.douyin" />剑网3魔盒
                    </a>
                    <a
                        class="u-tv-weibo u-tv-link"
                        href="https://weibo.com/jx3box"
                        target="_blank"
                        @mouseenter="addAni('weibo', 'animate__rubberBand')"
                        @mouseleave="resetAni('weibo')"
                    >
                        <img svg-inline src="@/assets/img/tv/weibo.svg" :class="ani.weibo" />剑网3魔盒
                    </a>
                    <a
                        class="u-tv-bilibili u-tv-link"
                        href="https://space.bilibili.com/2066064028"
                        target="_blank"
                        @mouseenter="addAni('bilibili', 'animate__swing')"
                        @mouseleave="resetAni('bilibili')"
                    >
                        <img svg-inline src="@/assets/img/tv/bilibili.svg" :class="ani.bilibili" />剑网3魔盒
                    </a>
                </div>
            </div>
            <div class="m-slider" v-if="ready" id="m-home-slider">
                <div
                    class="u-slider"
                    v-for="(item, i) in data"
                    :key="i"
                    :style="{ backgroundColor: item.bgcolor }"
                    v-reporter="{
                        data: { url: convertUrlToProtocol(item.link) },
                        caller: 'index_slider',
                    }"
                >
                    <a class="u-pic" :href="item.link" :target="target">
                        <img :src="showSlider(item.img)" />
                    </a>
                </div>
            </div>
        </div>
        <div class="m-slider-thumbnail">
            <div
                class="u-thumbnail"
                :class="{ active: active === i }"
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
import { buildTarget, resolveImagePath, getThumbnail, convertUrlToProtocol } from "@jx3box/jx3box-common/js/utils";
import { getConfigBanner } from "@/service/cms";
import Mini_bread from "../content/mini_bread.vue";
export default {
    name: "slider",
    components: {
        "mini-bread": Mini_bread,
    },
    data: function () {
        return {
            data: [],
            active: 0,
            ratio: window.devicePixelRatio || 1,
            w: window.innerWidth,

            ani: {
                tv: "",
                bilibili: "",
                weibo: "",
                douyin: ""
            },
        };
    },
    computed: {
        ready: function () {
            return this.data && this.data.length && !this.player_status;
        },
        player_status: function () {
            return ~~this.$store.state.config.index_live_status || ~~this.$store.state.config.index_video_status;
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
                    this.active = $("#m-home-slider").slick("slickCurrentSlide");
                });
        },
        setActive: function (index) {
            this.active = index;
            $("#m-home-slider").slick("slickGoTo", index);
        },
        loadData: function () {
            // banner轮播图
            return getConfigBanner({
                client: this.client,
                type: "slider",
                per: 8,
                status: 1,
            }).then((res) => {
                this.data = res.data.data.list;
            });
        },
        init: function () {
            this.loadData().then(() => {
                this.renderSlider();
            });
        },
        showSlider(val) {
            // 判断val是否是gif图片
            if (val.indexOf(".gif") > -1||val.indexOf(".webp") > -1) {
                return val;
            }
            if (this.ratio > 1 && this.w >= 1920) {
                return resolveImagePath(val);
            } else {
                return getThumbnail(val, "index_slider");
            }
        },
        showThumbnail(val) {
            if (val.includes('.gif') || val.includes('.webp')) {
                return val;
            }
            return getThumbnail(val, "index_banner"); //[220, 60]
        },
        addAni(key, val) {
            this.ani[key] = `animate__animated ${val}`;
        },
        resetAni(key) {
            this.ani[key] = "";
        },
        convertUrlToProtocol,
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/slider.less";
</style>
