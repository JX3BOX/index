<template>
    <section class="m-world-v5-servers">
        <div class="m-world-v5-report__header m-world-v5-servers__header">
            <h3 class="m-world-v5-report__title u-title">
                <span>{{ $t("index.world.serversTitle") }}</span>
            </h3>
            <button class="u-server-trigger" @click="toggleSheet">
                <span class="u-server-name">{{ currentServerName || $t("index.world.chooseServer") }}</span>
                <span class="u-arrow" :class="{ 'is-open': sheetVisible }">▾</span>
            </button>
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

        <el-dialog
            v-model="sheetVisible"
            class="w-world-v5-server-dialog"
            :title="$t('index.world.chooseServer')"
            width="560px"
            align-center
            append-to-body
            :show-close="true"
            :close-on-click-modal="true"
            :close-on-press-escape="true"
            @open="pendingServer = currentServerName"
            @closed="pendingServer = ''"
        >
            <div class="w-world-v5-sheet__list">
                <button
                    type="button"
                    class="w-world-v5-sheet__item"
                    :class="[getHeatState(item).class, { 'is-active': item.serverName === pendingServer }]"
                    :aria-pressed="item.serverName === pendingServer"
                    v-for="item in visibleServers"
                    :key="item.serverName"
                    @click="selectServer(item.serverName)"
                >
                    <span class="u-name">{{ item.serverName }}</span>
                    <span class="u-right">
                        <span class="u-dot" aria-hidden="true"></span>
                        <span class="u-state-text">{{ getHeatState(item).label }}</span>
                    </span>
                    <svg v-if="item.serverName === pendingServer" class="u-selected" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <template #footer>
                <el-button @click="closeSheet">{{ $t("index.world.cancel") }}</el-button>
                <el-button type="primary" :disabled="!pendingServer" @click="confirmServer">
                    {{ $t("index.world.confirm") }}
                </el-button>
            </template>
        </el-dialog>
    </section>
</template>

