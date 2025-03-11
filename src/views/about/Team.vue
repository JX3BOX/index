<template>
    <div class="p-team about-detail-wrapper">
        <div class="detail-title-list">
            <div
                class="title-item hvr-grow"
                :class="active === item && 'title-active'"
                v-for="(item, index) in titles"
                :key="index"
                @click="setTitle(item)"
            >
                {{ usergroups[item] }}
            </div>
        </div>
        <Member class="detail-content-wrap" :list="list" :usergroups="usergroups"></Member>
        <div class="m-about-button">
            <a class="u-join" href="/notice/21899" target="_blank"><i class="el-icon-right"></i>加入我们</a>
        </div>
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
            active: "developer",
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
    computed: {
        teammates: function () {
            const obj = {};

            Object.entries(this.usergroups).forEach(([key, value]) => {
                obj[key] = this.list.filter((item) => item.group === key);
            });

            return obj;
        },
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
.p-team {
    .u-join {
        background-color: @bg-black;
        color:#fff;
        &:hover {
            background-color: #000;
        }
    }
}
</style>
