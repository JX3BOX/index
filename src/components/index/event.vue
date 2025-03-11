<template>
<div class="m-event-wrapper">
    <div class="m-event" v-if="ready" id="m-event">
        <div class="u-event" v-for="(item, i) in data" :key="i">
            <a :href="item.link" rel="noopener noreferrer" :target="target">
                <i :style="{ backgroundColor: item.bgcolor }">
                    <img :src="item.img | resolveImagePath" />
                </i>
            </a>
        </div>
    </div>
</div>
</template>

<script>
import { buildTarget, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { getSliders } from "@/service/cms";
import lodash from "lodash";
export default {
    name: "event",
    props: [],
    data: function () {
        return {
            data: [],
            count: 5,
        };
    },
    computed: {
        ready : function (){
            return  this.data && this.data.length && this.event_status
        },
        client: function () {
            return this.$store.state.client;
        },
        event_status: function () {
            return this.client == "origin"
                ? ~~this.$store.state.config.origin_event_status
                : ~~this.$store.state.config.event_status;
        },
        target: function () {
            return buildTarget();
        },
    },
    methods: {
        loadData: function () {
            return getSliders("event", this.client, 10).then((res) => {
                this.data = res.data.data;
            });
        },
        calcCount: function () {
            let containerWith =
                window.innerWidth > 1280
                    ? window.innerWidth - 370
                    : window.innerWidth - 40;
            return Math.floor(containerWith / (240 + 20));
        },
        renderSlider: function () {
            let count = this.calcCount() || this.count;
            $("#m-event").slick({
                infinite: true,
                slidesToShow: count,
                slidesToScroll: count - 1,
                responsive: [
                    {
                        breakpoint: 2560,
                        settings: {
                            slidesToShow: 8,
                            slidesToScroll: 8,
                        },
                    },
                    {
                        breakpoint: 1920,
                        settings: {
                            slidesToShow: 6,
                            slidesToScroll: 6,
                        },
                    },
                    {
                        breakpoint: 1680,
                        settings: {
                            slidesToShow: 5,
                            slidesToScroll: 5,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4,
                        },
                    },
                    {
                        breakpoint: 420,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ],
            });
            // $('.slick-active').last().css('margin-right', '0')

            // $('#m-event').on('afterChange', function(event, slick, direction){
            //     $('.slick-active').last().css('margin-right', '0')
            //     console.log(11)
            // });
        },
        bindResizeEvent: function () {
            const vm = this;
            window.onresize = function () {
                lodash.debounce(vm.renderSlider, 500)();
            };
        },
        init: function () {
            this.loadData().then(() => {
                this.renderSlider();

                // this.bindResizeEvent()
            });
        },
    },
    mounted: function () {
        this.init();
    },
    filters: { resolveImagePath },
};
</script>

<style lang="less">
@import "../../assets/css/index/event.less";
</style>
