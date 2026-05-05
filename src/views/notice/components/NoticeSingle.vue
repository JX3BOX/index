<template>
    <div class="p-notice-detail" v-loading="loading">
        <article class="m-notice-detail__article bg-white rounded-xl shadow-sm overflow-hidden" v-if="!loading">
            <header class="m-notice-detail__header article-header-bg text-white px-8 py-7 md:px-10 md:py-8">
                <div class="m-notice-detail__headline flex items-center gap-4 mb-10">
                    <button
                        class="m-notice-detail__back inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-sm border border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
                        type="button"
                        :title="$t('notice.single.back')"
                        @click="$router.push({ name: 'list' })"
                    >
                        <i class="el-icon-arrow-left text-sm"></i>
                    </button>
                    <span
                        class="m-notice-detail__type inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-sm"
                        >{{ showType(post.post_subtype) }}</span
                    >
                    <div class="m-notice-detail__divider h-7 w-1 bg-indigo-500 hidden md:block"></div>
                    <h1
                        class="m-notice-detail__title text-[20px] md:text-[30px] font-bold tracking-tight leading-[1.15] break-words"
                    >
                        {{ post.post_title }}
                    </h1>
                </div>

                <div
                    class="m-notice-detail__meta-row flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/15"
                >
                    <div class="m-notice-detail__meta-main flex items-center flex-wrap gap-6 text-slate-300 text-sm">
	                        <span class="m-notice-detail__meta-item inline-flex items-center gap-2">
	                            <i class="el-icon-time"></i>
	                            {{ $t("notice.single.lastUpdated", { date: showDate(post.post_modified) }) }}
	                        </span>
                        <span class="m-notice-detail__meta-item inline-flex items-center gap-2" v-if="authorName">
                            <i class="el-icon-user"></i>
                            {{ authorName }}
                        </span>
	                        <span class="m-notice-detail__meta-item inline-flex items-center gap-2">
	                            <i class="el-icon-view"></i>
	                            {{ $t("notice.single.views", { count: formatNumber(stat.views) }) }}
	                        </span>
                    </div>

                    <div class="m-notice-detail__admin flex items-center gap-2" v-if="isAdmin">
                        <a
                            class="m-notice-detail__admin-btn inline-flex items-center h-10 px-5 bg-white/5 hover:bg-white/10 border border-white/20 rounded transition-all text-sm text-slate-300"
                            :href="edit_link"
                            target="_blank"
                            rel="noopener noreferrer"
	                        >
	                            <i class="el-icon-edit-outline mr-2"></i>{{ $t("notice.single.edit") }}
	                        </a>
                        <button
                            class="m-notice-detail__admin-btn m-notice-detail__admin-btn--ghost inline-flex items-center h-10 px-5 bg-white/5 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 rounded transition-all text-sm text-slate-300 hover:text-red-300"
                            type="button"
                            @click="openAdminPanel"
	                        >
	                            <i class="el-icon-setting mr-2"></i>{{ $t("notice.single.manage") }}
	                        </button>
                    </div>
                </div>
            </header>

            <section class="m-notice-detail__body p-8 md:p-10">
                <p class="m-notice-detail__excerpt" v-if="post.post_excerpt">{{ post.post_excerpt }}</p>

                <div class="m-notice-detail__content" v-if="post._check">
                    <Article :content="content" />
                </div>
                <div class="m-notice-detail__null" v-else>
                    <el-alert :title="null_tip" type="warning" show-icon></el-alert>
                </div>

                <footer
                    class="m-notice-detail__actions mt-12 pt-6 border-t border-slate-100 flex justify-end items-center gap-3"
                >
                    <button
                        class="m-notice-detail__action-btn px-6 py-2 rounded-full border border-slate-200 text-sm hover:bg-slate-50 inline-flex items-center cursor-pointer"
                        :class="{ 'is-active': liked }"
                        @click="toggleLike"
	                    >
	                        <i class="el-icon-thumb mr-2"></i>{{ $t("notice.single.like", { count: likeCount }) }}
	                    </button>
                    <button
                        class="m-notice-detail__action-btn m-notice-detail__action-btn--primary px-6 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 inline-flex items-center cursor-pointer"
                        :class="{ 'is-active': starred }"
                        @click="toggleStar"
	                    >
	                        <i :class="[starred ? 'el-icon-star-on' : 'el-icon-star-off', 'mr-2']"></i
	                        >{{ starred ? $t("notice.single.starred") : $t("notice.single.star") }}
	                    </button>
                </footer>
            </section>
        </article>

        <section
            class="m-notice-detail__comment bg-white rounded-xl shadow-sm mt-1 p-8"
            ref="commentView"
            v-if="!loading"
        >
	            <h2 class="m-notice-detail__comment-title text-2xl md:text-3xl font-bold mb-6">
	                {{ $t("notice.single.comments") }}
	            </h2>
            <div class="m-notice-detail__comment-box" v-if="id && !post.comment">
                <JxComment :id="id" category="post" />
            </div>
	            <div class="m-notice-detail__comment-placeholder" v-else>{{ $t("notice.single.commentsClosed") }}</div>
        </section>

        <right-affix
            :key="rightAffixKey"
            class="m-notice-detail__affix"
            :postId="Number(id)"
            :postType="post.post_type"
            :postTitle="post.post_title"
            :showComment="Number(id)"
            @toComment="toComment"
            :style="affixStyle"
        ></right-affix>

        <Admin class="m-notice-detail__admin-panel" :postId="id" app="notice" />
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getPost } from "@/service/cms.js";
import { getStat, postStat } from "@jx3box/jx3box-common/js/stat.js";
import { hasFav, addFav, delFav } from "@jx3box/jx3box-ui/service/fav";
import { showDate } from "@jx3box/jx3box-common/js/moment";
import { editLink } from "@jx3box/jx3box-common/js/utils";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import JxComment from "@jx3box/jx3box-ui/src/single/Comment.vue";
import RightAffix from "@jx3box/jx3box-ui/src/single/RightAffix.vue";
import Admin from "@jx3box/jx3box-ui/src/bread/Admin.vue";
import Bus from "@jx3box/jx3box-ui/utils/bus";

