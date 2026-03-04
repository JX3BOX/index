<template>
    <section class="m-followus bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col mb-6">
        <div class="m-followus__header flex items-center mb-5 px-1 text-gray-400" style="column-gap: 0.5rem">
            <img src="@/assets/img/index/follow.svg" alt="" svg-inline class="w-4 h-4 mr-2 text-indigo-500" />
            <span class="text-xs font-bold uppercase tracking-widest">关注我们</span>
        </div>

        <div class="m-followus__list grid grid-cols-1 gap-2.5">
            <a
                href="https://www.bilibili.com"
                target="_blank"
                rel="noopener noreferrer"
                class="m-followus__item flex items-center justify-between p-3 rounded-xl transition-all duration-300 group bg-gray-50 hover:bg-pink-400 hover:text-white"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-pink-400"
                    >
                        <img :src="bilibiliIcon" alt="B站" class="w-5 h-5 u-bilibili" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-sm font-bold">B站</span>
                        <span class="text-xs opacity-50 group-hover:opacity-100 tracking-tight">@Bilibili</span>
                    </div>
                </div>

                <i
                    class="el-icon-arrow-right opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                ></i>
            </a>

            <a
                href="https://weibo.com"
                target="_blank"
                rel="noopener noreferrer"
                class="m-followus__item flex items-center justify-between p-3 rounded-xl transition-all duration-300 group bg-gray-50 hover:bg-red-600 hover:text-white"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-red-600"
                    >
                        <img :src="weiboIcon" alt="微博" class="w-5 h-5" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-sm font-bold">微博</span>
                        <span class="text-xs opacity-50 group-hover:opacity-100 tracking-tight">@Weibo</span>
                    </div>
                </div>

                <i
                    class="el-icon-arrow-right opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                ></i>
            </a>

            <a
                href="https://www.douyin.com"
                target="_blank"
                rel="noopener noreferrer"
                class="m-followus__item flex items-center justify-between p-3 rounded-xl transition-all duration-300 group bg-gray-50 hover:bg-gray-900 hover:text-white"
            >
                <div class="flex items-center" style="column-gap: 0.75rem">
                    <div
                        class="m-followus__icon p-2 rounded-lg bg-white shadow-sm transition-transform transform group-hover:scale-110 text-gray-900"
                    >
                        <img :src="douyinIcon" alt="抖音" class="w-5 h-5" />
                    </div>

                    <div class="flex flex-col">
                        <span class="text-sm font-bold">抖音</span>
                        <span class="text-xs opacity-50 group-hover:opacity-100 tracking-tight">@Douyin</span>
                    </div>
                </div>
                <i
                    class="el-icon-arrow-right opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                ></i>
            </a>
        </div>
    </section>
</template>

<script>
import bilibiliIcon from "@/assets/img/tv/bilibili.svg";
import weiboIcon from "@/assets/img/tv/weibo.svg";
import douyinIcon from "@/assets/img/tv/douyin.svg";

export default {
    name: "FollowUsV5",
    components: {},
    data: function () {
        return {
            bilibiliIcon,
            weiboIcon: weiboIcon,
            douyinIcon: douyinIcon,
        };
    },
};
</script>

<style lang="less">
.m-followus {
    .m-followus__item {
        color: #1e293b;

        &:hover {
            color: #fff;
        }
    }
}
</style>