<script>
import { getServers } from "@/service/spider";
import serverStd from "@jx3box/jx3box-data/data/server/server_std.json";
import serverOrigin from "@jx3box/jx3box-data/data/server/server_origin.json";
import serverInternational from "@jx3box/jx3box-data/data/server/server_international.json";

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
            pendingServer: "",
            localSelectedServer: "",
            heatStateArr: [
                {
                    value: "6",
                    labelKey: "index.world.state.open",
                    class: "is-open",
                },
                {
                    value: "7",
                    labelKey: "index.world.state.busy",
                    class: "is-busy",
                },
                {
                    value: "8",
                    labelKey: "index.world.state.full",
                    class: "is-full-load",
                },
                {
                    value: "3",
                    labelKey: "index.world.state.close",
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
            const validList = this.visibleServers
                .map((item) => item.heat)
                .filter((item) => Number.isFinite(item) && item >= 0);
            if (!validList.length) return null;
            return Math.round(validList.reduce((sum, val) => sum + val, 0) / validList.length);
        },
        avgHeatText: function () {
            return Number.isFinite(this.avgHeat) ? `${this.avgHeat}ms` : "--";
        },
        stateText: function () {
            if (!this.currentServer) return this.$t("index.world.state.unknown");
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
            const serverList = clientType === "origin" ? serverOrigin : [...serverStd, ...serverInternational];
            return this.client === clientType && serverList.includes(item.serverName);
        },
        getHeatState(item) {
            const heat = item && item.heat !== undefined && item.heat !== null ? String(item.heat) : "";
            const matched = this.heatStateArr.find((state) => state.value === heat);
            if (matched)
                return {
                    value: matched.value,
                    label: this.$t(matched.labelKey),
                    class: matched.class,
                };

            if (item && item.connect_state) {
                return {
                    value: "6",
                    label: this.$t("index.world.state.open"),
                    class: "is-open",
                };
            }
            return {
                value: "3",
                label: this.$t("index.world.state.close"),
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
            if (typeof raw === "string")
                return ["1", "true", "open", "ok", "normal", "healthy"].includes(raw.toLowerCase());
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
            this.pendingServer = serverName;
        },
        confirmServer: function () {
            const serverName = this.pendingServer;
            if (!this.visibleServers.some((item) => item.serverName === serverName)) return;
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
    padding: 15px 5px 10px 5px;

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
    display: flex;
    align-items: center;
    justify-content: space-between;

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
    color: #5f6bff;
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

.w-world-v5-server-dialog.el-dialog {
    max-width: calc(100vw - 32px);
    padding: 0;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    background: #fff;
    box-shadow: 0 24px 64px rgba(15, 23, 42, 0.16);
    overflow: hidden;

    .el-dialog__header {
        margin: 0;
        padding: 24px 64px 20px 28px;
        border-bottom: 1px solid #f0f1f5;
    }
    .el-dialog__title {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #1f2937;
        font-size: 18px;
        line-height: 26px;
        font-weight: 700;
        &::before {
            content: "";
            width: 4px;
            height: 18px;
            border-radius: 4px;
            background: @v4primary;
        }
    }
    .el-dialog__headerbtn {
        top: 19px;
        right: 20px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
        border-radius: 10px;
        background: #f8fafc;
        transition: background-color 0.15s;
        .el-dialog__close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin: 0;
            color: #64748b;
            font-size: 20px;
            line-height: 1;
            svg { display: block; }
        }
        &:hover, &:focus-visible {
            background: @v4bg;
            .el-dialog__close { color: @v4primary; }
        }
    }
    .el-dialog__footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 18px 28px;
        border-top: 1px solid #f0f1f5;
        .el-button {
            min-width: 80px;
            margin: 0;
            border-radius: 8px;
        }
        .el-button--primary {
            --el-button-bg-color: @v4primary;
            --el-button-border-color: @v4primary;
            --el-button-hover-bg-color: lighten(@v4primary, 6%);
            --el-button-hover-border-color: lighten(@v4primary, 6%);
            --el-button-active-bg-color: darken(@v4primary, 6%);
            --el-button-active-border-color: darken(@v4primary, 6%);
        }
    }
    .el-dialog__body {
        padding: 24px 28px 28px;
        max-height: calc(100vh - 260px);
        max-height: calc(100dvh - 260px);
        overflow-y: auto;
    }
}

.w-world-v5-sheet__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}

.w-world-v5-sheet__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    min-width: 0;
    padding: 12px 16px;
    border: 1px solid #e8ebf0;
    border-radius: 12px;
    background: #fff;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;

    .u-name {
        max-width: 100%;
        color: #374151;
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
        .nobreak;
    }
    .u-right {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #20ad83;
    }
    .u-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
    }
    .u-state-text {
        color: #6b7280;
        font-size: 12px;
        line-height: 18px;
    }
    .u-selected {
        position: absolute;
        right: 10px;
        bottom: 12px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        color: #fff;
        background: @v4primary;
    }
    &.is-close .u-right { color: #94a3b8; }
    &.is-busy .u-right { color: #f59e0b; }
    &.is-full-load .u-right { color: #f06478; }
    &:hover {
        background: #fafaff;
        border-color: #d4d1f5;
    }
    &:focus-visible {
        outline: 2px solid @v4primary;
        outline-offset: 3px;
    }
    &.is-active {
        border-color: fade(@v4primary, 65%);
        background: #f7f6ff;
        box-shadow: none;
        .u-name { color: @v4primary; }
    }
}

@media screen and (max-width: 480px) {
    .w-world-v5-server-dialog.el-dialog {
        border-radius: 20px;
        .el-dialog__header { padding-left: 20px; }
        .el-dialog__body { padding: 20px; }
    }
    .w-world-v5-sheet__list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
}
</style>
