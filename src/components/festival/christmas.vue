<template>
    <div class="christmas" @click.stop>
        <div class="christmas-card" @click="change">
            <template v-if="!show">
                <img class="christmas-card__img" :src="`${imgLink}/christmas2023/cover.jpg`" alt="圣诞节快乐" />
                <img class="christmas-card__open" :src="`${imgLink}/christmas2023/button.png`" alt="圣诞节快乐" />
            </template>
            <div
                v-else
                :style="`background:url(${imgLink}/christmas2023/bg.jpg) top center no-repeat;background-size: cover;`"
            >
                <img
                    @click.stop="close"
                    class="animation christmas-card__content christmas-card__img"
                    :class="show ? 'flipInY' : ''"
                    :src="`${imgLink}/christmas2023/${fontCount || 0}.png`"
                    alt="圣诞节快乐"
                />
            </div>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "christmas",
    props: ["fontCount"],
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/`;
        },
    },
    data() {
        return {
            show: false,
        };
    },
    methods: {
        change() {
            this.show = true;
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/festival/christmas.less";
</style>
