<template>
    <div v-loading="loading" class="m-celebrity m-sideblock" v-if="client == 'std'">
        <div class="m-sideblock-header celebrity-header">
            <div class="u-left">
                <span class="u-title"><i class="u-icon el-icon-s-help"></i> 名望·楚天社 </span>
            </div>
            <div class="u-right desc">
                <span class="map"
                    >{{ currentMap.map }}
                    <!--({{ currentMap.tasks }})-->
                </span>
                <span class="arrow">»</span>
                <span class="next-map"
                    >{{ nextMap.map }}{{ nextMap.stages ? "(" + nextMap.stages[0].site + ")" : "" }}</span
                >
            </div>
        </div>
        <div class="m-celebrity-content">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>时间</th>
                        <th>地图</th>
                        <th>地点</th>
                        <th>阶段</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <!-- <tr class="pre-item">
            <td></td>
            <td>{{ list[0].timeFormat }}</td>
            <td>{{ list[0].map }}</td>
            <td>{{ list[0].site }}</td>
            <td><span><img :src="require(`@/assets/img/icon/minimap_${list[0].icon || 6}.png`)" />{{ list[0].stage }}</span></td>
          </tr> -->
                    <el-tooltip placement="top" popper-class="celebrity-notice-tooltip">
                        <div slot="content">
                            <div>{{ list[1].desc }}</div>
                        </div>
                        <tr class="current-item">
                            <td>
                                <i class="el-icon-caret-right"></i>
                            </td>
                            <td>{{ list[1].timeFormat }}</td>
                            <td>{{ list[1].map }}</td>
                            <td>{{ list[1].site }}</td>
                            <td>
                                <span
                                    ><img :src="require(`@/assets/img/icon/minimap_${list[1].icon || 6}.png`)" />{{
                                        list[1].stage
                                    }}</span
                                >
                            </td>
                        </tr>
                    </el-tooltip>
                    <el-tooltip placement="bottom" popper-class="celebrity-notice-tooltip">
                        <div slot="content">
                            <div>{{ list[2].desc }}</div>
                        </div>
                        <tr>
                            <td></td>
                            <td>{{ list[2].timeFormat }}</td>
                            <td>{{ list[2].map }}</td>
                            <td>{{ list[2].site }}</td>
                            <td>
                                <span
                                    ><img :src="require(`@/assets/img/icon/minimap_${list[2].icon || 6}.png`)" />{{
                                        list[2].stage
                                    }}</span
                                >
                            </td>
                        </tr>
                    </el-tooltip>
                    <!-- <tr
            v-for="(item, i) in list"
            :key="i"
            :class="[(i===1)&&'current-item', (i===0)&&'pre-item']"
          >
            <td>
              <i
                v-if="(i===1)"
                class="el-icon-caret-right"
              ></i>
            </td>
            <td>{{ item.timeFormat }}</td>
            <td>{{ item.map }}</td>
            <td>{{ item.site }}</td>
            <td>{{ item.stage }}</td>
          </tr> -->
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
// import celebrityData from "@/assets/data/celebrity.json";
import { getCelebrities } from "@/service/node";
// const currentTime = new Date("2022-12-07 00:01")
export default {
    name: "celebrity",
    data: function () {
        return {
            celebrityData: {},
            loading: false,
            currentMap: {},
            nextMap: {},
            list: [],
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
                    const arr = res.data.map((item) => {
                        item.time = Number(item.time);
                        item.icon = Number(item.icon);
                        return item;
                    });
                    const obj = {};
                    arr.forEach((item) => {
                        if (!obj[item.key]) {
                            obj[item.key] = {
                                stages: [item],
                                map: item.map,
                                tasks: arr.filter((oItem) => oItem.key === item.key).length,
                            };
                        } else {
                            obj[item.key].stages.push(item);
                        }
                    });
                    this.celebrityData = obj;
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
            const hF = h < 0 ? "23" : h < 10 ? "0" + h : h > 23 ? "00" : h;
            const hM = m < 10 ? "0" + m : m;
            return hF + ":" + hM;
        },
        getList(date) {
            const celebrityData = this.celebrityData;
            const key = "c" + (date.h % 2 === 0 ? "0" : "1") + (date.m < 30 ? "0" : "1");
            const preDate = new Date(new Date().getTime() - 30 * 60 * 1000);
            const nextDate = new Date(new Date().getTime() + 30 * 60 * 1000);
            const preKey = "c" + (preDate.getHours() % 2 === 0 ? "0" : "1") + (preDate.getMinutes() < 30 ? "0" : "1");
            const nextKey =
                "c" + (nextDate.getHours() % 2 === 0 ? "0" : "1") + (nextDate.getMinutes() < 30 ? "0" : "1");
            this.currentMap = celebrityData[key];
            this.nextMap = celebrityData[nextKey];
            let currentIndex = 0;
            const stages = this.currentMap.stages;
            const stageLen = stages.length;
            if (stages.find((item) => item.time === date.m)) {
                // 当前时间等于阶段内的某个时间
                currentIndex = stages.findIndex((item) => item.time === date.m);
            } else {
                // 当前时间不等于阶段内的时间
                const index = stages.findIndex((item) => item.time > date.m);
                currentIndex = index > -1 ? index - 1 : stageLen - 1;
            }
            let currentStage = {};
            let preStage = {};
            let nextStage = {};
            const h = date.h;
            const m = date.m;
            if (currentIndex > 0 && currentIndex < stageLen - 1) {
                // 当前阶段位于当前地图的中间
                preStage = Object.assign(stages[currentIndex - 1], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[currentIndex - 1].time),
                });
                currentStage = Object.assign(stages[currentIndex], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[currentIndex].time),
                });
                nextStage = Object.assign(stages[currentIndex + 1], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[currentIndex + 1].time),
                });
            } else if (currentIndex === 0) {
                // 当前阶段位于当前地图的第一个
                preStage = Object.assign(celebrityData[preKey].stages[celebrityData[preKey].stages.length - 1], {
                    map: celebrityData[preKey].map,
                    // 当前时间为0 或者当前时间大于0且小于30时但是未到下一个时间
                    timeFormat: this.toFormatTime(
                        m === 0 || (m < stages[1].time && m < 30) ? h - 1 : h,
                        celebrityData[preKey].stages[celebrityData[preKey].stages.length - 1].time
                    ),
                });
                currentStage = Object.assign(stages[0], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[0].time),
                });
                nextStage = Object.assign(stages[1], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[1].time),
                });
            } else if (currentIndex === stageLen - 1) {
                // 当前阶段位于当前地图的最后一个
                preStage = Object.assign(stages[stageLen - 2], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[stageLen - 2].time),
                });
                currentStage = Object.assign(stages[stageLen - 1], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[stageLen - 1].time),
                });
                nextStage = Object.assign(celebrityData[nextKey].stages[0], {
                    map: celebrityData[nextKey].map,
                    timeFormat: this.toFormatTime(m > 30 ? h + 1 : h, celebrityData[nextKey].stages[0].time),
                });
            } else {
                // 找不到当前阶段取上个地图的最后一个阶段 currentIndex = -1
                // 例如：当前时间为30，但是当前地图的第一个阶段为31时，目前不存在
                // 当前为0， 当前地图的第一个阶段为1时
                preStage = Object.assign(celebrityData[preKey].stages[celebrityData[preKey].stages.length - 2], {
                    map: celebrityData[preKey].map,
                    timeFormat: this.toFormatTime(
                        m === 0 || m < (stages[1].time && m < 30) ? h - 1 : h,
                        celebrityData[preKey].stages[celebrityData[preKey].stages.length - 2].time
                    ),
                });
                currentStage = Object.assign(celebrityData[preKey].stages[celebrityData[preKey].stages.length - 1], {
                    map: celebrityData[preKey].map,
                    timeFormat: this.toFormatTime(
                        m === 0 || m < (stages[1].time && m < 30) ? h - 1 : h,
                        celebrityData[preKey].stages[celebrityData[preKey].stages.length - 1]
                    ),
                });
                nextStage = Object.assign(stages[0], {
                    map: celebrityData[key].map,
                    timeFormat: this.toFormatTime(h, stages[0].time),
                });
            }
            this.list = [preStage, currentStage, nextStage];
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
@import "~@/assets/css/v2/celebrity.less";
</style>
