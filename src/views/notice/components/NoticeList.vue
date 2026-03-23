<template>
    <div class="p-notice-list">
        <section class="m-notice-list__header">
            <h1 class="m-notice-list__title">公告中心</h1>
            <p class="m-notice-list__desc">查看剑网3魔盒的最新动态、运营活动、功能更新与兑换通知。</p>
        </section>

        <section class="m-notice-list__toolbar">
            <div class="m-notice-list__tabs">
                <button
                    class="m-notice-list__tab"
                    v-for="item in buttons"
                    :key="item.value || 'all'"
                    @click="change(item)"
                    :class="{ 'is-active': type == item.value }"
                >
                    {{ item.name }}
                </button>
            </div>
            <el-input
                class="m-notice-list__search"
                size="large"
                v-model="search"
                placeholder="请输入关键词搜索"
                clearable
            >
                <template #prefix>
                    <i class="el-input__icon el-icon-search"></i>
                </template>
            </el-input>
        </section>

        <section class="m-notice-list__body" v-loading="loading">
            <router-link
                class="m-notice-list__item"
                v-for="item in list"
                :key="item.ID"
                :to="{ name: 'single', params: { id: item.ID } }"
            >
                <div class="m-notice-list__meta">
                    <div class="m-notice-list__flags">
                        <span class="m-notice-list__type" :class="typeClass(item)">{{ showTag(item) }}</span>
                        <span class="m-notice-list__source">{{ showSource(item) }}</span>
                        <span class="m-notice-list__sticky" v-if="item.sticky">置顶</span>
                    </div>
                    <h3 class="m-notice-list__item-title">{{ item.post_title }}</h3>
                    <p class="m-notice-list__item-author">
                        <i class="el-icon-user"></i>
                        <span>{{ showAuthor(item) }}</span>
                    </p>
                </div>
                <div class="m-notice-list__date">
                    <span class="m-notice-list__day">{{ formatDate(item.post_modified).display }}</span>
                    <span class="m-notice-list__stamp">{{ formatDate(item.post_modified).stamp }}</span>
                </div>
            </router-link>

            <div class="m-notice-list__empty" v-if="!list.length && !loading">当前分类暂无公告内容</div>
        </section>

        <section class="m-notice-list__pager" v-if="pages > 1">
            <el-pagination
                class="m-notice-list__pagination"
                layout="prev, pager, next"
                :current-page="page"
                :page-size="per"
                :total="total"
                :pager-count="5"
                @current-change="changePage"
                :hide-on-single-page="true"
            />
            <div class="m-notice-list__jump">
                <el-input
                    v-model="index"
                    type="number"
                    class="m-notice-list__jump-input"
                    size="mini"
                    @keyup.enter="toJump"
                />
                <button class="m-notice-list__jump-btn" @click="toJump">跳转</button>
            </div>
        </section>
    </div>
</template>

<script>
import { getPosts } from "@/service/cms";
import dayjs from "dayjs";

