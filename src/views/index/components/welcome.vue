<template>
    <div class="m-welcome">
        <div class="u-pic" :style="{ backgroundImage: `url(${bg})`, backgroundPosition: bgPosition }"></div>
        <i class="u-hook u-hook-left"><img src="@/assets/img/index/hook.png" /></i>
        <i class="u-hook u-hook-right"><img src="@/assets/img/index/hook.png" /></i>
        <a class="u-frame" :href="link" target="_blank"></a>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getConfigBanner, getUserDecoration } from "@/service/cms.js";
import { getUserConfig } from "@/service/user";

const { __cdn } = JX3BOX;

const DECORATION_KEY = "user_decoration_calendar_v2";
const DEFAULT_DECORATION_IMAGE = `${__cdn}design/decoration/images/0_TESTSAMPLE/calendar.png`;
const DEFAULT_DECORATION_POSITION = "center top";
const DECORATION_POSITION = {
    lt: "left top",
    rt: "right top",
    lb: "left bottom",
    rb: "right bottom",
    ct: "center top",
    cc: "center center",
    cb: "center bottom",
};
export default {
    name: "IndexWelcomeV4",
    components: {},
    data: function () {
        return {
            // 主题背景
            bg: DEFAULT_DECORATION_IMAGE,
            bgPosition: DEFAULT_DECORATION_POSITION,
            link: "/dashboard",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    mounted: function () {
        this.loadDecoration();
    },
    methods: {
        // 主题
        // ========================
        // A.加载公共主题
        loadDecoration: function () {
            // 1.是否存在活动-日历背景图
            getConfigBanner({
                type: "banner",
                subtype: "calendar",
                client: this.client,
                status: 1,
            }).then((res) => {
                // 2.存在活动，使用活动主题
                const url = resolveImagePath(res.data.data.list[0]?.img);
                if (url) {
                    this.bg = url;
                    const link = res.data.data.list[0]?.link;
                    if (link) {
                        this.link = link;
                    }
                } else {
                    // 3.不存在活动，使用用户主题
                    if (User.isLogin()) {
                        this.loadUserDecoration();
                        this.loadUserConfig();
                    }
                }
            });
        },
        // B.加载用户主题
        loadUserDecoration() {
            const decoration_calendar = sessionStorage.getItem(DECORATION_KEY);

            // 1.已缓存设置为无主题
            if (decoration_calendar == "NULL") {
                this.applyDefaultDecoration();
                return;
            }

            // 2.已有缓存用户主题
            if (decoration_calendar) {
                try {
                    if (!this.applyDecoration(JSON.parse(decoration_calendar))) {
                        this.applyDefaultDecoration();
                    }
                    return;
                } catch (e) {
                    sessionStorage.removeItem(DECORATION_KEY);
                }
            }

            // 3.无缓存则请求服务端最新设置
            getUserDecoration({ using: 1, type: "calendar", subtype: "pc_calendar" }).then((res) => {
                const decoration = res?.data?.data?.[0];
                const decorationItem = this.resolveDecorationItem(decoration);

                // 1.有 则使用v2装扮记录中的图片与位置
                if (decorationItem?.image) {
                    this.applyDecoration(decoration);
                    sessionStorage.setItem(DECORATION_KEY, JSON.stringify(decoration));
                } else {
                    // 2.空 则为无主题，不再加载接口
                    this.applyDefaultDecoration();
                    sessionStorage.setItem(DECORATION_KEY, "NULL");
                }
            });
        },

        applyDefaultDecoration() {
            this.bg = DEFAULT_DECORATION_IMAGE;
            this.bgPosition = DEFAULT_DECORATION_POSITION;
        },

        applyDecoration(decoration) {
            const decorationItem = this.resolveDecorationItem(decoration);
            const image = this.resolveDecorationImage(decorationItem?.image);
            if (!image) {
                return false;
            }

            this.bg = image;
            this.bgPosition = this.resolveDecorationPosition(decorationItem?.position);
            return true;
        },

        resolveDecorationItem(decoration) {
            const decorations = Array.isArray(decoration?.decorations)
                ? decoration.decorations
                : Array.isArray(decoration?.decoration)
                ? decoration.decoration
                : [];
            if (decorations.length) {
                return {
                    ...decoration,
                    ...(decorations.find((item) => item?.image) || decorations[0]),
                };
            }
            return {
                ...decoration,
                ...decoration?.decoration,
            };
        },

        resolveDecorationImage(image) {
            if (!image) {
                return "";
            }

            const markdownLink = String(image).match(/\]\(([^)]+)\)/);
            const url = markdownLink?.[1] || image;
            if (url.startsWith("/")) {
                return resolveImagePath(__cdn + url.replace(/^\/+/, ""));
            }
            return resolveImagePath(url);
        },

        resolveDecorationPosition(position) {
            return DECORATION_POSITION[position] || DEFAULT_DECORATION_POSITION;
        },

        // D.获取用户配置
        // ========================
        loadUserConfig() {
            getUserConfig().then((res) => {
                if (res.data.data) {
                    this.link = res.data.data.fav_link || "/dashboard";
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/index/welcome.less";
</style>
