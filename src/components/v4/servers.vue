<template>
    <section class="m-world-v5-servers">
        <div class="m-world-v5-servers__header">
            <h3 class="u-title">
                <i class="u-icon el-icon-connection"></i>
                <span>实时服况</span>
            </h3>
        </div>

        <div class="m-servers-content">
            <div class="u-list" v-if="serversData.length">
                <div class="u-item" v-for="(item, i) in serversData" :key="i" v-show="cansee(item)">
                    <el-tooltip class="item" effect="dark" :content="item.serverName" placement="top">
                        <span class="u-status" :class="{ on: item.connect_state }"></span>
                    </el-tooltip>
                    <span class="u-name">{{ item.serverName }}</span>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
import { getServers } from "@/service/spider";

export default {
    name: "IndexWorldServersV5",
    props: {
        selectedServer: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            serversData: [],
            sheetVisible: false,
            localSelectedServer: "",
            heatStateArr: [
                {
                    value: "6",
                    label: "流畅",
                    class: "is-open",
                },
                {
                    value: "7",
                    label: "繁忙",
                    class: "is-busy",
                },
                {
                    value: "8",
                    label: "爆满",
                    class: "is-full-load",
                },
                {
                    value: "3",
                    label: "维护",
                    class: "is-close",
                },
            ],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        storeServer: function () {
            return (this.$store && this.$store.state && this.$store.state.server) || "";
        },
        visibleServers: function () {
            return this.serversData.filter((item) => this.cansee(item));
        },
        currentServerName: function () {
            if (!this.visibleServers.length) return "";
            const current = this.selectedServer || this.localSelectedServer || this.storeServer;
            const found = this.visibleServers.find((item) => item.serverName === current);
            return (found && found.serverName) || this.visibleServers[0].serverName;
        },
        currentServer: function () {
            return this.visibleServers.find((item) => item.serverName === this.currentServerName) || null;
        },
        avgHeat: function () {
            const validList = this.visibleServers.map((item) => item.heat).filter((item) => Number.isFinite(item) && item >= 0);
            if (!validList.length) return null;
            return Math.round(validList.reduce((sum, val) => sum + val, 0) / validList.length);
        },
        avgHeatText: function () {
            return Number.isFinite(this.avgHeat) ? `${this.avgHeat}ms` : "--";
        },
        stateText: function () {
            if (!this.currentServer) return "未知";
            return this.getHeatState(this.currentServer).label;
        },
        stateClass: function () {
            if (!this.currentServer) return "is-unknown";
            const heatState = this.getHeatState(this.currentServer);
            return heatState.class || "is-unknown";
        },
    },
    watch: {
        selectedServer: {
            immediate: true,
            handler: function (val) {
                if (val) this.localSelectedServer = val;
            },
        },
        visibleServers: {
            immediate: true,
            handler: function (list) {
                if (!list.length) return;
                if (this.currentServerName) {
                    this.$store.state.server = this.currentServerName;
                    this.$emit("change-server", this.currentServerName);
                }
            },
        },
    },
    methods: {
        cansee: function (item) {
            const zoneName = (item && item.zoneName) || "";
            const clientType = zoneName === "缘起大区" ? "origin" : "std";
            return this.client === clientType;
        },
        getHeatState(item) {
            const heat = item && item.heat !== undefined && item.heat !== null ? String(item.heat) : "";
            const matched = this.heatStateArr.find((state) => state.value === heat);
            if (matched) return matched;

            if (item && item.connect_state) {
                return {
                    value: "6",
                    label: "流畅",
                    class: "is-open",
                };
            }
            return {
                value: "3",
                label: "维护",
                class: "is-close",
            };
        },
        parseState: function (item) {
            const raw =
                item && Object.prototype.hasOwnProperty.call(item, "connect_state")
                    ? item.connect_state
                    : item && item.connectState;
            if (typeof raw === "boolean") return raw;
            if (typeof raw === "number") return raw === 1;
            if (typeof raw === "string") return ["1", "true", "open", "ok", "normal", "healthy"].includes(raw.toLowerCase());
            return !!raw;
        },
        parseHeat: function (item) {
            if (!item || typeof item !== "object") return null;
            const raw = item.heat;
            if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw);
            if (typeof raw === "string") {
                const match = raw.match(/-?\d+(\.\d+)?/);
                if (match) {
                    const val = Number(match[0]);
                    if (Number.isFinite(val)) return Math.round(val);
                }
            }
            return null;
        },
        loadServers: function () {
            getServers().then((res) => {
                const data = Array.isArray(res.data)
                    ? res.data
                    : res && res.data && Array.isArray(res.data.data)
                      ? res.data.data
                      : [];

                const servers = data
                    .map((item) => {
                        const name =
                            item.main_server ||
                            item.mainServer ||
                            item.server_name ||
                            item.serverName ||
                            item.server ||
                            "";
                        return {
                        ...item,
                        serverName: name,
                        zoneName: item.zone_name || item.zoneName || "",
                        connect_state: this.parseState(item),
                        heat: this.parseHeat(item),
                        };
                    })
                    .filter((item) => item.serverName);

                this.serversData = servers;
            });
        },
        toggleSheet: function () {
            this.sheetVisible = !this.sheetVisible;
        },
        closeSheet: function () {
            this.sheetVisible = false;
        },
        selectServer: function (serverName) {
            this.localSelectedServer = serverName;
            this.$store.state.server = serverName;
            this.$emit("change-server", serverName);
            this.closeSheet();
        },
    },
    mounted: function () {
        this.loadServers();
    },
};
</script>

