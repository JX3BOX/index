<template>
    <div class="m-world-block m-world-pet">
        <el-divider content-position="left">宠物</el-divider>
        <div class="m-pet">
            <a
                class="u-item"
                v-for="item in luckyList"
                :key="item.Index"
                :href="getPetLink(item.Index)"
                target="_blank"
            >
                <div class="u-pet">
                    <div class="u-pet-icon" :class="`u-quality-${item.Quality}`">
                        <img :src="iconLink(item.IconID)" :alt="item.Name" />
                    </div>
                    <span class="u-pet-name">{{ item.Name }}</span>
                </div>
                <span class="u-npc">&lt;{{ item.szTip }}&gt;</span>
            </a>
        </div>
    </div>
</template>

<script>
import { getPets, getPetLucky } from "@/service/spider";
import dayjs from "@/utils/day";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "lucky-pet",
    props: {
        date: {
            type: String,
            default: dayjs.tz().format("YYYY-MM-DD"),
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data() {
        return {
            luckyList: [],
        };
    },
    watch: {
        date: {
            immediate: true,
            handler() {
                if (this.client === "std") this.loadPetLucky();
            },
        },
    },
    methods: {
        iconLink,
        // 获取福缘宠物
        loadPetLucky: function () {
            getPetLucky().then((res) => {
                let data = res.data.std;
                let dateIndex = dayjs.tz(this.date).format("MDD");
                let ids = data[dateIndex];
                getPets(ids).then((res) => {
                    this.luckyList = res.data.list;
                });
            });
        },
        // 前往宠物单页
        getPetLink(id) {
            return `/pet/${id}`;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v4/world/pet.less";
</style>
