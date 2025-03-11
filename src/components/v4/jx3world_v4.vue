<!-- 江湖模块 包含开服、日常、周常、买卖入口等 -->
<template>
    <div class="m-world m-sideblock" v-if="isStd">
        <div class="m-world-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-flag"></i>
                <a class="u-title" href="/pvg/gonggao/daily" target="_blank">江湖快报</a>
            </div>
            <div class="u-right">
                <span class="world-tip">{{ world_tip }}</span>
            </div>
        </div>
        <div class="m-world-content">
            <baizhan></baizhan>
            <daily></daily>
            <celebrity></celebrity>
            <horse></horse>
            <lucky-pet :date="date" :client="client"></lucky-pet>
            <reputation v-if="isCurrentWeek" :date="date" :client="client"></reputation>
            <mrt></mrt>
            <!-- <activity :activities="activities"></activity> -->
            <!-- <furniture v-if="isCurrentWeek" :date="date" :client="client"></furniture> -->
        </div>
    </div>
</template>

<script>
import daily from "@/components/v4/world/daily.vue";
import celebrity from "@/components/v4/world/celebrity.vue";
import horse from "@/components/v4/world/horse.vue";
import luckyPet from "@/components/v4/world/lucky_pet";
// import furniture from "@/components/v4/world/furniture";
// import activity from "@/components/v4/world/activity";
import reputation from "@/components/v4/world/reputation";
import dayjs from "@/utils/day";
import { formatTime } from "@/utils";
import { getDailyFromOs } from "@/service/spider";
import dailyKeys from "@/assets/data/daily_keys.json";
import baizhan from "@/components/v4/world/baizhan_mini.vue";
import mrt from "@/components/v4/world/meirentu.vue";
export default {
    name: "JX3WorldV4",
    components: {
        daily,
        luckyPet,
        // furniture,
        celebrity,
        horse,
        // activity,
        reputation,
        baizhan,
        mrt,
    },
    provide() {
        return {
            celebrity: () => this.celebrityData,
        };
    },
    data() {
        return {
            celebrityData: {
                list: [],
                currentDate: {
                    d: dayjs.tz().day(),
                    h: dayjs.tz().hour(),
                    m: dayjs.tz().minute(),
                },
            },
            world_tip: formatTime(),
            isSpc: false,
            isPhone: false,
            activities: [], // 日常配置列表
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        isStd() {
            return this.$store.state.client === "std";
        },
        date() {
            // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
            const hour = dayjs.tz().get("hours");
            return 0 <= hour && hour < 7
                ? dayjs.tz().subtract(1, "day").format("YYYY-MM-DD")
                : dayjs.tz().format("YYYY-MM-DD");
        },
        isCurrentWeek() {
            let week = dayjs.tz(this.date).isoWeek();
            let currentWeek = dayjs.tz().isoWeek();
            return week === currentWeek;
        },
        dailyKeyMap() {
            return dailyKeys.reduce((acc, cur) => {
                return { ...acc, [cur["key"]]: cur.name };
            }, {});
        },
    },
    methods: {
        loadDailyNew() {
            const params = {
                client: this.client,
            };
            getDailyFromOs(params).then((res) => {
                let list = res.data.data || [];
                const activities = list.filter((item) => {
                    return item.client === this.client;
                });
                this.activities = activities.map((item) => {
                    return {
                        ...item,
                        name: this.dailyKeyMap[item.key],
                    };
                });
            });
        },
    },
    created() {
        // this.loadDailyNew();
    },
    mounted() {
        this.isPhone = document.documentElement.clientWidth <= 768;
        this.isSpc = document.documentElement.clientWidth <= 1680;
        window.onresize = () => {
            this.isPhone = document.documentElement.clientWidth <= 768;
            this.isSpc = document.documentElement.clientWidth <= 1680;
        };
        setInterval(() => {
            if (
                this.celebrityData.currentDate.h !== dayjs.tz().hour() ||
                this.celebrityData.currentDate.m !== dayjs.tz().minute()
            ) {
                this.celebrityData.currentDate = {
                    d: dayjs.tz().day(),
                    h: dayjs.tz().hour(),
                    m: dayjs.tz().minute(),
                };
            }
            this.world_tip = formatTime();
        }, 1000);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v4/jx3world_v4.less";
</style>
