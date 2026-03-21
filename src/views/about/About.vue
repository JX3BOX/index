<template>
    <div class="p-about">
        <CommonHeader :overlayEnable="true" />
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
                <router-view v-slot="{ Component }">
                    <transition duration="550" name="nested" mode="out-in">
                        <keep-alive v-if="isCacheRoute">
                            <component :is="Component" class="inner"></component>
                        </keep-alive>
                        <component v-else :is="Component" class="inner"></component>
                    </transition>
                </router-view>
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

const { __cdn, __imgPath } = JX3BOX;

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
            return this.$route.meta.title === "首页" ? "关于我们" : this.$route.meta.title;
        },
        backgroundImage() {
            const routeName = this.$route.name || "index";
            return `${__cdn}design/about/${routeName}.png`;
        },
        isCacheRoute() {
            return Boolean(this.$route.meta?.cache);
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
