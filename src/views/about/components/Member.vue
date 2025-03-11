<template>
    <el-row v-if="list && list.length" :gutter="20">
        <el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <a class="detail-item hvr-float-shadow" :href="authorLink(item.user_id)">
                <img :src="getAvatar(item)" width="80" height="80" />
                <div class="u-info">
                    <span class="u-name">
                        <span class="name">{{ getUsername(item) }}</span>
                        <span class="hover-desc">{{ item.remark }}</span>
                    </span>
                    <span class="desc">{{ item.remark }}</span>
                    <div class="hover-detail">
                        <div class="u-desc" v-html="item.desc || '暂无介绍'"></div>
                    </div>
                </div>
            </a>
        </el-col>
    </el-row>
</template>

<script>
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { showDate } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "member",
    props: ["list", "usergroups"],
    data: function () {
        return {
            data: [],
            duty: {
                production: "产品",
                designer: "设计",
                mp: "运营",
                developer: "开发",
                editor: "编审",
            },
        };
    },
    methods: {
        getAvatar: function (item) {
            return showAvatar(item?.teammate_info?.user_avatar, "m");
        },
        getUsername: function (item) {
            return item?.teammate_info?.display_name;
        },
        authorLink,
        showDate,
        showTag(key) {
            return this.duty[key] || key;
        },
    },

    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/about/index.less";
.detail-item {
    .flex;
    font-weight: 300;
    img {
        .fl;
        .mr(20px);
        .ml(20px);
        .r(50%);
        .size(68px);
    }
    .u-info {
        .flex;
        flex-direction: column;
        color: @color;
        .u-name {
            .name {
                color: #000 !important;
                font-size: 20px !important;
                font-weight: bold;
                margin-right: 5px;
            }
        }
        .desc,
        .hover-desc {
            color: #888;
            font-size: 13px;
            font-weight: normal;
        }
        .hover-detail,
        .hover-desc {
            display: none;
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
    }
    &:hover {
        .u-info {
            .name {
                color: @primary;
            }
            .hover-detail,
            .hover-desc {
                display: inline-block;
                .u-desc {
                    .fz(13px,1.8);
                    padding:5px 10px 5px 0;
                    p{margin:0;}
                }
            }
            .desc {
                display: none;
            }
        }
    }
}
@media screen and (max-width:@phone){
    .m-about-content .detail-content-wrap{
        margin:0 auto !important;
    }
    .about-detail-wrapper .detail-content-wrap .detail-item{
        .ml(0);
    }
}
</style>
