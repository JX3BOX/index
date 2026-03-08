<template>
    <section class="m-joke-v5-purple group">
        <div class="u-container flex items-center px-6 py-3 my-6">
            <a
                class="u-label flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 mr-6 no-underline text-white font-bold rounded-xl transition-transform hover:scale-105"
                href="/joke"
                target="_blank"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path
                        d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                    />
                </svg>
                <span>今日骚话</span>
            </a>

            <div class="u-content flex-1 min-w-0 relative z-10">
                <el-carousel
                    height="48px"
                    direction="vertical"
                    :autoplay="true"
                    :interval="5000"
                    indicator-position="none"
                    arrow="never"
                >
                    <el-carousel-item v-for="(item, i) in list" :key="i">
                        <a class="u-item block no-underline truncate" :href="getLink(item.id)" target="_blank">
                            <span class="u-author text-gray-400 font-medium mr-1">{{ item.author || "匿名" }}：</span>
                            <span class="u-quote">“</span>
                            <span class="u-joke-text" v-if="item.html" v-html="item.html"></span>
                            <span class="u-joke-text" v-else>{{ item.content }}</span>
                            <span class="u-quote">”</span>
                        </a>
                    </el-carousel-item>
                </el-carousel>
            </div>

            <div class="u-actions flex items-center gap-3 ml-10">
                <!-- <span class="u-tip text-[12px] text-purple-500 font-bold hidden md:block opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    投喂骚话
                </span> -->
                <a
                    href="/joke"
                    target="_blank"
                    class="u-go cursor-pointer flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-indigo-500 transition-all duration-300 hover:bg-indigo-500 hover:text-white group-hover:shadow-lg group-hover:shadow-purple-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </a>
            </div>

            <div
                class="u-deco absolute -bottom-2 right-12 text-7xl font-black text-purple-100 opacity-30 select-none pointer-events-none"
            >
                ”
            </div>
        </div>
    </section>
</template>

<script>
import { getLink } from "@/config/js/utils";
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
                    this.data = res.data?.data?.list || [];
                    this.render();
                })
                .catch(() => {
                    this.data = [];
                });
        },
        render: function () {
            this.data.forEach((item) => {
                if (item.content) {
                    const ins = new JX3_EMOTION(item.content);
                    ins._renderHTML().then((html) => {
                        item.html = html;
                    });
                }
            });
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
.m-joke-v5-purple {
    position: relative;

    .u-container {
        background-color: #ffffff;
        border: 1px solid #f0f2f9;
        border-radius: 1.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        transition: all 0.3s ease;

        &:hover {
            border-color: #daddff;
            box-shadow: 0 10px 25px rgba(91, 92, 245, 0.08);
        }
    }

    .u-label {
        font-size: 12px;
        background: linear-gradient(135deg, #6e70f7 0%, #5b5cf5 100%);
        box-shadow: 0 4px 12px rgba(91, 92, 245, 0.25);
    }

    .u-item {
        color: #3d4663;
        font-size: 15px;
        font-weight: 600;
        line-height: 48px;
    }

    .u-joke-text {
        font-style: italic;

        img {
            display: inline-block;
            height: 20px;
            vertical-align: middle;
            margin: 0 2px;
        }
    }

    .u-quote {
        color: #5b5cf5;
        opacity: 0.6;
    }

    .el-carousel__container {
        height: 48px !important;
    }

    .el-carousel__item {
        display: flex;
        align-items: center;
    }

    .u-tip {
        letter-spacing: 1px;
        text-shadow: 0 0 10px rgba(91, 92, 245, 0.1);
        display: inline-block;
        white-space: nowrap;
    }

    .u-deco {
        right: 4rem;
    }
}
</style>
