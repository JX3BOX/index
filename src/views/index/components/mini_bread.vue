<template>
    <span class="m-mini-bread">
        <a
            :href="item.link"
            class="u-link"
            v-for="(item, key) in data"
            :key="key"
            target="_blank"
            v-show="item.status && item.meta_4 == client"
            :style="{ color: item.meta_1 }"
            >{{ item.meta_3 }}{{ item.label }}</a
        >
    </span>
</template>

<script>
import { getMenus } from "@/service/cms";
export default {
    name: "MiniBread",
    props: ["name"],
    components: {},
    data: function () {
        return {
            data: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        load: function () {
            if (!this.name) return;
            getMenus(this.name).then((res) => {
                const data = res?.data?.data?.val || [];
                // 过滤仅保留 meta_4 == this.client，且 status=true 的第一条数据
                const hit = data.find((item) => item.meta_4 == this.client && item.status);
                this.data = hit ? [hit] : [];
            });
        },
    },
    watch: {
        client: {
            immediate: true,
            handler: function () {
                this.load();
            },
        },
        name: function () {
            this.load();
        },
    },
    mounted: function () {
        // this.init();
    },
};
</script>
