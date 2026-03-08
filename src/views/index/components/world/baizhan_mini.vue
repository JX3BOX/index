<template>
    <div class="m-world-block m-world-baizhan--mini">
        <el-divider content-position="left">百战</el-divider>
        <div class="m-btn-wrapper">
            <el-button size="small" @click="toBaizhan" plain>百战详情</el-button>
            <el-button size="small" @click="toBaizhanMap" plain>地图预览</el-button>
        </div>
    </div>
</template>

<script>
import { isPhone } from "@/utils/index";
export default {
    name: "baizhan_mini",
    props: [],
    components: {},
    data: function () {
        return {
            isPhone: false,
        };
    },
    computed: {},
    watch: {},
    methods: {
        toBaizhan() {
            window.open("https://www.jx3box.com/fb/baizhan", "_blank");
        },
        toBaizhanMap() {
            window.open("https://www.jx3box.com/fb/baizhan?tab=map", "_blank");
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
