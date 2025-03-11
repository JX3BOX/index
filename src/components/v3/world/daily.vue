<template>
    <div class="m-world-daily">
        <div class="m-daily-content">
            <table>
                <thead>
                    <tr>
                        <th>活动</th>
                        <th>区服</th>
                        <th>项目</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in daily" :key="i">
                        <td>{{ item.type }}</td>
                        <td>{{ item.zone }}</td>
                        <td>{{ item.name }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <div class="m-world-block">
            <div class="u-item" v-for="(item, i) in daily" :key="i">
                <div>{{ item.type }}</div>
                <div>{{ item.name }}</div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { getDaily } from "@/service/spider";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isoWeek from "dayjs/plugin/isoWeek";
// import SimpleCelebrity from "./simple_celebrity";
dayjs.extend(isoWeek);
dayjs.extend(isToday);
export default {
    name: "Daily",
    components: {
        // SimpleCelebrity,
    },
    data: function () {
        return {
            daily: [],
        };
    },
    computed: {
        date() {
            // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
            const hour = dayjs().get("hours");
            return 0 <= hour && hour < 7
                ? dayjs().subtract(1, "day").format("YYYY-MM-DD")
                : dayjs().format("YYYY-MM-DD");
        },
        client() {
            return this.$store.state.client;
        },
        isCurrentWeek() {
            let week = dayjs(this.date).isoWeek();
            let currentWeek = dayjs().isoWeek();
            return week === currentWeek;
        },
    },
    methods: {
        loadDaily() {
            getDaily({ date: this.date }).then((res) => {
                let list = res.data.data || [];
                this.daily = list.map((item) => {
                    return {
                        type: item.task_type,
                        zone: "全服",
                        name: item.activity_name,
                    };
                });
            });
        },
    },
    mounted: function () {
        this.loadDaily();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/v3/world/daily.less";
</style>
