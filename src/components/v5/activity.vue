<template>
    <section class="m-activity-v5 bg-white py-8 px-4 text-gray-900 mb-6 border border-gray-200 shadow-sm font-fans">
        <div class="m-activity-v5__header flex justify-between items-end mb-4 px-1">
            <div class="m-activity-v5__title-wrap">
                <div class="m-activity-v5__title-sub flex items-center text-blue-600 mb-1">
                    <i class="u-icon el-icon-date"></i>
                    <span class="u-subtitle">Timeline</span>
                </div>
                <h3 class="u-title text-2xl font-bold m-0">活动</h3>
            </div>

            <div class="m-activity-v5__controller flex">
                <button type="button" class="u-scroll-btn" @click="scroll('left')">
                    <i class="el-icon-arrow-left"></i>
                </button>
                <button type="button" class="u-scroll-btn" @click="scroll('right')">
                    <i class="el-icon-arrow-right"></i>
                </button>
            </div>
        </div>

        <div class="m-activity-v5__timeline relative">
            <div class="m-activity-v5__line absolute left-0 w-full bg-gray-200"></div>

            <div
                ref="scrollRef"
                class="m-activity-v5__months flex overflow-x-auto relative z-10 py-4"
                style="scrollbar-width: none; -ms-overflow-style: none"
            >
                <div
                    v-for="month in months"
                    :id="`month-${month}`"
                    :key="month"
                    class="m-activity-v5__month-item flex-shrink-0 flex flex-col items-center"
                >
                    <div class="u-month text-sm font-bold mb-4" :class="{ 'is-active': isActiveMonth(month) }">
                        {{ month }}月
                    </div>

                    <div class="m-activity-v5__node relative flex items-center justify-center mb-8">
                        <template v-if="isActiveMonth(month)">
                            <span class="u-node-ping absolute bg-blue-100 rounded-full"></span>
                            <span
                                class="u-node-main bg-blue-600 rounded-full border-4 border-white shadow-sm z-10"
                            ></span>
                        </template>
                        <template v-else>
                            <span class="u-node bg-gray-200 rounded-full border-2 border-white z-10"></span>
                        </template>
                    </div>

                    <div class="m-activity-v5__cards px-3 w-full">
                        <template v-if="activitiesByMonth[month] && activitiesByMonth[month].length">
                            <a
                                v-for="item in activitiesByMonth[month]"
                                :key="item.id"
                                class="m-activity-v5__card group"
                                :class="cardClass(month, item)"
                                :href="item.link"
                                :target="item.link ? '_blank' : null"
                                :rel="item.link ? 'noopener noreferrer' : null"
                            >
                                <div
                                    v-if="isActiveMonth(month) && item.cover"
                                    class="m-activity-v5__cover rounded-lg overflow-hidden mb-2"
                                >
                                    <img class="u-cover block w-full" :src="item.cover" :alt="item.name" />
                                </div>
                                <div class="m-activity-v5__card-meta flex items-center">
                                    <span
                                        class="u-type u-type--xs font-bold px-1.5 py-0.5 rounded"
                                        :class="typeClass(month)"
                                    >
                                        {{ item.type }}
                                    </span>
                                    <i
                                        v-if="isActiveMonth(month)"
                                        class="u-star el-icon-star-on text-blue-600 u-star--xs"
                                        aria-hidden="true"
                                    ></i>
                                </div>

                                <h4 class="u-name text-sm font-bold truncate m-0 mt-1" :class="nameClass(month)">
                                    {{ item.name }}
                                </h4>

                                <div class="u-date u-date--xs flex items-center text-gray-400 mt-1">
                                    <i class="el-icon-time mr-1"></i>
                                    {{ item.date }}
                                </div>
                            </a>
                        </template>

                        <div
                            v-else
                            class="m-activity-v5__null u-null--xs h-20 flex items-center justify-center border border-dashed border-gray-100 rounded-xl text-gray-300"
                        >
                            暂无安排
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import dayjs from "dayjs";
import { getPvxEvents } from "@/service/index";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "IndexActivityV5",
    props: {
        activities: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    data: function () {
        const currentMonth = new Date().getMonth() + 1;
        return {
            activeMonth: currentMonth,
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            apiActivities: [],
        };
    },
    computed: {
        activityList: function () {
            if (this.activities && this.activities.length) return this.activities;
            return this.apiActivities;
        },
        activitiesByMonth: function () {
            return this.activityList.reduce((acc, item) => {
                if (!acc[item.month]) acc[item.month] = [];
                acc[item.month].push(item);
                return acc;
            }, {});
        },
    },
    mounted: function () {
        this.loadActivities();
        this.$nextTick(this.scrollToActiveMonth);
    },
    methods: {
        async loadActivities() {
            try {
                const res = await getPvxEvents({
                    status: 1,
                });
                this.apiActivities = this.normalizeActivities(res);
            } catch (e) {
                this.apiActivities = [];
            }
        },
        normalizeActivities: function (res) {
            const raw = res && res.data && res.data.data;
            const list = Array.isArray(raw) ? raw : raw && Array.isArray(raw.list) ? raw.list : [];
            const now = dayjs();

            return list
                .filter((item) => item && item.start_time)
                .map((item, index) => {
                    const start = dayjs(item.start_time);
                    const end = item.end_time ? dayjs(item.end_time) : start;

                    return {
                        id: item.id || `pvx-${index}`,
                        month: start.month() + 1,
                        name: item.name || "未命名活动",
                        type: item.type || "活动",
                        link: item.link || "",
                        cover: this.resolveCover(item.cover),
                        date: this.formatDateRange(start, end),
                        status: this.getActivityStatus(start, end, now),
                    };
                })
                .sort((a, b) => a.month - b.month);
        },
        resolveCover: function (cover) {
            if (!cover) return "";
            const isFullUrl = /^https?:\/\//i.test(cover);
            const raw = isFullUrl ? cover : `${__cdn}${String(cover).replace(/^\//, "")}`;
            const split = raw.split("?");
            const base = split[0].replace(/http:/g, "https:").replace(/oss\.jx3box\.com/g, "cdn.jx3box.com");
            const query = split[1] ? `&${split[1]}` : "";
            if (/\.gif$/i.test(base)) return `${base}${split[1] ? `?${split[1]}` : ""}`;

            // 使用 m_lfit 保留完整画面，避免 m_fill 的中心裁切；并提高输出尺寸与质量以减少糊感
            return `${base}?x-oss-process=image/auto-orient,1/resize,m_lfit,w_960,h_540/quality,Q_95${query}`;
        },
        formatDateRange: function (start, end) {
            if (!start || !start.isValid()) return "--";
            if (!end || !end.isValid()) end = start;

            const sameDay = start.isSame(end, "day");

            if (sameDay) return start.format("MM.DD");
            return `${start.format("MM.DD")} - ${end.format("MM.DD")}`;
        },
        getActivityStatus: function (start, end, now) {
            if (end.isBefore(now, "day")) return "past";
            if (
                (start.isBefore(now, "day") || start.isSame(now, "day")) &&
                (end.isAfter(now, "day") || end.isSame(now, "day"))
            ) {
                return "current";
            }
            return "upcoming";
        },
        isActiveMonth: function (month) {
            return month === this.activeMonth;
        },
        scroll: function (direction) {
            const el = this.$refs.scrollRef;
            if (!el) return;

            const offset = direction === "left" ? -260 : 260;
            el.scrollTo({
                left: el.scrollLeft + offset,
                behavior: "smooth",
            });
        },
        scrollToActiveMonth: function () {
            const el = this.$refs.scrollRef;
            if (!el) return;

            const currentMonthElement = this.$el.querySelector(`#month-${this.activeMonth}`);
            if (!currentMonthElement) return;

            const left = currentMonthElement.offsetLeft - el.clientWidth / 2 + currentMonthElement.clientWidth / 2;
            el.scrollTo({ left, behavior: "smooth" });
        },
        cardClass: function (month, item) {
            if (this.isActiveMonth(month)) {
                return "m-activity-v5__card--active";
            }
            if (item && item.status === "past") {
                return "m-activity-v5__card--past";
            }
            return "m-activity-v5__card--normal";
        },
        typeClass: function (month) {
            if (this.isActiveMonth(month)) {
                return "bg-blue-600 text-white";
            }
            return "bg-gray-100 text-gray-500 group-hover:bg-gray-200";
        },
        nameClass: function (month) {
            return this.isActiveMonth(month) ? "text-gray-900" : "text-gray-700";
        },
    },
};
</script>

