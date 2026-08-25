<template>
    <section
        v-if="loading || banners.length"
        class="m-index-banner"
        aria-roledescription="carousel"
        :aria-busy="loading"
        @mouseenter="pause"
        @mouseleave="play"
        @focusin="pause"
        @focusout="play"
    >
        <div v-if="loading" class="m-index-banner__skeleton" aria-hidden="true"></div>

        <template v-else>
            <div class="m-index-banner__viewport">
                <div
                    v-for="(item, index) in banners"
                    v-show="index === active"
                    :key="item.ID || index"
                    class="m-index-banner__slide"
                >
                    <iframe
                        v-if="isIframe(item)"
                        class="m-index-banner__iframe"
                        :src="item.link"
                        :title="item.title || 'JX3BOX banner'"
                        loading="lazy"
                        allowfullscreen
                    ></iframe>
                    <a
                        v-else
                        class="m-index-banner__link"
                        :href="item.link || undefined"
                        :target="item.link ? '_blank' : undefined"
                        :rel="item.link ? 'noopener noreferrer' : undefined"
                        :aria-label="item.title || undefined"
                    >
                        <img :src="showImage(item.img)" :alt="item.title || ''" loading="lazy" />
                    </a>
                </div>

                <template v-if="banners.length > 1">
                    <button class="m-index-banner__arrow is-prev" type="button" aria-label="上一张" @click="prev">
                        <i class="el-icon-arrow-left"></i>
                    </button>
                    <button class="m-index-banner__arrow is-next" type="button" aria-label="下一张" @click="next">
                        <i class="el-icon-arrow-right"></i>
                    </button>
                </template>
            </div>

            <div v-if="banners.length > 1" class="m-index-banner__dots" aria-label="轮播图分页">
                <button
                    v-for="(item, index) in banners"
                    :key="item.ID || index"
                    type="button"
                    :class="{ active: index === active }"
                    :aria-label="`第 ${index + 1} 张`"
                    :aria-current="index === active ? 'true' : undefined"
                    @click="setActive(index)"
                ></button>
            </div>
        </template>
    </section>
</template>

<script>
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { getConfigBanner } from "@/service/cms";

const DEV_MOCK_BANNERS = [
    {
        ID: "dev-slider",
        source_type: "link",
        title: "玄府雷动",
        power: 2,
        link: "/event/xuanfuleidong",
        img: "https://cdn.jx3box.com/upload/post/2025/11/9/4011_4010628.png",
    },
    {
        ID: "dev-iframe",
        source_type: "iframe",
        title: "Bilibili 视频演示",
        power: 1,
        link: "//player.bilibili.com/player.html?isOutside=true&aid=478020716&bvid=BV1nK411k716&cid=971857784&p=1",
    },
];

export default {
    name: "IndexSidebarBanner",
    data() {
        return {
            banners: [],
            active: 0,
            loading: true,
            timer: null,
            requestId: 0,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        client() {
            this.loadData();
        },
    },
    mounted() {
        this.loadData();
    },
    beforeUnmount() {
        this.pause();
        this.requestId += 1;
    },
    methods: {
        async loadData() {
            const requestId = ++this.requestId;
            this.loading = true;
            this.pause();
            try {
                const res = await getConfigBanner({
                    client: this.client,
                    type: "banner",
                    subtype: "index",
                    page: 1,
                    per: 8,
                    status: 1,
                });
                if (requestId !== this.requestId) return;
                const list = res?.data?.data?.list || [];
                const banners = this.normalizeBanners(list);
                this.banners = banners.length ? banners : this.getDevMockBanners();
                this.active = 0;
                this.play();
            } catch (e) {
                if (requestId === this.requestId) {
                    this.banners = this.getDevMockBanners();
                    this.active = 0;
                    this.play();
                }
            } finally {
                if (requestId === this.requestId) this.loading = false;
            }
        },
        isIframe(item) {
            return String(item?.source_type || "").toLowerCase() === "iframe";
        },
        normalizeBanners(list) {
            return (Array.isArray(list) ? list : [])
                .filter((item) => item?.img || (this.isIframe(item) && item?.link))
                .sort((a, b) => Number(b?.power || 0) - Number(a?.power || 0));
        },
        getDevMockBanners() {
            if (process.env.NODE_ENV !== "development") return [];
            return this.normalizeBanners(DEV_MOCK_BANNERS.map((item) => ({ ...item })));
        },
        showImage(src) {
            return resolveImagePath(src || "");
        },
        setActive(index) {
            this.active = index;
            this.play();
        },
        prev() {
            this.setActive((this.active - 1 + this.banners.length) % this.banners.length);
        },
        next() {
            this.setActive((this.active + 1) % this.banners.length);
        },
        pause() {
            window.clearInterval(this.timer);
            this.timer = null;
        },
        play() {
            this.pause();
            if (this.banners.length > 1) {
                this.timer = window.setInterval(() => this.next(), 5000);
            }
        },
    },
};
</script>

<style lang="less">
.m-index-banner {
    position: relative;
    margin-bottom: 24px;
    overflow: hidden;
    border: 1px solid rgba(226, 232, 240, 0.9);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);

    &__viewport,
    &__slide,
    &__link,
    &__skeleton {
        position: relative;
        display: block;
        width: 100%;
        aspect-ratio: 16 / 9;
    }

    &__viewport {
        overflow: hidden;
        background: #eef2f7;
    }

    &__slide {
        animation: index-banner-fade 0.35s ease both;
    }

    &__link img,
    &__iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
    }

    &__link img {
        object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    &__link:hover img {
        transform: scale(1.025);
    }

    &__arrow {
        position: absolute;
        top: 50%;
        z-index: 2;
        display: grid;
        width: 30px;
        height: 30px;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, 0.45);
        border-radius: 50%;
        color: #fff;
        background: rgba(15, 23, 42, 0.46);
        opacity: 0;
        cursor: pointer;
        transform: translateY(-50%);
        transition: opacity 0.2s ease, background-color 0.2s ease;

        &:hover {
            background: rgba(15, 23, 42, 0.72);
        }

        &.is-prev {
            left: 10px;
        }

        &.is-next {
            right: 10px;
        }
    }

    &:hover &__arrow,
    &:focus-within &__arrow {
        opacity: 1;
    }

    &__dots {
        position: absolute;
        right: 0;
        bottom: 10px;
        left: 0;
        z-index: 3;
        display: flex;
        justify-content: center;
        gap: 6px;
        pointer-events: none;

        button {
            width: 6px;
            height: 6px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.65);
            box-shadow: 0 1px 4px rgba(15, 23, 42, 0.3);
            cursor: pointer;
            pointer-events: auto;
            transition: width 0.2s ease, background-color 0.2s ease;

            &.active {
                width: 18px;
                background: #fff;
            }
        }
    }

    &__skeleton {
        overflow: hidden;
        background: #eef2f7;

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.7) 50%, transparent 80%);
            animation: index-banner-loading 1.4s infinite;
        }
    }
}

@keyframes index-banner-fade {
    from {
        opacity: 0.45;
    }
    to {
        opacity: 1;
    }
}

@keyframes index-banner-loading {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .m-index-banner__slide,
    .m-index-banner__skeleton::after {
        animation: none;
    }
}
</style>
