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
];

const router = createRouter({
    history: createWebHistory('/index/'),
    routes,
});

export default router;
