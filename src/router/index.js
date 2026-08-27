import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        name: "index",
        path: "/",
        component: () => import("@/views/index/Index.vue"),
        meta: {
            analytics: {
                page_key: "index.home",
                route_pattern: "/index",
                route_path: "/index",
                layout_version: "index-home-v1",
            },
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
    {
        name: "download",
        path: "/download",
        component: () => import("@/views/download/Download.vue"),
        meta: {
            i18n: {
                title: "download.meta.title",
                keywords: "download.meta.keywords",
                description: "download.meta.description",
            },
        },
    },
];

const router = createRouter({
    history: createWebHistory("/index/"),
    routes,
});

export default router;
