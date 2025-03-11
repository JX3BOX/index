<template>
    <div class="m-box" v-if="data && data.length">
        <div class="m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-menu"></i>
                <a class="u-title" href="/app" target="_blank">魔盒矩阵</a>
                <mini-bread class="u-bread" name="index_notification" />
            </div>
        </div>
        <!-- <div class="m-box-content"> -->
        <draggable
            class="u-list"
            :class="{ isEditMode: !options.disabled }"
            element="ul"
            v-model="data"
            @change="update"
            :options="options"
        >
            <li
                v-for="(item, key) in data"
                :key="key"
                class="u-item-wrapper"
                :class="{
                    'u-lf': isLF(item.uuid),
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
                        class="u-item"
                        :class="{ 'u-doing': !item.status }"
                    >
                        <img class="u-pic" :src="item.img | getBoxIcon" :class="{ hidden: !canSee(item.uuid) }" />
                        <img class="u-pic-hover" svg-inline :src="item.hover | getBoxIcon" />
                        <span class="u-txt">{{ showAbbr ? item.abbr : item.name }}</span>
                        <i v-if="item.hasMark" class="u-mark" :class="item.markcls">{{ item.mark }}</i>
                        <span class="u-control">
                            <i
                                class="u-break el-icon-scissors"
                                title="换行"
                                :class="{ on: isLF(item) }"
                                @click.prevent="cut(item.uuid)"
                            ></i>
                            <i
                                class="u-hide el-icon-delete"
                                title="隐藏"
                                v-if="canSee(item.uuid)"
                                @click.prevent="hideIt(item.uuid)"
                            ></i>
                            <i
                                class="u-show el-icon-view"
                                title="显示"
                                v-if="!canSee(item.uuid)"
                                @click.prevent="showIt(item.uuid)"
                            ></i>
                        </span>
                        <i class="u-pop" v-if="isEditor && pop[item.uuid]"></i>
                    </a>
                </el-tooltip>
            </li>
        </draggable>
        <!-- </div> -->
        <div class="m-box-op">
            <el-button plain class="u-reset" size="mini" icon="el-icon-refresh-left" v-if="defined" @click="reset"
                >恢复默认</el-button
            >
            <el-button plain class="u-reset" size="mini" icon="el-icon-download" @click="downBoxSetting" v-if="isLogin"
                >重新同步</el-button
            >
            <el-button
                plain
                class="u-custom"
                size="mini"
                icon="el-icon-setting"
                @click="active"
                v-if="!!options.disabled"
                >自定义</el-button
            >
            <el-button plain class="u-custom" size="mini" icon="el-icon-check" @click="save" v-if="!options.disabled"
                >保存</el-button
            >
        </div>
    </div>
</template>

<script>
import _ from "lodash";

// BOX设置
import box from "@/assets/data/box.json";
import { buildTarget } from "@jx3box/jx3box-common/js/utils";
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import draggable from "vuedraggable";
import User from "@jx3box/jx3box-common/js/user";

import { getMeta, setMeta } from "@/service/user.js";
import { getHelperPnt, getMenu } from "@/service/setting.js";
import Mini_bread from "../content/mini_bread.vue";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";
// ==============================

const KEY = "boxmatrix";

// ==============================

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
            showAbbr: true, //window.innerWidth < 370,

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
        prefix: function (){
            return this.client === 'std' ? 'www' : 'origin'
        }
    },
    methods: {
        buildRawData(raw) {
            // 默认数据
            const client = location.href.includes("origin") ? "origin" : "std";
            const default_data =
                raw?.filter((item) => {
                    return item.client == "all" ? true : item.client == client;
                }) || [];
            this.data = this.default_data = default_data;

            // 默认排序与折行
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
                    // 不管登录与否，默认都优先从本地获取配置
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
            // 手动从服务器读取
            getMeta(KEY).then((res) => {
                let val = res.data.data;
                if (val) {
                    try {
                        let data = JSON.parse(val);
                        this.buildData(data);
                        localStorage.setItem(KEY, this.setting);

                        this.$notify({
                            title: "成功",
                            message: "远程数据同步至本地",
                            type: "success",
                        });
                    } catch (e) {
                        console.log("[downBoxSetting]远程设置数据解析异常", e);
                    }
                } else {
                    this.$notify({
                        title: "消息",
                        message: "服务器上没有保存相关设置",
                        type: "info",
                    });
                }
            });
        },
        buildData: function (data) {
            if (data["order"] && data["order"]["length"]) {
                this.defined = true;

                // 对比新旧的长度,补充新加项目
                if (data["order"]["length"] != this.default_order.length) {
                    let diff = _.difference(this.default_order, data["order"]);
                    this.order = data["order"].concat(diff);
                } else {
                    this.order = data["order"];
                }

                let custom_data = [];
                this.order.forEach((uuid, i) => {
                    // 自动移除已经删除的项
                    if (this.default_map[uuid]) {
                        custom_data.push(this.default_map[uuid]);
                    }
                });
                this.data = custom_data;
            }
            if (data["hide"] && data["hide"]["length"]) {
                this.hide = data["hide"];
                this.defined = true;
            }
            if (data["lf"] && data["lf"]["length"]) {
                this.lf = data["lf"];
                this.defined = true;
            }
        },
        active: function () {
            this.options.disabled = false;
        },
        update: function (val) {
            let order = [];
            this.data.forEach((item, i) => {
                order.push(item.uuid);
            });
            this.order = order;
            this.defined = true;
        },
        save: function () {
            this.options.disabled = true;
            if (this.defined) {
                // 本地
                localStorage.setItem(KEY, this.setting);
                // 远程,如果是登录用户还需要远程保存
                if (this.isLogin) {
                    setMeta(KEY, this.setting);
                }
            }
        },
        reset: function () {
            this.$alert("确定重置为默认排序吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 当前
                        this.data = this.default_data;
                        this.order = [];
                        this.lf = this.default_lf;
                        this.hide = [];
                        this.defined = false;

                        // 本地
                        localStorage.removeItem(KEY);
                        // 远程,如果是登录用户还需要远程清空
                        if (this.isLogin) {
                            setMeta(KEY, "");
                        }

                        this.$forceUpdate();

                        this.$notify({
                            title: "成功",
                            message: "魔盒矩阵已重置为默认状态",
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
                let team_count = 0;
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
            reportNow({
                caller: "index_matrix",
                data: {
                    item: `${this.prefix}:${href}`,
                },
            })
        }
    },
    filters: {
        getBoxIcon: function (val) {
            // let local_url = "/box/" + val;
            val = val && val?.replace(".png", ".svg");
            let web_url = __cdn + "logo-light/" + val;
            return web_url;
            // return process.env.NODE_ENV === "production" ? web_url : local_url;
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
@import "../../assets/css/index/box.less";
</style>
