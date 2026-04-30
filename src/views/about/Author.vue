<template>
    <div class="p-author">
        <div class="m-author-intro">
            <p>持续产出各项玩法的高质量攻略，助力广大侠士仗剑江湖。</p>
            <a class="u-author-join" href="https://www.jx3box.com/dashboard/cooperation" target="_blank" rel="noopener noreferrer">
                <i class="el-icon-right"></i>
                <span>成为签约作者</span>
            </a>
        </div>

        <div class="m-author-panel" v-if="list.length">
            <div class="m-author-list">
                <a
                    v-for="item in list"
                    :key="item.ID"
                    class="m-author-card"
                    :href="`https://www.jx3box.com/author/${item.ID}`"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img class="u-avatar" :src="showAvatar(item.user_avatar)" :alt="item.display_name" />
                    <span class="u-name">{{ item.display_name }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { getSuperAuthor } from "@/service/about";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "SuperAuthor",
    data() {
        return {
            list: [],
        };
    },
    methods: {
        load() {
            getSuperAuthor().then((data) => {
                this.list = data || [];
            });
        },
        showAvatar(url) {
            return showAvatar(url, "m");
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
.p-author {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1176px;
    margin: 0 auto;
}

.m-author-intro {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 32px;

    p {
        margin: 0;
        color: #726857;
        font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
        font-size: 20px;
        font-weight: 500;
        line-height: 1.6;
    }
}

.u-author-join {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    gap: 10px;
    min-width: 176px;
    box-sizing: border-box;
    padding: 8px 24px;
    border-radius: 99px;
    background: linear-gradient(90deg, #b09461 0%, #c6ac7f 52%, #b09461 100%);
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.35;
    text-decoration: none;
    box-shadow: 0 12px 24px rgba(176, 148, 97, 0.22);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    i {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        transform: rotate(135deg);
    }

    &:hover,
    &:focus-visible {
        color: #fff;
        transform: translateY(-1px);
        box-shadow: 0 16px 30px rgba(176, 148, 97, 0.3);
    }
}

.m-author-panel {
    box-sizing: border-box;
    width: 100%;
    padding: 24px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.5);
}

.m-author-list {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    box-sizing: border-box;
    width: calc(100% + 8px);
    max-height: calc(100vh - 320px);
    margin-right: -8px;
    padding: 8px 0;
    overflow-x: hidden;
    overflow-y: auto;
    .scrollbar();
}

.m-author-card {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 8px;
    box-sizing: border-box;
    min-height: 48px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #666;
    font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.35;
    text-decoration: none;
    &:focus-visible {
        outline: 2px solid rgba(176, 148, 97, 0.45);
        outline-offset: 2px;
    }
}

.p-author .u-avatar {
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
}

.p-author .u-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media screen and (min-width: 721px) and (max-width: 1280px) {
    .m-author-intro {
        gap: 16px;
        margin-bottom: 18px;

        p {
            font-size: 14px;
        }
    }

    .u-author-join {
        min-width: 136px;
        padding: 6px 18px;
        font-size: 16px;

        i {
            font-size: 15px;
        }
    }

    .m-author-panel {
        padding: 16px;
        border-radius: 18px;
    }

    .m-author-list {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        width: calc(100% + 8px);
        max-height: calc(100vh - 190px);
        margin-right: -8px;
        padding: 6px 0;
    }

    .m-author-card {
        min-height: 40px;
        padding: 8px 10px;
        font-size: 13px;
    }
}

@media screen and (max-width: @phone) {
    .p-author {
        padding: 0 12px;
    }

    .m-author-intro {
        align-items: stretch;
        flex-direction: column;
        gap: 14px;
        margin-bottom: 16px;

        p {
            font-size: 14px;
        }
    }

    .u-author-join {
        width: 100%;
        min-width: 0;
        padding: 10px 20px;
        font-size: 16px;
    }

    .m-author-panel {
        padding: 12px;
    }

    .m-author-list {
        grid-template-columns: 1fr;
        width: 100%;
        max-height: none;
        margin-right: 0;
        padding: 0;
    }
}
</style>
