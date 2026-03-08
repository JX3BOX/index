<template>
    <section class="m-world-v5-report">
        <div class="m-world-v5-report__card m-world-v5-report__card--baizhan">
            <div class="m-world-v5-report__header">
                <h3 class="m-world-v5-report__title">百战地图</h3>
            </div>
            <baizhan></baizhan>
        </div>

        <div class="m-world-v5-report__card m-world-v5-report__card--celebrity">
            <div class="m-world-v5-report__header">
                <h3 class="m-world-v5-report__title">
                    名望<template v-if="celebrityTitleSuffix"> · {{ celebrityTitleSuffix }}</template>
                </h3>
                <el-dropdown
                    class="m-world-v5-report__celebrity-switch"
                    trigger="click"
                    @command="handleCelebrityTypeChange"
                >
                    <span class="u-switch-text">
                        {{ celebritySwitchLabel }}
                        <i class="u-switch-arrow el-icon-arrow-down"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                v-for="type in celebrityTypes"
                                :key="type.value"
                                :command="type.value"
                                :class="{ 'is-active': type.value === celebrityType }"
                            >
                                {{ type.switchLabel }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <celebrity
                :show-header="false"
                :show-switch="false"
                :type-value="celebrityType"
                @type-change="handleCelebrityTypeChange"
            ></celebrity>
        </div>

        <div class="m-world-v5-report__card m-world-v5-report__card--horse">
            <div class="m-world-v5-report__header">
                <h3 class="m-world-v5-report__title">抓马速递</h3>
            </div>
            <horse-notice :server="selectedServer" :client="client"></horse-notice>
        </div>

        <div class="m-world-v5-report__card m-world-v5-report__card--pet">
            <div class="m-world-v5-report__header">
                <h3 class="m-world-v5-report__title">福缘宠物</h3>
            </div>
            <lucky-pet :date="date" :client="client"></lucky-pet>
        </div>

        <div v-if="isCurrentWeek" class="m-world-v5-report__card m-world-v5-report__card--reputation">
            <div class="m-world-v5-report__header">
                <h3 class="m-world-v5-report__title">家园声望</h3>
            </div>
            <reputation :date="date" :client="client"></reputation>
        </div>

        <div class="m-world-v5-report__card m-world-v5-report__card--mrt">
            <div class="m-world-v5-report__header">
                <h3 class="m-world-v5-report__title">美人图 · {{ selectedServer || "蝶恋花" }}</h3>
            </div>
            <mrt :selected-server="selectedServer"></mrt>
        </div>
    </section>
</template>

<script>
import celebrity from "./celebrity.vue";
import luckyPet from "./lucky_pet.vue";
import reputation from "./reputation.vue";
import baizhan from "./baizhan_mini.vue";
import mrt from "./meirentu.vue";
import horseNotice from "./horse_notice.vue";

export default {
    name: "IndexWorldReportV5",
    components: {
        celebrity,
        horseNotice,
        luckyPet,
        reputation,
        baizhan,
        mrt,
    },
    props: {
        date: {
            type: String,
            default: "",
        },
        client: {
            type: String,
            default: "std",
        },
        isCurrentWeek: {
            type: Boolean,
            default: false,
        },
        selectedServer: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            celebrityType: "3",
            celebrityTypes: [
                {
                    switchLabel: "穹野卫",
                    titleLabel: "伊丽川",
                    value: "3",
                },
                {
                    switchLabel: "披风会",
                    titleLabel: "河西瀚漠",
                    value: "2",
                },
                {
                    switchLabel: "云从社",
                    titleLabel: "",
                    value: "1",
                },
                {
                    switchLabel: "楚天社",
                    titleLabel: "",
                    value: "0",
                },
            ],
        };
    },
    computed: {
        celebritySwitchLabel() {
            const type = this.celebrityTypes.find((item) => item.value === this.celebrityType);
            return type ? type.switchLabel : "穹野卫";
        },
        celebrityTitleSuffix() {
            const type = this.celebrityTypes.find((item) => item.value === this.celebrityType);
            return type ? type.titleLabel : "伊丽川";
        },
    },
    methods: {
        handleCelebrityTypeChange(type) {
            this.celebrityType = type;
        },
    },
};
</script>

