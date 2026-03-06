<template>
    <section class="p-index-world-v5 bg-white rounded-xl shadow-sm border border-gray-200 border-opacity-60 mb-6">
        <header class="m-index-world-v5__header">
            <div class="u-title">
                <i class="u-icon el-icon-s-flag"></i>
                <span>江湖快报</span>
            </div>
            <div class="u-sync">{{ world_tip }}</div>
        </header>

        <div class="m-index-world-v5__content">
            <world-servers :selected-server="selectedServer" @change-server="handleServerChange"></world-servers>
            <world-report
                v-if="isStd"
                :date="date"
                :client="client"
                :is-current-week="isCurrentWeek"
                :selected-server="selectedServer"
            ></world-report>
        </div>

        <a
            class="m-index-world-v5__entry"
            href="/pvg/gonggao/daily"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span>进入江湖情报中央大厅</span>
            <i class="el-icon-arrow-right"></i>
        </a>
    </section>
</template>

<script>
import dayjs from "@/utils/day";
import { formatTime } from "@/utils";
import worldServers from "@/components/v5/world/servers.vue";
import worldReport from "@/components/v5/world/report.vue";

export default {
    name: "JX3WorldV5",
    components: {
        worldServers,
        worldReport,
    },
    data() {
        return {
            world_tip: formatTime(),
            ticker: null,
            selectedServer: "",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        isStd() {
            return this.client === "std";
        },
        date() {
            const hour = dayjs.tz().get("hours");
            return 0 <= hour && hour < 7
                ? dayjs.tz().subtract(1, "day").format("YYYY-MM-DD")
                : dayjs.tz().format("YYYY-MM-DD");
        },
        isCurrentWeek() {
            return dayjs.tz(this.date).isoWeek() === dayjs.tz().isoWeek();
        },
    },
    mounted() {
        this.ticker = setInterval(() => {
            this.world_tip = formatTime();
        }, 1000);
    },
    methods: {
        handleServerChange(server) {
            this.selectedServer = server || "";
            if (server) {
                this.$store.state.server = server;
            }
        },
    },
    beforeDestroy() {
        clearInterval(this.ticker);
        this.ticker = null;
    },
};
</script>

<style lang="less">
.p-index-world-v5 {
    //margin-top: 20px;
    // background: #ffffff;
    // border-radius: 24px;
    overflow: hidden;
    // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    // font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.m-index-world-v5__header {
    background: #1a1c2e;
    color: #ffffff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    .u-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 16px;
        line-height: 1;

        a {
            color: #ffffff;
        }
    }

    .u-icon {
        color: #fb7185;
        font-size: 16px;
    }

    .u-sync {
        font-size: 11px;
        // font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        opacity: 0.6;
        white-space: nowrap;
    }
}

.m-index-world-v5__content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.m-index-world-v5__entry {
    background: #f8f9fc;
    border-top: 1px solid #f1f5f9;
    padding: 16px;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    transition: color 0.2s ease;

    .el-icon-arrow-right {
        font-size: 10px;
        line-height: 1;
    }

    &:hover {
        color: #4f46e5;
    }
}

@media screen and (max-width: @phone) {
    .p-index-world-v5 {
        border-radius: 16px;
    }

    .m-index-world-v5__header {
        padding: 14px 16px;
    }

    .m-index-world-v5__content {
        padding: 12px;
        gap: 14px;
    }

    .m-index-world-v5__entry {
        padding: 14px;
        font-size: 14px;

        .el-icon-arrow-right {
            font-size: 10px;
        }
    }
}
</style>
