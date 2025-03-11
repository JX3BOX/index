import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("../views/Index.vue");

Vue.use(VueRouter);

const routes = [
    { name: "index", path: "/", component: Index },
];

const router = new VueRouter({
    routes,
});

export default router;
