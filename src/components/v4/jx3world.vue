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
        <div class="m-world-content m-sideblock-list">
            <!-- 日常 名望 休闲 -->
            <div class="m-world-left">
                <!-- <daily :activities="activities"></daily> -->
                <daily></daily>
                <celebrity></celebrity>
                <reputation v-if="isCurrentWeek" :date="date" :client="client"></reputation>
                <!-- <activity :activities="activities"></activity> -->
            </div>
            <div class="m-baizhan">
                <el-divider>本周百战地图</el-divider>
                <baizhan-map :class="isPhone && 'is-map-phone'" mode="simple"></baizhan-map>
            </div>
            <div class="m-world-right">
                <horse></horse>
                <lucky-pet :date="date" :client="client"></lucky-pet>
                <!-- <furniture v-if="isCurrentWeek" :date="date" :client="client"></furniture> -->
            </div>
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
import BaizhanMap from "@jx3box/jx3box-bmap/src/components/BMap.vue";
import dayjs from "@/utils/day";
import { formatTime } from "@/utils";
import { getDailyFromOs } from "@/service/spider";
import dailyKeys from "@/assets/data/daily_keys.json";
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
        BaizhanMap,
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
@import "~@/assets/css/v4/jx3world.less";
</style>
