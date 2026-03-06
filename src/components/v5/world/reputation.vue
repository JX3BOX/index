<template>
    <div v-if="reputationList.length" class="m-world-block m-world-furniture">
        <el-divider content-position="left">家园声望</el-divider>
        <div class="m-furniture-item">
            <!-- <div class="u-title">家园声望</div> -->
            <div class="m-reputation">
                <a
                    class="u-reputation-item"
                    v-for="item in reputationList"
                    :key="item.id"
                    :href="getItemLink(item.id)"
                    target="_blank"
                >
                    <div class="u-reputation">
                        <el-tooltip class="box-item" effect="dark" :content="item.Desc" placement="top">
                            <div class="u-reputation-item">
                                <div class="u-reputation-icon" :class="`u-quality-${item.Quality}`">
                                    <img :src="iconLink(item.IconID)" :alt="item.Name" />
                                </div>
                                <span class="u-reputation-name">{{ item.Name }}</span>
                            </div>
                        </el-tooltip>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "@/utils/day";
import { getHomeReputation, getItems } from "@/service/spider";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Reputation",
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
            reputation: {},
        };
    },
    computed: {
        reputationList() {
            return this.reputation?.list || [];
        },
    },
    watch: {
        date: {
            immediate: true,
            handler() {
                if (this.client === "std") {
                    this.loadReputation();
                }
            },
        },
    },
    methods: {
        iconLink,
        getItemLink(id) {
            return `/item/view/${id}`;
        },
        // 家园声望
        loadReputation() {
            const cache = sessionStorage.getItem(`index_reputation_items`);
            if (cache) {
                const obj = JSON.parse(cache);
                if (obj.date === this.date) {
                    this.reputation = obj;
                    return;
                }
            }
            getHomeReputation(this.date, this.$store.state.server).then((res) => {
                const list = res.data?.data?.list || [];
                if (list.length) {
                    const ids = list.map((item) => {
                        return item.item_type_id + "_" + item.item_id;
                    });
                    this.loadItems(ids);
                }
            });
        },
        loadItems(ids) {
            // 读取本地数据
            if (!ids.length) return;
            getItems(ids).then((res) => {
                const list = res.data?.list || [];
                let newData = {
                    date: this.date,
                    list: list.map((item) => {
                        return {
                            id: item.id,
                            Name: item.Name.replace("声望·", ""),
                            IconID: item.IconID,
                            Quality: item.Quality,
                            Desc: /中(.*)\\\\\\/.exec(item.Desc)[1].trim(),
                        };
                    }),
                };
                this.reputation = newData;
                sessionStorage.setItem(`index_reputation_items`, JSON.stringify(newData));
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/v4/world/furniture.less";
</style>
