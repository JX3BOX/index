<template>
    <div :class="['m-important-msg', { hasMsg: html != '' && !show }]">
        <div class="m-msg-box">
            <span class="u-title">重要通知</span>
            <div class="u-content" v-html="html"></div>
            <div class="u-button">
                <el-button @click="confirm" icon="el-icon-thumb" plain size="small">确定收到</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import User from "@jx3box/jx3box-common/js/user";
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
    .pf;
    .none;
    .full;
    .lt(0);
    .rb(0);
    .z(9);
    background-color: rgba(0, 0, 0, 0.5);
    &.hasMsg {
        .db;
    }
    .m-msg-box {
        .pa;
        .ct(o,500px,240px);
        .size(500px,240px);
        .r(10px);
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        .u-button {
            .x;
            .mt(20px);
        }
        .u-content {
            .mt(10px);
            .size(100%,120px);
            padding: 10px;
            overflow: auto;
            box-sizing: border-box;
        }
        .u-title {
            .bold;
            .fz(14px);
        }
        p {
            margin: 8px 0 0 0;
        }
    }
}
</style>
