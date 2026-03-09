<template>
    <section class="m-followus rounded-xl bg-white p-5 shadow-xs border border-gray-200 border-opacity-60 mb-6">
        <div class="m-followus__header">
            <div class="u-left">
                <span class="text-xs flex items-center text-gray-800 uppercase tracking-widest m-0 font-bold"
                    ><img svg-inline src="@/assets/img/index/followus.svg" class="w-4 h-4 mr-2 text-indigo-500" /> 关注我们</span
                >
            </div>
        </div>

        <div class="m-followus__list grid grid-cols-1 gap-2.5">
            <a
                href="https://space.bilibili.com/2066064028"
                target="_blank"
                rel="noopener noreferrer"
                class="m-followus__item flex items-center justify-between p-3 rounded-xl group bg-gray-50 hover:bg-pink-400 hover:text-white"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-pink-400"
                    >
                        <img :src="bilibiliIcon" alt="B站" class="w-5 h-5 u-bilibili" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-xs font-bold">B站</span>
                        <span class="m-followus__desc text-xs opacity-50 group-hover:opacity-100 tracking-tight"
                            >@剑网3魔盒</span
                        >
                    </div>
                </div>

                <i
                    class="m-followus__arrow el-icon-arrow-right opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
            </a>

            <a
                href="https://weibo.com/jx3box"
                target="_blank"
                rel="noopener noreferrer"
                class="m-followus__item flex items-center justify-between p-3 rounded-xl group bg-gray-50 hover:bg-red-600 hover:text-white"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-red-600"
                    >
                        <img :src="weiboIcon" alt="微博" class="w-5 h-5" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-xs font-bold">微博</span>
                        <span class="m-followus__desc text-xs opacity-50 group-hover:opacity-100 tracking-tight"
                            >@剑网3魔盒</span
                        >
                    </div>
                </div>

                <i
                    class="m-followus__arrow el-icon-arrow-right opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
            </a>

            <a
                href="https://www.douyin.com/user/MS4wLjABAAAAP3OHPy-BYsW6IMiPZfP1FP3J_zYAAYNVVlk9XyoKhOs"
                target="_blank"
                rel="noopener noreferrer"
                class="m-followus__item flex items-center justify-between p-3 rounded-xl group bg-gray-50 hover:bg-gray-900 hover:text-white"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-gray-900"
                    >
                        <img :src="douyinIcon" alt="抖音" class="w-5 h-5" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-xs font-bold">抖音</span>
                        <span class="m-followus__desc text-xs opacity-50 group-hover:opacity-100 tracking-tight"
                            >@剑网3魔盒</span
                        >
                    </div>
                </div>
                <i
                    class="m-followus__arrow el-icon-arrow-right opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                ></i>
            </a>

            <div
                class="m-followus__item m-followus__item--wechat flex items-center justify-between p-3 rounded-xl group bg-gray-50 hover:text-white"
                @mouseenter="updateQrcodePlacement"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-emerald-600"
                    >
                        <img :src="wechatIcon" alt="微信公众号" class="w-5 h-5" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-xs font-bold">微信公众号</span>
                        <span class="m-followus__desc text-xs opacity-50 group-hover:opacity-100 tracking-tight"
                            >@剑三魔盒</span
                        >
                    </div>
                </div>

                <div class="m-followus__qrcode-trigger">
                    <img
                        :src="qrcodeIcon"
                        alt="二维码"
                        class="m-followus__arrow u-qrcode opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                    />
                    <div class="m-followus__qrcode-popup" :class="{ 'is-left': isQrcodePopupLeft }">
                        <img :src="qrcodeImage" alt="微信公众号二维码" class="m-followus__qrcode-image" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import bilibiliIcon from "@/assets/img/index/bilibili-black.svg?url";
import weiboIcon from "@/assets/img/index/weibo.svg?url";
import douyinIcon from "@/assets/img/index/douyin.svg?url";
import wechatIcon from "@/assets/img/index/wechat.svg?url";
import qrcodeIcon from "@/assets/img/index/qrcode.svg?url";
import qrcodeImage from "@/assets/img/index/mp.jpg";

export default {
    name: "FollowUsV5",
    components: {},
    data: function () {
        return {
            bilibiliIcon,
            weiboIcon: weiboIcon,
            douyinIcon: douyinIcon,
            wechatIcon: wechatIcon,
            qrcodeIcon: qrcodeIcon,
            isQrcodePopupLeft: false,
            qrcodeImage: qrcodeImage,
        };
    },
    methods: {
        updateQrcodePlacement() {
            const trigger = this.$el.querySelector(".m-followus__qrcode-trigger");
            if (!trigger) return;

            const popupWidth = 132;
            const popupGap = 10;
            const viewportRightSpace = window.innerWidth - trigger.getBoundingClientRect().right;
            this.isQrcodePopupLeft = viewportRightSpace < popupWidth + popupGap;
        },
    },
};
</script>

<style lang="less">
.m-followus {
    @followus-ease: cubic-bezier(0.22, 1, 0.36, 1);
    @followus-duration: 0.24s;

    .m-followus__header {
        margin-bottom: 15px;
    }

    .m-followus__item {
        color: #1e293b;
        transition: background-color @followus-duration @followus-ease, color @followus-duration @followus-ease,
            box-shadow @followus-duration @followus-ease;

        &:hover {
            color: #fff;
        }
    }

    .m-followus__icon {
        transition: transform @followus-duration @followus-ease;
        transform: translate3d(0, 0, 0);
    }

    .m-followus__desc,
    .m-followus__arrow {
        transition: opacity @followus-duration @followus-ease, transform @followus-duration @followus-ease;
    }

    .m-followus__item--wechat {
        position: relative;

        &:hover {
            background-color: #80bb4e;
            color: #fff;
        }
    }

    .m-followus__qrcode-trigger {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 16px;
    }

    .u-qrcode {
        width: 14px;
        height: 14px;
        opacity: 0;
    }

    .m-followus__item--wechat:hover .u-qrcode {
        opacity: 1;
    }

    .m-followus__qrcode-popup {
        position: absolute;
        left: calc(100% + 10px);
        top: 50%;
        width: 132px;
        padding: 6px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translate(4px, -50%);
        transition: opacity @followus-duration @followus-ease, transform @followus-duration @followus-ease,
            visibility 0s linear @followus-duration;
        z-index: 30;

        &::before {
            content: "";
            position: absolute;
            left: -6px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-right: 6px solid #fff;
        }
    }

    .m-followus__item--wechat:hover .m-followus__qrcode-popup {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translate(0, -50%);
        transition-delay: 0s, 0s, 0s;
    }

    .m-followus__qrcode-popup.is-left {
        left: auto;
        right: calc(100% + 10px);
        transform: translate(-4px, -50%);

        &::before {
            left: auto;
            right: -6px;
            border-right: none;
            border-left: 6px solid #fff;
        }
    }

    .m-followus__item--wechat:hover .m-followus__qrcode-popup.is-left {
        transform: translate(0, -50%);
    }

    .m-followus__qrcode-image {
        display: block;
        width: 120px;
        height: 120px;
        border-radius: 6px;
    }
}
</style>
