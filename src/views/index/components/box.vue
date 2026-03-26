<template>
    <section v-if="data && data.length" class="m-box-v5 bg-white shadow-xs border border-gray-200">
        <div class="m-box-v5__header flex items-center justify-between mb-8">
            <div class="m-box-v5__header-left flex items-center">
                <div class="u-header-icon-wrap">
                    <el-icon class="u-header-icon"><Menu /></el-icon>
                </div>
                <div class="u-header-meta">
                    <a class="u-title" href="/app" target="_blank">{{ $t("index.box.title") }}</a>
                    <mini-bread class="u-subtitle" name="index_notification" />
                </div>
            </div>

            <div class="m-box-v5__header-right flex items-center">
                <button class="u-btn u-btn--ghost" type="button" v-if="!!options.disabled" @click="active">
                    {{ $t("index.box.customize") }}
                </button>
                <button class="u-btn u-btn--dark" type="button" v-else @click="save">{{ $t("index.box.save") }}</button>
            </div>
        </div>

        <draggable
            class="m-box-v5__list"
            :class="{ isEditMode: !options.disabled }"
            tag="ul"
            v-model="data"
            @change="update"
            item-key="uuid"
            :disabled="options.disabled"
            :animation="options.animation"
        >
            <template #item="{ element: item, index }">
                <li
                    class="m-box-v5__item-wrapper"
                    :class="{
                        'u-lf': computedIsLF(item, index),
                        hidden: !canSee(item.uuid),
                    }"
                    v-show="item.status"
                    @click="onReport(item.href)"
                >
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.name"
                        :disabled="options.disabled"
                        placement="top"
                        :open-delay="50"
                    >
                        <a
                            :href="!options.disabled ? '' : item.href"
                            :target="item.href.startsWith('/') ? target : '_blank'"
                            class="m-box-v5__item group"
                            :class="{ 'u-doing': !item.status }"
                        >
                            <div class="m-box-v5__icon-box">
                                <img
                                    class="u-pic"
                                    :src="getBoxIcon(item.img)"
                                    :class="{ hidden: !canSee(item.uuid) }"
                                />
                                <span v-if="item.hasMark" class="u-mark-dot"></span>
                            </div>
                            <span class="u-txt">{{ showAbbr ? item.abbr : item.name }}</span>

                            <span class="u-control" @click.stop.prevent>
                                <el-icon
                                    class="u-break"
                                    :title="$t('index.box.tooltip.breakLine')"
                                    :class="{ on: isLF(item.uuid) }"
                                    @click.stop.prevent="cut(item.uuid)"
                                    ><Scissor
                                /></el-icon>
                                <el-icon
                                    class="u-hide"
                                    :title="$t('index.box.tooltip.hide')"
                                    v-if="canSee(item.uuid)"
                                    @click.stop.prevent="hideIt(item.uuid)"
                                    ><Delete
                                /></el-icon>
                                <el-icon
                                    class="u-show"
                                    :title="$t('index.box.tooltip.show')"
                                    v-if="!canSee(item.uuid)"
                                    @click.stop.prevent="showIt(item.uuid)"
                                    ><View
                                /></el-icon>
                            </span>

                            <i class="u-pop" v-if="isEditor && pop[item.uuid]"></i>
                        </a>
                    </el-tooltip>
                </li>
            </template>
        </draggable>

        <div class="m-box-v5__footer">
            <button class="u-btn u-btn--light" type="button" v-if="defined" @click="reset">{{ $t("index.box.reset") }}</button>
            <button class="u-btn u-btn--light" type="button" @click="downBoxSetting" v-if="isLogin">{{ $t("index.box.resync") }}</button>
        </div>
    </section>
</template>

<script>
import _ from "lodash";

// BOX设置
import box from "@/assets/data/box.json";
import { buildTarget } from "@jx3box/jx3box-common/js/utils";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import draggable from "vuedraggable";
import User from "@jx3box/jx3box-common/js/user";

import { getMeta, setMeta } from "@/service/user.js";
import { getHelperPnt, getMenu } from "@/service/setting.js";
import Mini_bread from "./mini_bread.vue";

const { __cdn } = JX3BOX;

const KEY = "boxmatrix";

