<template>
    <div class="p-author">
        <div class="u-list" v-if="data && data.length">
            <el-tooltip
                class="item"
                effect="dark"
                :content="item.display_name"
                placement="top"
                v-for="(item, i) in data"
                :key="i"
            >
                <a :href="`/author/` + item.ID" class="u-item" target="_blank">
                    <img class="u-avatar" :src="showAvatar(item.user_avatar)" :alt="item.display_name" />
                    <span class="u-name">{{ item.display_name }}</span>
                </a>
            </el-tooltip>
        </div>
        <div class="m-about-button"><a class="u-join" href="/dashboard/cooperation" target="_blank"><i class="el-icon-right"></i>成为签约作者</a></div>
    </div>
</template>
<script>
import { getSuperAuthor } from "@/service/about";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "SuperAuthor",
    props: [],
    components: {},
    data: function () {
        return {
            data: [],
        };
    },
    computed: {},
    watch: {},
    methods: {
        load() {
            getSuperAuthor().then((data) => {
                this.data = data || [];
            });
        },
        showAvatar(url) {
            return showAvatar(url, "m");
        },
    },
    created: function () {},
    mounted: function () {
        this.load();
    },
};
</script>

<style lang="less">
.p-author {
    .u-list {
        .flex;
        flex-wrap: wrap;
        gap: 20px;
        max-width: 1024px;
        justify-content: center;
        margin: 0 auto;
        background-color: #f6e8e6b5;
        padding: 60px 40px;
        .r(6px);
    }
    .u-avatar {
        .size(38px);
        .r(50%);
        border: 2px solid #fff;
        background-color:#fff;
    }
    .u-name {
        // .db;
        .none;
    }
    .u-join{
        color:#fff;
        background-color:#f4afa6;
        &:hover{
            background-color:darken(#f4afa6, 10%);
        }
    }
}
</style>
