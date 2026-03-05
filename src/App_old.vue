<template>
    <div id="app">
        <Header :overlayEnable="true"></Header>
        <div class="m-main">
            <div class="m-left m-sidebar">
                <welcome />
                <news />
                <jx3code />
                <ai />
                <followus />
                <feedback />
            </div>
            <div class="m-primary">
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
                        <!-- <jx3servers /> -->
                        <banner />
                        <jx3world v-if="isStd" />
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </div>
        <festival />

        <forceAlert />
        <importantMsg />
    </div>
</template>

<script>
// 左侧
import welcome from "@/components/v4/welcome.vue";
import news from "@/components/v4/news.vue";
import jx3world from "@/components/v4/jx3world_v4.vue";
import jx3code from "@/components/v4/jx3code.vue";
import ai from "@/components/v5/ai.vue";
import followus from "@/components/v5/followus.vue";
import feedback from "@/components/v5/feedback.vue";

// 中间
import slider from "@/components/v4/slider.vue";
import box from "@/components/v5/box.vue";
import joke from "@/components/v4/joke.vue";
import activity from "@/components/v5/activity.vue";
import posts from "@/components/v5/posts.vue";

// 右侧
// import jx3servers from "@/components/v3/jx3servers.vue";
import minirec from "@/components/v4/minirec/right.vue";
//import face from "@/components/v3/face.vue";
import festival from "@/components/festival/index.vue";
import forceAlert from "@/components/index/force_alert.vue";

import importantMsg from "@/components/v4/important_msg.vue";

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
        welcome,
        news,
        jx3world,
        jx3code,
        ai,
        followus,

        feedback,

        // 中间
        slider,
        box,
        joke,
        activity,
        posts,

        // 右侧
        minirec,
        // jx3servers,
        festival,
        forceAlert,
        importantMsg,
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
@import "~@/assets/css/v4/app.less";
</style>
