<template>
    <div class="p-team about-detail-wrapper" :aria-busy="loading">
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
                    {{ groupName(item) }}
                </button>
            </div>
            <a class="u-team-join" href="https://www.jx3box.com/notice/21899" target="_blank" rel="noopener noreferrer">
                <i class="el-icon-right"></i>
                <span>{{ $t("about.team.join") }}</span>
            </a>
        </div>
        <div v-if="loading" class="m-team-skeleton detail-content-wrap" aria-hidden="true">
            <div class="m-team-skeleton__grid">
                <div v-for="item in 6" :key="item" class="m-team-skeleton__card">
                    <span class="u-team-skeleton u-team-skeleton--avatar"></span>
                    <span class="m-team-skeleton__copy">
                        <span class="u-team-skeleton u-team-skeleton--name"></span>
                        <span class="u-team-skeleton u-team-skeleton--role"></span>
                    </span>
                </div>
            </div>
        </div>
        <Member v-else class="detail-content-wrap" :list="list"></Member>
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
            titles: ["designer", "mp", "developer", "editor", "contributors"],
            members: [],
            list: [],
            loading: true,
        };
    },
    methods: {
        groupName(key) { return this.$t(`about.team.groups.${key}`); },
        loadTeammates: function () {
            getTeammates().then((res) => {
                this.members = res.data.data;
                this.changeTitles(this.active);
            }).finally(() => {
                this.loading = false;
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
        this.loadTeammates();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/about/team.less";

.m-team-skeleton__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px 16px;
}

.m-team-skeleton__card {
    display: flex;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
    height: 112px;
    padding: 18px 24px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
}

.m-team-skeleton__copy {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.u-team-skeleton {
    display: block;
    background: linear-gradient(90deg, rgba(121, 130, 148, 0.1) 25%, rgba(121, 130, 148, 0.2) 37%, rgba(121, 130, 148, 0.1) 63%);
    background-size: 400% 100%;
    animation: team-skeleton-loading 1.4s ease infinite;
}

.u-team-skeleton--avatar {
    flex: 0 0 64px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
}

.u-team-skeleton--name {
    width: 58%;
    height: 20px;
    border-radius: 6px;
}

.u-team-skeleton--role {
    width: 76%;
    height: 12px;
    border-radius: 999px;
}

@keyframes team-skeleton-loading {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

@media screen and (min-width: 721px) and (max-width: 1280px) {
    .m-team-skeleton__grid {
        gap: 12px 16px;
    }

    .m-team-skeleton__card {
        height: 86px;
        padding: 14px 16px;
        border-radius: 16px;
    }

    .u-team-skeleton--avatar {
        flex-basis: 56px;
        width: 56px;
        height: 56px;
    }

    .u-team-skeleton--name {
        height: 16px;
    }
}

@media screen and (max-width: @phone) {
    .m-team-skeleton__grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .m-team-skeleton__card {
        height: 86px;
        padding: 14px 16px;
        border-radius: 16px;
    }

    .u-team-skeleton--avatar {
        flex-basis: 56px;
        width: 56px;
        height: 56px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .u-team-skeleton {
        animation: none;
    }
}
</style>
