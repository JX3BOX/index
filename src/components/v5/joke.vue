<template>
    <section
        class="m-joke-v5 relative overflow-hidden flex items-center px-4 py-3 my-6 bg-yellow-100 border border-yellow-200 shadow-sm group"
    >
        <a class="u-label flex-shrink-0 text-black font-black px-2 py-1 mr-4 no-underline" href="/joke" target="_blank">
            今日骚话
        </a>

        <div class="u-content flex-1 min-w-0 relative z-10">
            <el-carousel
                height="40px"
                direction="vertical"
                :autoplay="true"
                :interval="5000"
                indicator-position="none"
                arrow="never"
            >
                <el-carousel-item v-for="(item, i) in list" :key="i">
                    <a class="u-item block no-underline" :href="getLink(item.id)" target="_blank">
                        <span class="u-author">{{ item.author || "匿名" }}：</span>
                        <span class="u-quote">“</span>
                        <span class="u-joke" v-if="item.html" v-html="item.html"></span>
                        <span class="u-joke" v-else>{{ item.content }}</span>
                        <span class="u-quote">”</span>
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="u-deco absolute top-0 -right-2 text-6xl font-black text-yellow-200 opacity-20 select-none">“</div>
    </section>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { getJokes } from "@/service/index";
import JX3_EMOTION from "@jx3box/jx3box-emotion";

export default {
    name: "IndexJokeV5",
    data: function () {
        return {
            data: [],
            defaultItem: {
                id: 0,
                author: "匿名",
                content: "师父问我为什么110级了还没见过活人，我看了看空荡荡的帮会领地，流下了两行清泪。",
            },
        };
    },
    computed: {
        list: function () {
            return this.data.length ? this.data : [this.defaultItem];
        },
    },
    methods: {
        getLink: function (id) {
            if (!id) return "/joke";
            return getLink("joke", id);
        },
        init: function () {
            getJokes()
                .then((res) => {
                    this.data = res.data.data.list || [];
                    this.render();
                })
                .catch(() => {
                    this.data = [];
                });
        },
        render: function () {
            this.data.forEach((item) => {
                const ins = new JX3_EMOTION(item.content || "");
                ins._renderHTML().then((html) => {
                    this.$set(item, "html", html);
                });
            });
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
.m-joke-v5 {
    border-radius: 1.5rem;
    background-color: rgba(254, 243, 199, 0.5);
    border-color: rgba(253, 230, 138, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    .u-label {
        font-size: 10px;
        line-height: 1;
        border-radius: 0.25rem;
        background-color: #f59e0b;
        box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2);
    }

    .u-item {
        color: #78350f;
        font-size: 14px;
        font-weight: 700;
        font-style: italic;
        letter-spacing: -0.01em;
        line-height: 20px;
        max-height: 40px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .u-author {
        opacity: 0.9;
    }

    .u-quote {
        opacity: 0.7;
    }

    .u-joke {
        word-break: break-word;

        img {
            .pr;
            top: 4px;
            margin-left: 1px;
        }
    }

    .u-deco {
        line-height: 1;
        pointer-events: none;
    }

    .el-carousel__container {
        height: 40px !important;
    }

    .el-carousel__item {
        display: flex;
        align-items: center;
    }
}
</style>
