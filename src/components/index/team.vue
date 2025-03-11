<template>
    <div class="m-index-recruit m-sideblock">
        <el-tabs v-model="tab" class="u-recruit-tab">
            <el-tab-pane name="recruit">
                <div slot="label">
                    <i class="u-icon el-icon-data-analysis"></i> 团队招募
                </div>
                <div class="m-index-recruit-header m-sideblock-header">
                    <div class="u-condition">
                        <el-select
                            class="u-server u-select"
                            v-model="server"
                            placeholder="选择服务器"
                            size="mini"
                            filterable
                        >
                            <el-option key="all" label="全部" value></el-option>
                            <el-option
                                v-for="item in serversWithClient"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                        <el-input class="u-name" v-model="name" placeholder="查找团队" size="mini">
                            <i class="el-icon-search" slot="append" @click="loadData"></i>
                        </el-input>
                        <el-select
                            class="u-type"
                            v-model="tag"
                            multiple
                            placeholder="过滤类型"
                            size="mini"
                        >
                            <el-option label="全部类型" value></el-option>
                            <el-option v-for="item in tags" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                        <el-checkbox class="u-isVerified" v-model="isVerified">已认证</el-checkbox>
                    </div>
                </div>
                <div class="u-list" v-if="data && data.length">
                    <el-row :gutter="20">
                        <el-col :span="12" v-for="(item, i) in data" :key="i">
                            <div>
                                <a
                                    class="u-recruit-item"
                                    :href="item.ID | teamLink"
                                    target="_blank"
                                >
                                    <span class="u-pic">
                                        <img :src="item.logo | showLogo" v-if="item.logo" />
                                        <img src="../../assets/img/center/null.png" v-else />
                                    </span>
                                    <span class="u-name">
                                        {{ item.name }}
                                        <i
                                            class="u-status"
                                            v-if="item.status"
                                            title="已认证"
                                        >
                                            <img svg-inline src="../../assets/img/center/verify.svg" />
                                        </i>
                                        <span class="u-meta u-server">
                                            <em>{{ item.server }}</em>
                                        </span>
                                        <span class="u-tag" v-if="isGoodTeam(item.tags)"></span>
                                    </span>
                                    <!-- <span class="u-time">
                                        <i class="el-icon-refresh"></i>
                                        {{ item.updated_at | showTime }}
                                    </span>-->
                                    <span class="u-recruit">
                                        {{
                                        item.recruit || item.desc
                                        }}
                                    </span>
                                </a>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <a class="u-all" href="/team" target="_blank">
                    <i class="el-icon-d-arrow-right"></i> 查看更多
                </a>
            </el-tab-pane>
            <el-tab-pane label="活动大厅" name="hall">
                <div slot="label">
                    <i class="el-icon-date"></i> 活动大厅
                </div>
                <div class="m-index-board" v-if="tab === 'hall'">
                    <div class="m-team-list-header">
                        <el-select
                            class="u-server u-select u-filter"
                            v-model="server"
                            placeholder="选择服务器"
                            size="mini"
                            filterable
                        >
                            <el-option key="all" label="全部服务器" value></el-option>
                            <el-option
                                v-for="item in serversWithClient"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                        <el-input
                            class="u-name u-filter"
                            v-model="raidName"
                            placeholder="查找活动"
                            size="mini"
                        >
                            <i class="el-icon-search" slot="append" @click="loadRaids"></i>
                        </el-input>
                        <a
                            class="u-more el-button el-button--primary is-plain el-button--mini"
                            href="/team/raid/list"
                            target="_blank"
                        >查看更多&raquo;</a>
                    </div>
                    <div v-loading="raidLoading">
                        <template v-if="raidData && raidData.length">
                            <raid-list :data="raidData" time="全部" :isIndex="true" />
                        </template>
                        <el-alert v-else title="没有找到符合条件的记录" type="info" show-icon></el-alert>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="u-misc">
            <a href="/team/org/add" class="u-more" target="_blank" rel="noopener noreferrer">
                <i class="el-icon-office-building"></i>创建团队
            </a>
            <a href="/team/raid/add" class="u-more" target="_blank" rel="noopener noreferrer">
                <i class="el-icon-microphone"></i>发布活动
            </a>
        </div>
    </div>
