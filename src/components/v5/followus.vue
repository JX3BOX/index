<template>
    <section class="m-followus bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col mb-6">
        <div class="m-followus__header flex items-center mb-5 px-1 text-gray-400" style="column-gap: 0.5rem">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
            </svg>
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

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                    aria-hidden="true"
                >
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
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

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                    aria-hidden="true"
                >
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
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

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                    aria-hidden="true"
                >
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
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
