<template>
    <section class="m-posts-v5 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="m-posts-v5__tabs flex items-center justify-between px-6 py-5" aria-label="内容分类">
            <div class="m-posts-v5__tab-list flex items-center" role="tablist">
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="u-tab px-5 py-2 text-sm font-black rounded-xl transition-all mr-3 border-0 cursor-pointer"
                    :class="
                        activeTab === tab.value
                            ? 'bg-yellow-400 text-gray-900 shadow-sm'
                            : 'bg-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    "
                    :aria-pressed="activeTab === tab.value"
                    @click="changeTab(tab.value)"
                >
                    {{ tab.label }}
                </button>
            </div>
            <a
                href="/community"
                target="_blank"
                rel="noopener noreferrer"
                class="u-more text-xs text-gray-400 hover:text-yellow-600 no-underline flex-shrink-0"
            >
                更多 <el-icon><DArrowRight /></el-icon>
            </a>
        </div>

        <div
            v-loading="loading"
            class="m-posts-v5__content"
            :class="{ 'm-posts-v5__content--scroll': activeTab === 'follow' && isLogin && !!displayData.length }"
        >
            <a
                v-for="item in displayData"
                :key="item.key"
                class="m-posts-v5__item p-6 hover:bg-gray-50 transition-all flex space-x-5 group cursor-pointer no-underline"
                :href="item.link"
                :target="target"
            >
                <div class="relative flex-shrink-0">
                    <div class="m-posts-v5__avatar w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shadow-inner">
                        <img :src="item.avatar" :alt="item.authorName" class="w-full h-full object-cover" />
                    </div>
                    <!-- <div class="u-badge absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-gray-900">
                        {{ item.kind === 'work' ? '作' : '帖' }}
                    </div> -->
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center flex-wrap">
                            <span class="u-type text-xs px-2 py-1 rounded mr-2 mb-1">
                                {{ item.typeLabel }}
                            </span>
                            <span class="text-xs text-gray-400 mb-1 italic"> @{{ item.authorName }} </span>
                        </div>
                        <time class="text-xs text-gray-300 ml-2">{{ dateFormat(item.time) }}</time>
                    </div>

                    <h4
                        class="m-posts-v5__title text-lg font-bold text-gray-800 mb-3 mt-0 leading-snug group-hover:text-yellow-600 transition-colors"
                        :title="item.title"
                    >
                        {{ item.title }}
                    </h4>

                    <!-- <div class="flex items-center text-xs font-bold text-gray-400">
                        <span class="u-meta mr-6"><i class="el-icon-view mr-1"></i>{{ item.viewText }}</span>
                        <span class="u-meta mr-6"><i class="el-icon-chat-dot-round mr-1"></i>{{ item.replyText }}</span>
                        <span class="u-meta"><i class="el-icon-share mr-1"></i>分享</span>
                    </div> -->
                </div>
            </a>

            <div
                v-if="!loading && !displayData.length"
                class="m-posts-v5__null px-6 py-10 text-center text-sm font-bold text-gray-400"
            >
                暂无内容
            </div>
        </div>

        <div
            v-if="showFeedLoadMore"
            class="u-load px-6 py-4 border-t border-gray-100 bg-gray-50 text-center cursor-pointer"
            :class="{ 'is-loading': feedLoadingMore }"
            @click="loadMoreFeed"
        >
            {{ feedLoadingMore ? "加载中..." : "加载更多" }}
        </div>
    </section>
</template>

