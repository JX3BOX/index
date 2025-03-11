<template>
    <div id="app">
        <Header :overlayEnable="true"></Header>
        <div class="m-main">
            <div class="m-left m-sidebar">
                <welcome />
                <news />
                <jx3code />
                <jx3servers />
                <feedback />
                <follow />
            </div>
            <div class="m-primary">
                <live />
                <slider />
                <box />
                <joke />
                <div class="m-primary__main">
                    <div class="m-primary__main-left">
                        <posts />
                        <community />
                    </div>
                    <div class="m-primary__main-right">
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
import news from "@/components/v3/news.vue";
import jx3world from "@/components/v4/jx3world_v4.vue";
import jx3code from "@/components/v3/jx3code.vue";
import jx3servers from "@/components/v3/jx3servers.vue";
import banner from "@/components/v3/banner.vue";
import feedback from "@/components/v3/feedback.vue";
import follow from "@/components/v3/follow.vue";
import joke from "@/components/index/joke.vue";

// 首屏
import live from "@/components/v3/live.vue";
import slider from "@/components/v3/slider.vue";
import box from "@/components/v3/box.vue";
import posts from "@/components/v3/posts.vue";
import community from "@/components/v3/community.vue";

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
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";

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
        jx3servers,
        banner,
        feedback,
        follow,

        // 右侧
        live,
        slider,
        box,
        joke,
        //face,
        posts,
        community,

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
        if (!isMiniProgram()) {
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
@import "~@/assets/css/v3/app.less";
</style>
