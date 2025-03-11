<!-- 江湖模块 包含开服、日常、周常、买卖入口等 -->
<template>
    <div class="m-world m-sideblock" v-if="isStd">
        <div class="m-world-header m-sideblock-header">
            <div class="u-left">
                <!-- <el-tooltip effect="dark" content="开服监控" placement="top">
                    <a href="/app/servers2" target="_blank">
                        <i class="u-status" :class="is_open ? 'open' : 'closed'"></i>
                        <svg-icon class-name="u-icon" icon-class="world" />
                    </a>
                </el-tooltip> -->
                <i class="u-icon el-icon-s-flag"></i>
                <a class="u-title" href="/pvg/gonggao/daily" target="_blank">江湖快报</a>
                <!-- <div class="u-mode-list">
                    <span
                        :class="`u-mode u-mode-${mode} ${item.value == mode ? 'is-active' : ''}`"
                        v-for="item in mode_list"
                        :key="item.value"
                        @click="switchMode(item.value)"
                        >{{ item.label }}</span
                    >
                </div> -->
            </div>
            <div class="u-right">
                <span class="world-tip">{{ world_tip }}</span>
                <!-- <el-tooltip effect="dark" :content="more_title" placement="top"> -->
                <!-- <a :href="more_link" title="查看全部" class="u-more" target="_blank" rel="noopener noreferrer">
                    <i class="el-icon-more"></i>
                </a> -->
                <!-- </el-tooltip> -->
            </div>
        </div>
        <div class="m-world-content m-sideblock-list">
            <!-- 开服监控 -->
            <!-- <servers v-if="is_first" v-loading="serverLoading" :list="serverList"></servers> -->
            <!-- 其它 日常 名望 休闲 -->
            <div class="other-list" v-if="client == 'std'">
                <celebrity></celebrity>
                <daily></daily>
                <horse></horse>
                <leisure></leisure>
            </div>
        </div>
    </div>
</template>

<script>
import { getServers } from "@/service/spider";
// import { getCelebrities } from "@/service/node";
// import servers from "@/components/v3/world/servers.vue";
import daily from "@/components/v3/world/daily.vue";
import leisure from "@/components/v3/world/leisure.vue";
import celebrity from "@/components/v3/world/celebrity.vue";
import horse from "@/components/v3/world/horse.vue";
import dayjs from "dayjs";
export default {
    name: "JX3World",
    components: {
        //  servers,
        daily,
        leisure,
        celebrity,
        horse
    },
    provide() {
        return {
            celebrity: () => this.celebrityData,
        };
    },
    data() {
        return {
            mode: "celebrity",
            mode_list: [
                {
                    value: "celebrity",
                    label: "名望",
                    link: "/calendar",
                },
                {
                    value: "daily",
                    label: "日常",
                    link: "/calendar",
                },
                {
                    value: "leisure",
                    label: "休闲",
                    link: "/calendar",
                },
            ],
            serverLoading: false,
            serverList: [],
            celebrityData: {
                list: [],
                currentDate: {
                    d: new Date().getDay(),
                    h: new Date().getHours(),
                    m: new Date().getMinutes(),
                },
            },
            world_tip: dayjs().format("YYYY-MM-DD HH:mm"),
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        isStd() {
            return this.$store.state.client === "std";
        },
        // world_tip() {
        // const date = new Date();
        // const month = date.getMonth() + 1;
        // const dateFormat =
        //     date.getFullYear() +
        //     "-" +
        //     (month < 10 ? "0" + month : month) +
        //     "-" +
        //     (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
        // const time =
        //     " " +
        //     (this.celebrityData.currentDate.h < 10
        //         ? "0" + this.celebrityData.currentDate.h
        //         : this.celebrityData.currentDate.h) +
        //     ":" +
        //     (this.celebrityData.currentDate.m < 10
        //         ? "0" + this.celebrityData.currentDate.m
        //         : this.celebrityData.currentDate.m);
        // return dateFormat + time;
        // },
        more_link() {
            return this.mode_list.find((item) => item.value === this.mode).link;
        },
        more_title() {
            return "更多" + this.mode_list.find((item) => item.value === this.mode).label;
        },
        is_first() {
            // 暂定周一周四7点到12点 显示开服。
            let is_first = false;
            const dayArr = [1, 4];
            const day = this.celebrityData.currentDate.d;
            const hour = this.celebrityData.currentDate.h;
            if (dayArr.includes(day) && hour >= 7 && hour < 12) {
                is_first = true;
            }
            return is_first;
        },
        is_open() {
            let bol = false;
            const sLen = this.serverList.length;
            if (sLen) {
                const openLen = this.serverList.filter((item) => item.connect_state).length;
                if (openLen / sLen > 0.8) {
                    bol = true;
                }
            }
            return bol;
        },
    },
    methods: {
        switchMode(val) {
            this.mode = val;
        },
        getServerList() {
            this.serverLoading = true;
            getServers()
                .then((res) => {
                    this.serverLoading = false;
                    this.serverList = res.data.map((item) => {
                        return {
                            ...item,
                            serverName: item.main_server,
                        };
                    });
                })
                .catch(() => {
                    this.serverLoading = false;
                });
        },
        // getCelebrities() {
        //     getCelebrities().then((res) => {
        //         this.celebrityData.list = res.data;
        //     });
        // },
    },
    created() {
        // this.getServerList();
        // this.getCelebrities();
    },
    mounted() {
        setInterval(() => {
            if (
                this.celebrityData.currentDate.h !== new Date().getHours() ||
                this.celebrityData.currentDate.m !== new Date().getMinutes()
            ) {
                this.celebrityData.currentDate = {
                    d: new Date().getDay(),
                    h: new Date().getHours(),
                    m: new Date().getMinutes(),
                };
                this.world_tip = dayjs().format("YYYY-MM-DD HH:mm");
            }
        }, 1000);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v3/jx3world.less";
</style>
