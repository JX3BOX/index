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
        init: function () {
            getMenus(this.name).then((res) => {
                this.data = res?.data?.data?.val || [];
            });
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>
