<template>
    <div class="m-world-daily-new">
        <template v-if="weekActivities.length">
            <el-divider content-position="left">周常</el-divider>
            <div class="m-daily-content">
                <div class="u-table-body">
                    <div class="u-row" v-for="(item, i) in weekActivities" :key="i">
                        <div class="u-item">{{ item.name }}</div>
                        <el-tooltip
                            v-if="getLen(item.val) > 30"
                            class="box-item"
                            effect="dark"
                            :content="item.val"
                            placement="top-end"
                        >
                            <div class="u-item">{{ item.val }}</div>
                        </el-tooltip>
                        <div class="u-item" v-else>{{ item.val }}</div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="todayActivities.length">
            <el-divider content-position="left">活动&nbsp;·&nbsp;{{ dailyToday }}</el-divider>
            <div class="m-daily-content">
                <div class="u-table-body">
                    <div class="u-row" v-for="(item, i) in todayActivities" :key="i">
                        <div class="u-item">{{ item.name }}</div>
                        <el-tooltip
                            v-if="getLen(item.val) > 30"
                            class="box-item"
                            effect="dark"
                            :content="item.val"
                            placement="top"
                        >
                            <div class="u-item">{{ item.val }}</div>
                        </el-tooltip>
                        <div class="u-item" v-else>{{ item.val }}</div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import dayjs from "@/utils/day";
import dailyKeys from "@/assets/data/daily_keys.json";
import dailyDays from "@/assets/data/daily_days.json";
export default {
    name: "Activity",
    props: {
        activities: {
            type: Array,
            default: () => [],
        },
    },
    data: function () {
        return {};
    },
    computed: {
        day() {
            // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
            const hour = dayjs.tz().get("hours");
            const day = 0 <= hour && hour < 7 ? dayjs.tz().subtract(1, "day").day() : dayjs.tz().day();
            return day === 0 ? 7 : day;
        },
        client() {
            return this.$store.state.client;
        },
        dailyToday() {
            return dailyDays.find((item) => item.key === this.day)?.name;
        },
        weekActivities() {
            const keys = dailyKeys.filter((item) => item.type === 2).map((item) => item.key);
            return this.activities.filter((item) => keys.includes(item.key) && item.val);
        },
        // 今日活动
        todayActivities() {
            const keys = dailyKeys.filter((item) => item.type === 3).map((item) => item.key);
            return this.activities.filter(
                (item) => keys.includes(item.key) && item.val && (item.day === 0 || item.day === this.day)
            );
        },
    },
    methods: {
        getLen(str) {
            if (!str) return 0;
            if (typeof str !== "string") {
                str += "";
            }
            return str.replace(/[^\x00-\xff]/g, "01").length;
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/v4/world/daily_new.less";
</style>
