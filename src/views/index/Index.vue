<template>
    <div class="p-index">
        <CommonHeader :overlayEnable="true" />
        <div class="m-main">
            <div class="m-left m-sidebar">
                <Welcome />
                <News />
                <Jx3code />
                <!-- <Ai style="display: none" /> -->
                <Followus />
                <Feedback />
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

        <Festival />
        <ForceAlert />
        <ImportantMsg />
    </div>
</template>

<script>

// 左侧
import Welcome from "./components/welcome.vue";
import News from "./components/news.vue";
import Jx3code from "./components/jx3code.vue";
// import Ai from "./components/ai.vue";
import Followus from "./components/followus.vue";
import Feedback from "./components/feedback.vue";

// 中间
import Slider from "./components/slider.vue";
import Box from "./components/box.vue";
import Joke from "./components/joke.vue";
import Activity from "./components/activity.vue";
import Posts from "./components/posts.vue";

// 右侧
import Jx3world from "./components/jx3world.vue";

// 公共
import Festival from "./components/index.vue";
import ForceAlert from "./components/force_alert.vue";
import ImportantMsg from "./components/important_msg.vue";

import User from "@/config/js/user";
import { getProfile, getMeta } from "@/service/user";
import { getConfig } from "@/service/setting.js";
import driver from "@/utils/driver.js";
import { isMiniProgram, isApp } from "@/config/js/utils";

export default {
    name: "Index",
    props: [],
    components: {
        Welcome,
        News,
        Jx3code,
        // Ai,
        Followus,
        Feedback,

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
        };
    },
    computed: {},
    watch: {},
    methods: {},
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
        if (window.innerWidth <= 1133) {
            const main = document.querySelector(".m-main");
            const footer = document.querySelector(".c-footer");
            if (main && footer) main.appendChild(footer);
        }
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
};
</script>

<style lang="less">
@import "@/assets/css/views/index/app.less";
</style>
