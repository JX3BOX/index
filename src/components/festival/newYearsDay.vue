<template>
    <div class="newYearsDay" @click.stop>
        <div @click="change" class="newYearsDay-card" :class="show?'newYearsDay-card__on':'newYearsDay-card__off'">
            <!-- v-if="!show" -->
            <img class="newYearsDay-card__img newYearsDay-card__cover" :src="`${imgLink}/newYearsDay2023/P1-BG.jpg`"
                alt="元旦节快乐">
            <img class="newYearsDay-card__img newYearsDay-card__content" :src="`${imgLink}/newYearsDay2023/p2-01.jpg`"
                alt="元旦节快乐">
            <img class="newYearsDay-card__click" v-if="!show" :src="`${imgLink}/newYearsDay2023/ClickButton-1.png`" alt="">
            <img class="newYearsDay-card__close" @click.stop="close" :src="`${imgLink}/newYearsDay2023/CloseButton-1.png`"
                alt="">
            <span class="newYearsDay-card__fontCount">{{ fontCount }}</span>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: 'newYearsDay',
    props: ['fontCount'],
    computed: {
        imgLink() {
            return __imgPath + `topic/festival`;
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        change() {
            this.show = true;
        },
        close() {
            this.$emit("close");
        },
    },
}
</script>
<style lang="less">
    @import "~@/assets/css/festival/newYearsDay.less";
</style>