<template>
    <section class="m-posts-v5 bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden mb-6">
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
                更多 >>
            </a>
        </div>

        <div v-loading="loading" class="m-posts-v5__content">
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

        <!-- <a
            class="m-posts-v5__more block w-full py-6 bg-gray-50 text-center text-sm font-black text-gray-400 hover:text-yellow-600 transition-all no-underline"
            :href="moreLink"
            :target="target"
        >
            查看更多社区内容 ...
        </a> -->
    </section>
</template>

<script>
import { getPosts } from "@/service/index";
import { getTopicBucket, getMixLatest } from "@/service/community";
import { buildTarget, showAvatar, getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { showRecently } from "@/utils/moment";
import JX3_EMOTION from "@jx3box/jx3box-emotion";

export default {
    name: "IndexPostsV5",
    data: function () {
        return {
            tabs: [
                { label: "全部", value: "all" },
                { label: "作品", value: "works" },
                { label: "帖子", value: "community" },
            ],
            activeTab: "all",
            target: buildTarget(),
            loading: false,
            worksData: [],
            communityData: [],
            categoryList: [],
            displayLimit: 8,
            sourceLimit: 20,
            aggregate: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        displayData: function () {
            if (this.activeTab === "works") return this.sortByTime(this.worksData).slice(0, this.displayLimit);
            if (this.activeTab === "community") return this.sortByTime(this.communityData).slice(0, this.displayLimit);
            return this.sortByTime([...this.worksData, ...this.communityData]).slice(0, this.displayLimit);
        },
        moreLink: function () {
            if (this.activeTab === "community") return "/community";
            return "/bbs";
        },
        report_link: function () {
            const prefix = this.client == "std" ? "www" : "origin";
            return `${prefix}:${this.moreLink}`;
        },
        categoryMap: function () {
            return (this.categoryList || []).reduce((obj, item) => {
                obj[item.mark] = item.name;
                return obj;
            }, {});
        },
    },
    methods: {
        changeTab: function (tab) {
            this.activeTab = tab;
            this.updateAggregateAndReport();
        },
        dateFormat: function (val) {
            return val ? showRecently(val) : "--";
        },
        sortByTime: function (list) {
            return [...(list || [])].sort((a, b) => b.timestamp - a.timestamp);
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
                typeLabel: getTypeLabel(item.post_type),
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
        reportLink(link) {
            const prefix = this.client == "std" ? "www" : "origin";
            return `${prefix}:${link}`;
        },
        updateAggregateAndReport() {
            this.aggregate = this.displayData.map((item) => this.reportLink(item.link));
            // reportNow({
            //     caller: "index_lastest_artwork_load",
            //     data: {
            //         aggregate: this.aggregate,
            //         category: this.activeTab,
            //     },
            // });
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
        async loadData() {
            this.loading = true;
            try {
                await this.loadCategoryList();
                await Promise.all([this.loadWorks(), this.loadCommunity()]);
                this.updateAggregateAndReport();
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
    }

    .m-posts-v5__item:last-child {
        border-bottom: 0;
    }

    .u-more {
        font-weight: 400;
        letter-spacing: 0.02em;
        transition: color 0.2s ease, transform 0.2s ease;
    }

    .u-more:hover {
        transform: translateX(2px);
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
