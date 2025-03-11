import Vue from "vue";
import VueRouter from "vue-router";

const List = () => import("@/views/notice/components/NoticeListV2.vue");
const Single = () => import("@/views/notice/components/NoticeSingleV2.vue");

Vue.use(VueRouter);

const routes = [{
        name: "list",
        path: "/",
        component: List,
        meta: {
            keepAlive: true
        }
    },
    { name: "single", path: "/:id", component: Single },
];

const router = new VueRouter({
    mode: "history",
    base: '/notice',
    routes,
});

export default router;