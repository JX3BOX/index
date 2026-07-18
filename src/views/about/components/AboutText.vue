<template>
    <div class="m-about-text" :class="'m-about-' + type" :aria-busy="loading">
        <div v-if="loading" class="m-about-text__skeleton" aria-hidden="true">
            <span class="u-about-text-skeleton u-about-text-skeleton--title"></span>
            <span class="u-about-text-skeleton u-about-text-skeleton--lead"></span>
            <span class="u-about-text-skeleton u-about-text-skeleton--heading"></span>
            <span
                v-for="item in 10"
                :key="item"
                class="u-about-text-skeleton u-about-text-skeleton--line"
                :class="{ 'is-short': item % 4 === 0, 'is-medium': item % 4 === 3 }"
            ></span>
        </div>
        <div v-else v-html="data"></div>
    </div>
</template>

<script>
import { getArticle } from "@/service/about.js";
export default {
    name: "AboutText",
    data: function () {
        return {
            data: "",
            loading: true,
            requestId: 0,
        };
    },
    computed: {
        id: function () {
            return this.$route.meta.article_id;
        },
        type: function () {
            return this.$route.name || "";
        },
    },
    methods: {
        loadData: function () {
            const requestId = ++this.requestId;
            this.data = "";
            this.loading = Boolean(this.id);
            if (!this.id) return;

            getArticle(this.id)
                .then((data) => {
                    if (requestId === this.requestId) this.data = data;
                })
                .finally(() => {
                    if (requestId === this.requestId) this.loading = false;
                });
        },
    },
    watch: {
        "$route.name": {
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/text.less";

.m-about-text__skeleton {
    width: 100%;
}

.u-about-text-skeleton {
    display: block;
    background: linear-gradient(90deg, rgba(121, 130, 148, 0.1) 25%, rgba(121, 130, 148, 0.2) 37%, rgba(121, 130, 148, 0.1) 63%);
    background-size: 400% 100%;
    animation: about-text-skeleton-loading 1.4s ease infinite;
}

.u-about-text-skeleton--title {
    width: 34%;
    height: 30px;
    margin: 0 auto 32px;
    border-radius: 8px;
}

.u-about-text-skeleton--lead {
    width: 100%;
    height: 78px;
    margin-bottom: 36px;
    border-radius: 10px;
}

.u-about-text-skeleton--heading {
    width: 28%;
    height: 22px;
    margin-bottom: 20px;
    border-radius: 6px;
}

.u-about-text-skeleton--line {
    width: 100%;
    height: 14px;
    margin-bottom: 14px;
    border-radius: 999px;

    &.is-medium {
        width: 82%;
    }

    &.is-short {
        width: 56%;
        margin-bottom: 28px;
    }
}

@keyframes about-text-skeleton-loading {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

@media screen and (min-width: 721px) and (max-width: 1280px) {
    .u-about-text-skeleton--title {
        height: 24px;
        margin-bottom: 26px;
    }

    .u-about-text-skeleton--lead {
        height: 64px;
        margin-bottom: 30px;
    }
}

@media screen and (max-width: @phone) {
    .u-about-text-skeleton--title {
        width: 58%;
        height: 26px;
        margin-bottom: 24px;
    }

    .u-about-text-skeleton--lead {
        height: 88px;
        margin-bottom: 28px;
    }

    .u-about-text-skeleton--heading {
        width: 44%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .u-about-text-skeleton {
        animation: none;
    }
}
</style>
