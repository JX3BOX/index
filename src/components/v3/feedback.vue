<!--
 * @Author: iRuxu
 * @Date: 2022-05-20 17:38:03
 * @LastEditTime: 2022-07-04 23:10:13
 * @Description:
-->
<!-- 反馈 -->
<template>
    <div class="m-feedback m-sideblock">
        <div class="m-feedback-header m-sideblock-header">
            <div class="u-left"><i class="u-icon el-icon-s-opportunity"></i><a class="u-title">反馈中心</a></div>
        </div>
        <a class="m-feedback-content" :href="feedback" target="_blank">
            <img class="u-avatar" :src="img" alt="盒子娘" />
            <span class="u-info">
                <div>Bug反馈、建议意见、投诉举报</div>
                <span>→ 使劲戳盒子娘</span>
                <!-- <span><i class="el-icon-message"></i> admin@jx3box.com</span> -->
            </span>
        </a>
    </div>
</template>

<script>
import { __imgPath, feedback } from "@jx3box/jx3box-common/data/jx3box.json";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "feedback",
    data() {
        return { feedback : '/feedback' };
    },
    computed: {
        img() {
            return showAvatar("https://oss.jx3box.com/upload/post/2022/5/18/8_2301067.png", 300);
        },
    },
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less" scoped>
    .m-feedback-content {
        .flex;
        // justify-content: center;
        align-items: center;
        padding: 10px 10px 0 10px;

        .u-avatar {
            .size(80px);
        }

        .u-info {
            .x;
            .flex;
            .fz(13px,2);
            flex-direction: column;
            padding: 0 10px;
            align-items: flex-start;
            color: @color;
            span {
                .fz(12px);
                color: #999;
            }
            div{
                .nobreak;
            }
        }
    }
</style>
