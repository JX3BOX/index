<template>
    <div class="m-servers m-sideblock">
        <div class="m-servers-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-platform"></i><a class="u-title" href="/pvg/gonggao/server" target="_blank">开服状态</a>
            </div>
            <div class="u-right">
                <a href="/pvg/gonggao/server" class="u-more" title="查看更多" target="_blank"><i class="el-icon-more"></i></a>
            </div>
        </div>
        <div class="m-servers-content">
            <div class="u-list" v-if="data.length">
                <div class="u-item" v-for="(item, i) in data" :key="i" v-show="cansee(item)">
                    <el-tooltip class="item" effect="dark" :content="item.serverName" placement="top">
                        <span class="u-status" :class="{ on: item.connect_state }"></span>
                    </el-tooltip>
                    <span class="u-name">{{ item.serverName }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getServers } from "@/service/spider";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
export default {
    name: "servers",
    props: [],
    data: function () {
        return {
            data: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        servers: function () {
            if (this.client == "origin") {
                return servers_origin;
            } else {
                return servers_std;
            }
        },
    },
    methods: {
        cansee: function (item) {
            return this.servers.includes(item.serverName);
        },
    },
    mounted: function () {
        getServers().then((res) => {
            this.data = res.data.map((item) => {
                return {
                    ...item,
                    serverName: item.main_server,
                };
            });
        });
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/servers.less";
</style>
