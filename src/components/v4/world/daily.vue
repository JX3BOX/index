<template>
    <div v-if="daily.length" class="m-world-daily">
        <el-divider content-position="left">日常</el-divider>
        <div class="m-daily-content">
            <div class="u-table-header">
                <div class="u-row">
                    <div class="u-item">活动</div>
                    <div class="u-item">区服</div>
                    <div class="u-item">项目</div>
                </div>
            </div>
            <div class="u-table-body">
                <div class="u-row" v-for="(item, i) in daily" :key="i">
                    <div class="u-item">{{ item.type }}</div>
                    <div class="u-item">{{ item.zone }}</div>
                    <div class="u-item">{{ item.name }}</div>
                </div>
                <!-- <div class="u-row u-reputation">
                    <div class="u-item">家园声望</div>
                    <div class="u-item">全服</div>
                    <el-tooltip class="u-item" effect="dark" placement="top" :content="`英雄九辩馆、尘归海·巨冥湾`">
                        <div class="u-item">英雄九辩馆、尘归海·巨冥湾</div>
                    </el-tooltip>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import { getDaily } from "@/service/spider";
import dayjs from "@/utils/day";
export default {
    name: "Daily",
    data: function () {
        return {
            daily: [],
        };
    },
    computed: {
        date() {
            // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
            const hour = dayjs.tz().get("hours");
            return 0 <= hour && hour < 7
                ? dayjs.tz().subtract(1, "day").format("YYYY-MM-DD")
                : dayjs.tz().format("YYYY-MM-DD");
        },
        client() {
            return this.$store.state.client;
        },
        isCurrentWeek() {
            let week = dayjs.tz(this.date).isoWeek();
            let currentWeek = dayjs.tz().isoWeek();
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
@import "~@/assets/css/v4/world/daily.less";
</style>