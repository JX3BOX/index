<template>
    <div class="m-notice-content m-notice-content-single">
        <!-- 返回列表 -->
        <div class="m-backList" @click="goBack">
            <img class="u-arr" src="@/assets/img/notice/arr.svg" />
            <span>返回列表</span>
        </div>
        <!-- 返回顶部 -->
        <div class="m-backTop" @click="goTop" v-show="show" :style="style">
            <img class="u-arr" src="@/assets/img/notice/arr.svg" />
            <span>返回顶部</span>
        </div>
        <!-- 内容 -->
        <NoticeSingle :id="singleId" />
    </div>
</template>

<script>
import NoticeSingle from "./NoticeSingle.vue";
export default {
    name: "NoticeSingleV2",
    components: { NoticeSingle },
    data: function () {
        return {
            show: false,
            top: 0,
        };
    },
    computed: {
        style() {
            return {
                top: this.top + "px",
            };
        },
        singleId() {
            return this.$route.params.id;
        },
    },

    methods: {
        goBack() {
            this.$router.push({ name: "list" });
        },
        goTop() {
            document.documentElement.scrollTop = 0;
        },
        handlerScroll() {
            let clientHeight = document.documentElement.clientHeight;
            let osTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (osTop >= clientHeight) {
                this.show = true;
                this.top = osTop + clientHeight - 220;
            }
        },
    },
    mounted() {
        document.addEventListener("scroll", this.handlerScroll);
    },
    beforeDestroy() {
        document.removeEventListener("scroll", this.handlerScroll);
    },
};
</script>

<style lang="less">
// 返回按钮
.m-backList {
    .flex;
    .r(20px);
    .pointer;
    .size(90px,42px);
    background-color: #fff;
    color: #282c31;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.1);
    .u-arr {
        transform: rotate(-90deg);
    }
}

// 返回顶部
.m-backTop {
    .pa;
    .flex;
    .z(2);
    .size(40px,134px);
    .pointer;
    .x;
    right: -50px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.1);
    gap: 10px;
    padding: 0 10px;
    background: #fff;
    border-radius: 30px;
}
// 内容区域
.m-notice-content {
    position: relative;
    min-height: calc(100vh - 54px);
    box-sizing: border-box;
    .pt(160px);
    &.m-notice-content-single {
        padding: 160px 20px 0 20px;
    }
    .m-notice-box {
        padding: 20px 0 60px 0;
    }
    .m-notice-single {
        .r(20px);
        padding: 30px;
        background-color: #fff;
        box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.1);
    }
}
@media screen and (max-width: @ipad) {
    .m-backTop {
        right: 0;
    }
    .m-backList {
        .w(72px);
    }
    .m-notice-content {
        .pt(100px);
        .fz(12px);
        .m-notice-single {
            padding: 30px 5px;
        }
        .m-single-title {
            font-size: 18px;
        }
    }
}

// 适配小程序端
.v-miniprogram {
    .p-notice-v2 {
        background: none;
    }
    .m-backList, .m-thx, .m-single-comment {
        .none;
    }

    .m-notice-single {
        border-radius: 0;
        box-shadow: none;
    }

    .c-footer {
        .none;
    }
}
</style>