export default {
    name: "box",
    props: [],
    components: {
        draggable,
        "mini-bread": Mini_bread,
    },
    data: function () {
        return {
            // 数据
            data: [],

            // 默认
            default_map: {},
            default_data: [],
            default_lf: [],
            default_order: [],

            // 自定义
            order: [],
            hide: [],
            lf: [],

            // UI
            options: {
                disabled: true,
                animation: 150,
            },
            showAbbr: true,

            // 云端
            isLogin: User.isLogin(),
            defined: false,

            // 仅管理可见
            isEditor: User.isEditor(),
            pop: {
                cj: false,
                knowledge: false,
                item: false,
            },
        };
    },
    computed: {
        target: function () {
            return buildTarget();
        },
        custom: function () {
            return {
                order: this.order,
                hide: this.hide,
                lf: this.lf,
            };
        },
        setting: function () {
            return JSON.stringify(this.custom);
        },
        client: function () {
            return this.$store.state.client;
        },
        userId: function () {
            return User.getInfo().uid;
        },
        prefix: function () {
            return this.client === "std" ? "www" : "origin";
        },
    },
    methods: {
        buildRawData(raw) {
            const client = location.href.includes("origin") ? "origin" : "std";
            const default_data =
                raw?.filter((item) => {
                    return item.client == "all" ? true : item.client == client;
                }) || [];
            this.data = this.default_data = default_data;

            const default_map = {};
            const default_lf = [];
            const default_order = [];

            _.each(default_data, (item) => {
                default_map[item.uuid] = item;
                if (item.lf) default_lf.push(item.uuid);
                default_order.push(item.uuid);
            });

            this.default_map = default_map;
            this.lf = this.default_lf = default_lf;
            this.order = this.default_order = default_order;
        },
        init: function () {
            getMenu("box")
                .then((res) => {
                    let _raw = res.data?.data?.val;
                    this.buildRawData(_raw);
                })
                .finally(() => {
                    this.getBoxSetting();
                });
        },
        getBoxSetting: function () {
            let val = localStorage.getItem(KEY);
            if (val) {
                try {
                    let data = JSON.parse(val);
                    this.buildData(data);
                } catch (e) {
                    console.log("[getBoxSetting]本地设置数据解析异常", e);
                }
            }
        },
        downBoxSetting: function () {
            getMeta(KEY).then((res) => {
                let val = res.data.data;
                if (val) {
                    try {
                        let data = JSON.parse(val);
                        this.buildData(data);
                        localStorage.setItem(KEY, this.setting);

                        this.$notify({
                            title: this.$t("index.box.notify.successTitle"),
                            message: this.$t("index.box.notify.syncToLocal"),
                            type: "success",
                        });
                    } catch (e) {
                        console.log("[downBoxSetting]远程设置数据解析异常", e);
                    }
                } else {
                    this.$notify({
                        title: this.$t("index.box.notify.infoTitle"),
                        message: this.$t("index.box.notify.noRemote"),
                        type: "info",
                    });
                }
            });
        },
        buildData: function (data) {
            if (data.order && data.order.length) {
                this.defined = true;

                if (data.order.length != this.default_order.length) {
                    let diff = _.difference(this.default_order, data.order);
                    this.order = data.order.concat(diff);
                } else {
                    this.order = data.order;
                }

                let custom_data = [];
                this.order.forEach((uuid) => {
                    if (this.default_map[uuid]) {
                        custom_data.push(this.default_map[uuid]);
                    }
                });
                this.data = custom_data;
            }
            if (data.hide && data.hide.length) {
                this.hide = data.hide;
                this.defined = true;
            }
            if (data.lf && data.lf.length) {
                this.lf = data.lf;
                this.defined = true;
            }
        },
        active: function () {
            this.options.disabled = false;
        },
        update: function () {
            let order = [];
            this.data.forEach((item) => {
                order.push(item.uuid);
            });
            this.order = order;
            this.defined = true;
        },
        save: function () {
            this.options.disabled = true;
            if (this.defined) {
                localStorage.setItem(KEY, this.setting);
                if (this.isLogin) {
                    setMeta(KEY, this.setting);
                }
            }
        },
        reset: function () {
            this.$alert(this.$t("index.box.notify.resetConfirmText"), this.$t("index.box.notify.resetConfirmTitle"), {
                confirmButtonText: this.$t("index.box.notify.resetConfirmBtn"),
                callback: (action) => {
                    if (action == "confirm") {
                        this.data = this.default_data;
                        this.order = [];
                        this.lf = this.default_lf;
                        this.hide = [];
                        this.defined = false;

                        localStorage.removeItem(KEY);
                        if (this.isLogin) {
                            setMeta(KEY, "");
                        }

                        this.$forceUpdate();

                        this.$notify({
                            title: this.$t("index.box.notify.successTitle"),
                            message: this.$t("index.box.notify.resetSuccess"),
                            type: "success",
                        });
                    }
                },
            });
        },
        canSee: function (uuid) {
            return !this.hide.includes(uuid);
        },
        hideIt: function (uuid) {
            this.hide.push(uuid);
            this.defined = true;
        },
        showIt: function (uuid) {
            let i = this.hide.indexOf(uuid);
            this.hide.splice(i, 1);
            this.defined = true;
        },
        isLF: function (uuid) {
            return this.lf.includes(uuid);
        },
        computedIsLF: function (item, index) {
            if (this.isLF(item.uuid)) return true;

            for (let i = index - 1; i >= 0; i--) {
                let prev = this.data[i];
                let isPrevVisible = false;

                if (!prev.status) {
                    isPrevVisible = false;
                } else if (!this.canSee(prev.uuid)) {
                    isPrevVisible = !this.options.disabled;
                } else {
                    isPrevVisible = true;
                }

                if (isPrevVisible) {
                    break;
                }

                if (this.isLF(prev.uuid)) {
                    return true;
                }
            }
            return false;
        },
        cut: function (uuid) {
            if (this.isLF(uuid)) {
                let i = this.lf.indexOf(uuid);
                this.lf.splice(i, 1);
            } else {
                this.lf.push(uuid);
            }
            this.defined = true;
        },
        getPop: function () {
            getHelperPnt().then((res) => {
                let data = res.data.data;
                for (let key in data) {
                    if (key == "achievement") {
                        this.pop.cj += ~~data[key];
                    } else if (key == "team_events_record" || key == "team_race") {
                        this.pop.team = ~~this.pop.team + ~~data[key];
                    } else if (key == "team_verify_log") {
                        this.pop.rank = ~~data[key];
                    } else if (this.pop[key]) {
                        this.pop[key] = ~~data[key];
                    }
                }
            });
        },
        onReport(href) {
            // reportNow({
            //     caller: "index_matrix",
            //     data: {
            //         item: `${this.prefix}:${href}`,
            //     },
            // });
        },
        getBoxIcon(val) {
            const v = val ? String(val).replace(".png", ".svg") : "";
            return __cdn + "logo/logo-light/" + v;
        },
    },
    created: function () {
        this.buildRawData(box);
    },
    mounted: function () {
        this.init();
        // if (this.isEditor) this.getPop();
    },
};
</script>