<style lang="less">
.m-servers-content {
    // padding:15px 0 15px 15px;
    padding: 15px 15px 10px 15px;

    .clearfix;
    .u-list {
        // padding: 0 10px;
        .clearfix;
    }
    .u-item {
        .fl;
        // .w(80px);
        // .mr(15px);
        .mr(8px);
        .mb(8px);
        cursor: default;
        .nobreak;

        color: #666;
        &:hover {
            color: #555;
        }
        .pr;
    }
    .u-status {
        .db;
        // .dbi;.y;
        .size(12px);
        // .size(8px);
        background-color: #aaa;
        // .mr(8px);
        &.on {
            background-color: #c6e48b;
        }
    }
    .u-myserver {
        // .pa;.rt(0);
        .fz(14px);
        color: #f93;
    }
    .u-name {
        .fz(12px,30px);
        .none;
    }
}
.m-world-v5-servers {
    background: #f8f9fc;
    border-radius: 16px;
    padding: 16px;
    border: 1px solid rgba(0, 0, 0, 0.02);
}

.m-world-v5-servers__header {
    margin-bottom: 12px;

    .u-title {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: #1a1c2e;
        display: flex;
        align-items: center;
        gap: 6px;

        .u-icon {
            color: #4caf7c;
            font-size: 16px;
        }
    }
}

.m-world-v5-servers__panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.m-world-v5-servers__panel .u-row {
    min-height: 62px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.m-world-v5-servers__panel .u-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
}

.m-world-v5-servers__panel .u-latency {
    font-size: 12px;
    font-weight: 600;
    color: #2e8b57;
    line-height: 1.2;
    white-space: nowrap;
}

.u-server-trigger {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: none;
    background: transparent;
    padding: 0;
    color: #475569;
    cursor: pointer;
}

.u-server-name {
    font-size: 12px;
    font-weight: 600;
}

.u-arrow {
    font-size: 12px;
    color: #94a3b8;
    transition: transform 0.22s ease;
}

.u-arrow.is-open {
    transform: rotate(180deg);
}

.u-state {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;

    .u-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: currentColor;
    }

    &.is-open {
        color: #50aa7b;
    }
    &.is-busy {
        color: #ab6e34;
    }
    &.is-full-load {
        color: #ea6567;
    }
    &.is-close {
        color: #8c8c8c;
    }
    &.is-unknown {
        color: #94a3b8;
    }
}

.w-world-v5-sheet__mask {
    position: fixed;
    inset: 0;
    z-index: 3000;
    background: rgba(15, 23, 42, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
}

.w-world-v5-sheet {
    width: min(420px, calc(100vw - 12px));
    background: #f3f4f6;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
    transform: translateY(0);
}

.w-world-v5-sheet__title {
    text-align: center;
    font-size: 24px;
    line-height: 1;
    transform: scale(0.5);
    transform-origin: center;
    margin: -6px 0 10px;
    color: #1f2937;
    font-weight: 700;
}

.w-world-v5-sheet__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.w-world-v5-sheet__item {
    border: none;
    background: #e9eaec;
    border-radius: 10px;
    padding: 8px 8px 7px;
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    cursor: pointer;
}

.w-world-v5-sheet__item .u-name {
    font-size: 13px;
    color: #2f3948;
    .nobreak;
}

.w-world-v5-sheet__item .u-right {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #50aa7b;
}

.w-world-v5-sheet__item .u-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: currentColor;
}

.w-world-v5-sheet__item.is-close .u-right {
    color: #808080;
}

.w-world-v5-sheet__item.is-open .u-right {
    color: #50aa7b;
}

.w-world-v5-sheet__item.is-busy .u-right {
    color: #ab6e34;
}

.w-world-v5-sheet__item.is-full-load .u-right {
    color: #ea6567;
}

.w-world-v5-sheet__item .u-state-text {
    font-size: 11px;
    color: currentColor;
    font-weight: 600;
}

.w-world-v5-sheet__item.is-active {
    box-shadow: inset 0 0 0 1px #4f46e5;
}

.w-world-v5-sheet-fade-enter-active,
.w-world-v5-sheet-fade-leave-active {
    transition: opacity 0.22s ease;
}

.w-world-v5-sheet-fade-enter,
.w-world-v5-sheet-fade-leave-to {
    opacity: 0;
}

.w-world-v5-sheet-fade-enter-active .w-world-v5-sheet {
    animation: w-world-v5-sheet-up 0.22s ease;
}

.w-world-v5-sheet-fade-leave-active .w-world-v5-sheet {
    animation: w-world-v5-sheet-down 0.16s ease;
}

@keyframes w-world-v5-sheet-up {
    from {
        transform: translateY(8px) scale(0.98);
    }
    to {
        transform: translateY(0) scale(1);
    }
}

@keyframes w-world-v5-sheet-down {
    from {
        transform: translateY(0) scale(1);
    }
    to {
        transform: translateY(8px) scale(0.98);
    }
}

@media screen and (max-width: @phone) {
    .w-world-v5-sheet {
        width: calc(100vw - 8px);
    }
}
</style>
