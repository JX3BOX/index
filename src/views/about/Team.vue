<template>
    <div class="p-team about-detail-wrapper">
        <div class="m-team-toolbar">
            <div class="detail-title-list">
                <button
                    class="title-item"
                    :class="{ 'title-active': active === item }"
                    v-for="item in titles"
                    :key="item"
                    type="button"
                    @click="setTitle(item)"
                >
                    {{ usergroups[item] }}
                </button>
            </div>
            <a class="u-team-join" href="https://www.jx3box.com/notice/21899" target="_blank" rel="noopener noreferrer">
                <i class="el-icon-right"></i>
                <span>加入我们</span>
            </a>
        </div>
        <Member class="detail-content-wrap" :list="list"></Member>
    </div>
</template>

<script>
import { getTeammates } from "@/service/about";
import Member from "./components/Member.vue";
export default {
    name: "Team",
    components: { Member },
    data() {
        return {
            active: "designer",
            titles: [],
            members: [],
            list: [],
            usergroups: {
                designer: "创意部",
                mp: "运营部",
                developer: "研发部",
                editor: "编辑部",
                contributors: "贡献名单",
            },
        };
    },
    methods: {
        loadTeammates: function () {
            getTeammates().then((res) => {
                this.members = res.data.data;
                this.changeTitles(this.active);
            });
        },
        setTitle(title) {
            this.active = title;
            this.changeTitles(title);
        },
        changeTitles(title) {
            // const others = this.titles.filter((item) => item !== title);
            // others.splice(Math.floor(others.length / 2), 0, title);
            // this.titles = others;
            this.list = this.members.filter((item) => item.group === title);
        },
    },
    mounted: function () {
        this.titles = Object.keys(this.usergroups);
        this.loadTeammates();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/team.less";
</style>
