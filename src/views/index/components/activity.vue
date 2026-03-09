<template>
    <section class="m-activity-v5 bg-white py-8 px-6 text-gray-900 mb-6 border border-gray-200 shadow-xs font-fans">
        <div class="m-activity-v5__header flex justify-between items-end mb-4 px-1">
            <div class="m-activity-v5__title-wrap">
                <div class="m-activity-v5__title-sub flex items-center text-indigo-600 mb-1">
                    <i class="u-icon el-icon-date"></i>
                    <span class="u-subtitle">{{ $t("index.activity.subtitle") }}</span>
                </div>
                <h3 class="u-title text-2xl font-bold m-0">{{ $t("index.activity.title") }}</h3>
            </div>

            <div class="m-activity-v5__controller flex">
                <button type="button" class="u-scroll-btn" @click="scroll('left')">
                    <el-icon><ArrowLeft /></el-icon>
                </button>
                <button type="button" class="u-scroll-btn" @click="scroll('right')">
                    <el-icon><ArrowRight /></el-icon>
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
                        {{ $t("index.activity.month", { month }) }}
                    </div>

                    <div class="m-activity-v5__node relative flex items-center justify-center mb-8">
                        <template v-if="isActiveMonth(month)">
                            <span class="u-node-ping absolute bg-indigo-100 rounded-full"></span>
                            <span
                                class="u-node-main bg-indigo-600 rounded-full border-4 border-white shadow-sm z-10"
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
                                <div class="m-activity-v5__card-inner flex items-start">
                                    <div class="m-activity-v5__cover rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            v-if="item.cover"
                                            class="u-cover block"
                                            :class="{ 'is-inactive': !isCurrentActivity(item) }"
                                            :src="item.cover"
                                            :alt="item.name"
                                        />
                                        <div v-else class="u-cover u-cover--placeholder">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>
                                    </div>

                                    <div class="m-activity-v5__card-body">
                                        <div class="m-activity-v5__card-meta flex items-center">
                                            <span
                                                class="u-type u-type--xs font-bold px-1.5 py-0.5 rounded"
                                                :class="typeClass(month)"
                                            >
                                                {{ item.type }}
                                            </span>
                                            <i
                                                v-if="isActiveMonth(month)"
                                                class="u-star el-icon-star-on text-indigo-600 u-star--xs"
                                                aria-hidden="true"
                                            ></i>
                                        </div>

                                        <h4 class="u-name text-sm font-bold truncate m-0 mt-1" :class="nameClass(item)">
                                            {{ item.name }}
                                        </h4>

                                        <div class="u-date u-date--xs flex items-center text-gray-400 mt-1">
                                            <i class="el-icon-time mr-1"></i>
                                            {{ item.date }}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </template>

                        <div
                            v-else
                            class="m-activity-v5__null u-null--xs h-20 flex items-center justify-center border border-dashed border-gray-100 rounded-xl text-gray-300"
                        >
                            {{ $t("index.activity.empty") }}
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
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const { __cdn } = JX3BOX;

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
            const grouped = this.activityList.reduce((acc, item) => {
                if (!acc[item.month]) acc[item.month] = [];
                acc[item.month].push(item);
                return acc;
            }, {});

            Object.keys(grouped).forEach((month) => {
                grouped[month] = grouped[month].slice().sort((a, b) => {
                    const sortDiff = this.getSortValue(a.sort) - this.getSortValue(b.sort);
                    if (sortDiff !== 0) return sortDiff;
                    return this.getStartTimestamp(a.start) - this.getStartTimestamp(b.start);
                });
            });

            return grouped;
        },
    },
    watch: {
        activityList: function () {
            this.updateActiveMonth();
            this.$nextTick(this.scrollToActiveMonth);
        },
    },
    mounted: function () {
        this.loadActivities();
    },
    methods: {
        async loadActivities() {
            try {
                const res = await getPvxEvents({
                    status: 1,
                });
                this.apiActivities = this.normalizeActivities(res);
                this.updateActiveMonth();
            } catch (e) {
                this.apiActivities = [];
                this.updateActiveMonth();
            }
            this.$nextTick(this.scrollToActiveMonth);
        },
        normalizeActivities: function (res) {
            const raw = res && res.data && res.data.data;
            const list = Array.isArray(raw) ? raw : raw && Array.isArray(raw.list) ? raw.list : [];
            const now = dayjs();

            return list
                .filter((item) => item && item.start_time)
                .map((item, index) => {
                    const start = this.parseActivityTime(item.start_time, false);
                    const end = this.parseActivityTime(item.end_time || item.start_time, true);

                    return {
                        id: item.id || `pvx-${index}`,
                        month: start.month() + 1,
                        sort: this.getSortValue(item.sort),
                        name: item.name || this.$t("index.activity.defaultName"),
                        type: item.type || this.$t("index.activity.defaultType"),
                        tags: this.resolveTags(item),
                        link: item.link || "",
                        cover: this.resolveCover(item.cover),
                        date: this.formatDateRange(start, end),
                        start,
                        end,
                        status: this.getActivityStatus(start, end, now),
                    };
                })
                .sort((a, b) => a.start.valueOf() - b.start.valueOf());
        },
        getSortValue: function (value) {
            const num = Number(value);
            return Number.isFinite(num) ? num : 9999;
        },
        getStartTimestamp: function (start) {
            if (start && typeof start.valueOf === "function") return start.valueOf();
            const parsed = dayjs(start);
            if (!parsed.isValid()) return Number.MAX_SAFE_INTEGER;
            return parsed.valueOf();
        },
        resolveTags: function (item) {
            const tags = [];
            if (item.type) tags.push(item.type);
            if (item.category) tags.push(item.category);
            return tags.slice(0, 3);
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
        parseActivityTime: function (value, endOfDay) {
            if (!value) return dayjs("");
            const parsed = dayjs(value);
            if (!parsed.isValid()) return parsed;

            const raw = String(value);
            const hasExplicitTime = /(?:T|\s)\d{1,2}:\d{2}/.test(raw);
            if (hasExplicitTime) return parsed;

            return endOfDay ? parsed.endOf("day") : parsed.startOf("day");
        },
        formatDateRange: function (start, end) {
            if (!start || !start.isValid()) return "--";
            if (!end || !end.isValid()) end = start;

            const sameDay = start.isSame(end, "day");

            if (sameDay) return start.format("MM.DD");
            return `${start.format("MM.DD")} - ${end.format("MM.DD")}`;
        },
        getActivityStatus: function (start, end, now) {
            if (!start || !start.isValid() || !end || !end.isValid()) return "upcoming";
            if (end.valueOf() < now.valueOf()) return "past";
            if (start.valueOf() <= now.valueOf() && end.valueOf() >= now.valueOf()) return "current";
            return "upcoming";
        },
        updateActiveMonth: function () {
            const list = Array.isArray(this.activityList) ? this.activityList : [];
            if (!list.length) {
                this.activeMonth = new Date().getMonth() + 1;
                return;
            }

            const currentItem = list.find((item) => item && item.status === "current");
            if (currentItem && currentItem.month) {
                this.activeMonth = Number(currentItem.month);
                return;
            }

            const now = dayjs().valueOf();
            const withStart = list
                .filter((item) => item && this.getStartTimestamp(item.start) < Number.MAX_SAFE_INTEGER)
                .slice()
                .sort((a, b) => this.getStartTimestamp(a.start) - this.getStartTimestamp(b.start));

            const upcomingItem = withStart.find((item) => this.getStartTimestamp(item.start) >= now);
            if (upcomingItem && upcomingItem.month) {
                this.activeMonth = Number(upcomingItem.month);
                return;
            }

            const latestPast = withStart.length ? withStart[withStart.length - 1] : list[0];
            this.activeMonth = Number(latestPast.month) || new Date().getMonth() + 1;
        },
        isActiveMonth: function (month) {
            return month === this.activeMonth;
        },
        isCurrentActivity: function (item) {
            return item && item.status === "current";
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
            if (this.isCurrentActivity(item)) {
                return "m-activity-v5__card--active";
            }
            if (item && item.status === "past") {
                return "m-activity-v5__card--past";
            }
            return "m-activity-v5__card--normal";
        },
        typeClass: function (month) {
            if (this.isActiveMonth(month)) {
                return "bg-indigo-600 text-white";
            }
            return "bg-gray-100 text-gray-500 group-hover:bg-gray-200";
        },
        nameClass: function (item) {
            return this.isCurrentActivity(item) ? "is-active" : "is-inactive";
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/index/activity.less";
</style>
