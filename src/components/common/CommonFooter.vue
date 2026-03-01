<template>
    <footer class="tw-box-border tw-bg-gray-900 tw-px-6 tw-py-12 tw-text-gray-400 md:tw-px-10 lg:tw-px-16 xl:tw-px-20">
        <div class="tw-mx-auto tw-max-w-7xl">
            <div
                class="tw-grid tw-grid-cols-1 tw-gap-10 tw-border-b tw-border-gray-800 tw-pb-10 lg:tw-grid-cols-12 lg:tw-gap-8"
            >
                <section class="lg:tw-col-span-4">
                    <div class="tw-flex tw-items-center tw-space-x-3">
                        <img class="tw-h-9 tw-w-9" svg-inline src="@/assets/img/footer/logo.svg" alt="JX3BOX" />
                        <span class="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-white">JX3BOX</span>
                    </div>
                    <p class="tw-mt-5 tw-max-w-sm tw-text-sm tw-leading-7 tw-text-gray-400">
                        一站式剑三工具与资源聚合站，由热心侠士自发结伴、持续研发、用心运营；江湖路远，幸甚有你。
                    </p>
                    <div class="tw-mt-6 tw-flex tw-flex-wrap tw-gap-3">
                        <div v-for="item in socials" :key="item.name">
                            <el-popover
                                v-if="item.qrcode"
                                trigger="hover"
                                placement="top"
                                popper-class="c-footer-v4__popover"
                            >
                                <div class="tw-flex tw-w-36 tw-flex-col tw-items-center tw-p-3">
                                    <img
                                        class="tw-h-32 tw-w-32 tw-rounded-md tw-object-cover"
                                        :src="item.qrcode"
                                        :alt="item.name"
                                    />
                                    <span class="tw-mt-2 tw-text-xs tw-text-gray-300">{{
                                        item.label || item.name
                                    }}</span>
                                </div>
                                <a
                                    slot="reference"
                                    class="tw-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-gray-700 tw-bg-gray-800 tw-transition hover:tw-border-blue-500 hover:tw-bg-blue-600"
                                    :title="item.name"
                                    href="javascript:;"
                                >
                                    <img class="tw-h-5 tw-w-5" svg-inline :src="item.icon" :alt="item.name" />
                                </a>
                            </el-popover>
                            <a
                                v-else
                                class="tw-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-gray-700 tw-bg-gray-800 tw-transition hover:tw-border-blue-500 hover:tw-bg-blue-600"
                                :href="item.href"
                                target="_blank"
                                rel="noopener noreferrer"
                                :title="item.name"
                            >
                                <img class="tw-h-5 tw-w-5" svg-inline :src="item.icon" :alt="item.name" />
                            </a>
                        </div>
                    </div>
                </section>

                <section class="lg:tw-col-span-4">
                    <div class="tw-grid tw-grid-cols-1 tw-gap-8 sm:tw-grid-cols-3">
                        <div v-for="group in footerGroups" :key="group.title">
                            <h3 class="tw-text-sm tw-font-semibold tw-tracking-wide tw-text-white">
                                {{ group.title }}
                            </h3>
                            <div class="tw-mt-4 tw-space-y-3">
                                <a
                                    v-for="item in group.links"
                                    :key="item.name"
                                    class="tw-block tw-text-xs tw-text-gray-400 tw-transition hover:tw-text-blue-400"
                                    :href="item.href"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ item.name }}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="lg:tw-col-span-4">
                    <h3 class="tw-text-sm tw-font-semibold tw-tracking-wide tw-text-white">下载中心</h3>
                    <div class="tw-mt-4 tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
                        <div v-for="item in downloadLinks" :key="item.name">
                            <el-popover
                                v-if="item.qrcode"
                                trigger="hover"
                                placement="top"
                                popper-class="c-footer-v4__popover"
                            >
                                <div class="tw-flex tw-flex-col tw-items-center tw-p-3">
                                    <img
                                        class="tw-h-32 tw-w-32 tw-rounded-md tw-object-cover"
                                        :src="item.qrcode"
                                        :alt="item.name"
                                    />
                                    <span class="tw-mt-2 tw-text-xs tw-text-gray-300">{{ item.label }}</span>
                                </div>
                                <a
                                    slot="reference"
                                    class="tw-flex tw-h-12 tw-items-center tw-rounded-xl tw-border tw-border-gray-700 tw-bg-gray-800 tw-px-4 tw-text-xs tw-text-gray-300 tw-transition hover:tw-border-blue-500 hover:tw-bg-gray-700"
                                    :href="item.href || 'javascript:;'"
                                    :target="item.href ? '_blank' : null"
                                    :rel="item.href ? 'noopener noreferrer' : null"
                                >
                                    <span class="tw-mr-2.5 tw-flex tw-h-4 tw-w-4 tw-items-center tw-justify-center">
                                        <img class="tw-h-4 tw-w-4" svg-inline :src="item.icon" :alt="item.name" />
                                    </span>
                                    <span>{{ item.name }}</span>
                                </a>
                            </el-popover>
                            <a
                                v-else
                                class="tw-flex tw-h-12 tw-items-center tw-rounded-xl tw-border tw-border-gray-700 tw-bg-gray-800 tw-px-4 tw-text-xs tw-text-gray-300 tw-transition hover:tw-border-blue-500 hover:tw-bg-gray-700"
                                :href="item.href || 'javascript:;'"
                                :target="item.href ? '_blank' : null"
                                :rel="item.href ? 'noopener noreferrer' : null"
                            >
                                <span class="tw-mr-2.5 tw-flex tw-h-4 tw-w-4 tw-items-center tw-justify-center">
                                    <img class="tw-h-4 tw-w-4" svg-inline :src="item.icon" :alt="item.name" />
                                </span>
                                <span>{{ item.name }}</span>
                            </a>
                        </div>
                    </div>


                    <div
                        class="tw-mt-4 tw-flex tw-items-center tw-justify-between tw-rounded-xl tw-border tw-p-4"
                        style="
                            border-color: rgba(59, 130, 246, 0.2);
                            background-image: linear-gradient(90deg, rgba(30, 64, 175, 0.2), rgba(31, 41, 55, 0.4));
                        "
                    >
                        <div class="tw-flex tw-items-center tw-space-x-3">
                            <div
                                class="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-lg tw-text-blue-400"
                                style="background-color: rgba(59, 130, 246, 0.2)"
                            >
                                <img class="tw-h-5 tw-w-5" src="@/assets/img/left/qqbot2.png" alt="QQ机器人" />
                            </div>
                            <div>
                                <p
                                    class="tw-font-bold tw-uppercase tw-tracking-wider tw-text-gray-500"
                                    style="font-size: 10px"
                                >
                                    QQ 机器人服务
                                </p>
                                <p class="tw-mt-1 tw-font-mono tw-text-sm tw-font-semibold tw-text-white">3889010020</p>
                            </div>
                        </div>
                        <a
                            class="tw-rounded-md tw-bg-blue-600 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-transition hover:tw-bg-blue-500"
                            href="tencent://AddContact/?uin=3889010020&Site=www.jx3box.com&Menu=yes"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            添加
                        </a>
                    </div>
                </section>
            </div>

            <div
                class="tw-flex tw-flex-col tw-items-center tw-justify-between tw-gap-4 tw-pt-6 tw-text-xs tw-text-gray-500 md:tw-flex-row"
            >
                <div
                    class="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-5 tw-gap-y-2 md:tw-justify-start"
                >
                    <span>© 2024 JX3BOX. 由开源社区驱动。</span>
                    <a
                        class="tw-transition hover:tw-text-gray-300"
                        href="https://beian.miit.gov.cn/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        湘ICP备2021002288号
                    </a>
                    <span>湘公网安备 43019002001234号</span>
                </div>
                <div class="tw-flex tw-items-center tw-gap-6 tw-text-xs">
                    <a
                        class="tw-transition hover:tw-text-white"
                        href="https://rx-planet.com/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        联系我们
                    </a>
                    <a
                        class="tw-transition hover:tw-text-white"
                        href="https://www.jx3box.com/feedback"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        反馈建议
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {
            socials: [
                {
                    name: "公众号",
                    key: "wechat",
                    href: "",
                    icon: require("@/assets/img/wechat.svg"),
                    qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "B站",
                    key: "bilibili",
                    href: "https://space.bilibili.com/2066064028",
                    icon: require("@/assets/img/footer/bilibili.svg"),
                },
                {
                    name: "微博",
                    key: "weibo",
                    href: "https://weibo.com/jx3box",
                    icon: require("@/assets/img/tv/weibo.svg"),
                },
                {
                    name: "抖音",
                    key: "douyin",
                    href: "https://www.douyin.com/user/MS4wLjABAAAAP3OHPy-BYsW6IMiPZfP1FP3J_zYAAYNVVlk9XyoKhOs",
                    icon: require("@/assets/img/tv/douyin.svg"),
                },
            ],
            aboutLinks: [
                { name: "团队成员", href: "https://www.jx3box.com/about/" },
                { name: "加入我们", href: "https://www.jx3box.com/notice/21899" },
                { name: "开发文档", href: "https://www.jx3box.com/tool?subtype=4" },
                { name: "代码仓库", href: "https://github.com/JX3BOX" },
            ],
            legalLinks: [
                { name: "用户协议", href: "https://www.jx3box.com/about/license" },
                { name: "创作公约", href: "https://www.jx3box.com/about/treaty" },
                { name: "隐私政策", href: "https://www.jx3box.com/about/privacy" },
                { name: "创作激励", href: "https://www.jx3box.com/about/incentives" },
            ],
            extraLinks: [
                { name: "游戏版本", href: "https://www.jx3box.com/topic" },
                { name: "活动中心", href: "https://www.jx3box.com/event" },
                { name: "全站地图", href: "https://www.jx3box.com/app/" },
            ],
            downloadLinks: [
                {
                    name: "App Store",
                    href: "",
                    icon: require("@/assets/img/footer/ios.svg"),
                    // qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "Android",
                    href: "",
                    icon: require("@/assets/img/footer/android.svg"),
                    // qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "鸿蒙 NEXT",
                    href: "",
                    icon: require("@/assets/img/footer/harmony.svg"),
                    // qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "小程序",
                    label: "JX3BOX小助手",
                    href: "",
                    icon: require("@/assets/img/footer/miniprogram.svg"),
                    qrcode: require("@/assets/img/mobile/miniprogram.jpg"),
                },
            ],
        };
    },
    computed: {
        footerGroups() {
            return [
                {
                    title: "关于我们",
                    links: this.aboutLinks,
                },
                {
                    title: "法律合规",
                    links: this.legalLinks,
                },
                // {
                //     title: "更多入口",
                //     links: this.extraLinks,
                // },
            ];
        },
    },
};
</script>

<style lang="postcss">
@tailwind components;
@tailwind utilities;

.c-footer-v4__popover {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    box-shadow: 0 16px 40px rgba(3, 7, 18, 0.45);
    padding: 0 !important;
}

.c-footer-v4__popover .popper__arrow,
.c-footer-v4__popover .popper__arrow:after {
    display: none !important;
}
</style>
