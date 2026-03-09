<template>
    <div class="m-world-block m-world-baizhan--mini">
        <el-divider content-position="left">{{ $t("index.world.baizhan.divider") }}</el-divider>
        <div class="m-btn-wrapper">
            <el-button size="small" @click="visible = true" plain>{{ $t("index.world.baizhan.mapPreview") }}</el-button>
            <el-button size="small" @click="toBaizhan" plain>{{ $t("index.world.baizhan.detail") }}</el-button>
        </div>
        <baizhan-dialog v-if="visible" :visible="visible" :isPhone="isPhone" @close="visible = false"></baizhan-dialog>
    </div>
</template>

<script>
import { isPhone } from "@/utils/index";
import BaizhanDialog from "./baizhan_dialog.vue";
export default {
    name: "baizhan_mini",
    props: [],
    components: { BaizhanDialog },
    data: function () {
        return {
            visible: false,
            isPhone: false,
        };
    },
    computed: {},
    watch: {},
    methods: {
        toBaizhan() {
            window.open("https://www.jx3box.com/fb/baizhan", "_blank");
        },
    },
    created: function () {},
    mounted: function () {
        const self = this;
        self.isPhone = isPhone();
        let timer = null;
        window.addEventListener("resize", () => {
            if (timer === null) {
                timer = setTimeout(() => {
                    self.isPhone = isPhone();
                    clearTimeout(timer);
                    timer = null;
                }, 0);
            }
        });
    },
};
</script>
<style lang="less">
.m-world-baizhan--mini {
    .el-divider {
        margin-top: 10px;
    }
    .u-banner {
        height: 160px;
        width: 320px;
    }
    .m-btn-wrapper {
        .flex;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 10px;

        i {
            margin-right: 3px;
        }
        i:after {
            .none !important;
        }
    }
}
</style>