</template>

<script>
import {
    authorLink,
    publishLink,
    showAvatar,
    resolveImagePath,
    getThumbnail,
    getLink,
} from "@jx3box/jx3box-common/js/utils";
import { __ossMirror } from "@jx3box/jx3box-common/data/jx3box.json";
import lodash from "lodash";
import { showTime, showRecently } from "@/utils/moment.js";
import { getTeams, searchRaids } from "@/service/index.js";
import servers from "@jx3box/jx3box-data/data/server/server_list.json";
import serverMap from "@jx3box/jx3box-data/data/server/server_map.json";
import tags from "@/assets/data/team_tags.json";
import RaidList from "./raid_list.vue";
export default {
    name: "Team",
    props: [],
    data: function () {
        return {
            per: 16,
            page: 1,
            total: 1,
            pages: 1,
            data: [
                // {
                //     ID: 13,
                //     status: 1,
                //     super: 6314,
                //     admin: "",
                //     server: "服务器名",
                //     name: "团队名字",
                //     desc: "",
                //     logo: "",
                //     recruit: "招2个七秀",
                //     found: "",
                //     time: "",
                //     contact: "",
                //     tv: "",
                //     created_at: "2020-10-06T16:29:17+08:00",
                //     updated_at: "2020-10-06T16:29:17+08:00",
                //     deleted_at: "0001-01-01T00:00:00Z",
                // },
            ],
            loading: false,
            name: "",
            server: "",
            servers,
            tags,
            tag: "",
            isVerified: false,
            tab: "recruit", // 招募

            raidName: "白帝",
            raidData: [],
            raidLoading: false,
        };
    },
    computed: {
        params: function () {
            let params = {
                pageIndex: this.page,
                pageSize: this.per,
                recruit: 1, //有招募的
                server: this.server,
                name: this.name,
                tag: this.tag && this.tag.join(","),
            };
            if (this.isVerified) {
                params.status = 1;
            }
            return params;
        },
        raidParams: function () {
            let params = {
                server: this.server,
                name: this.raidName,
                time: -1,
                per: 20,
                is_public: 1,
                client: "std",
            };
            return params;
        },
        serversWithClient: function () {
            const _servers = []

            for (let name in serverMap) {
                if (serverMap[name].client === 'std') {
                    _servers.push(name)
                }
            }

            return _servers
        }
    },
    methods: {
        loadData: function () {
            this.loading = true;
            getTeams(this.params)
                .then((res) => {
                    this.total = res.data.data.page.total;
                    this.pages = res.data.data.page.pageTotal;
                    this.data = res.data.data.list;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadRaids: function () {
            this.raidLoading = true;
            searchRaids(this.raidParams)
                .then((res) => {
                    this.raidData = res.data.data.list || [];
                })
                .finally(() => {
                    this.raidLoading = false;
                });
        },
        isGoodTeam: function (val) {
            return val && val.includes("可教学");
        },
    },
    filters: {
        showTime: showRecently,
        showLogo: function (val) {
            return getThumbnail(val, 42, true);
        },
        teamLink: function (val) {
            return getLink("org", val);
        },
    },
    watch: {
        params: function (newparams) {
            this.loadData();
        },
        raidParams: {
            deep: true,
            handler() {
                this.loadRaids();
            },
        },
        tab: function (val) {
            if (val === "hall") this.loadRaids();
        },
    },
    mounted: function () {},
    components: {
        RaidList,
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/team.less";
@import "../../assets/css/index/raid_list.less";
</style>
