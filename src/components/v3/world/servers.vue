<template>
    <div class="m-servers">
        <div class="m-servers-content">
            <div class="u-list" v-if="list.length">
                <div class="u-item" v-for="(item, i) in list" :key="i" v-show="cansee(item)">
                    <el-tooltip
                        class="item u-status"
                        :class="{ on: item.connect_state }"
                        effect="dark"
                        :content="item.serverName"
                        placement="bottom"
                    >
                        <!-- <svg-icon icon-class="world" /> -->
                        <span></span>
                    </el-tooltip>
                    <span class="u-name">{{ item.serverName }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
export default {
    name: "servers",
    props: ["list"],
    data: function () {
        return {};
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
};
</script>

<style lang="less">
// @import "~@/assets/css/v3/world/servers.less";
</style>
