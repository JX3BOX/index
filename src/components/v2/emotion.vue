<template>
    <div class="m-emotion m-sideblock">
        <div class="m-emotion-title">✿今日趣图</div>
        <div class="m-emotion-list">
            <a v-for="(item, index) in list" :key="index" class="u-item" :href="`/emotion/${item.id}`" target="_blank">
                <img class="u-img" :src="showEmotion(item.url)" :alt="item.name" />
            </a>
        </div>
        <a class="m-emotion-more" href="/emotion"><i class="el-icon-s-promotion"></i>发张骚图</a>
    </div>
</template>

<script>
import { getEmotions } from "@/service/index";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "emotion",
    data() {
        return {
            list: [],
        };
    },
    methods: {
        loadData() {
            getEmotions({limit:12}).then((res) => {
                this.list = res?.data?.data || [];
            });
        },
        showEmotion(url){
            return getThumbnail(url)
        }
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/emotion.less";
</style>
