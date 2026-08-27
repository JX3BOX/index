<template>
    <div class="p-index" v-track-page="analyticsPage">
        <CommonHeader :overlayEnable="true" />
        <div class="m-main" ref="main">
            <div class="m-left m-sidebar">
                <IndexLeftSidebar
                    v-track-id="'index.sidebar'"
                    v-track:exposure.once="{
                        name: 'index_module_exposure',
                        id: 'index.sidebar',
                        props: { module_id: 'sidebar' },
                    }"
                />
            </div>
            <div class="m-primary">
                <Slider
                    v-track-id="'index.slider'"
                    v-track:exposure.once="{
                        name: 'index_module_exposure',
                        id: 'index.slider',
                        props: { module_id: 'slider' },
                    }"
                />
                <div class="m-primary__main">
                    <div class="m-primary__main-left">
                        <Box
                            v-track-id="'index.box'"
                            v-track:exposure.once="{
                                name: 'index_module_exposure',
                                id: 'index.box',
                                props: { module_id: 'box' },
                            }"
                        />
                        <Joke
                            v-track-id="'index.joke'"
                            v-track:exposure.once="{
                                name: 'index_module_exposure',
                                id: 'index.joke',
                                props: { module_id: 'joke' },
                            }"
                        />
                        <Activity
                            v-track-id="'index.activity'"
                            v-track:exposure.once="{
                                name: 'index_module_exposure',
                                id: 'index.activity',
                                props: { module_id: 'activity' },
                            }"
                        />
                        <Posts
                            v-track-id="'index.posts'"
                            v-track:exposure.once="{
                                name: 'index_module_exposure',
                                id: 'index.posts',
                                props: { module_id: 'posts' },
                            }"
                        />
                    </div>
                    <div class="m-primary__main-right">
                        <Jx3world
                            v-track-id="'index.world'"
                            v-track:exposure.once="{
                                name: 'index_module_exposure',
                                id: 'index.world',
                                props: { module_id: 'world' },
                            }"
                        />
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
import { isApp } from "@jx3box/jx3box-common/js/utils";

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
    computed: {
        analyticsPage() {
            return {
                page_key: "index.home",
                layout_version: "index-home-v1",
            };
        },
    },
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

        if (!isApp()) {
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
