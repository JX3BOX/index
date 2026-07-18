<template>
    <div class="p-notice-list">
        <section class="m-notice-list__header">
            <h1 class="m-notice-list__title">{{ $t("notice.list.title") }}</h1>
            <p class="m-notice-list__desc">{{ $t("notice.list.desc") }}</p>
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
                    {{ $t(item.i18nKey) }}
                </button>
            </div>
            <el-input
                class="m-notice-list__search"
                size="large"
                v-model="search"
                :placeholder="$t('notice.list.searchPlaceholder')"
                clearable
            >
                <template #prefix>
                    <i class="el-input__icon el-icon-search"></i>
                </template>
            </el-input>
        </section>

        <section class="m-notice-list__body" :aria-busy="loading">
            <div v-if="loading" class="m-notice-list__skeleton" aria-hidden="true">
                <div v-for="item in per" :key="item" class="m-notice-list__skeleton-item">
                    <div class="m-notice-list__skeleton-meta">
                        <div class="m-notice-list__skeleton-flags">
                            <span class="u-notice-skeleton u-notice-skeleton--tag"></span>
                            <span class="u-notice-skeleton u-notice-skeleton--source"></span>
                        </div>
                        <span
                            class="u-notice-skeleton u-notice-skeleton--title"
                            :class="{ 'u-notice-skeleton--title-short': item % 3 === 0 }"
                        ></span>
                        <span class="u-notice-skeleton u-notice-skeleton--author"></span>
                    </div>
                    <div class="m-notice-list__skeleton-date">
                        <span class="u-notice-skeleton u-notice-skeleton--day"></span>
                        <span class="u-notice-skeleton u-notice-skeleton--stamp"></span>
                    </div>
                </div>
            </div>
            <div class="m-notice-list__empty" v-else-if="loadError">
                <p>{{ $t("notice.list.loadError") }}</p>
                <button class="m-notice-list__retry" type="button" @click="loadPosts">
                    {{ $t("notice.retry") }}
                </button>
            </div>
            <router-link
                v-else
                class="m-notice-list__item"
                v-for="item in list"
                :key="item.ID"
                :to="{ name: 'single', params: { id: item.ID } }"
            >
                <div class="m-notice-list__meta">
                    <div class="m-notice-list__flags">
                        <span class="m-notice-list__type" :class="typeClass(item)">{{ showTag(item) }}</span>
                        <span class="m-notice-list__source">{{ showSource(item) }}</span>
                        <span class="m-notice-list__sticky" v-if="item.sticky">{{ $t("notice.list.sticky") }}</span>
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

            <div class="m-notice-list__empty" v-if="!loadError && !list.length && !loading">
                {{ $t("notice.list.empty") }}
            </div>
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
                    size="small"
                    @keyup.enter="toJump"
                />
                <button class="m-notice-list__jump-btn" @click="toJump">{{ $t("notice.list.jump") }}</button>
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
            loading: true,
            loadError: false,
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
                { i18nKey: "notice.list.tabs.all", key: "", value: "" },
                { i18nKey: "notice.list.tabs.notice", key: "notice", value: 2 },
                { i18nKey: "notice.list.tabs.information", key: "information", value: 1 },
                { i18nKey: "notice.list.tabs.feature", key: "feature", value: 3 },
                { i18nKey: "notice.list.tabs.message", key: "message", value: 4 },
            ],
            subtypeMap: {
                1: { i18nKey: "notice.list.tabs.information", source: "EVENT", cls: "is-event" },
                2: { i18nKey: "notice.list.tabs.notice", source: "OFFICIAL", cls: "is-official" },
                3: { i18nKey: "notice.list.tabs.feature", source: "UPDATE", cls: "is-update" },
                4: { i18nKey: "notice.list.tabs.message", source: "NOTICE", cls: "is-notice" },
            },
            searchTimer: null,
            requestId: 0,
            skipPageLoad: false,
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
            const requestId = ++this.requestId;
            this.loading = true;
            this.loadError = false;
            getPosts(this.params, this)
                .then((res) => {
                    if (requestId !== this.requestId) return;
                    this.list = res?.data?.data?.list || [];
                    this.total = res?.data?.data?.total || 0;
                    this.pages = res?.data?.data?.pages || 1;
                })
                .catch(() => {
                    if (requestId !== this.requestId) return;
                    this.list = [];
                    this.total = 0;
                    this.pages = 1;
                    this.loadError = true;
                })
                .finally(() => {
                    if (requestId !== this.requestId) return;
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
                display: d.format("MM/DD"),
                stamp: `${d.locale("en").format("MMM")}. ${d.format("YYYY")}`,
            };
        },
        showTag(row) {
            const key = this.subtypeMap[row.post_subtype]?.i18nKey || "notice.list.tabs.notice";
            return this.$t(key);
        },
        showSource(row) {
            return this.subtypeMap[row.post_subtype]?.source || "OFFICIAL";
        },
        typeClass(row) {
            return this.subtypeMap[row.post_subtype]?.cls || "is-official";
        },
        showAuthor(row) {
            return (
                row?.author_info?.display_name ||
                row?.user_nickname ||
                row?.post_author_name ||
                this.$t("notice.list.authorDefault")
            );
        },
    },
    watch: {
        page() {
            if (this.skipPageLoad) {
                this.skipPageLoad = false;
                return;
            }
            this.loadPosts();
        },
        type() {
            if (this.page !== 1) {
                this.page = 1;
            } else {
                this.loadPosts();
            }
        },
        search() {
            if (this.page !== 1) {
                this.skipPageLoad = true;
                this.page = 1;
            }
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.loadPosts(), 300);
        },
        "$route.query.tab"(val) {
            const current = this.buttons.find((item) => item.key == (val || ""));
            this.type = current ? current.value : "";
        },
    },
    mounted() {
        const tab = this.$route.query.tab;
        let initializedByTab = false;
        if (tab) {
            const current = this.buttons.find((item) => item.key == tab);
            if (current && current.value !== this.type) {
                this.type = current.value;
                initializedByTab = true;
            }
        }
        if (!initializedByTab) this.loadPosts();
    },
    beforeUnmount() {
        clearTimeout(this.searchTimer);
        this.requestId++;
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
        background-color: @bg-black;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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

    .m-notice-list__skeleton-item {
        display: flex;
        gap: 22px;
        justify-content: space-between;
        min-height: 116px;
        margin-bottom: 14px;
        padding: 18px 26px;
        border: 1px solid #e8edf6;
        border-radius: 0 72px 0 0;
        background: #fdfefe;
        box-sizing: border-box;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .m-notice-list__skeleton-meta {
        flex: 1;
        min-width: 0;
    }

    .m-notice-list__skeleton-flags {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 11px;
    }

    .m-notice-list__skeleton-date {
        width: 168px;
        padding-left: 24px;
        border-left: 1px solid #eef2f8;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .u-notice-skeleton {
        display: block;
        border-radius: 4px;
        background: linear-gradient(90deg, #f1f4f8 25%, #e3e9f1 37%, #f1f4f8 63%);
        background-size: 400% 100%;
        animation: notice-skeleton-loading 1.4s ease infinite;
    }

    .u-notice-skeleton--tag {
        width: 64px;
        height: 28px;
    }

    .u-notice-skeleton--source {
        width: 58px;
        height: 12px;
    }

    .u-notice-skeleton--title {
        width: 68%;
        height: 22px;
    }

    .u-notice-skeleton--title-short {
        width: 48%;
    }

    .u-notice-skeleton--author {
        width: 92px;
        height: 13px;
        margin-top: 12px;
    }

    .u-notice-skeleton--day {
        width: 104px;
        height: 42px;
    }

    .u-notice-skeleton--stamp {
        width: 76px;
        height: 14px;
    }

    @keyframes notice-skeleton-loading {
        0% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .u-notice-skeleton {
            animation: none;
        }
    }

    .m-notice-list__retry {
        padding: 8px 20px;
        border: 1px solid @v4primary;
        border-radius: 4px;
        background: #fff;
        color: @v4primary;
        cursor: pointer;
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #818c9f;
        font-size: 15px;

        p {
            margin: 0 0 16px;
        }
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

        .m-notice-list__skeleton-item {
            min-height: 104px;
            padding: 12px;
            border-radius: 10px;
            gap: 12px;
        }

        .m-notice-list__skeleton-date {
            width: 90px;
            padding-left: 12px;
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
