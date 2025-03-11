<template>
    <div v-if="daily.length" class="m-world-daily">
        <el-divider content-position="left">日常</el-divider>
        <div class="m-daily-content">
            <!-- <div class="u-table-header">
                <div class="u-row">
                    <div class="u-item">活动</div>
                    <div class="u-item">项目</div>
                </div>
            </div> -->
            <div class="u-table-body">
                <div class="u-row" v-for="(item, i) in daily" :key="i">
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
    </div>
</template>
<script>
// import dayjs from "@/utils/day";
import dailyKeys from "@/assets/data/daily_keys.json";
export default {
    name: "Daily",
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
        client() {
            return this.$store.state.client;
        },
        daily() {
            const keys = dailyKeys.filter((item) => item.type === 1).map((item) => item.key);
            return this.activities.filter((item) => keys.includes(item.key) && item.val);
        },
        // date() {
        //     // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
        //     const hour = dayjs.tz().get("hours");
        //     return 0 <= hour && hour < 7
        //         ? dayjs.tz().subtract(1, "day").format("YYYY-MM-DD")
        //         : dayjs.tz().format("YYYY-MM-DD");
        // },
        // isCurrentWeek() {
        //     let week = dayjs.tz(this.date).isoWeek();
        //     let currentWeek = dayjs.tz().isoWeek();
        //     return week === currentWeek;
        // },
    },
    methods: {
        getLen(str) {
            if (!str) return 0;
            if (typeof str !== "string") {
                str += "";
            }
            return str.replace(/[^\x00-\xff]/g, "01").length;
        },
        // loadDaily() {
        //     getDaily({ date: this.date }).then((res) => {
        //         let list = res.data.data || [];
        //         this.daily = list.map((item) => {
        //             return {
        //                 type: item.task_type,
        //                 zone: "全服",
        //                 name: item.activity_name,
        //             };
        //         });
        //     });
        // },
    },
    mounted: function () {
        // this.loadDaily();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/v4/world/daily_new.less";
</style>
