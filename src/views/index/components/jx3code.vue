<template>
    <div
        class="m-jx3code bg-white p-5 shadow-sm border border-gray-200 border-opacity-60 mb-6"
        v-if="data && data.length"
    >
        <div class="m-jx3code-header">
            <div class="u-left">
                <span class="u-title text-xs flex items-center text-gray-800 uppercase tracking-widest m-0">
                    <Icon name="coupon" class="u-icon w-4 h-4 mr-2" />
                    今日福利</span
                >
            </div>
            <div class="u-right">
                <span class="u-time">
                    {{ expire_at }}
                </span>
            </div>
        </div>
        <div class="m-jx3code-content">
            <div class="u-codebox" v-for="(item, i) in data" :key="i">
                <div class="u-code" @click="copy(item.title)" :style="{ color: item.color || '#fbc724' }">
                    {{ item.title }}
                </div>
                <a class="u-name" v-if="item.link" :href="item.link" target="_blank">
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
        expire_at: function () {
            return this.data?.[0]?.remark;
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
@import "@/assets/css/index/jx3code.less";
</style>
