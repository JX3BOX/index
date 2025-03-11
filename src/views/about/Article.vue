<template>
    <div class="p-article about-detail-wrapper">
        <div class="detail-title-list">
            <router-link
                class="title-item special-title-item hvr-grow"
                v-for="item in tabs"
                :key="item.type"
                :to="{ name: item.type }"
            >
                {{ item.title }}
            </router-link>
        </div>
        <div class="detail-content-wrap detail-text-wrap">
            <AboutText :customType="active"></AboutText>
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
            active: "",
            list: {
                terms: [
                    {
                        title: "用户协议",
                        type: "license",
                    },
                    {
                        title: "隐私政策",
                        type: "privacy",
                    },
                ],
                creation: [
                    {
                        title: "创作公约",
                        type: "treaty",
                    },
                    {
                        title: "创作激励",
                        type: "incentives",
                    },
                ],
            },
        };
    },
    computed: {
        name() {
            return this.$route.name;
        },
        tabs() {
            return this.list[this.$route.meta.belongs] || [];
        },
    },
    watch: {
        name: {
            handler() {
                this.active = this.tabs[0].type;
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.p-article {
    .detail-title-list {
        gap: 20px;
    }
    .detail-title-list .title-item.router-link-exact-active {
        font-size: 20px !important;
    }
}
</style>
