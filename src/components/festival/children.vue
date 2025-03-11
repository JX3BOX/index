<template>
    <div class="children" @click.stop>
        <div class="children-card" @click="change">
            <template v-if="!show">
                <img
                    :class="`children-card__img animation ${show ? '' : 'fadeInUp'}`"
                    :src="`${imgLink}children2024/bg.png`"
                    alt="六一儿童节"
                />
                <div :class="`u-img animation ${show ? '' : 'fadeInDown'}`">
                    <img class="children-card__open" :src="`${imgLink}children2024/button.png`" alt="六一儿童节" />
                </div>
            </template>
            <div v-else @click.stop="close">
                <img
                    class="children-card__img animation"
                    :class="show ? 'flipInY' : ''"
                    :src="`${imgLink}children2024/bg2.png`"
                    alt="六一儿童节"
                />
                <img
                    class="animation children-card__content"
                    :class="show ? 'flipInY' : ''"
                    :src="`${imgLink}children2024/${fontCount || 6}.png`"
                    alt="六一儿童节"
                />
            </div>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "children",
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
@import "~@/assets/css/festival/children.less";
</style>
