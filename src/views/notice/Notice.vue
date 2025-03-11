<template>
    <div class="p-notice" :class="theme_cls">
        <!--  :style="{backgroundImage:bg}" -->
        <Header :overlayEnable="true"></Header>
        <div class="p-notice-container wp">
            <div class="m-left m-sidebar">
                <div class="m-left-box">
                    <!-- <assistant /> -->
                    <!-- <calendar /> -->
                    <jx3code />
                    <!-- <servers /> -->
                    <gamenews />
                    <notice />
                </div>
                <div class="m-fixed-box">
                    <feedback />
                    <qrcode />
                </div>
            </div>
            <NoticeSingle v-if="id"></NoticeSingle>
            <NoticeList v-else></NoticeList>
        </div>
        <div class="p-notice-footer">
            <div class="wp">
                <Footer></Footer>
            </div>
        </div>
    </div>
</template>

<script>
import { theme } from "../../../setting.json";
import NoticeList from "@/views/notice/components/NoticeList.vue";
import NoticeSingle from "@/views/notice/components/NoticeSingle.vue";
// 左侧
// import assistant from "@/components/v2/assistant.vue";
import calendar from "@/components/v2/calendar.vue";
import jx3code from "@/components/v3/jx3code.vue";
import gamenews from "@/components/index/gamenews.vue";
// import servers from "@/components/index/servers.vue";
import notice from "@/components/index/notice.vue";
import feedback from "@/components/v2/feedback.vue";
import qrcode from "@/components/v2/qrcode.vue";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Notice",
    props: [],
    components: {
        NoticeList,
        NoticeSingle,
        // 左侧
        // assistant,
        // calendar,
        jx3code,
        gamenews,
        // servers,
        notice,
        feedback,
        qrcode,
    },
    data: function () {
        return {};
    },
    computed: {
        id: function () {
            let _list = location.pathname.split("/");
            if (_list.length > 2) {
                return ~~_list[2];
            }
            return false;
        },
        client: function () {
            return this.$store.state.client;
        },
        theme_cls: function () {
            return "theme-" + theme[this.client];
        },
        bg: function () {
            return `url(${__imgPath}topic/${theme[this.client]}/kv.jpg)`;
        },
    },
    watch: {},
    methods: {
        handleScroll() {
            $(document).scroll(function () {
                let notice = $(".p-notice-container").innerHeight() - $(".p-notice-container").height();
                let scrollTop = $(document).scrollTop();
                let height = $(".m-left-box").outerHeight() + notice;
                if (scrollTop >= height) {
                    $(".m-fixed-box").addClass("m-fixed");
                } else {
                    $(".m-fixed-box").removeClass("m-fixed");
                }
            });
        },
    },
    filters: {},
    created: function () {},
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
};
</script>

<style lang="less">
    // @import "~@/assets/css/kv.less";
    @import "~@/assets/css/v2/sideblock.less";
    @import "~@/assets/css/v2/responsive.less";
    @import "~@/assets/css/notice/common.less";
</style>
