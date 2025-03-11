<template>
    <div class="m-welcome" :style="{ backgroundImage: `url(${bg})` }">
        <div class="m-code" v-for="(item, i) in data" :key="i">
            <div class="u-code" @click="copy(item.title)" v-if="item.title">
                <span :style="{ backgroundColor: preset.buttoncolor, color: item.color || preset.buttontextcolor }">{{
                    item.title
                }}</span>
            </div>
            <div class="u-desc" v-if="item.desc">
                <span>{{ item.desc }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getConfigBanner, getUserDecoration, getPublicDecoration } from "@/service/cms.js";

const DECORATION_KEY = "user_decoration_calendar";
const DECORATION_LIST = "public_decoration";
export default {
    name: "IndexWelcome",
    components: {},
    data: function () {
        return {
            // 激活码
            data: [
                {
                    title: "",
                    desc: "",
                    color: "",
                },
            ],

            // 主题背景
            bg: `${__cdn}design/decoration/images/0_TESTSAMPLE/calendar.png`,
            user_decoration: "",

            // 主题信息
            public_decoration: "",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        // 主题配色提取
        preset: function ({ public_decoration, user_decoration }) {
            const _preset = public_decoration?.[user_decoration];
            if (_preset) {
                return {
                    buttoncolor: _preset.buttoncolor || "#000",
                    buttontextcolor: _preset.buttontextcolor || "#fff",
                };
            } else {
                return {
                    buttoncolor: "#000",
                    buttontextcolor: "#fff",
                };
            }
        },
    },
    methods: {
        // 激活码
        // ========================
        // 复制
        copy(text) {
            navigator.clipboard.writeText(text);
            this.$message({
                message: "复制成功",
                type: "success",
            });
        },
        // 加载
        loadCode() {
            // 激活码
            getConfigBanner({ client: this.client, type: "code", status: 1, _valid: 1 }).then((res) => {
                this.data = res?.data?.data?.list || [];
            });
        },

        // 主题
        // ========================
        // A.加载公共主题
        loadDecoration: function () {
            // 1.是否存在活动-日历背景图
            getConfigBanner({
                type: "common",
                subtype: "jba",
                client: this.client,
                status: 1,
            }).then((res) => {
                // 2.存在活动，使用活动主题
                const url = resolveImagePath(res.data.data.list[0]?.img);
                if (url) {
                    this.bg = url;
                } else {
                    // 3.不存在活动，使用用户主题
                    if (User.isLogin()) {
                        this.loadUserDecoration();
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
    },
    watch: {
        user_decoration(val) {
            // 如果设置值为空，则退回使用默认值
            if (val) {
                this.bg = __cdn + `design/decoration/images/${val}/calendar.png`;
                this.renderDecoration(val);
            }
        },
    },
    mounted: function () {
        // this.loadCode();
        this.loadDecoration();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v3/welcome.less";
</style>