<style lang="less">
.m-activity-v5 {
    border-radius: 2rem;

    .m-activity-v5__title-sub {
        column-gap: 0.5rem;
    }

    .u-icon {
        font-size: 18px;
        line-height: 1;
    }

    .u-subtitle {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
    }

    .m-activity-v5__controller {
        column-gap: 0.25rem;
    }

    .u-scroll-btn {
        width: 36px;
        height: 36px;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        color: #9ca3af;
        background: #fff;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .u-scroll-btn:hover {
        color: #111827;
        background: #f9fafb;
    }

    .m-activity-v5__line {
        top: 42px;
        height: 1px;
    }

    .m-activity-v5__months::-webkit-scrollbar {
        display: none;
    }

    .m-activity-v5__months {
        column-gap: 0.5rem;
    }

    .m-activity-v5__month-item {
        width: 256px;
    }

    .u-month {
        color: #9ca3af;
        transition: color 0.2s ease;
    }

    .u-month.is-active {
        color: #2563eb;
    }

    .u-node-ping {
        width: 24px;
        height: 24px;
        animation: m-activity-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    .u-node-main {
        width: 16px;
        height: 16px;
    }

    .u-node {
        width: 12px;
        height: 12px;
    }

    .u-type--xs,
    .u-star--xs {
        font-size: 10px;
        line-height: 1.2;
    }

    .u-date--xs,
    .u-null--xs {
        font-size: 11px;
        line-height: 1.4;
    }

    .m-activity-v5__cards {
        display: block;
    }

    .m-activity-v5__card {
        display: block;
        padding: 0.75rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        background: #fff;
        text-decoration: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    }

    .m-activity-v5__card + .m-activity-v5__card {
        margin-top: 1rem;
    }

    .m-activity-v5__card--active {
        border-color: #bfdbfe;
        background: #eff6ff;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    }

    .m-activity-v5__card--past {
        border-color: #e5e7eb;
        background: #fff;
    }

    .m-activity-v5__card--normal {
        border-color: #e5e7eb;
        background: #fff;
    }

    .m-activity-v5__card--normal:hover {
        border-color: #d1d5db;
    }

    .m-activity-v5__card-meta {
        column-gap: 0.375rem;
    }

    .m-activity-v5__cover {
        aspect-ratio: 16 / 9;
        background: #f8fafc;
    }

    .u-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
}

@keyframes m-activity-ping {
    75%,
    100% {
        transform: scale(1.8);
        opacity: 0;
    }
}

@media screen and (max-width: @phone) {
    .m-activity-v5 {
        border-radius: 1.25rem;
        padding: 1.25rem 0.75rem;

        .m-activity-v5__month-item {
            width: 224px;
        }
    }
}
</style>
