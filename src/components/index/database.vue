<!-- 数据库版本的组件 -->
<template>
    <div class="m-database m-sideblock">
        <div class="m-database-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-grid"></i><a class="u-title" href="/app/database" target="_blank">数据库版本</a>
            </div>
            <div class="u-right">
                <a href="/app/database" class="u-more" title="访问数据库" target="_blank"
                    ><i class="el-icon-more"></i
                ></a>
            </div>
        </div>
        <div class="m-database-content">
            <div class="u-empty" v-if="version.length == 0">数据加载中...</div>
            <div class="u-list">
                <el-tooltip placement="top" v-for="_type in all_types" :key="_type" :enterable="true">
                    <div slot="content" class="m-database-content__popover">
                        <p v-for="data in version.filter((v) => v.type == _type)" :key="data.name">
                            <span class="u-detail-label">{{ data.label }}</span>
                            <span class="u-detail-time">更新于{{ showFromNowTime(data.time) }}</span>
                            <br />
                        </p>
                    </div>
                    <div class="u-item">
                        <span class="u-item-type">{{ _type }}</span>
                        <span class="u-item-time">{{ showDisplayTime(_type) }}</span>
                    </div>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { getDatabaseStat } from "@/service/node";
import { showRecently, showDate } from "@/utils/moment";
import { cloneDeep, uniq } from "lodash";
import { moment } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "database",
    data: function () {
        return {
            count: {},
            version: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        all_types: function () {
            return uniq(this.version.map((item) => item.type));
        },
    },
    methods: {
        showDisplayTime: function (type) {
            const recentlyTime = this.version
                .filter((item) => item.type == type)
                .sort((a, b) => moment(a.time).isBefore(moment(b.time)))[0];
            return showDate(recentlyTime.time);
        },
        showFromNowTime: function (time) {
            return showRecently(time);
        },
    },
    mounted() {
        getDatabaseStat({ client: this.client }).then((res) => {
            let data = res.data;
            this.version = cloneDeep(data.version).sort((a, b) => a.label.length - b.label.length);
            delete data.version;
            this.$set(this, "count", data);
        });
    },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index/database.less";
</style>
