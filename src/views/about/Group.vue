<template>
    <div class="about-detail-wrapper">
        <div class="detail-title">幸甚有你，共建美好社区。</div>
        <el-row class="detail-content-wrap" :gutter="20">
            <el-col v-for="(item, index) in group" :key="index" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="detail-item hvr-float-shadow">
                    <i :class="item.icon"></i>
                    <div class="right">
                        <div class="name">{{ item.name }}</div>
                        <div class="qq">
                            <span>{{ item.qq || item.email }}</span>
                            <a v-if="item.link" class="btn" :href="item.link">加入</a>
                            <a v-if="item.email" class="btn" :href="`mailto:` + item.email">发送</a>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "Group",
    data() {
        return {
            group: [
                {
                    name: "官方邮箱",
                    email: "service@jx3box.com",
                    icon: "el-icon-message",
                },
                {
                    name: "正式服交流群（反馈/兑奖）",
                    qq: 2471800,
                    link: "https://jq.qq.com/?_wv=1027&k=k1aSaI93",
                    icon: "el-icon-service",
                },
                {
                    name: "怀旧服交流群（反馈/兑奖）",
                    qq: 590349918,
                    link: "https://jq.qq.com/?_wv=1027&k=oohQF6Yu",
                    icon: "el-icon-service",
                },
                {
                    name: "正式服团长群（副本/赛事）",
                    qq: 785597424,
                    link: "https://jq.qq.com/?_wv=1027&k=bpNtDAzA",
                    icon: "el-icon-user",
                },
                {
                    name: "怀旧服团长群（萌新教学）",
                    qq: 528707506,
                    link: "https://jq.qq.com/?_wv=1027&k=XiDy5ZKI",
                    icon: "el-icon-user",
                },
                {
                    name: "宏作者群（宏库/职业）",
                    qq: 297985102,
                    link: "https://jq.qq.com/?_wv=1027&k=ypz3InIy",
                    icon: "el-icon-position",
                },
                {
                    name: "数据作者群（技术帝）",
                    qq: 608303480,
                    link: "https://jq.qq.com/?_wv=1027&k=uSHHxdmd",
                    icon: "el-icon-setting",
                },
                {
                    name: "百科小分队（资历党）",
                    qq: 614370825,
                    link: "https://jq.qq.com/?_wv=1027&k=MFwMNVRb",
                    icon: "el-icon-trophy",
                },
                {
                    name: "休闲交流群（颜控党）",
                    qq: 658035079,
                    link: "https://jq.qq.com/?_wv=1027&k=mA07EfW3",
                    icon: "el-icon-sugar",
                },
                // {
                //     name: "PVP交流群",
                //     qq: 769948201,
                //     link: "https://jq.qq.com/?_wv=1027&k=xsxyIsCg",
                //     icon: "el-icon-collection",
                // },
            ],
        };
    },
};
</script>

