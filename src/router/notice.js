import { createRouter, createWebHistory } from "vue-router";

const List = () => import("@/views/notice/components/NoticeList.vue");
const Single = () => import("@/views/notice/components/NoticeSingle.vue");

const routes = [
    {
        name: "list",
        path: "/",
        component: List,
        meta: {
            keepAlive: true,
            i18n: {
                title: "pages.notice.title",
                keywords: "pages.notice.keywords",
                description: "pages.notice.description",
            },
        },
    },
    {
        name: "single",
        path: "/:id",
        component: Single,
        meta: {
            i18n: {
                title: "pages.notice.single.title",
                keywords: "pages.notice.single.keywords",
                description: "pages.notice.single.description",
            },
        },
    },
];

const router = createRouter({
    history: createWebHistory("/notice/"),
    routes,
});

export default router;
