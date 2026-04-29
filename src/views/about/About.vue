<template>
    <div class="p-about">
        <CommonHeader :overlayEnable="true" />
        <div class="m-about-main" :class="mainClass">
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

            <div class="m-about-layout">
                <aside class="m-about-sidebar" aria-label="关于我们导航">
                    <div class="m-about-sidebar__title">
                        <strong>关于</strong>
                        <span>|</span>
                        <em>ABOUT</em>
                    </div>
                    <nav class="m-about-sidebar__nav">
                        <router-link
                            v-for="route in desktopRoutes"
                            :key="route.path"
                            class="m-about-sidebar__item"
                            :class="{ 'is-active': isDesktopRouteActive(route) }"
                            :to="getRoutePath(route)"
                        >
                            <i class="u-nav-arrow" aria-hidden="true"></i>
                            <span class="u-nav-label">{{ route.meta.title }}</span>
                        </router-link>
                    </nav>
                    <transition name="about-mascot">
                        <img
                            v-if="showSidebarMascot"
                            class="m-about-sidebar__mascot"
                            src="@/assets/img/about/sidebar-girl.png"
                            alt=""
                        />
                    </transition>
                </aside>

                <main class="m-about-stage">
                    <img v-if="isIndexRoute" class="m-about-hero" src="@/assets/img/about/hero-girl.svg" alt="" />
                    <img v-if="showGroupBg" class="m-about-group-bg" src="@/assets/img/about/hero-girl.svg" alt="" />
                    <section class="m-about-panel">
                        <div class="m-about-heading">
                            <div class="m-about-heading__title">
                                <img class="u-heading-icon" :src="headingIconSrc" alt="" />
                                <span>{{ name }}</span>
                            </div>
                            <span class="m-about-heading__mark">{{ headingMark }}</span>
                        </div>
                        <div class="m-about-content">
                            <router-view v-slot="{ Component }">
                                <transition name="about-page" mode="out-in">
                                    <keep-alive v-if="isCacheRoute">
                                        <component :is="Component" :key="$route.fullPath" class="inner"></component>
                                    </keep-alive>
                                    <component v-else :is="Component" :key="$route.fullPath" class="inner"></component>
                                </transition>
                            </router-view>
                        </div>
                    </section>
                </main>
            </div>

            <div class="m-about-mobile">
                <div class="m-about-mobile__header">
                    <div class="u-logo-wrap">
                        <img :src="logoSrc" alt="JX3BOX" />
                    </div>
                    <div class="u-title">JX3BOX</div>
                    <div class="u-desc">VERSION: {{ version || "release" }}</div>
                </div>

                <div class="m-about-mobile__content">
                    <ul class="u-list">
                        <li class="u-item" v-for="item in copyInfo" :key="item.key">
                            <span class="u-label">{{ item.label }}</span>
                            <a class="u-value u-value--link" v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">
                                <span>Join</span>
                                <i class="u-arrow">›</i>
                            </a>
                            <span class="u-value" v-else>{{ item.value }}</span>
                        </li>
                    </ul>
                </div>

                <div class="m-about-mobile__action">
                    <a class="u-website-btn" href="https://rx-planet.com" target="_blank" rel="noopener noreferrer">
                        <i class="u-btn-icon">🌐</i>
                        <span>访问公司官网</span>
                    </a>
                </div>

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
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import CommonHeader from "@jx3box/jx3box-ui/src/CommonHeader.vue";
import CommonFooter from "@jx3box/jx3box-ui/src/CommonFooter.vue";
import cubeIcon from "@/assets/img/about/cube.svg";
import coffeeIcon from "@/assets/img/about/icon-coffee.svg";
import messageIcon from "@/assets/img/about/icon-message.svg";
import awardIcon from "@/assets/img/about/icon-award.svg";
import bookIcon from "@/assets/img/about/icon-book-open.svg";

const { __imgPath } = JX3BOX;

export default {
    name: "About",
    components: {
        SubNav,
        CommonHeader,
        CommonFooter,
    },
    data() {
        return {
            logoSrc: `${__imgPath}logo/logo.svg`,
            copyInfo: [
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
            version: "v0.0.0",
        };
    },
    computed: {
        name() {
            if (this.isArticleRoute) return "服务条款";
            return this.$route.meta.title === "首页" ? "关于我们" : this.$route.meta.title;
        },
        mainClass() {
            const routeName = this.isArticleRoute ? "terms" : this.$route.meta?.belongs || this.$route.name || "index";
            return {
                "is-index": this.isIndexRoute,
                [`is-${routeName}`]: true,
            };
        },
        desktopRoutes() {
            return this.$router.options.routes.filter((route) => !["creation"].includes(route.name));
        },
        isIndexRoute() {
            return this.$route.name === "index";
        },
        isGroupRoute() {
            return this.$route.name === "group";
        },
        isTeamRoute() {
            return this.$route.name === "team";
        },
        isAuthorRoute() {
            return this.$route.name === "author";
        },
        isArticleRoute() {
            return ["terms", "creation"].includes(this.$route.meta?.belongs) || ["terms", "creation"].includes(this.$route.name);
        },
        showGroupBg() {
            return this.isGroupRoute || this.isTeamRoute || this.isAuthorRoute || this.isArticleRoute;
        },
        showSidebarMascot() {
            return !this.isIndexRoute;
        },
        headingIconSrc() {
            if (this.isArticleRoute) return bookIcon;
            if (this.isAuthorRoute) return awardIcon;
            if (this.isTeamRoute) return messageIcon;
            return this.isGroupRoute ? coffeeIcon : cubeIcon;
        },
        headingMark() {
            if (this.isArticleRoute) return "";
            if (this.isAuthorRoute) return "期待你的加入";
            if (this.isTeamRoute) return "期待你的加入";
            return this.isGroupRoute ? "幸甚有你，共建美好社区" : "JX3BOX";
        },
        isCacheRoute() {
            return Boolean(this.$route.meta?.cache);
        },
    },
    methods: {
        getRoutePath(route) {
            return route.children ? route.children[0].path : route.path;
        },
        isDesktopRouteActive(route) {
            if (route.name === "terms" && this.isArticleRoute) return true;
            return route.name === this.$route.name || route.name === this.$route.meta?.belongs;
        },
    },
    mounted() {
        const query = new URLSearchParams(location.search);
        this.version = query.get("version") || this.version;
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/about.less";
@import "~@/assets/css/about/index.less";
</style>
