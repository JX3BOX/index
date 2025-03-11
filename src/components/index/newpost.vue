<template>
    <div class="m-newpost m-sideblock">
        <div class="m-guide-header m-sideblock-header">
            <i class="u-icon el-icon-discover"></i>
            <span class="u-title">游戏指南</span>
            <a
                href="/knowledge"
                class="u-more"
                target="_blank"
                rel="noopener noreferrer"
                title="查看全部"
            >
                <i class="el-icon-more"></i>
            </a>
        </div>
        <div class="m-guide-content">
            <el-row>
                <el-col :span="8">
                    <div class="u-guide-block u-guide-pve">
                        <!-- PVE -->
                        <template v-if="menu_groups['guide-pve']">
                            <h5 class="u-title">{{ menu_groups["guide-pve"].label }}</h5>
                            <div class="u-list">
                                <a
                                    v-for="(menu, key) in menu_groups[
                                        'guide-pve'
                                    ].menus"
                                    :key="key"
                                    :href="menu.link"
                                    target="_blank"
                                    v-html="menu.label"
                                ></a>
                            </div>
                        </template>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="u-guide-block u-guide-pve">
                        <!-- PVX -->
                        <template v-if="menu_groups['guide-pvx']">
                            <h5 class="u-title">{{ menu_groups["guide-pvx"].label }}</h5>
                            <div class="u-list">
                                <a
                                    v-for="(menu, key) in menu_groups[
                                        'guide-pvx'
                                    ].menus"
                                    :key="key"
                                    :href="menu.link"
                                    target="_blank"
                                    v-html="menu.label"
                                ></a>
                            </div>
                        </template>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="u-guide-block u-guide-pvp">
                        <!-- PVP -->
                        <template v-if="menu_groups['guide-pvp']">
                            <h5 class="u-title">{{ menu_groups["guide-pvp"].label }}</h5>
                            <div class="u-list">
                                <a
                                    v-for="(menu, key) in menu_groups[
                                        'guide-pvp'
                                    ].menus"
                                    :key="key"
                                    :href="menu.link"
                                    target="_blank"
                                    v-html="menu.label"
                                ></a>
                            </div>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="m-newpost-box">
            <el-row>
                <el-col :span="16">
                    <div class="u-label">
                        <!-- <i class="el-icon-s-management"></i>  -->
                        <b>最新作品</b>
                    </div>
                    <div class="m-newpost-inner">
                        <div class="m-newpost-header m-sideblock-header">
                            <el-tabs v-model="type">
                                <el-tab-pane name="all">
                                    <span slot="label">全部</span>
                                </el-tab-pane>
                                <el-tab-pane
                                    :label="item.label"
                                    :name="item.slug"
                                    v-for="(item, i) in links"
                                    :key="i"
                                ></el-tab-pane>
                            </el-tabs>
                        </div>
                        <template v-if="isWikiType">
                            <div class="m-newpost-content" v-loading="loading">
                                <a
                                    class="u-post"
                                    v-for="(item, i) in data"
                                    :key="i"
                                    :href="getLink(item.type,item.source_id)"
                                    :target="target"
                                >
                                    <el-image
                                        class="u-avatar"
                                        :src="(item.user_avatar) | showAvatar"
                                        fit="cover"
                                    ></el-image>
                                    <div class="u-info">
                                        <i class="el-icon-collection-tag"></i>
                                        <span
                                            class="u-type"
                                            target="_blank"
                                        >{{ item.type | formatTypeName }}</span>
                                        ／
                                        <span
                                            class="u-author"
                                            :href="authorLink(item.user_id)"
                                            target="_blank"
                                        >{{ item.user_nickname || '匿名'}}</span>
                                        <span class="u-date">
                                            <i class="el-icon-refresh"></i>
                                            {{ item.updated | wikiDate }}
                                        </span>
                                    </div>
                                    <span class="u-title">
                                        <i class="el-icon-reading"></i>
                                        {{ item.title || "无标题" }}
                                    </span>
                                </a>
                            </div>
                        </template>
                        <template v-else>
                            <div class="m-newpost-content" v-loading="loading">
                                <a
                                    class="u-post"
                                    v-for="(item, i) in data"
                                    :key="i"
                                    :href="getLink(item.post_type,item.ID)"
                                    :target="target"
                                >
                                    <el-image
                                        class="u-avatar"
                                        :src="(item.author_info && item.author_info.user_avatar) | showAvatar"
                                        fit="cover"
                                        :alt="item.author_info && item.author_info.display_name"
                                    ></el-image>
                                    <div class="u-info">
                                        <i class="el-icon-collection-tag"></i>
                                        <span
                                            class="u-type"
                                            target="_blank"
                                        >{{ item.post_type | formatTypeName }}</span>
                                        ／
                                        <span
                                            class="u-author"
                                            :href="authorLink(item.post_author)"
                                            target="_blank"
                                        >{{ item.author_info && item.author_info.display_name || '匿名'}}</span>
                                        <span class="u-date">
                                            <i class="el-icon-refresh"></i>
                                            {{ item.post_modified | dateFormat }}
                                        </span>
                                    </div>
                                    <span class="u-title">
                                        <i class="el-icon-reading"></i>
                                        {{ item.post_title || "无标题" }}
                                    </span>
                                </a>
                            </div>
                        </template>
                    </div>
                </el-col>
                <el-col :span="8" style="border-right:none">
                    <div class="u-guide-block u-guide-other">
                        <!-- 成就 -->
                        <template v-if="menu_groups['awesome-achievements']">
                            <h5 class="u-title">{{ menu_groups["awesome-achievements"].label }}</h5>
                            <div class="u-list">
                                <a
                                    v-for="(menu, key) in menu_groups[
                                        'awesome-achievements'
                                    ].menus"
                                    :key="key"
                                    :href="menu.link"
                                    target="_blank"
                                    :style="{color:menu.color}"
                                >
                                    <img :src="menu.icon | iconLink" />
                                    <span v-html="menu.label"></span>
                                </a>
                            </div>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getMenuGroups } from "@/service/setting";