<style lang="less">
.m-world-v5-report {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.m-world-v5-report__card {
    background: #f8f9fc;
    border-radius: 16px;
    padding: 16px;
    border: 1px solid rgba(0, 0, 0, 0.02);
}

.m-world-v5-report__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .u-more {
        color: #cbd5e1;
        font-size: 14px;
    }
}

.m-world-v5-report__celebrity-switch {
    flex: 0 0 auto;
}

.m-world-v5-report__celebrity-switch .u-switch-text {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #5f6bff;
    line-height: 1.2;
    cursor: pointer;
    user-select: none;
}

.m-world-v5-report__celebrity-switch .u-switch-arrow {
    font-size: 12px;
    color: #a9b3c2;
}

.m-world-v5-report__title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1a1c2e;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    flex: 0 1 auto;

    &::before {
        content: "";
        width: 4px;
        height: 14px;
        background: @v4primary;
        border-radius: 2px;
    }
}

.m-world-v5-report__card {
    .el-divider {
        display: none;
    }
}

.m-world-v5-report__card--baizhan {
    .m-btn-wrapper {
        margin-top: 0 !important;
        display: grid !important;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .el-button {
        background: white;
        border: 1px solid #e2e8f0;
        padding: 8px 10px;
        border-radius: 10px;
        font-size: 12px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #475569;
        transition: all 0.2s;

        &:hover {
            border-color: @v4primary;
            color: @v4primary;
        }
    }
}

.m-world-v5-report__card--celebrity {
    .u-table-header {
        display: none;
    }

    .u-table-body {
        margin-top: 0 !important;
    }

    .u-row {
        grid-template-columns: 60px 1fr 80px !important;
        padding: 10px 0 !important;
        font-size: 13px !important;
        border-bottom: 1px dashed #e2e8f0;
        align-items: center;
    }

    .u-row:last-child {
        border-bottom: none;
    }

    .u-item {
        text-align: left !important;
        padding: 0 !important;
    }

    .u-item:first-child {
        color: #64748b;
        font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    .u-item:last-child {
        text-align: right !important;
    }

    .current-item {
        color: #f59e0b;
        font-weight: 600;
    }
}

.m-world-v5-report__card--horse {
    padding-top: 14px;
}

.m-world-v5-report__card--pet {
    .u-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 0;
    }

    .u-item:last-child {
        margin-bottom: 0;
    }

    .u-pet {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        flex: 1;
    }

    .u-pet-icon {
        width: 28px !important;
        height: 28px !important;
        border-radius: 50% !important;
        background: #e2e8f0;
        overflow: hidden;
        border: 1px solid white;
        box-shadow: 0 2px 5px rgba(15, 23, 42, 0.18);
    }

    .u-pet-name {
        font-size: 13px;
        color: #111827;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .u-npc {
        font-size: 12px;
        line-height: 1;
        color: #64748b;
        white-space: nowrap;
        margin-left: 10px;
    }
}

.m-world-v5-report__card--reputation {
    .u-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 0;
    }

    .u-item:last-child {
        margin-bottom: 0;
    }

    .u-pet {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        flex: 1;
    }

    .u-pet-icon {
        width: 28px !important;
        height: 28px !important;
        border-radius: 50% !important;
        background: #e2e8f0;
        overflow: hidden;
        border: 1px solid white;
        box-shadow: 0 2px 5px rgba(15, 23, 42, 0.18);
    }

    .u-pet-name {
        font-size: 13px;
        color: #111827;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.m-world-v5-report__card--mrt {
    .m-mrt-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 13px;
        border-bottom: 1px dashed #e2e8f0;
    }

    .m-mrt-item:last-child {
        border-bottom: none;
    }

    .m-mrt-item.active {
        color: @v4primary;
        font-weight: 600;
    }

    .u-desc {
        background: #eef2ff;
        // color: @v4primary;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
    }

    .u-week {
        font-size: 12px;
        color: #94a3b8;
        margin-left: 6px;
    }
}
</style>
