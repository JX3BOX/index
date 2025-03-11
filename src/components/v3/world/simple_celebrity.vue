<template>
    <tr>
        <td>
            <span>行侠·{{ info.nowMap }}</span>
        </td>
        <td>
            <el-tooltip placement="top" popper-class="celebrity-notice-tooltip">
                <div slot="content">
                    <div>{{ info.nowMap }}·{{ info.nowSite }}·{{ info.nowStage }}</div>
                </div>
                <span class="now" v-if="info.nowSite === info.nextSite">{{
                    info.nowSite + "·" + (info.nowStage.indexOf("·") > -1 ? info.nowStage.split("·")[1] : info.nowStage)
                }}</span>
                <span v-else class="now">{{ info.nowSite }}</span>
            </el-tooltip>
            <span> » </span>
            <el-tooltip placement="top" popper-class="celebrity-notice-tooltip">
                <div slot="content">
                    <div>{{ info.nextMap }}·{{ info.nextSite }}·{{ info.nextStage }}</div>
                </div>
                <template v-if="info.nowMap === info.nextMap">
                    <span v-if="info.nowSite === info.nextSite">{{
                        info.nextStage.indexOf("·") > -1 ? info.nextStage.split("·")[1] : info.nextStage
                    }}</span>
                    <span v-else>{{ info.nextSite }}</span>
                </template>
                <span v-else>{{ info.nextMap }}·{{ info.nextSite }}</span>
            </el-tooltip>
        </td>
    </tr>
</template>

<script>
export default {
    name: "SimpleCelebrity",
    inject: ["celebrity"],
    data() {
        return {};
    },
    computed: {
        info() {
            const list = this.celebrity().list;
            const date = this.celebrity().currentDate;
            const key = "c" + (date.h % 2 === 0 ? "0" : "1") + (date.m < 30 ? "0" : "1");
            const nextDate = new Date(new Date().getTime() + 30 * 60 * 1000);
            const nextKey =
                "c" + (nextDate.getHours() % 2 === 0 ? "0" : "1") + (nextDate.getMinutes() < 30 ? "0" : "1");
            const info = {
                nowMap: "",
                nowSite: "",
                nowStage: "",
                nextMap: "",
                nextSite: "",
                nextStage: "",
            };
            if (list.length) {
                const arr = list.filter((item) => item.key === key);
                const nextArr = list.filter((item) => item.key === nextKey);
                let index = 0;
                const mArr = arr.map((item) => Number(item.time));
                if (mArr.includes(date.m)) {
                    index = mArr.indexOf(date.m);
                } else {
                    const i = mArr.findIndex((item) => item > date.m);
                    index = i > -1 ? i - 1 : arr.length - 1;
                }
                // console.log(arr, index);
                const item = arr[index];
                let nextItem = (nextItem = arr[index + 1]);
                if (index === arr.length - 1) {
                    nextItem = nextArr[0];
                }
                info.nowMap = item.map;
                info.nowSite = item.site;
                info.nowStage = item.stage;
                info.nextMap = nextItem.map;
                info.nextSite = nextItem.site;
                info.nextStage = nextItem.stage;
            }
            return info;
        },
    },
    methods: {
        getCelebrityLink() {
            return `/celebrity`;
        },
    },
};
</script>
