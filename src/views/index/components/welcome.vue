<template>
    <div class="m-welcome">
        <div class="u-pic" :style="{ backgroundImage: `url(${bg})` }"></div>
        <i class="u-hook u-hook-left"><img src="@/assets/img/index/hook.png" /></i>
        <i class="u-hook u-hook-right"><img src="@/assets/img/index/hook.png" /></i>
        <a class="u-frame" :href="link" target="_blank"></a>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getUserSkin } from "@/service/cms.js";
import { getUserConfig } from "@/service/user";

const { __cdn } = JX3BOX;

const DEFAULT_CALENDAR_SKIN = `${__cdn}design/skin/default/pc_calendar.png`;
const PC_CALENDAR_SUBTYPE = "pc_calendar";

export default {
    name: "IndexWelcomeV4",
    components: {},
    data: function () {
        return {
            bg: DEFAULT_CALENDAR_SKIN,
            link: "/dashboard",
        };
    },
    mounted: function () {
        this.loadCalendarSkin();
    },
    methods: {
        loadCalendarSkin() {
            this.bg = DEFAULT_CALENDAR_SKIN;
            if (!User.isLogin()) {
                return;
            }

            const uid = User.getInfo()?.uid;
            if (!uid) {
                return;
            }

            this.loadUserConfig();
            getUserSkin({ user_id: uid })
                .then((res) => {
                    const skins = this.getSkinParts(res?.data?.data);
                    const calendarSkin = this.selectSkinPart(skins, PC_CALENDAR_SUBTYPE);
                    const image = this.resolveSkinImage(this.getSkinImage(calendarSkin));
                    if (image) {
                        this.bg = image;
                    }
                })
                .catch(() => {
                    this.bg = DEFAULT_CALENDAR_SKIN;
                });
        },
        getSkinParts(data) {
            const rows = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : [];
            return rows.reduce((list, row) => {
                if (Array.isArray(row?.skins)) {
                    return list.concat(row.skins);
                }
                if (row?.subtype) {
                    list.push(row);
                }
                return list;
            }, []);
        },
        selectSkinPart(skins, subtype) {
            const list = (skins || []).filter((item) => item?.subtype === subtype && this.getSkinImage(item));
            if (!list.length) {
                return null;
            }
            const theme = this.getCurrentTheme();
            return (
                list.find((item) => this.normalizeTheme(item.theme) === "all") ||
                list.find((item) => this.normalizeTheme(item.theme) === theme) ||
                list.find((item) => !item.theme) ||
                null
            );
        },
        getSkinImage(item) {
            return item?.image || item?.img || item?.url || "";
        },
        normalizeTheme(theme) {
            return String(theme || "")
                .trim()
                .toLowerCase();
        },
        getCurrentTheme() {
            const html = document?.documentElement;
            const body = document?.body;
            const theme =
                html?.dataset?.theme ||
                body?.dataset?.theme ||
                localStorage.getItem("__theme") ||
                localStorage.getItem("theme") ||
                "";
            if (String(theme).toLowerCase() === "dark") {
                return "dark";
            }
            if (html?.classList?.contains("dark") || body?.classList?.contains("dark")) {
                return "dark";
            }
            return "light";
        },
        resolveSkinImage(image = "") {
            const raw = String(image || "").trim();
            if (!raw) {
                return "";
            }
            if (/^https?:\/\//i.test(raw) || raw.startsWith("//")) {
                return resolveImagePath(raw);
            }
            const cdnBase = String(__cdn || "https://cdn.jx3box.com/").replace(/\/+$/, "");
            return resolveImagePath(`${cdnBase}/${raw.replace(/^\/+/, "")}`);
        },

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
