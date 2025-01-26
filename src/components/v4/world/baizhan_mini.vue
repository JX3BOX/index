<template>
    <div class="m-world-block m-world-baizhan--mini">
        <el-divider content-position="left">百战</el-divider>
        <!-- <el-image class="u-banner" :src="banner"></el-image> -->
        <div class="m-btn-wrapper">
            <el-button size="mini" @click="visible = true" plain icon="el-icon-zoom-in">快速预览</el-button>
            <el-button size="mini" @click="toBaizhan" plain icon="el-icon-position">百战详情</el-button>
        </div>
        <baizhan v-if="visible" :visible="visible" :isPhone="isPhone" @close="visible = false"></baizhan>
    </div>
</template>

<script>
import { isPhone } from "@/utils/index";
import baizhan from "@/components/v4/world/baizhan.vue";
export default {
    name: "baizhan_mini",
    props: [],
    components: {
        baizhan,
    },
    data: function () {
        return {
            visible: false,
            banner: "https://cdn.jx3box.com/upload/post/2024/11/7/294981_597969.png?x-oss-process=image/auto-orient,1/resize,m_fill,w_640,h_320/quality,Q_100",
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
