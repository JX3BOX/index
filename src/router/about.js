import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import("@/views/about/Index.vue"),
        name: "index",
        meta: {
            title: "关于我们",
            titleKey: "about.routes.index",
            i18n: { title: "pages.about.title", keywords: "pages.about.keywords", description: "pages.about.description" },
            cache: true,
        },
    },
    {
        path: "/group",
        component: () => import("@/views/about/Group.vue"),
        name: "group",
        meta: {
            title: "联系我们",
            titleKey: "about.routes.group",
            cache: true,
        },
    },
    {
        path: "/team",
        component: () => import("@/views/about/Team.vue"),
        name: "team",
        meta: {
            title: "加入团队",
            titleKey: "about.routes.team",
            cache: true,
        },
    },
    {
        path: "/author",
        component: () => import("@/views/about/Author.vue"),
        name: "author",
        meta: {
            title: "签约作者",
            titleKey: "about.routes.author",
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
            titleKey: "about.routes.terms",
            cache: true,
        },
        children: [
            {
                path: "/license",
                component: () => import("@/views/about/Article.vue"),
                name: "license",
                meta: {
                    title: "用户协议",
                    titleKey: "about.routes.license",
                    cache: true,
                    belongs: "terms",
                    article_id: 21020,
                },
            },
            {
                path: "/privacy",
                component: () => import("@/views/about/Article.vue"),
                name: "privacy",
                meta: {
                    title: "隐私政策",
                    titleKey: "about.routes.privacy",
                    cache: true,
                    belongs: "terms",
                    article_id: 21021,
                },
            },
        ],
    },
    {
        path: "/creation",
        component: () => import("@/views/about/Article.vue"),
        redirect: "/treaty",
        name: "creation",
        meta: {
            title: "创作扶持",
            titleKey: "about.routes.creation",
            cache: true,
        },
        children: [
            {
                path: "/treaty",
                component: () => import("@/views/about/Article.vue"),
                name: "treaty",
                meta: {
                    title: "创作公约",
                    titleKey: "about.routes.treaty",
                    cache: true,
                    belongs: "creation",
                    article_id: 21022,
                },
            },
            {
                path: "/incentives",
                component: () => import("@/views/about/Article.vue"),
                name: "incentives",
                meta: {
                    title: "创作激励",
                    titleKey: "about.routes.incentives",
                    cache: true,
                    belongs: "creation",
                    article_id: 28917,
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory("/about/"),
    routes,
});

router.beforeEach((to, _from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
        return;
    }
    next();
});

export default router;
