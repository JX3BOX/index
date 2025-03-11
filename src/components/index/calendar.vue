<template>
    <section class="m-calendar-content">
        <section class="m-calendar-week">
            <div class="u-week" v-for="week in weeks" :key="week">
                <span>{{ week }}</span>
            </div>
        </section>
        <section class="m-calendar-date">
            <a
                v-for="(item, index) in dataArr"
                class="u-date"
                :class="[
                    { 'u-other': ['pre', 'next'].includes(item.type) },
                    { 'u-today': isToday(item) },
                    { 'u-current': isCurrent(item) }
                ]"
                :key="index"
                :href="`/calendar/archive/${item.year}/${item.month}/${item.date}`"
                target="_blank"
            >
                <calendar-item
                    :data="item"
                    :counts="counts"
                    :slogans="slogans"
                    :pageSlogan="pageSlogan"
                    :isToday="isToday(item)"
                ></calendar-item>
            </a>
        </section>
        <el-collapse class="m-history" v-if="history && history.length" v-model="collapse">
            <el-collapse-item name="history">
                <section class="m-calendar-history">
                    <span class="u-title">✨ 那年今日</span>
                    <el-carousel
                        indicator-position="none"
                        :autoplay="true"
                        :interval="4000"
                        height="24px"
                        direction="vertical"
                    >
                        <el-carousel-item class="m-history-item" v-for="item in history" :key="item.id">
                            <template v-if="item.link && item.link.length">
                                <a class="u-link" v-for="linkItem in item.link" :key="linkItem.desc" :href="linkItem.link">{{ linkItem.desc }}</a>
                            </template>
                            <a class="u-link" :href="`/calendar/view/${item.id}`" target="_blank">{{ item.title || item.desc }}</a>
                        </el-carousel-item>
                    </el-carousel>
                </section>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>

<script>
import { getCalendar, getCalendarSlogans, getHistory, getCalendarCount } from "@/service/cms.js";
import calendar_item from "./calendar_item.vue";
export default {
    name: "calendar",
    components: {
        "calendar-item": calendar_item,
    },
    data() {
        return {
            current: {
                year: "",
                month: "",
                date: "",
            },
            dataArr: [],
            weeks: ["一", "二", "三", "四", "五", "六", "日"],
            slogans: [],
            monthStartWeekday: 0,
            history: [],
            counts: [],

            collapse : []
        };
    },
    computed: {
        // 页面slogan
        pageSlogan() {
            const { current } = this;
            return this.slogans.find(
                (slogan) => slogan.year === current.year && slogan.month === current.month && !slogan.date
            );
        },
        client() {
            return location.href.includes("origin") ? "origin" : "std";
        },
    },
    mounted() {
        const today = new Date();
        this.current = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            date: today.getDate(),
        };
        this.getMonthData();

        this.loadCalendar();
        this.loadCalendarSlogans();
        this.loadCalendarCount();
        this.loadHistory();
    },
    methods: {
        // 判断是否为今日
        isToday({ year, month, date }) {
            const dateObj = new Date();

            return dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month && dateObj.getDate() === date;
        },
        // 当前选定的日期
        isCurrent({ year, month, date }) {
            const { current } = this;

            return current.year === year && current.month === month && current.date === date;
        },
        // 获取指定月份数据
        getMonthData() {
            const { year, month } = this.current;
            let dataArr = [];
            let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // 闰年
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                daysInMonth[1] = 29;
            }
            const monthStartWeekday = new Date(year, month - 1, 1).getDay() || 7;
            const monthEndWeekday = new Date(year, month, 1).getDay() || 7;

            const preInfo = this.getPreMonth(this.current);
            const nextInfo = this.getNextMonth();

            for (let i = 0; i < monthStartWeekday - 1; i++) {
                let preObj = {
                    type: "pre",
                    date: daysInMonth[preInfo.month - 1] - (monthStartWeekday - i - 2),
                    month: preInfo.month,
                    year: preInfo.year,
                    children: [],
                };
                dataArr.push(preObj);
            }

            for (let i = 0; i < daysInMonth[month - 1]; i++) {
                let itemObj = {
                    type: "normal",
                    date: i + 1,
                    month,
                    year,
                    children: [],
                };
                dataArr.push(itemObj);
            }

            for (let i = 0; i < 8 - monthEndWeekday; i++) {
                let nextObj = {
                    type: "next",
                    date: i + 1,
                    month: nextInfo.month,
                    year: nextInfo.year,
                    children: [],
                };
                dataArr.push(nextObj);
            }

            this.dataArr = dataArr;
        },
        // 获取前一个月的年月日信息
        getPreMonth(date, defaultDate = 1) {
            let { year, month } = date || this.current;

            if (month === 1) {
                year -= 1;
                month = 12;
            } else {
                month -= 1;
            }

            return { year, month, date: defaultDate };
        },
        // 获取后一个月的年月日信息
        getNextMonth(defaultDate = 1) {
            let { year, month } = this.current;
            if (month === 12) {
                year += 1;
                month = 1;
            } else {
                month += 1;
            }

            return { year, month, date: defaultDate };
        },
        getCalendarLink(item) {
            if (item.type === 'normal') {
                window.open(`${location.origin}/calendar/archive/${item.year}/${item.month}/${item.date}`);
            }
        },
        // 数据加载
        loadCalendar() {
            const { year, month } = this.current;
            getCalendar({ year, month }, this.client).then((res) => {
                const data = res.data.data;
                data?.forEach((item) => {
                    let { year, month, date } = item;
                    let index = this.dataArr.findIndex((d) => d.year === year && d.month === month && d.date === date);

                    if (index) {
                        this.dataArr[index].children.push(item);
                    }
                });
            });
        },
        // 获取当前年月的统计数据
        loadCalendarCount() {
            const { year, month } = this.current;
            getCalendarCount({ year, month }).then((res) => {
                this.counts = res.data.map((item) => {
                    return {
                        ...item,
                        month,
                        year,
                    };
                });
            });
        },
        // 获取当前年月的海报信息
        loadCalendarSlogans() {
            const { year, month } = this.current;
            getCalendarSlogans({ year, month }).then((res) => {
                this.slogans = res.data;
            });
        },
        loadHistory() {
            getHistory({
                month: this.current.month,
                date: this.current.date
            }, { is_top: 1 })
                .then((res) => {
                    this.history = res.data.data;
                })
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/calendar/index.less";
</style>
