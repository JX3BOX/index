<template>
    <div class="m-left m-sidebar">
        <div class="m-left-box">
            <!-- <assistant /> -->
            <calendar />
            <jx3code />
            <servers />
            <gamenews />
            <notice />
        </div>
        <div class="m-fixed-box">
            <feedback />
            <qrcode />
        </div>
    </div>
</template>
<script>
// import assistant from "@/components/v2/assistant.vue";
import calendar from "@/components/v2/calendar.vue";
import jx3code from "@/components/v3/jx3code.vue";
import gamenews from "@/components/index/gamenews.vue";
import servers from "@/components/index/servers.vue";
import notice from "@/components/index/notice.vue";
import feedback from "@/components/v2/feedback.vue";
import qrcode from "@/components/v2/qrcode.vue";
export default {
    name: "left",
    components: {
        // assistant,
        calendar,
        jx3code,
        gamenews,
        servers,
        notice,
        feedback,
        qrcode,
    },
};
</script>
<style lang="less">
    @import "~@/assets/css/v2/sideblock.less";
</style>