import { getPosts } from "@/service/index";
import { getWikiPosts } from "@/service/helper";
import {
    buildTarget,
    authorLink,
    showAvatar,
    getThumbnail,
    getLink,
    iconLink,
} from "@jx3box/jx3box-common/js/utils";
import {
    __postType,
    __otherType,
    default_avatar,
} from "@jx3box/jx3box-common/data/jx3box.json";
import { showRecently } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "newpost",
    props: [],
    data: function () {
        return {
            data: [],
            target: buildTarget(),
            type: "all",
            links: [
                {
                    label: "宏库",
                    slug: "macro",
                },
                {
                    label: "插件",
                    slug: "jx3dat",
                },
                {
                    label: "副本",
                    slug: "fb",
                },
                {
                    label: "职业",
                    slug: "bps",
                },
                {
                    label: "工具",
                    slug: "tool",
                },
                {
                    label: "茶馆",
                    slug: "bbs",
                },
                {
                    label: "成就",
                    slug: "achievement",
                },
                {
                    label: "物品",
                    slug: "item",
                },
                {
                    label: "通识",
                    slug: "knowledge",
                },
                {
                    label: "任务",
                    slug: "quest",
                },
            ],
            loading: false,

            menu_groups: {},
            wiki_types: ["achievement", "item", "knowledge", "quest"],
        };
    },
    computed: {
        isWikiType: function () {
            return this.wiki_types.includes(this.type);
        },
    },
    methods: {
        loadData: function () {
            let type = this.type == "all" ? "" : this.type;
            this.loading = true;
            if (this.isWikiType) {
                getWikiPosts({
                    type,
                    limit : 6
                }).then((res) => {
                    this.data = res.data.data.newest.slice(0, 6) || []
                }).finally(() => {
                        this.loading = false;
                    });
            } else {
                getPosts(type)
                    .then((res) => {
                        this.data = res.data.data.list.slice(0, 6) || [];
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        loadGuide: function () {
            getMenuGroups({
                names: [
                    "guide-pve",
                    "guide-pvx",
                    "guide-pvp",
                    "awesome-achievements",
                ],
            }).then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let output = {};
                    for (let i in data.data.data) {
                        let group = data.data.data[i];
                        output[group.name] = group;
                    }
                    this.menu_groups = output;
                }
            });
        },
        getLink,
        authorLink,
    },
    filters: {
        formatTypeName: function (type) {
            return __postType[type] || __otherType[type];
        },
        dateFormat: function (val) {
            return showRecently(val);
        },
        showAvatar: function (val) {
            return showAvatar(val, 24);
        },
        iconLink,
        wikiDate : function (val){
            return showRecently(new Date(val*1000))
        }
    },
    watch: {
        type: function () {
            this.loadData();
        },
    },
    mounted: function () {
        this.loadData();
        this.loadGuide();
    },
    components: {},
};
</script>

<style lang="less">
@import "../../assets/css/index/newpost.less";
</style>
