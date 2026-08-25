<template>
    <div class="p-download">
        <CommonHeader :overlayEnable="true" />

        <main class="m-download">
            <section class="m-download-hero">
                <div class="m-download-hero__content">
                    <div class="u-download-eyebrow">
                        <span class="u-download-eyebrow__dot"></span>
                        {{ $t("download.hero.eyebrow") }}
                    </div>
                    <h1>{{ $t("download.hero.title") }}</h1>
                    <p>{{ $t("download.hero.description") }}</p>
                    <div class="m-download-hero__meta">
                        <span><el-icon><CircleCheck /></el-icon>{{ $t("download.hero.free") }}</span>
                        <span><el-icon><Refresh /></el-icon>{{ $t("download.hero.sync") }}</span>
                        <span><el-icon><Lock /></el-icon>{{ $t("download.hero.secure") }}</span>
                    </div>
                </div>

                <div class="m-download-hero__visual" aria-hidden="true">
                    <span class="u-visual-glow u-visual-glow--purple"></span>
                    <span class="u-visual-glow u-visual-glow--yellow"></span>
                    <div class="u-device-preview">
                        <img :src="appPreviewUrl" alt="" fetchpriority="high" />
                    </div>
                    <div class="u-app-identity">
                        <span class="u-app-identity__logo" aria-hidden="true">
                            <img :src="brandLogo" alt="" />
                        </span>
                        <div>
                            <strong>剑网3魔盒</strong>
                            <span>JX3BOX官方应用</span>
                        </div>
                    </div>
                    <span class="u-platform-float u-platform-float--android">
                        <img :src="platformIcons.android" alt="" />
                    </span>
                    <span class="u-platform-float u-platform-float--apple">
                        <img :src="platformIcons.apple" alt="" />
                    </span>
                    <span class="u-platform-float u-platform-float--harmony">
                        <img :src="platformIcons.harmony" alt="" />
                    </span>
                </div>
            </section>

            <section class="m-download-section" aria-labelledby="download-platform-title">
                <div class="m-download-section__head">
                    <div>
                        <span class="u-section-kicker">{{ $t("download.available.kicker") }}</span>
                        <h2 id="download-platform-title">{{ $t("download.available.title") }}</h2>
                    </div>
                    <p>{{ $t("download.available.description") }}</p>
                </div>

                <div class="m-download-platforms">
                    <section class="m-android-group" aria-labelledby="android-download-title">
                        <div class="m-android-direct">
                            <div class="m-android-direct__icon u-platform-icon is-android">
                                <img :src="platformIcons.android" alt="" />
                            </div>
                            <div class="m-android-direct__content">
                                <div class="m-platform-title-line">
                                    <span class="u-platform-overline">ANDROID · OFFICIAL APK</span>
                                    <span class="u-status u-status--online">
                                        <i></i>{{ $t("download.status.available") }}
                                    </span>
                                </div>
                                <h3 id="android-download-title">{{ androidPlatform.name }}</h3>
                                <p>{{ androidPlatform.description }}</p>
                                <div class="m-android-direct__meta">
                                    <span v-if="appVersion"><el-icon><CollectionTag /></el-icon>{{ appVersion }}</span>
                                    <span><el-icon><Cellphone /></el-icon>Android 10+</span>
                                </div>
                            </div>
                            <a
                                class="u-download-button u-download-button--primary"
                                :class="{ 'is-disabled': !androidPlatform.url || configLoading }"
                                :href="androidPlatform.url || undefined"
                                :aria-disabled="!androidPlatform.url || configLoading"
                                @click="handleDownloadClick($event, androidPlatform)"
                            >
                                <span class="u-download-button__label">{{ getDownloadButtonText(androidPlatform) }}</span>
                                <svg
                                    class="u-download-button__ribbons"
                                    viewBox="0 0 320 56"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <defs>
                                        <linearGradient id="download-ribbon-light" x1="0" y1="0" x2="320" y2="0">
                                            <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
                                            <stop offset="0.2" stop-color="#ffffff" stop-opacity="0.13" />
                                            <stop offset="0.58" stop-color="#ffffff" stop-opacity="0.2" />
                                            <stop offset="0.86" stop-color="#ffffff" stop-opacity="0.09" />
                                            <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
                                        </linearGradient>
                                        <linearGradient id="download-ribbon-warm" x1="0" y1="0" x2="320" y2="0">
                                            <stop offset="0" stop-color="#ffe9a6" stop-opacity="0" />
                                            <stop offset="0.3" stop-color="#ffe9a6" stop-opacity="0.09" />
                                            <stop offset="0.72" stop-color="#ffe9a6" stop-opacity="0.15" />
                                            <stop offset="1" stop-color="#ffe9a6" stop-opacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        class="is-primary"
                                        stroke="url(#download-ribbon-light)"
                                        d="M-36 44 C24 2 80 0 126 31 C171 61 224 58 274 24 C300 7 326 4 356 10"
                                    />
                                    <path
                                        class="is-secondary"
                                        stroke="url(#download-ribbon-warm)"
                                        d="M-34 11 C30 47 88 64 144 30 C197 -2 250 2 294 35 C317 52 340 51 360 44"
                                    />
                                    <g transform="translate(205 12)">
                                        <path
                                            class="u-download-button__sparkle is-sparkle-a"
                                            d="M0 -5 C0 -1.6 -1.6 0 -5 0 C-1.6 0 0 1.6 0 5 C0 1.6 1.6 0 5 0 C1.6 0 0 -1.6 0 -5Z"
                                        />
                                    </g>
                                    <g transform="translate(252 42)">
                                        <path
                                            class="u-download-button__sparkle is-sparkle-b"
                                            d="M0 -3.6 C0 -1.1 -1.1 0 -3.6 0 C-1.1 0 0 1.1 0 3.6 C0 1.1 1.1 0 3.6 0 C1.1 0 0 -1.1 0 -3.6Z"
                                        />
                                    </g>
                                    <g transform="translate(174 47)">
                                        <path
                                            class="u-download-button__sparkle is-sparkle-c"
                                            d="M0 -2.6 C0 -0.8 -0.8 0 -2.6 0 C-0.8 0 0 0.8 0 2.6 C0 0.8 0.8 0 2.6 0 C0.8 0 0 -0.8 0 -2.6Z"
                                        />
                                    </g>
                                </svg>
                                <el-icon v-if="configLoading" class="u-download-button__icon is-loading">
                                    <Loading />
                                </el-icon>
                                <el-icon v-else class="u-download-button__icon"><Bottom /></el-icon>
                            </a>
                        </div>

                        <div class="m-android-stores">
                            <div class="m-android-stores__head">
                                <div>
                                    <span class="u-platform-overline">ANDROID STORES</span>
                                    <h3>{{ $t("download.coming.title") }}</h3>
                                </div>
                                <p>{{ $t("download.coming.description") }}</p>
                            </div>
                            <div class="m-store-list">
                                <div v-for="store in androidStores" :key="store.key" class="m-store-item">
                                    <span class="u-store-icon-wrap">
                                        <img v-if="store.icon" class="u-store-icon" :src="store.icon" alt="" />
                                        <span v-else class="u-store-mark" :class="`is-${store.key}`">{{ store.mark }}</span>
                                    </span>
                                    <div>
                                        <strong>{{ store.name }}</strong>
                                        <span class="u-store-state"><i></i>{{ $t("download.status.comingSoon") }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <article
                        v-for="platform in secondaryPlatforms"
                        :key="platform.key"
                        class="m-platform-card"
                        :class="`is-${platform.key}`"
                    >
                        <div class="m-platform-card__top">
                            <div class="u-platform-icon" :class="`is-${platform.key}`">
                                <img :src="platform.icon" alt="" />
                            </div>
                            <span class="u-status u-status--online">
                                <i></i>{{ $t("download.status.available") }}
                            </span>
                        </div>
                        <div class="m-platform-card__body">
                            <span class="u-platform-overline">{{ platform.overline }}</span>
                            <h3>{{ platform.name }}</h3>
                            <p>{{ platform.description }}</p>
                        </div>
                        <a
                            class="u-download-button"
                            :class="{ 'is-disabled': !platform.url || configLoading }"
                            :href="platform.url || undefined"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-disabled="!platform.url || configLoading"
                            @click="handleDownloadClick($event, platform)"
                        >
                            <span>{{ getDownloadButtonText(platform) }}</span>
                            <el-icon v-if="configLoading" class="is-loading"><Loading /></el-icon>
                            <el-icon v-else><ArrowRight /></el-icon>
                        </a>
                    </article>
                </div>
            </section>

            <section class="m-download-note">
                <div class="u-download-note__icon"><el-icon><Promotion /></el-icon></div>
                <div>
                    <h2>{{ $t("download.note.title") }}</h2>
                    <p>{{ $t("download.note.description") }}</p>
                </div>
                <a href="/dashboard/feedback" target="_blank" rel="noopener noreferrer">
                    {{ $t("download.note.action") }}<el-icon><ArrowRight /></el-icon>
                </a>
            </section>
        </main>

        <CommonFooter />
    </div>
</template>

<script>
import { getGlobalConfig } from "@jx3box/jx3box-ui/service/header";

export default {
    name: "Download",
    data: function () {
        return {
            appConfig: {},
            configLoading: true,
            brandLogo: require("@/assets/img/common/logo_v2.svg"),
            appPreviewUrl: require("@/assets/img/download/kv/app-phone-hero.png"),
            platformIcons: {
                apple: require("@jx3box/jx3box-ui/assets/img/common/ios.svg"),
                harmony: require("@jx3box/jx3box-ui/assets/img/common/harmony.svg"),
                android: require("@jx3box/jx3box-ui/assets/img/common/android.svg"),
            },
            androidStores: [
                {
                    key: "google",
                    icon: require("@/assets/img/download/stores/google-play.svg"),
                    name: "Google Play",
                },
                {
                    key: "xiaomi",
                    icon: require("@/assets/img/download/stores/xiaomi.svg"),
                    name: "小米应用商店",
                },
                {
                    key: "vivo",
                    icon: require("@/assets/img/download/stores/vivo.svg"),
                    name: "vivo 应用商店",
                },
                {
                    key: "oppo",
                    icon: require("@/assets/img/download/stores/oppo.svg"),
                    name: "OPPO 软件商店",
                },
                { key: "honor", mark: "H", name: "荣耀应用市场" },
            ],
        };
    },
    computed: {
        appVersion() {
            return this.appConfig.app_versions || "";
        },
        androidPlatform() {
            return {
                key: "android",
                name: this.$t("download.available.androidName"),
                description: this.$t("download.available.androidDescription"),
                button: this.$t("download.available.androidAction"),
                icon: this.platformIcons.android,
                url: this.appConfig.android_apk || "",
            };
        },
        secondaryPlatforms() {
            return [
                {
                    key: "apple",
                    overline: "iPhone & iPad",
                    name: "App Store",
                    description: this.$t("download.available.appleDescription"),
                    button: this.$t("download.available.appleAction"),
                    icon: this.platformIcons.apple,
                    url: this.appConfig.apple_url || "",
                },
                {
                    key: "harmony",
                    overline: "HarmonyOS NEXT",
                    name: this.$t("download.available.harmonyName"),
                    description: this.$t("download.available.harmonyDescription"),
                    button: this.$t("download.available.harmonyAction"),
                    icon: this.platformIcons.harmony,
                    url: this.appConfig.harmony_url || "",
                },
            ];
        },
    },
    mounted() {
        this.loadAppConfig();
    },
    methods: {
        loadAppConfig() {
            this.configLoading = true;
            getGlobalConfig()
                .then((config) => {
                    this.appConfig = config || {};
                })
                .catch(() => {
                    this.appConfig = {};
                })
                .finally(() => {
                    this.configLoading = false;
                });
        },
        handleDownloadClick(event, platform) {
            if (this.configLoading || !platform.url) event.preventDefault();
        },
        getDownloadButtonText(platform) {
            if (this.configLoading) return this.$t("download.status.loading");
            if (!platform.url) return this.$t("download.status.maintaining");
            return platform.button;
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/download/index.less";
</style>
