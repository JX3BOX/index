import { createRouter, createWebHistory } from "vue-router";

const routes = [{ name: "index", path: "/", component: () => import("../views/index/Index.vue") }];

const router = createRouter({
    history: createWebHistory('/index/'),
    routes,
});

export default router;
