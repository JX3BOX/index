<template>
    <div class="m-welcome">
        <div class="u-pic" :style="{ backgroundImage: `url(${bg})` }"></div>
        <i class="u-hook u-hook-left"><img src="@/assets/img/calendar/hook-2.png" /></i>
        <i class="u-hook u-hook-right"><img src="@/assets/img/calendar/hook-2.png" /></i>
        <a class="u-frame" :href="link" target="_blank"></a>
    </div>
</template>

<script>
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getConfigBanner, getUserDecoration, getPublicDecoration } from "@/service/cms.js";
import { getUserConfig } from "@/service/user"

const DECORATION_KEY = "user_decoration_calendar";
const DECORATION_LIST = "public_decoration";
export default {
    name: "IndexWelcomeV4",
    components: {},
    data: function () {
        return {
            // 主题背景
            bg: `${__cdn}design/decoration/images/0_TESTSAMPLE/calendar.png`,
            user_decoration: "",

            // 主题信息
            public_decoration: "",
            link: "/dashboard",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    watch: {
        user_decoration(val) {
            // 如果设置值为空，则退回使用默认值
            if (val) {
                const webp = ["jx3box-birthday-5"];
                this.bg = __cdn + `design/decoration/images/${val}/calendar.${webp.includes(val) ? "webp" : "png"}`;
                this.renderDecoration(val);
            }
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
            let decoration_calendar = sessionStorage.getItem(DECORATION_KEY);

            // 1.已缓存设置为无主题
            if (decoration_calendar == "NULL") {
                return;
            }

            // 2.已有缓存用户主题
            if (decoration_calendar) {
                this.user_decoration = decoration_calendar;
                return;
            }

            // 3.无缓存则请求服务端最新设置
            getUserDecoration({ using: 1, type: "calendar" }).then((res) => {
                decoration_calendar = res?.data?.data?.[0]?.["val"];

                // 1.有 则为有主题，界面设对应主题KEY
                if (decoration_calendar) {
                    this.user_decoration = decoration_calendar;
                    sessionStorage.setItem(DECORATION_KEY, decoration_calendar);
                } else {
                    // 2.空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem(DECORATION_KEY, "NULL");
                }
            });
        },

        // C.渲染主题配色
        // ========================
        renderDecoration() {
            // 1.本地缓存探测
            const public_decoration = sessionStorage.getItem(DECORATION_LIST);
            if (public_decoration) {
                try {
                    this.public_decoration = JSON.parse(public_decoration);
                } catch (e) {
                    console.log("[renderDecoration|公共装扮数据本地已损坏]:", e);
                }
                // 2.重新服务器同步
            } else {
                getPublicDecoration().then((res) => {
                    this.public_decoration = res?.data || [];
                    sessionStorage.setItem(DECORATION_LIST, JSON.stringify(this.public_decoration));
                });
            }
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
@import "~@/assets/css/v4/welcome.less";
</style>
