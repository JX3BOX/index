<template>
    <div class="m-daily-activity m-sideblock" v-if="client == 'std'">
        <div class="m-sideblock-header">
            <div class="u-left">
                <a class="u-title" href="/calendar" target="_blank"> <i class="u-icon el-icon-s-order"></i> 日常活动</a>
            </div>
            <!-- <el-select class="u-select" v-model="server" placeholder="请选择服务器" size="mini">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select> -->
            <div class="u-right">
                <a href="/calendar" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-daily-content">
            <table>
                <thead>
                    <tr>
                        <th>活动</th>
                        <!-- <th>区服</th> -->
                        <th>项目</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in daily" :key="i">
                        <td>{{ item.type }}</td>
                        <!-- <td>{{ item.zone }}</td> -->
                        <td>{{ item.name }}</td>
                    </tr>
                    <!-- <meirentu :server="server"></meirentu> -->
                    <lucky-pet :date="date" :client="client"></lucky-pet>
                    <furniture v-if="isCurrentWeek" :date="date" :client="client"></furniture>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { getDaily } from "@/service/spider";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isoWeek from "dayjs/plugin/isoWeek";
// import meirentu from "./meirentu";
import luckyPet from "./lucky_pet";
import furniture from "./furniture";
dayjs.extend(isoWeek);
dayjs.extend(isToday);
export default {
    name: "activity",
    components: {
        // meirentu,
        luckyPet,
        furniture,
    },
    data: function () {
        return {
            daily: [],
            server: "蝶恋花",
        };
    },
    computed: {
        servers: function () {
            if (this.client == "std") {
                return servers_std;
            } else {
                return servers_origin;
            }
        },

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
        myServer() {
            return this.$store.state.server;
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
    watch: {
        myServer(val) {
            if (val) this.server = val;
        },
    },
    mounted: function () {
        this.loadDaily();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/v2/daily.less";
</style>
