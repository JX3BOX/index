<template>
    <div class="m-card" @click.stop>
        <span class="u-close" @click="close"></span>
        <div class="u-card" @click="change">
            <img v-if="!show" :src="`${imgLink}midAutumn/one.png`" alt="中秋节快乐！" />
            <img
                v-else
                class="animation"
                :class="show ? 'flipInY' : ''"
                :src="`${imgLink}midAutumn/two.png`"
                alt="中秋节快乐！"
            />
            <span class="u-username" v-if="!show">{{ username }} 侠士</span>
            <span v-else class="u-fontCount animation" :class="show ? 'fadeInDown' : ''">{{ fontCount }}</span>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "flipScreen",
    props: ["username", "fontCount"],
    data: function () {
        return {
            show: false,
        };
    },
    computed: {
        imgLink() {
            return __imgPath + `topic/festival/`;
        },
    },
    watch: {},
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
