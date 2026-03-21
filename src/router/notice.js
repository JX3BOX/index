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
        },
    },
    { name: "single", path: "/:id", component: Single },
];

const router = createRouter({
    history: createWebHistory("/notice/"),
    routes,
});

export default router;
