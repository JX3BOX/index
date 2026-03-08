<template>
    <div class="m-slider-box shadow-s">
        <div class="m-tv-station">
            <div class="m-slider" v-if="ready" id="m-home-slider">
                <div class="u-slider" v-for="(item, i) in data" :key="i" :style="{ backgroundColor: item.bgcolor }">
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
import { buildTarget, resolveImagePath, getThumbnail, convertUrlToProtocol } from "@/config/js/utils";
import { getConfigBanner } from "@/service/cms";
import _ from "lodash";
export default {
    name: "slider",
    components: {},
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
                douyin: "",
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
            const $ = window.$;
            if (!$ || !$.fn?.slick) return;

            const $slider = $("#m-home-slider");
            if (!$slider?.length) return;

            $slider
                .slick({
                    infinite: true,
                    autoplay: true,
                    dots: false,
                })
                .on("afterChange", () => {
                    this.active = $slider.slick("slickCurrentSlide");
                });
        },
        setActive: function (index) {
            this.active = index;
            const $ = window.$;
            if (!$ || !$.fn?.slick) return;
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
                this.data = this.sortWithPowerShuffle(res.data.data.list);
            });
        },
        sortWithPowerShuffle(list) {
            return _.chain(list)
                .groupBy("power")
                .toPairs() // [[power, items]]
                .orderBy(([power]) => Number(power), "desc")
                .flatMap(([, items]) => _.shuffle(items))
                .value();
        },
        init: function () {
            this.loadData().then(() => {
                this.renderSlider();
            });
        },
        showSlider(val) {
            // 判断val是否是gif图片
            if (val.indexOf(".gif") > -1 || val.indexOf(".webp") > -1) {
                return val;
            }
            if (this.ratio > 1 && this.w >= 1920) {
                return resolveImagePath(val);
            } else {
                return getThumbnail(val, "index_slider");
            }
        },
        showThumbnail(val) {
            if (val.includes(".gif") || val.includes(".webp")) {
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
@import "@/assets/css/views/index/slider.less";
</style>