export default {
    name: "NoticeSingle",
    components: {
        Article,
        JxComment,
        RightAffix,
        Admin,
    },
    data: function () {
        return {
            loading: true,
            post: {},
            stat: {},
            liked: false,
            starred: false,
            likeCount: 0,
            favoriteId: false,
            likeStatus: true,
            favoriteLoading: false,
            rightAffixKey: 0,
            affixStyle: {},
            handleAffixFavoriteClick: null,
        };
    },
    computed: {
        edit_link: function () {
            return editLink(this.post?.post_type, this.post?.ID);
        },
        content: function () {
            return this.post?.post_content || "";
        },
        null_tip: function () {
            const visibleLabel = this.getVisibleLabel(this.post.visible);
            return this.$t("notice.single.visibilityTip", { visibility: visibleLabel });
        },
        id() {
            return this.$route.params.id;
        },
        isAdmin() {
            return User.isAdmin() || User.isSuperAdmin();
        },
        authorName() {
            return (
                this.post?.author_info?.display_name || this.post?.user_nickname || this.post?.post_author_name || ""
            );
        },
    },
    watch: {
        id: {
            immediate: true,
            handler() {
                if (this.id) this.load();
            },
        },
    },
    methods: {
        showDate,
        showType(val) {
            const key =
                {
                    1: "notice.list.tabs.information",
                    2: "notice.list.tabs.notice",
                    3: "notice.list.tabs.feature",
                    4: "notice.list.tabs.message",
                }[val] || "notice.list.tabs.notice";
            return this.$t(key);
        },
        getVisibleLabel(val) {
            const key =
                {
                    0: "notice.single.visibility.public",
                    1: "notice.single.visibility.self",
                    2: "notice.single.visibility.friends",
                    3: "notice.single.visibility.password",
                    4: "notice.single.visibility.paid",
                    5: "notice.single.visibility.fans",
                }[val] || "notice.single.visibility.public";
            return this.$t(key);
        },
        formatNumber(val) {
            const num = ~~val;
            return num.toLocaleString();
        },
        load() {
            this.loading = true;
            this.liked = false;
            this.likeStatus = true;
            this.starred = false;
            this.favoriteId = false;

            getPost(this.id, this)
                .then((res) => {
                    this.post = res?.data?.data || {};
                    document.title = this.post.post_title || this.$t("pages.notice.single.title");
                })
                .finally(() => {
                    this.loading = false;
                });

            getStat("notice", this.id).then((res) => {
                this.stat = res?.data || {};
                this.likeCount = ~~(this.stat?.likes || 0);
            });

            this.loadFavoriteStatus();
            postStat("notice", this.id);
        },
        loadFavoriteStatus() {
            if (!this.id) return Promise.resolve();
            return hasFav("notice", this.id)
                .then((res) => {
                    this.favoriteId = res?.id || false;
                    this.starred = !!this.favoriteId;
                })
                .catch(() => {
                    this.favoriteId = false;
                    this.starred = false;
                });
        },
        toComment() {
            this.$nextTick(() => {
                const element = this.$refs.commentView;
                if (!element) return;
                const offsetTop = element.offsetTop - 74;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });
            });
        },
        toggleLike() {
            if (!this.likeStatus) return;
            this.liked = true;
            this.likeCount++;
            postStat("notice", this.id, "likes");
            this.likeStatus = false;
        },
        async toggleStar() {
            if (!User.isLogin()) {
                User.toLogin();
                return;
            }
            if (this.favoriteLoading) return;
            this.favoriteLoading = true;

            const action = this.favoriteId
                ? delFav(this.favoriteId)
                : addFav("notice", this.id, this.post?.post_title || "");
            action
                .then(async () => {
                    await this.loadFavoriteStatus();
                    this.rightAffixKey++;
                })
                .catch(() => {})
                .finally(() => {
                    this.favoriteLoading = false;
                });
        },
        openAdminPanel() {
            Bus.emit("toggleAdminPanel");
        },
        handleScroll() {
            const top = document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (top > 320) {
                this.affixStyle = { top: "96px" };
            } else {
                this.affixStyle = { top: `${416 - top}px` };
            }
        },
    },
    mounted() {
        document.body.classList.add("is-notice-admin-theme");
        this.handleScroll();
        document.addEventListener("scroll", this.handleScroll);
        this.handleAffixFavoriteClick = (event) => {
            const target = event?.target;
            if (!target || !target.closest) return;
            if (target.closest(".m-notice-detail__affix .w-fav2")) {
                setTimeout(() => {
                    this.loadFavoriteStatus();
                }, 250);
            }
        };
        document.addEventListener("click", this.handleAffixFavoriteClick, true);
    },
    beforeUnmount() {
        document.body.classList.remove("is-notice-admin-theme");
        document.removeEventListener("scroll", this.handleScroll);
        if (this.handleAffixFavoriteClick) {
            document.removeEventListener("click", this.handleAffixFavoriteClick, true);
        }
    },
};
</script>

