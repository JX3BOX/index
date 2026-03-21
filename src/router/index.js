import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        name: "index",
        path: "/",
        component: () => import("@/views/index/Index.vue"),
        meta: {
            i18n: {
                title: "pages.index.title",
                keywords: "pages.index.keywords",
                description: "pages.index.description",
            },
        },
    },
    {
        name: "tv",
        path: "/tv",
        component: () => import("@/views/tv/TV.vue"),
        meta: {
            i18n: {
                title: "魔盒电视台",
            },
        },
    },
];

const router = createRouter({
    history: createWebHistory('/index/'),
    routes,
});

export default router;
