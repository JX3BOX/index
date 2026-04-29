<template>
    <div class="p-article">
        <div class="m-article-tabs">
            <router-link
                class="m-article-tab"
                v-for="item in tabs"
                :key="item.type"
                :to="{ name: item.type }"
            >
                {{ item.title }}
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
                    title: "用户协议",
                    type: "license",
                },
                {
                    title: "隐私政策",
                    type: "privacy",
                },
                {
                    title: "创作公约",
                    type: "treaty",
                },
                {
                    title: "创作激励",
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
    display: flex;
    align-items: center;
    gap: clamp(40px, 5.56vw, 80px);
    flex: 0 0 auto;
    min-height: 44px;
    margin-bottom: 28px;
}

.m-article-tab {
    color: rgba(255, 255, 255, 0.8);
    font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.35;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s ease, font-size 0.15s ease, font-weight 0.15s ease;

    &:hover,
    &.router-link-exact-active {
        color: #fff;
        font-size: 28px;
        font-weight: 900;
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
        gap: 34px;
        min-height: 32px;
        margin-bottom: 18px;
    }

    .m-article-tab {
        font-size: 16px;

        &:hover,
        &.router-link-exact-active {
            font-size: 19px;
        }
    }

    .m-article-panel {
        border-radius: 16px;
    }
}
</style>