<style lang="less">
.p-notice-detail {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .article-header-bg {
        background-color: #1a202c;
        background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .m-notice-detail__type {
        white-space: nowrap;
        word-break: keep-all;
        writing-mode: horizontal-tb;
    }

    .m-notice-detail__excerpt {
        margin-bottom: 1.25rem;
        padding: 0.875rem 1rem;
        border-left: 4px solid #3b82f6;
        background: #f8fafc;
        color: #475569;
        line-height: 1.8;
        font-size: 15px;
    }

    .m-notice-detail__meta-item {
        font-size: 14px;
        color: #a8b0c1;
    }

    .m-notice-detail__meta-item i {
        font-size: 14px;
    }

    .m-notice-detail__content {
        font-size: 15px;
        line-height: 1.8;
        color: #475569;

        :deep(p) {
            margin-bottom: 1.5rem;
            line-height: 1.8;
            font-size: 15px;
            color: #475569;
        }

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4) {
            color: #1f2937;
        }
    }

    .m-notice-detail__comment-placeholder {
        border-radius: 10px;
        border: 1px dashed #ced5e5;
        background: #f8faff;
        padding: 16px;
        font-size: 14px;
        color: #69758d;
        line-height: 1.7;
    }

    .m-notice-detail__admin-btn {
        .pointer;
    }

    .m-notice-detail__action-btn.is-active {
        border-color: #3b82f6;
        color: #3b82f6;
    }

    .m-notice-detail__action-btn--primary.is-active {
        background: #1d4ed8;
        border-color: #1d4ed8;
        color: #fff;
    }

    .m-notice-detail__affix {
        z-index: 5;
        right: 24px !important;
        left: auto !important;
        margin-left: 0 !important;
        transform: none !important;
    }

    .m-notice-detail__affix.c-right-affix.is-close {
        right: 24px !important;
        transform: none !important;
    }

    .m-notice-detail__admin-panel {
        top: 64px !important;
    }
}