<style lang="less">
.m-box-v5 {
    border-radius: 3rem;
    padding: 2rem;
    border-color: rgba(226, 232, 240, 0.6);

    .m-box-v5__header-left {
        column-gap: 1rem;
    }

    .u-header-icon-wrap {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
        background: #0f172a;
        color: #f59e0b;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .u-header-icon {
        font-size: 1.5rem;
        line-height: 1;
    }

    .u-title {
        margin: 0;
        font-size: 1.5rem;
        line-height: 1.2;
        font-weight: 600;
        color: #1e293b;
        letter-spacing: -0.02em;
        text-decoration: none;
    }

    .u-subtitle {
        margin: 0.25rem 0 0;
        font-size: 0.75rem;
        font-weight: 700;
        color: #94a3b8;
        line-height: 1.4;
        .db;
        a {
            color: #94a3b8;
        }
    }

    .u-bread {
        margin-top: 0.35rem;
    }

    .u-btn {
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 0.75rem 1.25rem;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .u-btn--ghost {
        background: #f8fafc;
        color: #475569;

        &:hover {
            background: #f1f5f9;
        }
    }

    .u-btn--dark {
        background: #0f172a;
        border-color: #0f172a;
        color: #f8fafc;

        &:hover {
            opacity: 0.9;
        }
    }

    .u-btn--light {
        background: #fff;
        color: #475569;

        &:hover {
            background: #f8fafc;
        }
    }

    .m-box-v5__list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(5.6rem, 5.6rem));
        gap: clamp(0.75rem, 1.6vw, 0.8rem);
        justify-content: flex-start;
    }

    .m-box-v5__item-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
        max-width: 5.6rem;

        &.hidden {
            display: none;
        }

        &.u-lf {
            grid-column-start: 1;
        }
    }

    .m-box-v5__item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border-radius: 2rem;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        text-decoration: none;
        // transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
            // background: #f8fafc;
            transform: translateY(-1px);
        }

        &:active {
            transform: scale(0.98);
        }

        &.u-doing {
            opacity: 0.35;
            pointer-events: none;
        }
    }

    .m-box-v5__icon-box {
        position: relative;
        width: 3.5rem;
        height: 3.5rem;
        margin: 0 auto 1rem;
        border-radius: 1rem;
        background: #fff;
        border: 1px solid #f1f5f9;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .m-box-v5__item:hover .m-box-v5__icon-box {
        transform: scale(1.06);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
    }

    .u-pic {
        width: 1.85rem;
        height: 1.85rem;
        display: block;
    }

    .u-txt {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
        color: #334155;
        line-height: 1.2;
        letter-spacing: -0.02em;
    }

    .u-mark-dot {
        position: absolute;
        right: -0.14rem;
        top: -0.14rem;
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 9999px;
        background-color: #ef4444;
        box-shadow: 0 0 0 3px #fff;
        z-index: 2;
        animation: boxDotBlink 1.2s ease-in-out infinite;
    }

    .u-control {
        display: none;
    }

    .m-box-v5__footer {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        display: none;
    }

    @keyframes popBlink {
        from {
            opacity: 0.45;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes boxDotBlink {
        0% {
            transform: scale(0.9);
            opacity: 0.55;
        }
        50% {
            transform: scale(1.15);
            opacity: 1;
        }
        100% {
            transform: scale(0.9);
            opacity: 0.55;
        }
    }

    .u-pop {
        position: absolute;
        right: 0.7rem;
        bottom: 0.7rem;
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background-color: #ef4444;
        animation: popBlink 0.5s infinite ease-in-out;
    }

    .m-box-v5__list.isEditMode {
        .m-box-v5__item-wrapper {
            display: block !important;
        }

        .m-box-v5__item-wrapper.hidden {
            opacity: 0.45;
        }

        .m-box-v5__item {
            border: 1px dashed #cbd5e1;
            background: #fff;
            border-radius: 1.5rem;
            cursor: move;
            padding: 1rem 0.65rem;
            width: 100%;
        }

        .u-control {
            display: block;
            margin-top: 0.45rem;
            font-size: 0.85rem;

            i {
                // padding: 0 4px;
                margin: 0 4px;
                color: #64748b;
                cursor: pointer;

                &:hover {
                    color: @v4primary;
                }
            }

            .u-break.on {
                color: @v4primary;
            }
        }
    }
}

@media screen and (max-width: @phone) {
    .m-box-v5 {
        border-radius: 1.5rem;
        padding: 1.25rem;

        .m-box-v5__header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
        }

        .m-box-v5__header-left {
            min-width: 0;
            flex: 1 1 auto;
        }

        .m-box-v5__header-right {
            width: auto;
            flex: 0 0 auto;
            justify-content: flex-end;
        }

        .m-box-v5__footer {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        .u-btn {
            padding: 0.65rem 0.9rem;
            white-space: nowrap;
        }

        .u-header-icon-wrap {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.9rem;
        }

        .u-title {
            font-size: 1rem;
        }

        .u-subtitle {
            margin-top: 0.15rem;
            font-size: 0.7rem;
        }

        .m-box-v5__list {
            grid-template-columns: repeat(auto-fill, minmax(4.8rem, 4.8rem));
            gap: 0.85rem;
            justify-content: flex-start;
        }

        .m-box-v5__item-wrapper {
            width: 100%;
            max-width: 4.8rem;
        }

        .m-box-v5__item {
            border-radius: 1.2rem;
            padding: 0.75rem 0.45rem;
            width: 100%;
        }

        .m-box-v5__icon-box {
            width: 3rem;
            height: 3rem;
            border-radius: 0.85rem;
            margin-bottom: 0.5rem;
        }

        .u-pic {
            width: 1.5rem;
            height: 1.5rem;
        }

        .u-txt {
            font-size: 10px;
        }
    }
}

@media (hover: none) {
    .m-box-v5 {
        .m-box-v5__item:hover {
            background: transparent;
            transform: none;
        }

        .m-box-v5__item:hover .m-box-v5__icon-box {
            transform: none;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
        }
    }
}
</style>
