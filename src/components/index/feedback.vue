<!-- 反馈 -->
<template>
    <div class="m-feedback m-sideblock">
        <div class="m-feedback-header m-sideblock-header">
            <i class="u-icon el-icon-s-opportunity">
            </i><a class="u-title">反馈建议</a>
            <a href="/bbs/#/feedback" class="u-more" title="查看更多" target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <div class="m-feedback-publish">
            <div class="u-qq"><i class="el-icon-phone-outline"></i> 综合反馈交流Q群：<a href="https://jq.qq.com/?_wv=1027&k=XkO6DVvm" target="_blank"><b>2471800</b></a></div>
            <!-- <el-alert class="u-msg" title="如涉及账号等私人信息请发送电子邮件至admin@jx3box.com" type="warning" show-icon></el-alert> -->
            <el-input
                v-model="post.post_content"
                type="textarea"
                placeholder="写下你想说的..."
                show-word-limit
                :maxlength="1024"
                :rows="3"
            ></el-input>
            <div class="m-feedback-actions">
                <el-upload
                    ref="upload"
                    class="u-upload avatar-uploader"
                    :action="url"
                    list-type="picture-card"
                    :on-remove="remove"
                    :on-success="done"
                    :on-error="fail"
                    :on-exceed="exceed"
                    :limit="max"
                    title="上传图片"
                    with-credentials
                    accept="image/jpg, image/jpeg, image/gif, image/png, image/bmp"
                >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="u-submit">
                    <el-button
                        :loading="processing"
                        @click="publish"
                        icon="el-icon-s-promotion"
                        plain
                        size="small"
                    >提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";
const API_Root = process.env.NODE_ENV === "production" ? __cms : "/";
const API = API_Root + "api/cms/upload";
import User from "@jx3box/jx3box-common/js/user";
import { push } from "@/service/cms.js";
export default {
    name: 'feedback',
    data() {
        return {
            imgs: [],
            url: API,

            max: 8,
            // 内容
            post: {
                // 文章ID
                ID: "",
                // 状态：publish公开、private私有、draft草稿、dustbin删除
                post_status: "publish",
                // 类型
                post_type: "feedback",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "0",
                // 自定义字段
                post_meta: {},
                // 内容
                post_content: "",
                // 编辑模式(会影响文章详情页渲染规则)
                post_mode: "",

                // 是否原创
                original: 1,
                // 客户端：std正式服、origin怀旧服
                client: "std",
                // 语言：cn简体、tr繁体
                lang: "cn",
                // 资料片
                zlp: "",

                // 摘要
                post_excerpt: "",
                // 海报
                post_banner: "",
                // 小册
                post_collection: "",

                // 评论开关（0开启|默认，1关闭）
                comment: 0,

                // 阅读权限（0公开，1仅自己，2亲友，3密码，4付费，5粉丝）
                visible: 0,
                // 自定义标签 10上限
                tags: [],
            },
            processing: false,
            user: User.getInfo(),
            isLogin: User.isLogin()
        }
    },
    methods: {
        // 提交图片成功
        done: function (res) {
            this.imgs = [...this.imgs, res.data[0]];
        },
        // 提交图片失败
        fail: function (err) {
            try {
                let response = JSON.parse(err.message);
                this.$message.error(`[${response.code}]${response.msg}`);
            } catch {
                this.$message.error("网络请求异常");
            }
        },
        // 图片上限
        exceed: function () {
            this.$message.warning(`上传的图片个数最多为${this.max}个`);
        },
        // 移除图片
        remove: function (file) {
            this.imgs = this.imgs.filter(
                (img) => img !== file?.response?.data[0]
            );
        },
        // 提交反馈
        publish: function () {
            if (!this.post.post_content) {
                this.$notify.warning({
                    title: '提醒',
                    message: '反馈内容不能为空'
                })
                return
            }
            if (!this.isLogin) {
                if (this.post.post_content) {
                    localStorage.setItem('feedback', this.post.post_content);
                }
                User.toLogin();
                return
            }
            this.post.post_meta = this.imgs;
            this.processing = true;
            this.post.post_excerpt = this.post.post_content.slice(0, 200);

            push(this.post)
                .then((res) => {
                    let result = res.data.data;
                    this.$emit("update", {
                        ...result,
                        author_info: {
                            user_avatar: this.user?.avatar_origin,
                            display_name: this.user?.name
                        }
                    });
                    this.$notify.success({
                        title: "消息",
                        dangerouslyUseHTMLString: true,
                        message: `<div>反馈提交成功</div>
                                <div style="margin-top: 5px;"><a href="/bbs/#feedback/${result.ID}">点击查看</a></div>`,
                        duration: 6000
                    });
                    // 清空表单
                    this.post = this.$options.data().post;
                    this.imgs = [];
                    this.$refs.upload.clearFiles()
                })
                // .catch((err) => {
                //     this.$notify.error({ title: "消息", message: "反馈提交失败" });
                // })
                .finally(() => {
                    this.processing = false;
                });
        },
        loadCache: function (){
            const content = localStorage.getItem('feedback') || '';
            this.post.post_content = content;
            localStorage.removeItem('feedback');
        }
    },
    mounted: function (){
        this.loadCache()
    },
}
</script>

<style lang="less">
@import "../../assets/css/index/feedback.less";
</style>