@media screen and (max-width: 768px) {
    .p-notice-detail {
        gap: 12px;

        .m-notice-detail__article {
            border-radius: 12px;
        }

        .m-notice-detail__header {
            padding: 14px 12px 16px !important;
        }

        .m-notice-detail__headline {
            display: grid;
            grid-template-columns: auto auto 1fr;
            align-items: center !important;
            column-gap: 8px !important;
            row-gap: 8px !important;
            margin-bottom: 12px !important;
        }

        .m-notice-detail__back {
            height: 32px;
            min-width: 32px;
            padding: 0 8px;
            border-radius: 6px;
        }

        .m-notice-detail__title {
            grid-column: 1 / -1;
            margin: 0;
            letter-spacing: 0;
        }

        .m-notice-detail__meta-row {
            display: flex !important;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding-top: 12px !important;
        }

        .m-notice-detail__meta-main {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            column-gap: 12px !important;
            row-gap: 6px !important;
        }

        .m-notice-detail__meta-item,
        .m-notice-detail__meta-item i {
            font-size: 12px !important;
        }

        .m-notice-detail__admin {
            width: 100%;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .m-notice-detail__admin-btn {
            height: 34px !important;
            padding: 0 14px !important;
            font-size: 13px !important;
            border-radius: 6px;
        }

        .m-notice-detail__body,
        .m-notice-detail__comment {
            padding: 14px !important;
        }

        .m-notice-detail__excerpt {
            padding: 10px 12px;
            margin-bottom: 14px;
            font-size: 14px;
            line-height: 1.75;
        }

        .m-notice-detail__content {
            font-size: 14px;
            line-height: 1.75;

            :deep(p) {
                font-size: 14px;
                line-height: 1.75;
                margin-bottom: 1rem;
            }
        }

        .m-notice-detail__actions {
            margin-top: 14px !important;
            padding-top: 12px !important;
            gap: 8px;
        }

        .m-notice-detail__action-btn {
            height: 34px;
            padding: 0 12px !important;
            font-size: 13px !important;
        }

        .m-notice-detail__comment-title {
            font-size: 20px !important;
            margin-bottom: 12px !important;
        }

        .m-notice-detail__comment-placeholder {
            padding: 12px;
            font-size: 13px;
        }

        .m-notice-detail__affix {
            display: none !important;
        }
    }
}
</style>
