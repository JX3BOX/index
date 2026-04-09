<template>
    <div class="m-versions">
        <div class="m-versions-header">
            <h3 class="m-versions-title">
                {{ $t("index.database.versions.title") }}
            </h3>
        </div>
        <div class="m-versions-content">
            <div class="u-empty" v-if="version.length === 0">
                {{ $t("index.database.versions.loading") }}
            </div>
            <div class="u-list" v-else>
                <el-tooltip
                    placement="top"
                    popper-class="m-versions-tooltip"
                    v-for="_type in all_types"
                    :key="_type"
                    :enterable="true"
                >
                    <template #content>
                        <div class="m-versions-content__popover">
                            <p v-for="data in version.filter((v) => v.type === _type)" :key="data.name">
                                <span class="u-detail-label">{{ data.label }}</span>
                                <span class="u-detail-time">
                                    {{ $t("index.database.versions.updatedAt", { time: showRecently(data.time) }) }}
                                </span>
                                <br />
                            </p>
                        </div>
                    </template>
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
import { moment, showRecently, showDate } from "@/utils/moment";

export default {
    name: "DatabaseVersions",
    props: {
        client: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            version: [],
            count: {},
        };
    },
    computed: {
        currentClient: function () {
            return this.client || (location.href.includes("origin") ? "origin" : "std");
        },
        all_types: function () {
            return [...new Set((this.version || []).map((item) => item.type).filter(Boolean))];
        },
    },
    methods: {
        showRecently,
        showDisplayTime: function (type) {
            const recentlyTime = this.version
                .filter((item) => item.type === type)
                .sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())[0];
            return recentlyTime ? showDate(recentlyTime.time) : "-";
        },
        getStat: function () {
            getDatabaseStat({ client: this.currentClient })
                .then((res) => {
                    const data = res?.data?.data || res?.data || {};
                    const version = Array.isArray(data.version)
                        ? [...data.version].sort(
                              (a, b) => String(a?.label || "").length - String(b?.label || "").length
                          )
                        : [];
                    const count = { ...data };
                    delete count.version;

                    this.version = version;
                    this.count = count;
                })
                .catch(() => {
                    this.version = [];
                    this.count = {};
                });
        },
    },
    watch: {
        currentClient: {
            handler: function () {
                this.getStat();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.m-versions {
    background: #f8f9fc;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.02);
    padding: 16px;
}

.m-versions-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
}

.m-versions-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1a1c2e;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &::before {
        content: "";
        width: 4px;
        height: 14px;
        background: @v4primary;
        border-radius: 2px;
    }

    .u-icon {
        font-size: 13px;
        color: #1f2937;
    }
}

.m-versions-content {
    padding: 0;

    .u-empty {
        text-align: center;
        color: #94a3b8;
        font-size: 12px;
        line-height: 1.8;
        padding: 8px 0 4px;
    }

    .u-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0;
        flex-wrap: nowrap;
        overflow-x: auto;
    }

    .u-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1 0 0;
        font-size: 12px;
        line-height: 1.5;
        padding: 0 10px;
        min-height: 48px;
        min-width: 84px;
        position: relative;
        cursor: pointer;
        white-space: nowrap;
    }

    .u-item + .u-item::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 28px;
        background: #e5e7eb;
    }

    .u-item-type {
        font-weight: bold;
        color: #1f2937;
    }

    .u-item-time {
        color: #64748b;
        margin-top: 2px;
    }
}

.m-versions-tooltip .m-versions-content__popover {
    min-width: 180px;

    p {
        margin: 0 0 4px;
    }

    .u-detail-label {
        margin-right: 16px;
        color: #e5e7eb;
    }

    .u-detail-time {
        float: right;
        color: #cbd5e1;
    }
}

@media screen and (max-width: @phone) {
    .m-versions {
        padding: 14px;
        border-radius: 14px;
    }

    .m-versions-content {
        .u-item + .u-item::before {
            height: 24px;
        }
    }
}
</style>
