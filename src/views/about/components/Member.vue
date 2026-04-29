<template>
    <el-row v-if="list && list.length" :gutter="16">
        <el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <a class="m-detail-item" :href="authorLink(item.user_id)">
                <div class="u-member-head">
                    <span class="u-profile">
                        <img class="u-avatar" :src="getAvatar(item)" width="64" height="64" />
                        <span class="u-copy">
                            <span class="name">{{ getUsername(item) }}</span>
                            <span class="desc">{{ item.remark }}</span>
                        </span>
                    </span>
                    <span class="hover-role">{{ item.remark }}</span>
                </div>
                <div class="hover-detail">
                    <div class="u-desc" v-html="item.desc || '暂无介绍'"></div>
                </div>
            </a>
        </el-col>
    </el-row>
</template>

<script>
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "member",
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        getAvatar: function (item) {
            return showAvatar(item?.teammate_info?.user_avatar, "m");
        },
        getUsername: function (item) {
            return item?.teammate_info?.display_name;
        },
        authorLink,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/index.less";

.m-detail-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 112px;
    box-sizing: border-box;
    border: 2px solid transparent;
    font-weight: 300;
    text-decoration: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

    .u-member-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-width: 0;
        gap: 12px;
    }

    .u-profile {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 12px;
    }

    .u-avatar {
        .r(50%);
        flex: 0 0 64px;
        .size(64px);
        object-fit: cover;
        transition: flex-basis 0.15s ease, width 0.15s ease, height 0.15s ease;
    }

    .u-copy {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
    }

    .name {
        color: #000 !important;
        font-size: 20px !important;
        font-weight: bold;
        line-height: 1.35;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .desc,
    .hover-role {
        color: #888;
        font-size: 13px;
        font-weight: normal;
        line-height: 1.6;
        white-space: nowrap;
    }

    .hover-role,
    .hover-detail {
        display: none;
    }

    .hover-detail {
        margin-top: 14px;
        color: #666;
    }

    .u-desc {
        display: -webkit-box;
        overflow: hidden;
        color: #666;
        font-size: 13px;
        line-height: 1.8;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        p {
            margin: 0;
        }
    }

    .u-tags {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .u-tag {
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 5px;
        }
    }

    &:focus-visible {
        outline: none;
    }

    &:hover,
    &:focus-visible {
        justify-content: flex-start;
        border-color: var(--v4primary500, #615fff);
        background: linear-gradient(0deg, rgba(114, 107, 255, 0.08) 0%, rgba(114, 107, 255, 0.08) 100%),
            var(--100, #fff);
        box-shadow: 0 8px 2px 0 rgba(102, 100, 187, 0.25);

        .u-profile {
            gap: 8px;
        }

        .u-avatar {
            flex-basis: 24px;
            .size(24px);
        }

        .u-copy {
            display: block;
        }

        .name {
            color: #333 !important;
        }

        .desc {
            display: none;
        }

        .hover-role,
        .hover-detail {
            display: block;
        }
    }

    &:focus-visible {
        box-shadow: 0 0 0 4px rgba(97, 95, 255, 0.16), 0 8px 2px 0 rgba(102, 100, 187, 0.25);
    }
}

@media screen and (max-width:@phone) {
    .m-about-content .detail-content-wrap {
        margin: 0 auto !important;
    }

    .about-detail-wrapper .detail-content-wrap .m-detail-item {
        .ml(0);
    }
}
</style>
