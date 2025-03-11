<template>
    <div class="m-celebrity-content">
        <table>
            <thead>
                <tr>
                    <th>时间</th>
                    <!-- <th>地图</th> -->
                    <th>地点</th>
                    <th>阶段</th>
                </tr>
            </thead>
            <tbody v-if="list.length">
                <el-tooltip v-for="(item, i) in list" :key="i" placement="top" popper-class="celebrity-notice-tooltip">
                    <div slot="content">
                        <div>{{ item.desc }}</div>
                    </div>
                    <tr :class="!i && 'current-item'">
                        <td>
                            <i v-if="!i" class="el-icon-caret-right"></i>
                            <span>{{ item.timeFormat }}</span>
                        </td>
                        <!-- <td>{{ item.map }}</td> -->
                        <td>{{ item.map + "·" + item.site }}</td>
                        <td>
                            <span
                                ><img :src="require(`@/assets/img/icon/minimap_${item.icon || 6}.png`)" />{{
                                    item.stage
                                }}</span
                            >
                        </td>
                    </tr>
                </el-tooltip>
            </tbody>
        </table>
    </div>
</template>
<script>
import { getCelebrities } from "@/service/node";
export default {
    name: "celebrity",
    data: function () {
        return {
            loading: false,
            list: [],
            celebrityList: [],
            currentDate: {
                h: new Date().getHours(),
                m: new Date().getMinutes(),
            },
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        loadData: function () {
            this.loading = true;
            return getCelebrities()
                .then((res) => {
                    this.celebrityList = res.data.map((item) => {
                        item.icon = Number(item.icon);
                        item.time = Number(item.time);
                        return item;
                    });
                })
                .finally(() => {
                    this.getList(this.currentDate);
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        toFormatTime(h, m) {
            const formatM = m.toString().padStart(2, "00");
            return `${h}:${formatM}`.padStart(5, "00:00");
        },
        getList(date) {
            const currentKey = "c" + (date.h % 2 === 0 ? "0" : "1") + (date.m < 30 ? "0" : "1");
            const isEqualMinute = this.celebrityList.findIndex((item) => {
                return item.key === currentKey && item.time === date.m;
            });
            let index = 0;
            if (isEqualMinute !== -1) {
                // 包含当前时间
                index = isEqualMinute;
            } else {
                // 不包含
                const nIndex = this.celebrityList.findIndex((item) => {
                    return item.key === currentKey && item.time > date.m;
                });
                if (nIndex === -1) {
                    // 当前key中最后一个
                    index = this.celebrityList.findLastIndex((item) => {
                        return item.key === currentKey;
                    });
                } else {
                    index = nIndex - 1;
                }
            }
            // 13: 57
            let list = this.celebrityList.slice(index, index + 3);
            let newList = [];
            if (list.length < 3) {
                newList = list.concat(this.celebrityList.slice(0, 3 - list.length));
            } else {
                newList = [].concat(list);
            }
            this.list = newList.map((item) => {
                // 当前时间
                let h = this.currentDate.h;
                // "双数整点 c00 双数半点 c01 单数整点 c10 单数半点 c11" "烂柯山 晟江 百溪 楚州"
                // 烂柯山 晟江/烂柯山 晟江 不变
                // 晟江 百溪/晟江 百溪 加1
                // 百溪 楚州/百溪 楚州 不变
                // 楚州 烂柯山/楚州 烂柯山 加1
                if (currentKey === "c01" && item.key === "c10") {
                    h = h + 1;
                }
                if (currentKey === "c11" && item.key === "c00") {
                    h = h + 1;
                }
                item.h = h;
                item.timeFormat = this.toFormatTime(h, item.time);
                return item;
            });
        },
    },
    watch: {
        currentDate: {
            immediate: true,
            deep: true,
            handler(date) {
                if (this.list.length) {
                    this.getList(date);
                }
            },
        },
    },
    created() {
        this.loadData();
    },
    mounted() {
        setInterval(() => {
            if (this.currentDate.h !== new Date().getHours() || this.currentDate.m !== new Date().getMinutes()) {
                this.currentDate = {
                    h: new Date().getHours(),
                    m: new Date().getMinutes(),
                };
            }
        }, 1000);
    },
};
</script>
<style lang="less">
@import "~@/assets/css/v3/world/celebrity.less";
</style>
