<template>
    <div class="m-face m-sideblock">
        <div class="m-face-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-camera-solid"></i> <a class="u-title" href="/face" target="_blank">最新捏脸</a>
            </div>
            <div class="u-right">
                <a href="/face" class="u-more" target="_blank" rel="noopener noreferrer" title="查看全部">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-face-content" v-loading="loading">
            <ul class="m-face-list" v-if="data && data.length">
                <li class="u-item" v-for="(item, i) in data" :key="i">
                    <a class="u-face" :target="target" :href="item.id | postLink">
                        <i class="u-img">
                            <img class="u-pic" :src="showThumb(item)" loading="lazy" />
                        </i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { buildTarget, getThumbnail, getLink } from "@jx3box/jx3box-common/js/utils";
import { getFaceList } from "@/service/index.js";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "face",
    props: [],
    components: {},
    data: function () {
        return {
            data: [],
            loading: false,
        };
    },
    computed: {
        target: function () {
            return buildTarget();
        },
        per: function () {
            return 9;
            let w = window.innerWidth;
            let space = w;
            let count = 10;
            if (w < 1280) {
                space = w - 30 * 2;
            } else if (w <= 1680) {
                space = w - 30 * 2 - 350;
            } else {
                space = w - 30 * 2 - 350 - 320;
            }
            count = Math.floor(space / 150) * 2;

            if (w < 768) {
                count = 9;
            }
            return count;
        },
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        showThumb: function (item) {
            let url = item.images[0];
            if (url) {
                return getThumbnail(url, 200);
            } else {
                return __imgPath + "image/face/null2.png";
            }
        },
    },
    filters: {
        postLink: function (id) {
            return getLink("face", id);
        },
    },
    mounted: function () {
        this.loading = true;
        getFaceList({
            pageSize: this.per,
            filter_empty_images: true,
            client: this.client,
        })
            .then((res) => {
                this.data = res.data.data.list || [];
            })
            .finally(() => {
                this.loading = false;
            });
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/face.less";
</style>
