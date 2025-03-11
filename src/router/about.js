import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err);
};

const routes = [
    {
        path: "/",
        component: () => import("@/views/about/Index.vue"),
        name: "index",
        meta: {
            title: "关于我们",
            cache: true,
        },
    },
    {
        path: "/group",
        component: () => import("@/views/about/Group.vue"),
        name: "group",
        meta: {
            title: "联系我们",
            cache: true,
        },
    },
    {
        path: "/team",
        component: () => import("@/views/about/Team.vue"),
        name: "team",
        meta: {
            title: "加入团队",
            cache: true,
        },
    },
    {
        path: "/author",
        component: () => import("@/views/about/Author.vue"),
        name: "author",
        meta: {
            title: "签约作者",
            cache: true,
        },
    },
    {
        path: "/terms",
        component: () => import("@/views/about/Article.vue"),
        redirect: "/license",
        name: "terms",
        meta: {
            title: "服务条款",
            cache: true,
        },
        children: [
            {
                path: "/license",
                component: () => import("@/views/about/Article.vue"),
                name: "license",
                meta: {
                    title: '用户协议',
                    cache: true,
                    belongs: 'terms',
                    article_id: 21020
                }
            },
            {
                path: "/privacy",
                component: () => import("@/views/about/Article.vue"),
                name: "privacy",
                meta: {
                    title: '隐私政策',
                    cache: true,
                    belongs: 'terms',
                    article_id: 21021
                }
            }
        ]
    },
    {
        path: "/creation",
        component: () => import("@/views/about/Article.vue"),
        redirect: "/treaty",
        name: "creation",
        meta: {
            title: "创作扶持",
            cache: true,
        },
        children: [
            {
                path: "/treaty",
                component: () => import("@/views/about/Article.vue"),
                name: "treaty",
                meta: {
                    title: '创作公约',
                    cache: true,
                    belongs: 'creation',
                    article_id: 21022
                }
            },
            {
                path: "/incentives",
                component: () => import("@/views/about/Article.vue"),
                name: "incentives",
                meta: {
                    title: '创作激励',
                    cache: true,
                    belongs: 'creation',
                    article_id: 28917
                }
            }
        ]
    },
];

const router = new VueRouter({
    routes,
    mode: "history",
    base: "/about",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
