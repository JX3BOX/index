<template>
    <div class="about-wrapper">
        <Header :overlayEnable="true"></Header>
        <div class="m-about-main" :style="{ backgroundImage: `url('${backgroundImage}')` }">
            <Breadcrumb
                class="m-about-bread"
                icon="more"
                :name="name"
                slug="about"
                root="/about"
                :publishEnable="false"
            >
            </Breadcrumb>
            <LeftSidebar class="m-about-nav--left">
                <SubNav :side="true"></SubNav>
            </LeftSidebar>
            <SubNav class="m-about-nav--top"></SubNav>
            <div class="m-about-content">
                <transition duration="550" name="nested" mode="out-in">
                    <keep-alive>
                        <router-view v-if="$route.meta.cache" class="inner"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.cache" class="inner"></router-view>
                </transition>
            </div>
            <div class="m-about-mobile">
                <!-- Logo & 版本 -->
                <div class="m-about-mobile__header">
                    <div class="u-logo-wrap">
                        <img :src="LogoSrc" alt="JX3BOX" />
                    </div>
                    <div class="u-title">JX3BOX</div>
                    <div class="u-desc">VERSION: {{ version || 'release' }}</div>
                </div>

                <!-- 核心信息列表 -->
                <div class="m-about-mobile__content">
                    <ul class="u-list">
                        <li class="u-item" v-for="item in CopyInfo" :key="item.key">
                            <span class="u-label">{{ item.label }}</span>
                            <a class="u-value u-value--link" v-if="item.link" :href="item.link">
                                <span>Join</span>
                                <i class="u-arrow">›</i>
                            </a>
                            <span class="u-value" v-else>{{ item.value }}</span>
                        </li>
                    </ul>
                </div>

                <!-- 访问官网按钮 -->
                <div class="m-about-mobile__action">
                    <a class="u-website-btn" href="https://rx-planet.com" target="_blank">
                        <i class="u-btn-icon">🌐</i>
                        <span>访问公司官网</span>
                    </a>
                </div>

                <!-- 底部页脚 -->
                <div class="m-about-mobile__footer">
                    <p>Powered by Fuyan Tech</p>
                </div>
            </div>
        </div>
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import SubNav from "./components/SubNav.vue";
import CommonFooter from "@jx3box/jx3box-common-ui/src/CommonFooter.vue";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { isPhone } from "@/utils/index";

const { __cdn, __imgPath } = JX3BOX;
export default {
    name: "About",
    props: [],
    components: { SubNav, CommonFooter },
    data: function () {
        return {
            isPhone: false,
            LogoSrc: __imgPath + "logo/logo.svg",
            CopyInfo: [
                {
                    key: "cooperation",
                    label: "渠道合作",
                    value: "rx6@qq.com",
                },
                {
                    key: "join",
                    label: "加入我们",
                    value: "",
                    link: "https://www.jx3box.com/notice/21899",
                },
                {
                    key: "beian",
                    label: "备案信息",
                    value: "湘ICP备2021002288号",
                },
                {
                    key: "dev",
                    label: "技术支持",
                    value: "湖南浮烟科技有限公司",
                },
            ],
            version : 'v0.0.0'
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        name() {
            return this.$route.meta.title === "首页" ? "关于我们" : this.$route.meta.title;
        },
        backgroundImage() {
            // return "/temp/about/" + this.$route.name + ".png";
            const name = this.$route.name || "index";
            return __cdn + "design/about/" + name + ".png";
        },
    },
    watch: {},
    methods: {},
    created: function () {},
    mounted() {
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

        const query = new URLSearchParams(location.search);
        this.version = query.get('version')
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/about.less";
@import "~@/assets/css/about/index.less";
</style>
