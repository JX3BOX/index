<template>
    <div class="m-welcome" :style="{ backgroundImage: bg }">
        <div class="m-assistant">
            <div class="u-assistant">
                <a
                    href="/tool/39410"
                    target="_blank"
                    class="u-btn button button-primary button-rounded"
                    :style="btnStyle.assistant"
                    ><i class="el-icon-download"></i>魔盒助手</a
                >
                <span class="u-label" :style="btnStyle.assistantText"> {{ label }}</span>
            </div>
        </div>
        <calendar :theme="preset"></calendar>
    </div>
</template>

<script>
import calendar from "@/components/v2/calendar.vue";
import { theme } from "../../../setting.json";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { getConfigBanner, getDecoration, getDecorationJson } from "@/service/cms.js";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "assistant",
    components: {
        calendar,
    },
    data: function () {
        return {
            label: "",
            link: "",
            bg: "",
            decorationJson: {},
            preset: null,
            btnStyle: {
                assistant: {},
                assistantText: {},
            },
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        theme: function () {
            return theme[this.client];
        },
    },

    methods: {
        loadData: function () {
            // TODO: 新接口，此处可能需要修改
            return getBreadcrumb("index_jba").then((data) => {
                this.label = data;
            });
        },
        loadBackGround: function () {
            // 日历背景图
            getConfigBanner({
                type: "common",
                subtype: "jba",
                client: this.client,
                status: 1
            }).then((res) => {
                const url = resolveImagePath(res.data.data.list[0]?.img);
                if (url) {
                    this.bg = `url(${url})`;
                } else {
                    if (User.isLogin()) {
                        this.getDecoration();
                    } else {
                        this.setDefaultCalendar();
                    }
                }
            });
        },
        showDecoration: function (val, type) {
            return __cdn + `design/decoration/images/${val}/${type}.png`;
        },
        setDefaultCalendar() {
            this.bg = `url(${__cdn}design/decoration/images/0_TESTSAMPLE/calendar.png)`;
        },
        getDecorationJson() {
            let decorationJson = sessionStorage.getItem("decoration_json");
            if (decorationJson) {
                this.decorationJson = JSON.parse(decorationJson);
                return;
            }
            getDecorationJson().then((data) => {
                sessionStorage.setItem("decoration_json", JSON.stringify(data.data));
                this.decorationJson = data.data;
            });
        },
        getDecoration() {
            let decoration_calendar = sessionStorage.getItem("decoration_calendar");
            if (decoration_calendar == "no") {
                this.setDefaultCalendar();
                return;
            }
            //已有缓存，读取解析
            if (decoration_calendar) {
                this.setDecoration(JSON.parse(decoration_calendar));
                return;
            }
            getDecoration({ using: 1, type: "calendar" }).then((data) => {
                let res = data.data.data;
                if (res.length == 0) {
                    //空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem("decoration_calendar", "no");
                    //设置默认背景图
                    this.setDefaultCalendar();
                    return;
                }
                sessionStorage.setItem("decoration_calendar", JSON.stringify(res[0]));
                this.setDecoration(res[0]);
            });
        },
        setDecoration(decoration_calendar) {
            let preset = this.decorationJson[decoration_calendar.val];
            this.$set(this, "preset", preset);
            if (preset.buttoncolor) {
                this.$set(this.btnStyle.assistant, "background-color", preset.buttoncolor);
                this.$set(this.btnStyle.assistant, "border-color", preset.buttoncolor);
                this.$set(this.btnStyle.assistantText, "background-color", preset.buttoncolor);
                this.$set(this.btnStyle.assistantText, "border-color", preset.buttoncolor);
            }
            if (preset.buttontextcolor) {
                this.$set(this.btnStyle.assistant, "color", preset.buttontextcolor);
                this.$set(this.btnStyle.assistantText, "color", preset.buttontextcolor);
            }
            this.bg = `url(${this.showDecoration(decoration_calendar.val, "calendar")})`;
        },
    },
    created() {
        this.getDecorationJson();
    },
    mounted: function () {
        this.loadData();
        this.loadBackGround();
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/assistant.less";
</style>
