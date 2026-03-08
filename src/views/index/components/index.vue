<template>
    <div class="m-index-popup" v-if="success" v-show="visible">
        <!-- 贺卡 -->
        <iframe class="m-holiday-iframe" :style="eventStyle" :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
import { __Root } from "@/config/data/jx3box.json";
import { getBoxCoin, getEventDetail } from "@/service/index";
import User from "@/config/js/user";
export default {
    name: "Festival",
    data: function () {
        return {
            success: false,
            visible: true,
            count: 20,
            data: {},
            done: sessionStorage.getItem("festival_id"),
            check: false,

            record_id: 0,
        };
    },
    computed: {
        event_id() {
            return ~~this.$store.state.config.festival_id;
        },
        event_status() {
            return !!~~this.$store.state.config.festival_enable;
        },
        event_test() {
            return !!~~this.$store.state.config.festival_test;
        },
        url() {
            let url = `${__Root}card?uid=${User.getInfo().uid}&event_id=${this.event_id}`;
            if (this.record_id) {
                url += `&id=${this.record_id}`;
            }
            return url;
        },
        eventStyle() {
            return {
                width: this.data.meta?.width || "100%",
                height: this.data.meta?.height || "100%",
            };
        },
    },
    methods: {
        checked() {
            this.check = true;
        },
        close() {
            this.visible = false;
        },
        async init() {
            if ((this.event_status && this.event_id) || (this.event_test && User.isSuperAdmin())) {
                console.log("尝试触发贺卡事件");
                window.addEventListener("message", this.handleIframeMessage);
                const res = await getEventDetail(this.event_id);
                this.data = res.data.data;
                if (!this.done) {
                    getBoxCoin(this.event_id)
                        .then((res) => {
                            console.log("成功触发贺卡事件");
                            this.data = res.data?.data;
                            this.count = res.data?.data?.boxcoin || res.data?.data?.points || 0;
                            this.success = true;
                            sessionStorage.setItem("festival_id", this.event_id);
                            this.record_id = res.data?.data?.trigger_log_id || 0;
                        })
                        .catch((err) => {
                            console.log("贺卡触发失败", err);
                            this.closeIframe();
                        });
                } else {
                    this.closeIframe();
                }
            }
        },
        handleIframeMessage(event) {
            if (event.data === "closeHolidayCard") {
                this.closeIframe();
            }
        },
        closeIframe() {
            window.removeEventListener("message", this.handleIframeMessage);
            this.close();
        },
    },
    watch: {
        "$store.state.config": {
            handler() {
                this.init();
            },
            deep: true,
        },
    },
    beforeUnmount() {
        window.removeEventListener("message", this.handleIframeMessage);
    },
    mounted() {
        if (User.isLogin()) {
            this.init();
        }
    },
};
</script>

<style lang="less">
.m-index-popup {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}

.m-holiday-iframe {
    width: min(900px, 100%);
    height: min(600px, 100%);
    border: 0;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}
</style>
