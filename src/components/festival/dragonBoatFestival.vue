<template>
    <div class="dragonBoatFestival" @click.stop>
        <div
            :class="['u-count', { show }]"
            :style="{ backgroundImage: `url('${imgLink}dragonBoatFestival/${fontCount}.svg')` }"
        ></div>
        <div class="u-img mark" :class="{ show }"></div>
        <el-image
            v-for="(item, i) in list"
            :key="i"
            :src="`${imgLink}dragonBoatFestival/${item}.svg`"
            fit="cover"
            class="u-img"
            :class="[{ text: item == 'text' }, { show }]"
            @click="showText"
        />
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "dragonBoatFestival",
    props: ["fontCount"],
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/`;
        },
    },
    data() {
        return {
            list: ["bg", "text", "cover"],
            show: false,
        };
    },
    methods: {
        close() {
            this.$emit("close");
        },
        showText() {
            this.show ? this.close() : (this.show = true);
        },
    },
};
</script>
<style lang="less">
.dragonBoatFestival {
    .pr;
    .size(282px,100%);
    .auto(x);
    .u-count {
        .pa;
        .size(30px,82px);
        .lt(0,50%);
        .z(3);
        opacity: 0;
        margin: -174px 0 0 84px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 23px auto;
        transition: all 0.5s ease-in-out;
        &.show {
            opacity: 1;
        }
    }
    .u-img {
        .pa;
        .pointer;
        .size(282px,640px);
        .lt(0,50%);
        .mt(-320px);
        transition: all 0.3s ease-in-out;
        &.mark {
            .none;
            .z(1);
            .tm(0.5);
            background: #000;
            &.show {
                .db;
            }
        }
        &.text {
            .size(213px,610px);
            .mt(-305px);
            .ml(22px);
            &.show {
                .z(2);
                margin: -305px 0 0 50px;
            }
        }
    }
    &:hover {
        .u-img:not(.show).text {
            .ml(-12px);
        }
    }
}
</style>
