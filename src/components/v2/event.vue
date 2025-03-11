<!--
 * @Author: iRuxu
 * @Date: 2022-05-20 17:38:03
 * @LastEditTime: 2022-06-22 23:48:47
 * @Description:
-->
<template>
    <div class="m-event-wrapper" v-if="data && data.length">
        <div class="m-event" id="m-event" v-loading="loading">
            <a class="u-event" v-for="(item, index) in data" :key="index" :href="item.link" target="_blank" rel="noopener noreferrer">
                <img :src="resolveImagePath(item.img)" :alt="item.title" />
            </a>
        </div>
        <!-- <a class="u-more" href="/notice?subtype=2" target="_blank"><span>往期活动</span></a> -->
    </div>
</template>

<script>
import { getConfigBanner } from "@/service/cms";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "event",
    props: [],
    data: function () {
        return {
            data: [],
            loading: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        params: function () {
            return {
                client: this.client,
                type:"common",
                subtype: "event",
                per: 6, 
                status: 1 
            };
        },
    },
    methods: {
        loadData: function () {
            this.loading = true;
            return getConfigBanner(this.params)
                .then((res) => {
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        resolveImagePath,
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/event.less";
</style>
