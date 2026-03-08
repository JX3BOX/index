<template>
    <div :class="['m-important-msg', { hasMsg: html != '' && !show }]">
        <div class="m-msg-box">
            <span class="u-title">重要通知</span>
            <div class="u-content" v-html="html"></div>
            <div class="u-button">
                <el-button @click="confirm" icon="Check" type="primary">确定收到</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getBreadcrumb } from "@/config/js/api_misc";
import User from "@/config/js/user";
export default {
    name: "importantMsg",
    components: {},

    data() {
        return {
            html: "",
            confirm_msg: false,
        };
    },
    computed: {
        userList() {
            const list = this.$store.state.config.user_important_msg || "";
            return list.split(",");
        },
        userId() {
            return User.getInfo().uid;
        },
        hasMsg() {
            return this.userList.includes(this.userId);
        },
        show() {
            const local = localStorage.getItem("confirm_msg");
            return local == 1 || this.confirm_msg;
        },
    },
    watch: {
        hasMsg: {
            immediate: true,
            handler: function (val) {
                val && this.loadData();
            },
        },
    },
    methods: {
        loadData() {
            return getBreadcrumb("user_important_msg").then((res) => {
                this.html = res || "";
            });
        },
        confirm() {
            this.confirm_msg = true;
            localStorage.setItem("confirm_msg", 1);
        },
    },
};
</script>

<style lang="less">
.m-important-msg {
    position: fixed;
    display: none;
    inset: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.5);
    &.hasMsg {
        display: block;
    }
    .m-msg-box {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 500px;
        height: 240px;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        .u-button {
            text-align: center;
            margin-top: 20px;
        }
        .u-content {
            margin-top: 10px;
            width: 100%;
            height: 120px;
            padding: 10px;
            overflow: auto;
            box-sizing: border-box;
        }
        .u-title {
            font-weight: 700;
            font-size: 14px;
        }
        p {
            margin: 8px 0 0 0;
        }
    }
}
</style>