<script>
import { getPosts, getFeedList } from "@/service/index";
import { getTopicBucket, getMixLatest } from "@/service/community";
import { buildTarget, showAvatar, getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { showRecently } from "@/utils/moment";
import JX3_EMOTION from "@jx3box/jx3box-emotion";
import User from "@jx3box/jx3box-common/js/user";
import jx3box from "@jx3box/jx3box-common/data/jx3box.json";
const { __postType } = jx3box;
const communityTypes = {
    "discuz": "论坛", // 交流讨论
    "story": "论坛", // 江湖故事
    "guide": "论坛", // 攻略心得
    "help": "论坛", // 求助寻觅
}

export default {
    name: "IndexPostsV5",
    data: function () {
        return {
            activeTab: "all",
            target: buildTarget(),
            loading: false,
            worksData: [],
            communityData: [],
            feedData: [],
            categoryList: [],
            displayLimit: 6,
            sourceLimit: 18,
            aggregate: [],

            feedCursor: 0,
            feedCursorTime: "",
            feedPageSize: 10,
            feedHasMore: true,
            feedLoadingMore: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        tabs: function () {
            return [
                { label: "全部", value: "all" },
                this.isLogin ? { label: "关注", value: "follow" } : null,
                { label: "作品", value: "works" },
                { label: "帖子", value: "community" },
            ].filter(Boolean);
        },
        displayData: function () {
            if (this.activeTab === "follow" && this.isLogin) return this.feedData;
            if (this.activeTab === "works") return this.sortByTime(this.worksData).slice(0, this.displayLimit);
            if (this.activeTab === "community") return this.sortByTime(this.communityData).slice(0, this.displayLimit);
            return this.sortByTime([...this.worksData, ...this.communityData]).slice(0, this.displayLimit);
        },
        moreLink: function () {
            if (this.activeTab === "community") return "/community";
            return "/bbs";
        },
        categoryMap: function () {
            return (this.categoryList || []).reduce((obj, item) => {
                obj[item.mark] = item.name;
                return obj;
            }, {});
        },
        showFeedLoadMore: function () {
            return this.activeTab === "follow" && this.isLogin && !!this.displayData.length && this.feedHasMore;
        },
        isLogin() {
            return User.isLogin();
        },
    },
    methods: {
        changeTab: function (tab) {
            this.activeTab = tab;
        },
        dateFormat: function (val) {
            return val ? showRecently(val) : "--";
        },
        sortByTime: function (list) {
            return [...(list || [])].sort((a, b) => b.timestamp - a.timestamp);
        },
        normalizeFeedItem: function (item) {
            const authorInfo = item.author_info || {};
            const post_type = __postType[item.post_type] ? item.post_type : "community";
            const link = getLink(post_type, item.post_id || item.id);
            const time = item.updated_at || item.created_at;
            const timestamp = new Date(time).getTime() || 0;

            return {
                key: `feed-${item.id}`,
                kind: "feed",
                reportCategory: item.post_type,
                typeLabel: communityTypes[item.post_type] || getTypeLabel(item.post_type),
                title: item.title || "无标题",
                authorName: authorInfo.display_name || "匿名",
                avatar: showAvatar(authorInfo.avatar, 112),
                time,
                timestamp,
                link,
                banner: item.banner || "",
                viewText: "--",
                replyText: "--",
            };
        },
        normalizeWorkItem: function (item) {
            const link = getLink(item.post_type, item.ID);
            const time = item.post_modified;
            const timestamp = new Date(time).getTime() || 0;
            const authorName = (item.author_info && item.author_info.display_name) || "匿名";
            const avatar = showAvatar(item.author_info && item.author_info.user_avatar, 112);

            return {
                key: `work-${item.ID}`,
                kind: "work",
                reportCategory: item.post_type,
                typeLabel: communityTypes[item.post_type] || getTypeLabel(item.post_type),
                title: item.post_title || "无标题",
                authorName,
                avatar,
                time,
                timestamp,
                link,
                viewText: this.formatCount(item.views_count || item.post_views),
                replyText: this.formatCount(item.comment_count || item.comments),
            };
        },
        normalizeCommunityTopic: function (item) {
            const info = item.ext_user_info || {};
            const link = getLink("community", item.id);
            const time = item.latest_reply_at || item.created_at;
            return {
                key: `topic-${item.id}`,
                kind: "community",
                reportCategory: "community",
                typeLabel: this.categoryMap[item.category] || "讨论",
                title: item.title || "无内容",
                authorName: info.display_name || "匿名",
                avatar: showAvatar(info.avatar, 112),
                time,
                timestamp: new Date(time).getTime() || 0,
                link,
                viewText: this.formatCount(item.views || item.view_count),
                replyText: this.formatCount(item.reply_num || item.reply_count),
            };
        },
        async normalizeCommunityReply(item) {
            const topic = item.topic || {};
            const info = item.ext_user_info || {};
            const text = (item.content || "").replace(/<img[^>]*>/g, "[图片]");
            const content = await new JX3_EMOTION(text)._renderHTML();
            const link = getLink("community", topic.id);
            const time = item.latest_reply_at || item.created_at;

            return {
                key: `reply-${item.id || topic.id}-${time}`,
                kind: "community",
                reportCategory: "community",
                typeLabel: this.categoryMap[topic.category] || "讨论",
                title: this.br2nl(content || "无内容"),
                authorName: info.display_name || "匿名",
                avatar: showAvatar(info.avatar, 112),
                time,
                timestamp: new Date(time).getTime() || 0,
                link,
                viewText: "--",
                replyText: "回帖",
            };
        },
        formatCount: function (val) {
            if (val === undefined || val === null || val === "") return "--";
            const n = Number(val);
            if (!Number.isFinite(n)) return "--";
            if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
            return `${n}`;
        },
        br2nl: function (val) {
            return String(val || "")
                .replace(/<br\s*\/?>/g, " ")
                .replace(/<[^>]+>/g, "")
                .trim();
        },
        getCurrentCursorTime() {
            const date = new Date();
            const pad = (v) => String(v).padStart(2, "0");
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
                date.getHours()
            )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },
        async loadCategoryList() {
            try {
                const res = await getTopicBucket({ type: "community" });
                this.categoryList = res?.data?.data || [];
            } catch (e) {
                this.categoryList = [];
            }
        },
        async loadWorks() {
            const res = await getPosts(this.client, "", this.sourceLimit);
            const list = res?.data?.data?.list || [];
            this.worksData = list.map((item) => this.normalizeWorkItem(item));
        },
        async loadCommunity() {
            const res = await getMixLatest();
            const topicList = res?.data?.data?.topic_list || [];
            const replyList = res?.data?.data?.reply_list || [];

            const topicData = topicList.map((item) => this.normalizeCommunityTopic(item));
            const replyData = await Promise.all(replyList.map((item) => this.normalizeCommunityReply(item)));

            this.communityData = this.sortByTime([...topicData, ...replyData]).slice(0, this.sourceLimit);
        },
        async loadFeed(reset = false) {
            if (reset) {
                this.feedCursor = 0;
                this.feedCursorTime = "";
                this.feedHasMore = true;
            }
            const cursor = reset ? 0 : this.feedCursor;
            const cursorTime = reset ? this.getCurrentCursorTime() : this.feedCursorTime || this.getCurrentCursorTime();
            const res = await getFeedList({
                client: this.client,
                cursor,
                cursor_time: cursorTime,
                pageSize: this.feedPageSize,
            });
            const list = res?.data?.data?.list || [];
            const page = res?.data?.data?.page || {};
            const normalizedList = list.map((item) => this.normalizeFeedItem(item));
            const pageCursor = Number(page.cursor);
            const pageSize = Number(page.page_size);

            this.feedCursor = Number.isFinite(pageCursor) ? pageCursor : 0;
            this.feedCursorTime = page.cursor_time || "";
            this.feedPageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : this.feedPageSize;
            this.feedHasMore = page.has_more === true;
            this.feedData = reset ? normalizedList : [...this.feedData, ...normalizedList];
        },
        async loadMoreFeed() {
            if (this.feedLoadingMore || !this.feedHasMore) return;

            this.feedLoadingMore = true;
            try {
                await this.loadFeed();
            } finally {
                this.feedLoadingMore = false;
            }
        },
        async loadData() {
            this.loading = true;
            try {
                await this.loadCategoryList();
                const tasks = [this.loadWorks(), this.loadCommunity()];

                if (this.isLogin) {
                    tasks.push(this.loadFeed(true));
                }

                await Promise.allSettled(tasks);
            } finally {
                this.loading = false;
            }
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
.m-posts-v5 {
    .m-posts-v5__tabs {
        background-color: #fff;
        border-bottom: 1px solid #e5e7eb;
    }

    .m-posts-v5__item {
        border-bottom: 1px solid #e5e7eb;

        &:last-of-type {
            border-bottom: 0;
        }
    }

    .u-more {
        .flex(y);
        font-weight: 400;
        letter-spacing: 0.02em;
        transition: color 0.2s ease, transform 0.2s ease;
    }

    .u-more:hover {
        transform: translateX(2px);
    }

    .u-more.is-loading {
        pointer-events: none;
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .m-posts-v5__tabs {
        scrollbar-width: thin;
        overflow-x: auto;
    }

    .m-posts-v5__title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .m-posts-v5__content--scroll {
        max-height: 36rem;
        overflow-y: auto;
    }

    .m-posts-v5__avatar {
        transition: all 0.2s ease;
    }

    .m-posts-v5__item:hover {
        .m-posts-v5__avatar {
            transform: translateY(-1px);
            box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.18) inset;
        }
    }

    .u-badge {
        line-height: 1;
    }

    .u-type {
        color: #d97706;
        background-color: #fffbeb;
    }

    .u-load {
        padding: 10px;
        .x;
        .fz(12px);
        color: #bbb;
        //background-color:#fafafa;
        .flex(o);
        &:hover {
            background-color: @bg-gray;
            color: #aaa;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-posts-v5 {
        border-radius: 1.25rem;

        .m-posts-v5__tabs {
            padding: 1rem;
        }

        .u-tab {
            padding: 0.5rem 0.9rem;
            font-size: 12px;
            margin-right: 0.5rem;
            white-space: nowrap;
        }

        .m-posts-v5__item {
            padding: 1rem;
            gap: 0.75rem;
        }

        .m-posts-v5__title {
            font-size: 1rem;
        }
    }
}
</style>
