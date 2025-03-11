<template>
    <div class="m-live" v-if="live_status || video_status">
        <iframe :src="live_url" frameborder="0" v-if="live_status"></iframe>
        <iframe
            :src="video_url"
            scrolling="no"
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            v-if="video_status"
        ></iframe>
    </div>
</template>

<script>
export default {
    name: "",
    props: [],
    data: function () {
        return {};
    },
    computed: {
        live_url: function () {
            return this.$store.state.config.index_live_url;
        },
        live_status: function () {
            return ~~this.$store.state.config.index_live_status;
        },
        video_url: function () {
            return this.$store.state.config.index_video_url;
        },
        video_status: function () {
            return ~~this.$store.state.config.index_video_status;
        },
    },
    methods: {},
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/live.less";
</style>
