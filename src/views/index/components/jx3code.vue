<template>
    <div
        class="m-jx3code bg-white p-5 shadow-xs border border-gray-200 border-opacity-60 mb-6"
        v-if="data && data.length"
    >
        <div class="m-jx3code-header">
            <div class="u-left">
                <span class="u-title text-xs flex items-center text-gray-800 uppercase tracking-widest m-0">
                    <img svg-inline src="@/assets/img/index/coupon.svg" class="w-4 h-4 mr-2 text-indigo-500" />
                    {{ $t("index.jx3code.title") }}</span
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
            data: [
                // {
                //     title: "jiansanhuanyingni",
                //     desc: "剑三欢迎你",
                //     link: "https://www.jx3box.com",
                //     remark: "2024-12-31 23:59:59",
                // }
            ],
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
                message: this.$t("index.jx3code.copySuccess"),
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
