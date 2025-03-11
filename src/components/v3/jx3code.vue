<template>
    <div class="m-jx3code m-sideblock" v-if="data && data.length">
        <div class="m-jx3code-header m-sideblock-header">
            <div class="u-left">
                <span class="u-title"
                    ><img class="u-icon" svg-inline src="@/assets/img/left/coupon.svg" />今日福利</span
                >
            </div>
            <div class="u-right">
                <span class="u-time">
                    <!-- {{ showTime(time) }} -->
                </span>
            </div>
        </div>
        <div class="m-jx3code-content">
            <div class="u-codebox" v-for="(item, i) in data" :key="i">
                <div class="u-code" @click="copy(item.title)" :style="{ color: item.color || '#f98003' }">
                    {{ item.title }}
                </div>
                <a v-if="item.remark" :href="item.remark" target="_blank">
                    {{ item.desc }}
                </a>
                <div class="u-desc" v-else>{{ item.desc }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getConfigBanner } from "@/service/cms";
import { showTime } from "@jx3box/jx3box-common/js/moment";
export default {
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
        time: function () {
            return this.data?.[0]?.updated_at ? new Date(this.data?.[0]?.updated_at) : new Date();
        },
    },
    methods: {
        copy(text) {
            navigator.clipboard.writeText(text);
            this.$message({
                message: "复制成功",
                type: "success",
            });
        },
        showTime,
    },
    created: function () {
        getConfigBanner({ client: this.client, type: "code", status: 1, _valid: 1 }).then((res) => {
            this.data = res.data.data.list || [];
        });
    },
    components: {},
};
</script>
<style lang="less">
@import "~@/assets/css/v3/jx3code.less";
</style>
