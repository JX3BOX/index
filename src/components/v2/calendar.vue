<template>
    <div class="m-calendar">
        <div class="m-calendar-content">
            <a
                class="m-calendar-item"
                :class="{ current: isToday(item) }"
                v-for="(item, index) in data"
                :key="index"
                :href="`/calendar/archive/${item.year}/${item.month}/${item.date}`"
                target="_blank"
            >
                <div class="u-week">{{ item.week }}</div>
                <div class="u-date" :style="{ backgroundColor: isToday(item) ? themeStyle.backgroundColor : '' }">
                    {{ item.date }}
                </div>
                <div
                    class="u-link"
                    :style="{
                        color: item.slogan.color || themeStyle.textColor,
                        backgroundColor: themeStyle.backgroundColor,
                        '--beforeColor': beforeColor,
                    }"
                    v-if="item.slogan.title"
                >
                    {{ item.slogan.title }}
                </div>
            </a>
        </div>
        <div class="m-calendar-event">
            <calendar-item v-for="(item, index) in list" :key="index" :data="item"></calendar-item>
        </div>
    </div>
</template>

<script>
import calendar_item from "./calendar_item.vue";
import { getRangeCalendar, getCalendarSlogansExact } from "@/service/cms.js";
import dayjs from "dayjs";
export default {
    name: "calendar",
    props: {
        theme: {
            type: Object,
            default: null,
        },
    },
    components: {
        "calendar-item": calendar_item,
    },
    data() {
        return {
            data: [],
            list: [],
            slogans: [],
            weeks: ["日", "一", "二", "三", "四", "五", "六"],
            current: {
                year: "",
                month: "",
                date: "",
            },
            themeStyle: {},
            beforeColor: "#f6f8fa",
        };
    },
    computed: {
        dateRange() {
            let dataRange = [];
            const prevDate = dayjs().subtract(3, "day");

            for (let i = 0; i < 7; i++) {
                const date = prevDate.add(i, "day").format("YYYY-MM-DD");
                dataRange.push(date);
            }

            return dataRange;
        },
        params() {
            return {
                dateRange: this.dateRange.join(","),
                client: this.$store.state.client,
            };
        },
    },
    watch: {
        dateRange: {
            deep: true,
            immediate: true,
            handler(val) {
                this.initCalendar();
            },
        },
        theme: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val != null) {
                    if (val.buttoncolor) {
                        this.$set(this.themeStyle, "backgroundColor", val.buttoncolor);
                        this.$set(this, "beforeColor", val.buttoncolor);
                    }
                    if (val.buttontextcolor) this.$set(this.themeStyle, "textColor", val.buttontextcolor);
                }
            },
        },
    },
    methods: {
        initCalendar() {
            const today = new Date();
            this.current = {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                date: today.getDate(),
            };
            this.dateRange.forEach((date) => {
                const year = ~~date.split("-")[0];
                const month = ~~date.split("-")[1];
                const day = ~~date.split("-")[2];
                this.data.push({
                    year,
                    month,
                    date: day,
                    isToday: this.isToday({ year, month, date: day }),
                    week: "周" + this.weeks[new Date(year, month - 1, day).getDay()],
                    children: [],
                    slogan: "",
                });
            });

            this.loadRangeCalendar();
            this.loadCalendarSlogans();
        },
        loadRangeCalendar() {
            getRangeCalendar(this.params).then((res) => {
                const { data } = res.data;
                this.list = data || [];
                if (data) {
                    data?.forEach((item) => {
                        const index = this.data.findIndex(
                            (v) => v.year === item.year && v.month === item.month && v.date === item.date
                        );

                        index > -1 && this.data[index].children.push(item);
                    });
                }
            });
        },
        // 获取当前年月的海报信息
        loadCalendarSlogans() {
            getCalendarSlogansExact(this.params).then((res) => {
                this.slogans = res.data;
                this.slogans.forEach((item) => {
                    const index = this.data.findIndex(
                        (v) => v.year === item.year && v.month === item.month && v.date === item.date
                    );

                    index > -1 && (this.data[index].slogan = item);
                });
            });
        },
        // 判断是否为今日
        isToday({ year, month, date }) {
            const dateObj = new Date();

            return dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month && dateObj.getDate() === date;
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/calendar.less";
.m-calendar-item .u-link:before {
    border-bottom-color: var(--beforeColor);
}
</style>
