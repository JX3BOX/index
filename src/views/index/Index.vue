<template>
    <div class="p-index">
        <CommonHeader :overlayEnable="true" />
        <div class="m-main" ref="main">
            <div class="m-left m-sidebar">
                <IndexLeftSidebar />
            </div>
            <div class="m-primary">
                <Slider />
                <div class="m-primary__main">
                    <div class="m-primary__main-left">
                        <Box />
                        <Joke />
                        <Activity />
                        <Posts />
                    </div>
                    <div class="m-primary__main-right">
                        <Jx3world />
                    </div>
                </div>
            </div>
        </div>
        <CommonFooter />
        <div ref="footerAnchor" style="display: none"></div>

        <Festival />
        <ForceAlert />
        <ImportantMsg />
    </div>
</template>

<script>

import IndexLeftSidebar from "@/components/IndexLeftSidebar.vue";

// 中间
import Slider from "./components/slider.vue";
import Box from "./components/box.vue";
import Joke from "./components/joke.vue";
import Activity from "./components/activity.vue";
import Posts from "./components/posts.vue";

// 右侧
import Jx3world from "./components/jx3world.vue";

// 公共
import Festival from "./components/festival.vue";
import ForceAlert from "./components/force_alert.vue";
import ImportantMsg from "./components/important_msg.vue";

import User from "@jx3box/jx3box-common/js/user";
import { getProfile, getMeta } from "@/service/user";
import { getConfig } from "@/service/setting.js";
import driver from "@/utils/driver.js";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "Index",
    props: [],
    components: {
        IndexLeftSidebar,

        Slider,
        Box,
        Joke,
        Activity,
        Posts,
        Jx3world,

        Festival,
        ForceAlert,
        ImportantMsg,
    },
    data: function () {
        return {
            isMobile: window.innerWidth < 1280,
            footerBreakpoint: 1133,
        };
    },
    computed: {},
    watch: {},
    methods: {
        syncFooterPosition() {
            const main = this.$refs.main;
            const root = this.$el;
            const anchor = this.$refs.footerAnchor;
            const footer = root?.querySelector(".c-footer, .c-footer--v4");
            if (!main || !root || !anchor || !footer) return;

            if (window.innerWidth <= this.footerBreakpoint) {
                if (footer.parentElement !== main) {
                    main.appendChild(footer);
                }
            } else if (footer.nextElementSibling !== anchor || footer.parentElement !== root) {
                root.insertBefore(footer, anchor);
            }
        },
        handleResize() {
            this.isMobile = window.innerWidth < 1280;
            this.syncFooterPosition();
        },
    },
    created: function () {
        if (User.isLogin()) {
            getProfile().then((data) => {
                if (data) {
                    this.$store.state.server = data.jx3_server;
                }
            });
        }

        getConfig().then((res) => {
            const data = res?.data?.data;
            const config = {};
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    config[item.key] = item.val;
                });
            }
            this.$store.state.config = config;
        });
    },
    mounted: function () {
        this.syncFooterPosition();
        window.addEventListener("resize", this.handleResize);

        if (!isMiniProgram() && !isApp()) {
            this.$nextTick(() => {
                if (User.isLogin()) {
                    getMeta("new_user_guide").then((res) => {
                        const val = ~~res?.data?.data;
                        if (!val) driver.drive();
                    });
                } else {
                    const key = "new_user_guide";
                    const isShow = localStorage.getItem(key);
                    if (~~isShow) return;
                    driver.drive();
                }
            });
        }

        if (location.href.indexOf("index/feature") > -1) {
            location.href = "/notice?tab=feature";
        }
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
};
</script>

<style lang="less">
@import "@/assets/css/index/app.less";
</style>