export default {
    name: "NoticeList",
    data: function () {
        return {
            loading: false,
            list: [],
            page: 1,
            total: 1,
            pages: 1,
            per: 10,
            index: "",
            client: this.$store.state.client,
            search: "",
            type: "",
            buttons: [
                { name: "全部", key: "", value: "" },
                { name: "公告动态", key: "notice", value: 2 },
                { name: "运营活动", key: "information", value: 1 },
                { name: "功能更新", key: "feature", value: 3 },
                { name: "兑换通知", key: "message", value: 4 },
            ],
            subtypeMap: {
                1: { name: "运营活动", source: "EVENT", cls: "is-event" },
                2: { name: "公告动态", source: "OFFICIAL", cls: "is-official" },
                3: { name: "功能更新", source: "UPDATE", cls: "is-update" },
                4: { name: "兑换通知", source: "NOTICE", cls: "is-notice" },
            },
        };
    },
    computed: {
        query() {
            return {
                client: this.client,
                search: this.search,
                subtype: !this.type ? "" : this.type,
            };
        },
        params: function () {
            const params = {
                per: this.per,
                page: ~~this.page || 1,
                sticky: 1,
                ...this.query,
                type: "notice",
            };
            Object.keys(params).forEach((item) => {
                if (!params[item]) delete params[item];
            });
            return params;
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getPosts(this.params, this)
                .then((res) => {
                    this.list = res?.data?.data?.list || [];
                    this.total = res?.data?.data?.total || 0;
                    this.pages = res?.data?.data?.pages || 1;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage(i) {
            this.page = ~~i || 1;
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        toJump() {
            if (!this.index) return;
            if (this.index > this.pages) this.index = this.pages;
            if (this.index < 1) this.index = 1;
            this.changePage(this.index);
            this.index = "";
        },
        change({ key, value }) {
            this.type = value;
            this.page = 1;
            this.$router.push({
                query: key ? { tab: key } : {},
            });
        },
        formatDate(time) {
            const d = dayjs(time);
            if (!d.isValid()) return { display: "--/--", stamp: "---. ----" };
            return {
                display: d.format("DD/MM"),
                stamp: d.format("MMM. YYYY").toUpperCase(),
            };
        },
        showTag(row) {
            return this.subtypeMap[row.post_subtype]?.name || "公告动态";
        },
        showSource(row) {
            return this.subtypeMap[row.post_subtype]?.source || "OFFICIAL";
        },
        typeClass(row) {
            return this.subtypeMap[row.post_subtype]?.cls || "is-official";
        },
        showAuthor(row) {
            return row?.author_info?.display_name || row?.user_nickname || row?.post_author_name || "魔盒";
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function () {
                this.loadPosts();
            },
        },
        query() {
            this.page = 1;
        },
        "$route.query.tab"(val) {
            const current = this.buttons.find((item) => item.key == (val || ""));
            this.type = current ? current.value : "";
        },
    },
    mounted() {
        const tab = this.$route.query.tab;
        if (tab) {
            const current = this.buttons.find((item) => item.key == tab);
            if (current) this.type = current.value;
        }
    },
};
</script>

<style lang="less">
.p-notice-list {
    display: flex;
    flex-direction: column;
    // gap: 16px;

    .m-notice-list__header,
    .m-notice-list__body,
    .m-notice-list__pager {
        border-radius: 12px;
        //border: 1px solid #e4e9f2;
        //background: #f6f8fc;
    }

    .m-notice-list__pager {
        background-color: #fff;
    }

    .m-notice-list__header {
        padding: 20px 24px;
        background-color:@bg-black;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .m-notice-list__title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        line-height: 1.2;
    }

    .m-notice-list__desc {
        margin: 10px 0 0;
        font-size: 14px;
        color: #aaa;
        line-height: 1.8;
    }

    .m-notice-list__toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 12px;
        border: 1px solid #e4e9f2;
        background: #f6f8fc;
        box-shadow: 0 1px 2px rgba(32, 56, 108, 0.05);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .m-notice-list__tabs {
        display: flex;
        align-items: center;
        gap: 8px;
        overflow-x: auto;
        flex: 1;
    }

    .m-notice-list__tab {
        border: 1px solid #e1e7f2;
        padding: 0 16px;
        height: 36px;
        border-radius: 4px;
        background: #fff;
        color: #66748f;
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;

        &:hover {
            color: #2b3d65;
            border-color: #cfd8ea;
            background: #f8faff;
        }

        &.is-active {
            background: @v4primary;
            color: #fff;
            font-weight: 600;
            border-color: @v4primary;
        }
    }

    .m-notice-list__search {
        width: 260px;
    }

    .m-notice-list__body {
        padding: 16px 0;
        min-height: 420px;
    }

    .m-notice-list__item {
        display: flex;
        gap: 22px;
        justify-content: space-between;
        align-items: stretch;
        position: relative;
        overflow: visible;
        text-decoration: none;
        padding: 18px 26px;
        border-radius: 0 72px 0 0;
        border: 1px solid #e8edf6;
        background: #fdfefe;
        transition: all 0.25s ease;
        margin-bottom: 14px;

        &::before {
            content: "";
            position: absolute;
            left: 4px;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #1f2532;
            border-radius: 0;
            .none;
        }

        &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: transparent;
            border-radius: 0;
            transition: background-color 0.25s ease;
        }

        &:last-child {
            margin-bottom: 0;
        }

        &:hover {
            border-color: #d5dff2;
            background: #fff;
        }

        &:hover::after {
            background: @v4primary;
        }
    }

    .m-notice-list__meta {
        min-width: 0;
        flex: 1;
    }

    .m-notice-list__flags {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }

    .m-notice-list__type {
        display: inline-flex;
        align-items: center;
        height: 28px;
        border-radius: 3px;
        padding: 0 12px;
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        background: @v4primary;
    }

    .m-notice-list__source {
        font-size: 12px;
        color: #c5cdd9;
        letter-spacing: 0.8px;
        text-transform: uppercase;
    }

    .m-notice-list__sticky {
        font-size: 12px;
        color: #bb7a11;
    }

    .m-notice-list__item-title {
        margin: 0;
        font-size: 18px;
        line-height: 1.6;
        color: #111827;
        font-family: Arial Black, PingFang SC, Microsoft YaHei, sans-serif;
        word-break: break-word;
    }

    .m-notice-list__item-author {
        margin: 6px 0 0;
        color: #8a95a9;
        line-height: 1.6;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .m-notice-list__date {
        width: 168px;
        border-left: 1px solid #eef2f8;
        padding-left: 24px;
        text-align: right;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
    }

    .m-notice-list__day {
        font-size: 46px;
        line-height: 1;
        font-weight: 700;
        color: #c9d8f1;
        letter-spacing: -1px;
    }

    .m-notice-list__stamp {
        font-size: 14px;
        line-height: 1.2;
        color: #bbcae4;
        letter-spacing: 0.4px;
        text-transform: none;
    }

    .m-notice-list__empty {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #818c9f;
        font-size: 15px;
    }

    .m-notice-list__pager {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 14px;
    }

    .m-notice-list__jump {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 10px;
    }

    .m-notice-list__jump-input {
        width: 72px;
    }

    .m-notice-list__jump-btn {
        border: 0;
        padding: 0 12px;
        height: 30px;
        border-radius: 6px;
        background: @v4primary;
        color: #fff;
        cursor: pointer;
    }

    .m-notice-list__pagination {
        :deep(.btn-prev),
        :deep(.btn-next),
        :deep(.number) {
            min-width: 32px;
            height: 32px;
            line-height: 32px;
            border-radius: 3px;
            border: 1px solid #dfe5f1;
            background: #fff;
            color: #616d83;
            margin: 0 3px;
        }

        :deep(.number.is-active) {
            background: #2f63dc;
            border-color: #2f63dc;
            color: #fff;
            box-shadow: 0 4px 10px rgba(47, 99, 220, 0.28);
        }
    }
}

@media screen and (max-width: 1280px) {
    .p-notice-list {
        .m-notice-list__title {
            font-size: 22px;
        }

        .m-notice-list__toolbar {
            display: block;
        }

        .m-notice-list__search {
            width: 100%;
            margin-top: 12px;
        }

        .m-notice-list__item {
            padding: 12px;
            border-radius: 10px;
            gap: 12px;
        }

        .m-notice-list__item-title {
            font-size: 22px;
        }

        .m-notice-list__date {
            width: 90px;
            padding-left: 12px;
        }

        .m-notice-list__day {
            font-size: 30px;
        }

        .m-notice-list__jump {
            display: none;
        }
    }
}

@media screen and (max-width: 768px) {
    .p-notice-list {
        width: 100%;
        max-width: 100%;

        .m-notice-list__header {
            padding: 14px;
        }

        .m-notice-list__toolbar {
            padding: 10px;
            // border-radius: 10px;
        }

        .m-notice-list__tabs {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 2px;
            gap: 6px;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        .m-notice-list__tab {
            flex: 0 0 auto;
            height: 32px;
            padding: 0 12px;
            font-size: 12px;
        }

        .m-notice-list__search {
            width: 100%;
            margin-top: 8px;
        }

        // .m-notice-list__body {
        //     padding: 10px;
        // }

        .m-notice-list__item {
            flex-direction: column;
            border-radius: 10px;
            padding: 10px 10px 8px 14px;
            gap: 8px;
            overflow: hidden;

            &::before {
                left: 4px;
                width: 3px;
            }

            &::after {
                left: 0;
                width: 3px;
            }
        }

        .m-notice-list__flags {
            margin-bottom: 4px;
            gap: 6px;
        }

        .m-notice-list__type {
            height: 24px;
            padding: 0 10px;
            font-size: 12px;
        }

        .m-notice-list__source {
            font-size: 10px;
            letter-spacing: 0.6px;
        }

        .m-notice-list__item-title {
            font-size: 16px;
            line-height: 1.45;
            font-family: PingFang SC, Microsoft YaHei, sans-serif;
            font-weight: 700;
        }

        .m-notice-list__item-author {
            margin-top: 2px;
            font-size: 12px;
            gap: 4px;
        }

        .m-notice-list__date {
            width: 100%;
            border-left: 0;
            border-top: 1px solid #eef2f8;
            padding-left: 0;
            padding-top: 6px;
            text-align: left;
            flex-direction: row;
            align-items: baseline;
            justify-content: flex-start;
            gap: 6px;
        }

        .m-notice-list__day {
            font-size: 36px;
        }

        .m-notice-list__stamp {
            font-size: 12px;
        }
    }
}
</style>
