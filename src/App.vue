<template>
    <div id="app">
        <Header :overlayEnable="true"></Header>
        <div class="m-main">
            <div class="m-left m-sidebar font-sans">
                <!-- <welcome /> -->
                <ai />
                <news />
                <jx3code />
                <download />
                <followus />
                <!-- <jx3servers /> -->
                <feedback />
                <!-- <follow /> -->
            </div>
            <div class="m-primary">
                <live />
                <slider />
                <div class="m-primary__main">
                    <div class="m-primary__main-left">
                        <box />
                        <joke />
                        <activity />
                        <posts />
                    </div>
                    <div class="m-primary__main-right">
                        <minirec />
                        <banner />
                        <jx3world v-if="isStd" />
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
        <festival />

        <forceAlert />
        <importantMsg />
    </div>
</template>

<script>
// 左侧
import welcome from "@/components/v4/welcome.vue";
import jx3servers from "@/components/v3/jx3servers.vue";
import follow from "@/components/v3/follow.vue";

import news from "@/components/v5/news.vue";
import jx3world from "@/components/v4/jx3world_v4.vue";
import jx3code from "@/components/v5/jx3code.vue";
import banner from "@/components/v3/banner.vue";
import feedback from "@/components/v5/feedback.vue";
import ai from "@/components/v5/ai.vue";
import download from "@/components/v5/download.vue";
import followus from "@/components/v5/followus.vue";
// 右侧
import minirec from "@/components/v4/minirec/right.vue";
import joke from "@/components/v5/joke.vue";

// 首屏
import live from "@/components/v3/live.vue";
import slider from "@/components/v3/slider.vue";
import box from "@/components/v5/box.vue";
import posts from "@/components/v5/posts.vue";
import activity from "@/components/v5/activity.vue";

//import face from "@/components/v3/face.vue";
import festival from "@/components/festival/index.vue";
import forceAlert from "@/components/index/force_alert.vue";

import importantMsg from "@/components/v4/important_msg.vue";
import CommonFooter from "./components/common/CommonFooter.vue";

// 系统
import User from "@jx3box/jx3box-common/js/user";
import { getProfile, getMeta } from "@/service/user";
import { getConfig } from "@/service/setting.js";
import _ from "lodash";
import "animate.css";
import driver from "@/utils/driver.js";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "App",
    props: [],
    data: function () {
        return {
            isMobile: window.innerWidth < 1280,
        };
    },
    computed: {
        versions() {
            return "v2";
        },
        isLogin() {
            return User.isLogin();
        },
        isStd() {
            return this.$store.state.client === "std";
        },
    },
    components: {
        // 左侧
        // welcome,
        news,
        jx3world,
        jx3code,
        // jx3servers,
        banner,
        feedback,
        // follow,
        ai,
        download,
        followus,
        // 右侧
        live,
        slider,
        box,
        joke,
        activity,
        //face,
        posts,
        minirec,

        festival,
        forceAlert,
        importantMsg,

        Footer: CommonFooter,
    },
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
            let data = res.data.data;
            let _data = {};
            if (data) {
                data.forEach((item) => {
                    _data[item.key] = item.val;
                });
            }
            this.$store.state.config = _data;
        });
    },
    mounted() {
        if (window.innerWidth <= 1133) {
            const main = document.querySelector(".m-main");
            const footer = document.querySelector(".c-footer");
            main.appendChild(footer);
        }
        if (!isMiniProgram() && !isApp()) {
            this.$nextTick(() => {
                if (this.isLogin) {
                    getMeta("new_user_guide").then((res) => {
                        let val = ~~res.data.data;
                        if (!val) {
                            driver.drive();
                        }
                    });
                } else {
                    const key = "new_user_guide";
                    const isShow = localStorage.getItem(key);
                    if (~~isShow) {
                        return;
                    }
                    driver.drive();
                }
            });
        }

        // 如果路由包含index/feature
        if (location.href.indexOf("index/feature") > -1) {
            location.href = "/notice?tab=feature";
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v5/app.less";
</style>
