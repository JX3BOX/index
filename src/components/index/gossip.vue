<template>
    <div class="m-sideblock m-gossip">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-watermelon"></i>
            <span class="u-title">近日吃瓜</span>
            <a
                href="/knowledge/#/type/gossip"
                class="u-more"
                target="_blank"
                rel="noopener noreferrer"
                title="查看更多"
            >
                <i class="el-icon-more"></i>
            </a>
        </div>
        <ul class="m-sideblock-list u-list" v-if="data.length">
            <li v-for="(item, i) in data" :key="i">
                <a
                    class="u-list-item"
                    target="_blank"
                    :href="item.link"
                    rel="noopener noreferrer"
                    :style="{ color: item.color }"
                    :class="{ isHighlight: !!item.color }"
                >
                    <el-image :src="item.img" class="m-gossip-img">
                    </el-image>
                    <div>
                        <span class="m-gossip-title">{{ item.title }}</span>
                        <span class="m-gossip-desc">{{ item.desc }}</span>
                    </div>
                </a>
            </li>
        </ul>
        <el-alert v-else title="近日无瓜" type="info" center show-icon :closable="false"></el-alert>
    </div>
</template>

<script>
import { getGossip } from "@/service/cms";
export default {
    name: "gossip",
    props: [],
    data: function () {
        return {
            data: [],
        };
    },
    computed: {},
    methods: {},
    created: function () {
        getGossip(8).then((res) => {
            this.data = res.data.data;
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/gossip.less";
</style>
