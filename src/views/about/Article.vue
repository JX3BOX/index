<template>
    <div class="p-article" :class="`is-${$i18n.locale}`">
        <div class="m-article-tabs">
            <router-link
                class="m-article-tab"
                v-for="item in tabs"
                :key="item.type"
                :to="{ name: item.type }"
            >
                {{ $t(item.titleKey) }}
            </router-link>
        </div>
        <div class="m-article-panel">
            <AboutText></AboutText>
        </div>
    </div>
</template>

<script>
import AboutText from "./components/AboutText.vue";

export default {
    name: "Article",
    components: { AboutText },
    data() {
        return {
            tabs: [
                {
                    titleKey: "about.routes.license",
                    type: "license",
                },
                {
                    titleKey: "about.routes.privacy",
                    type: "privacy",
                },
                {
                    titleKey: "about.routes.treaty",
                    type: "treaty",
                },
                {
                    titleKey: "about.routes.incentives",
                    type: "incentives",
                },
            ],
        };
    },
};
</script>

<style lang="less">
.p-article {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.m-article-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: center;
    gap: clamp(12px, 2vw, 32px);
    flex: 0 0 auto;
    min-height: 44px;
    margin-bottom: 28px;
}

.m-article-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-width: 0;
    color: rgba(255, 255, 255, 0.64);
    font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
    font-size: 22px;
    font-weight: 500;
    line-height: 1.35;
    text-decoration: none;
    white-space: nowrap;
    transition: none;

    &:hover,
    &.router-link-exact-active {
        color: #fff;
        font-size: 24px;
        font-weight: 700;
    }
}

.p-article.is-en-US,
.p-article.is-vi {
    .m-article-tabs {
        gap: 12px;
    }

    .m-article-tab {
        padding: 0 4px;
        box-sizing: border-box;
        font-size: clamp(14px, 1.25vw, 18px);
        line-height: 1.2;
        text-align: center;
        white-space: normal;

        &:hover,
        &.router-link-exact-active {
            font-size: clamp(15px, 1.4vw, 20px);
        }
    }
}

.m-article-panel {
    flex: 1 1 auto;
    min-height: 0;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
    overflow: hidden;
}

@media screen and (min-width: 721px) and (max-width: 1280px) {
    .m-article-tabs {
        gap: 10px;
        min-height: 32px;
        margin-bottom: 18px;
    }

    .m-article-tab {
        width: 100%;
        font-size: 14px;

        &:hover,
        &.router-link-exact-active {
            font-size: 16px;
        }
    }

    .p-article.is-en-US,
    .p-article.is-vi {
        .m-article-tab {
            font-size: 12px;

            &:hover,
            &.router-link-exact-active {
                font-size: 13px;
            }
        }
    }

    .m-article-panel {
        border-radius: 16px;
    }
}
</style>
