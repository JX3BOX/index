<template>
    <div class="m-world-block m-world-mrt">
        <el-divider content-position="left">
            <span>美人图&nbsp;·&nbsp;</span>
            <el-select class="u-select" v-model="server">
                <el-option v-for="(server, i) in servers" :key="i" :label="server" :value="server"></el-option>
            </el-select>
        </el-divider>

        <div class="m-mrt-item" :class="!i && 'active'" v-for="(item, i) in list" :key="i">
            <div class="u-name">
                {{ item.title }}
            </div>
            <div class="u-right">
                <!-- eslint-disable-next-line vue/no-parsing-error -->
                <span class="u-desc" v-if="item.body">{{ `< ${item.body} >` }}</span>
                <!-- eslint-disable-next-line vue/no-parsing-error -->
                <span class="u-week">{{ `< ${item.week} >` }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { bodyMap } from "@jx3box/jx3box-data/data/role/body.json";
import schoolMap from "@jx3box/jx3box-data/data/xf/schoolid.json";
import dayjs from "@/utils/day";
import { getMeirentuNew } from "@/service/spider";
export default {
    props: {
        selectedServer: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            server: "",
            list: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
        storeServer: function () {
            return (this.$store && this.$store.state && this.$store.state.server) || "";
        },
        serverWhitelist: function () {
            return this.client == "std" ? servers_std : servers_origin;
        },
        servers: function () {
            return this.serverWhitelist;
        },
    },
    watch: {
        server: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.$store.state.server = val;
                this.load();
            },
        },
        selectedServer: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.server = val;
            },
        },
        storeServer: {
            immediate: true,
            handler(val) {
                if (!val) return;
                if (val !== this.server) this.server = val;
            },
        },
        servers: {
            immediate: true,
            handler(list) {
                if (!list.length) return;
                if (!this.server || !list.includes(this.server)) {
                    this.server = list[0];
                }
            },
        },
    },
    mounted() {
        this.server = this.selectedServer || this.storeServer || this.servers[0] || "梦江南";
    },
    methods: {
        getWeek(date) {
            var data = dayjs.tz(date).day();
            var week = ["日", "一", "二", "三", "四", "五", "六"];
            return "周" + week[data];
        },
        // 获取美人图
        load() {
            const params = {
                server: this.server,
                client: this.client,
            };
            getMeirentuNew(params).then((res) => {
                const list = (res.data?.data || []).map((item) => {
                    const data = item.item || {};
                    return {
                        date: item.date,
                        ...data,
                        week: this.getWeek(item.date || 0),
                        title: `${schoolMap[data.school_id]}${data.desc}画像`,
                        body: bodyMap[data.body_id],
                    };
                });
                const today = dayjs(new Date()).format("YYYY-MM-DD");
                if (today !== list?.[0]?.date) {
                    this.list = [
                        {
                            date: today,
                            week: this.getWeek(today),
                            title: "今日暂无画像",
                            body: "",
                        },
                        ...list.slice(0, 2),
                    ];
                } else {
                    this.list = list.slice(0, 3);
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/views/index/world/mrt.less";
</style>
