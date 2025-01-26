<template>
    <el-dialog
        class="m-index-baizhan-dialog"
        title="本周百战地图"
        :visible.sync="show"
        @close="onClose"
        :close-on-click-modal="false"
        :width="isPhone ? '100%' : '800px'"
    >
        <div class="m-baizhan-wrapper">
            <baizhan-map :class="isPhone && 'is-map-phone'" mode="simple"></baizhan-map>
        </div>
    </el-dialog>
</template>

<script>
import BaizhanMap from "@jx3box/jx3box-bmap/src/components/BMap.vue";
export default {
    name: "baizhanDialog",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        isPhone: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["close"],
    components: {
        BaizhanMap,
    },
    data() {
        return {
            show: false,
        };
    },
    watch: {
        visible: {
            immediate: true,
            handler(bol) {
                this.show = bol;
            },
        },
    },
    methods: {
        onClose() {
            this.show = false;
            this.$emit("close", false);
        },
    },
};
</script>
<style lang="less">
.m-index-baizhan-dialog .el-dialog__body {
    padding: 10px;
    overflow: hidden;
    overflow-x: auto;
    .m-baizhan-wrapper {
        min-width: 750px;
        width: 100%;
        max-height: 60vh;
        overflow-y: auto;
        .scrollbar(4px);
    }
}
</style>
