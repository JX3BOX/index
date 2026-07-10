<template>
    <div class="m-welcome">
        <el-carousel v-if="banners.length > 1" class="u-calendar-slider" height="100px" :interval="5000" arrow="hover">
            <el-carousel-item v-for="item in banners" :key="item.ID || item.id || item.img">
                <a class="u-calendar-banner" :href="item.link || '/dashboard'" target="_blank">
                    <img :src="resolveBannerImage(item.img)" alt="" />
                </a>
            </el-carousel-item>
        </el-carousel>
        <a v-else-if="banners.length === 1" class="u-calendar-banner" :href="banners[0].link || '/dashboard'" target="_blank">
            <img :src="resolveBannerImage(banners[0].img)" alt="" />
        </a>
        <div v-else class="u-pic" :style="{ backgroundImage: `url(${bg})` }"></div>
        <i class="u-hook u-hook-left"><img src="@/assets/img/index/hook.png" /></i>
        <i class="u-hook u-hook-right"><img src="@/assets/img/index/hook.png" /></i>
        <a v-if="!banners.length" class="u-frame" :href="link" target="_blank"></a>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getConfigBanner, getUserSkin } from "@/service/cms.js";
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
            banners: [],
        };
    },
    mounted: function () {
        this.loadCalendarBanner();
    },
    methods: {
        loadCalendarBanner() {
            getConfigBanner({
                client: "std",
                type: "banner",
                subtype: "calendar",
                status: 1,
                page: 1,
                per: 8,
            })
                .then((res) => {
                    const list = res?.data?.data?.list;
                    this.banners = Array.isArray(list) ? list.filter((item) => item?.img) : [];
                    if (!this.banners.length) {
                        this.loadCalendarSkin();
                    }
                })
                .catch(() => {
                    this.banners = [];
                    this.loadCalendarSkin();
                });
        },
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
        resolveBannerImage(image = "") {
            return resolveImagePath(image);
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
