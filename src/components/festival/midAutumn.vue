<template>
    <div class="midAutumn">
        <div class="m-count" :class="{ flipper }">
            <img :src="`${imgLink}${fontCount}.png`" class="u-count" />
        </div>
        <img :src="`${imgLink}202403.png`" class="u-img u-bg" :class="{ flipper }" @click="close" />
        <div class="u-img u-img-cover" @click.stop="hide" :class="{ active, flipper }">
            <img :src="`${imgLink}202402.png`" class="u-pic u-pic-2" />
            <img :src="`${imgLink}202401.png`" class="u-pic u-pic-1" />
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "midAutumn",
    props: ["fontCount"],
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/midAutumn2024/`;
        },
        number() {
            const str = this.fontCount + "";
            return str.split("") || [0];
        },
    },
    data() {
        return {
            active: false,
            flipper: false,
        };
    },

    methods: {
        close() {
            this.active = false;
            this.$emit("checked");
            this.$emit("close");
        },
        hide() {
            this.flipper = true;
            setTimeout(() => {
                this.active = true;
                this.$emit("checked");
            }, 600);
        },
    },
};
</script>
<style lang="less">
.midAutumn {
    .pr;
    .pointer;
    .auto(x);
    .ct(o,360px,610px);
    .size(360px,610px);
    .u-img {
        .full;
        perspective: 1000px;
        transform-style: preserve-3d;
        transition: all 2s;
        &.u-bg {
            opacity: 0;
        }
        &.flipper {
            opacity: 1;
            transform: rotateY(180deg);
        }
    }
    .u-pic {
        .pa;
        .lb(0);
        transition: all 0.5s ease;
    }
    .u-pic-2 {
        z-index: 2;
        width: 720px;
        max-width: 720px;
        .lb(50%,0);
        .ml(-420px);
    }
    .u-img-cover {
        .pa;
        .lt(0);
        .u-pic-1 {
            transform: scale(0.95);
        }

        &:hover {
            .u-pic-1 {
                transform: scale(1);
                transform-origin: bottom center;
            }
        }

        &.active {
            .none;
        }
    }
    .m-count {
        .pa;
        .lb(0,30px);
        .flex;
        .tm(0);
        z-index: 2;
        transition: opacity 1.5s ease 1s;
        justify-content: center;
        gap: 2px;
        &.flipper {
            .tm(1);
        }
        .u-count {
            .w(80%);
        }
    }
    @media screen and (max-width: @phone) {
        zoom: 0.8;
    }
}
</style>
