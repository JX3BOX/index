<template>
    <div class="m-card" @click.stop>
        <!-- 第一屏 -->
        <div class="m-first" v-show="!show" @click="showSecond">
            <img class="u-petal animation" :class="change ? 'fadeOut' : 'fadeIn'" :src="`${imgLink}seven/petal.png`" />
            <img class="u-look animations fadeInOut" :class="change ? 'none' : ''" :src="`${imgLink}seven/look.png`" />
        </div>
        <!-- 第二屏 -->
        <div class="m-second" v-show="show">
            <img class="u-left animation fadeInLeft" :src="`${imgLink}seven/left.png`" />
            <img class="u-right animation fadeInRight" :src="`${imgLink}seven/right.png`" />
            <img class="u-good animation fadeInDown" :src="`${imgLink}seven/v${good}.png`" />
            <img class="u-txt animation fadeInUp" :src="`${imgLink}seven/${num}.png`" />
            <div class="u-boxcion animation fadeInDown">
                <span class="u-cion">{{ fontCount }}</span>
                <img class="u-img" :src="`${imgLink}seven/boxcion.png`" />
            </div>
            <img class="u-close animation fadeInUp" :src="`${imgLink}seven/close.png`" @click="closePop" />
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "doubleScreen",
    props: ["count", "fontCount"],
    data: function () {
        return {
            show: false,
            change: false,
        };
    },
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/`;
        },
        good() {
            return this.count || 2;
        },
        num() {
            return Math.ceil(Math.random() * 5);
        },
    },
    methods: {
        showSecond() {
            this.change = true;
            setTimeout(() => {
                this.show = true;
            }, 1000);
        },
        closePop() {
            this.$emit("close");
        },
    },
};
</script>
