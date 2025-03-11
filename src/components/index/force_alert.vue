<template>
    <el-dialog :visible="showAlert" custom-class="m-force-alert" @close="onClose" :show-close="false" :close-on-click-modal="false">
        <el-carousel :interval="4000" :height="height" :arrow="data.length > 1 ? 'always' : 'never'">
            <el-carousel-item v-for="item in data" :key="item.ID">
                <a :href="item.link" target="_blank">
                    <img class="u-main-img" :src="item.img" alt="" />
                </a>
            </el-carousel-item>
        </el-carousel>
        <div class="u-close" @click="onClose"></div>
    </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getConfigBanner } from "@/service/cms";
export default {
    name: "force_alert",
    data: function () {
        return {
            data: [],
            height: "300px",
        };
    },
    computed: {
        ...mapGetters(["showAlert"]),
        params() {
            return {
                client: this.$store.state.client,
                type: "alert",
                subtype: "index",
                per: 8,
                status: 1,
            };
        },
    },
    mounted() {
        this.loadEvent();

        if (window.innerWidth < 768) {
            this.height = "300px";
        } else {
            this.height = "600px";
        }
    },
    methods: {
        ...mapMutations(["setShowAlert"]),
        onClose() {
            this.setShowAlert(false);
            this.data.forEach((item) => {
                const key = `force_alert_${item.ID}`;
                localStorage.setItem(key, 1);
            });
        },
        loadEvent() {
            // 强制弹窗
            getConfigBanner(this.params).then((res) => {
                this.data = res.data.data.list;

                // 本地存储
                this.data = this.data.filter((item) => {
                    const key = `force_alert_${item.ID}`;
                    const value = localStorage.getItem(key);
                    return !value;
                });

                if (this.data?.length) {
                    this.setShowAlert(true);
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/index/force_alert.less";
</style>
