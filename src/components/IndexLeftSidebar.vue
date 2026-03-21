<template>
    <aside class="c-index-sidebar" :class="[`c-index-sidebar--${variant}`]">
        <Welcome />
        <News />
        <Jx3code />
        <Followus />
        <Feedback />
    </aside>
</template>

<script>
import Welcome from "@/views/index/components/welcome.vue";
import News from "@/views/index/components/news.vue";
import Jx3code from "@/views/index/components/jx3code.vue";
import Followus from "@/views/index/components/followus.vue";
import Feedback from "@/views/index/components/feedback.vue";

export default {
    name: "IndexLeftSidebar",
    props: {
        variant: {
            type: String,
            default: "default",
        },
    },
    components: {
        Welcome,
        News,
        Jx3code,
        Followus,
        Feedback,
    },
};
</script>

<style lang="less">
.c-index-sidebar {
    width: 100%;
}

.c-index-sidebar--notice {
    .m-news-list {
        li {
            line-height: 26px;
            padding-top: 1px;
            padding-bottom: 1px;
        }
    }
}
</style>
