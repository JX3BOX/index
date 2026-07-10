<template>
    <div class="p-about-group">
        <div class="m-about-group__list">
            <article v-for="(item, index) in group" :key="item.nameKey" class="m-about-group__item">
                <div class="m-about-group__header">
                    <span class="u-group-icon__wrap">
                        <img class="u-group-icon" :class="item.icon" :src="getIcon(item, index)" alt="" />
                    </span>
                    <h3>{{ getTitle(item) }}</h3>
                </div>
                <p class="u-group-desc">{{ getDesc(item) }}</p>
                <div class="m-about-group__footer">
                    <span class="u-group-value">{{ getValue(item) }}</span>
                    <div class="m-about-group__actions">
                        <button
                            class="u-group-action u-group-action--copy"
                            type="button"
                            :title="$t('about.group.copy')"
                            @click="copyValue(item)"
                        >
                            <img :src="copyIcon" alt="" />
                        </button>
                        <a
                            v-if="getActionLink(item)"
                            class="u-group-action u-group-action--link"
                            :href="getActionLink(item)"
                            target="_blank"
                            rel="noopener noreferrer"
                            :title="$t('about.group.go')"
                        >
                            <img :src="arrowIcon" alt="" />
                        </a>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import iconMail from "@/assets/img/about/icon-mail.svg";
import iconSmile from "@/assets/img/about/icon-smile.svg";
import iconUsers from "@/assets/img/about/icon-users.svg";
import iconCode from "@/assets/img/about/icon-code.svg";
import iconCube from "@/assets/img/about/icon-cube.svg";
import iconStar from "@/assets/img/about/icon-star.svg";
import iconHeart from "@/assets/img/about/icon-heart.svg";
import iconCopy from "@/assets/img/about/icon-copy.svg";
import iconArrowCircle from "@/assets/img/about/icon-arrow-circle.svg";

export default {
    name: "Group",
    data() {
        return {
            copyIcon: iconCopy,
            arrowIcon: iconArrowCircle,
            group: [
                {
                    nameKey: "email",
                    email: "service@jx3box.com",
                    icon: "el-icon-message",
                },
                {
                    nameKey: "stdChat",
                    qq: 2471800,
                    link: "https://jq.qq.com/?_wv=1027&k=k1aSaI93",
                    icon: "el-icon-service",
                },
                {
                    nameKey: "originChat",
                    qq: 590349918,
                    link: "https://jq.qq.com/?_wv=1027&k=oohQF6Yu",
                    icon: "el-icon-service",
                },
                {
                    nameKey: "stdLeader",
                    qq: 785597424,
                    link: "https://jq.qq.com/?_wv=1027&k=bpNtDAzA",
                    icon: "el-icon-user",
                },
                {
                    nameKey: "originLeader",
                    qq: 528707506,
                    link: "https://jq.qq.com/?_wv=1027&k=XiDy5ZKI",
                    icon: "el-icon-user",
                },
                {
                    nameKey: "macro",
                    qq: 297985102,
                    link: "https://jq.qq.com/?_wv=1027&k=ypz3InIy",
                    icon: "el-icon-position",
                },
                {
                    nameKey: "data",
                    qq: 608303480,
                    link: "https://jq.qq.com/?_wv=1027&k=uSHHxdmd",
                    icon: "el-icon-setting",
                },
                {
                    nameKey: "wiki",
                    qq: 614370825,
                    link: "https://jq.qq.com/?_wv=1027&k=MFwMNVRb",
                    icon: "el-icon-trophy",
                },
                {
                    nameKey: "casual",
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
    methods: {
        getTitle(item) {
            return this.$t(`about.group.items.${item.nameKey}.title`);
        },
        getDesc(item) {
            return this.$t(`about.group.items.${item.nameKey}.desc`);
        },
        getValue(item) {
            return String(item.qq || item.email || "");
        },
        getActionLink(item) {
            if (item.link) return item.link;
            if (item.email) return `mailto:${item.email}`;
            return "";
        },
        getIcon(_item, index) {
            const iconMap = [
                iconMail,
                iconUsers,
                iconUsers,
                iconSmile,
                iconSmile,
                iconCode,
                iconCube,
                iconStar,
                iconHeart,
            ];
            return iconMap[index] || iconMail;
        },
        async copyValue(item) {
            const value = this.getValue(item);
            if (!value) return;

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                const input = document.createElement("textarea");
                input.value = value;
                input.setAttribute("readonly", "readonly");
                input.style.position = "fixed";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
            }

            ElMessage.success(this.$t("about.group.copied"));
        },
    },
};
</script>

<style lang="less">
.p-about-group {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1176px;
    margin: 0 auto;
}

.m-about-group__list {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.m-about-group__item {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-sizing: border-box;
    min-height: 132px;
    padding: 24px;
    border: 2px solid transparent;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
    margin-bottom: 16px;

    &:hover,
    &:focus-within {
        border-color: #5f8fff;
        background: linear-gradient(90deg, rgba(123, 167, 255, 0.1) 0%, rgba(123, 167, 255, 0.1) 100%), #fff;
        box-shadow: 0 8px 1px rgba(134, 173, 229, 0.25);

        .m-about-group__actions {
            opacity: 1;
        }
    }
}

.m-about-group__header {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;

    h3 {
        min-width: 0;
        margin: 0;
        color: #333;
        font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
        font-size: 24px;
        font-weight: 700;
        line-height: 1.35;
        word-break: break-word;
    }
}

.u-group-icon__wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 1.875rem;
    width: 1.875rem;
    height: 2.25rem;
}

.u-group-icon {
    display: block;
    flex: 0 0 auto;
    object-fit: contain;
    transform: translateY(0);

    &.el-icon-message {
        width: 1.6875rem;
        height: 1.3125rem;
        transform: translateY(-1px);
    }
    &.el-icon-service {
        width: 1.8125rem;
        height: 1.5rem;
        transform: translateY(-1px);
    }
    &.el-icon-user {
        width: 1.6875rem;
        height: 1.6875rem;
        transform: translateY(-2px);
    }

    &.el-icon-position {
        width: 1.6875rem;
        height: 1rem;
        transform: translateY(-1px);
    }

    &.el-icon-setting {
        width: 1.5rem;
        height: 1.6875rem;
        transform: translateY(-1px);
    }
    &.el-icon-trophy {
        width: 1.6875rem;
        height: 1.5625rem;
        transform: translateY(-2px);
    }
    &.el-icon-sugar {
        width: 1.5rem;
        height: 1.3125rem;
        transform: translateY(-1px);
    }
}

.u-group-desc {
    margin: 0;
    color: #999;
    font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
    font-size: 16px;
    line-height: 1.35;
}

.m-about-group__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    flex: 1 1 auto;
    gap: 16px;
    min-width: 0;
}

.u-group-value {
    min-width: 0;
    color: #6690d3;
    font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
    font-size: 18px;
    font-weight: 900;
    line-height: 1.35;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.m-about-group__actions {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.u-group-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    text-decoration: none;

    img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }
}

.u-group-action--copy {
    background: #9fb3d3;
}

.u-group-action--link {
    background: #3e78ff;
}

@media screen and (min-width: 721px) and (max-width: 1280px) {
    .p-about-group {
        max-width: none;
    }

    .m-about-group__list {
        gap: 10px;
    }

    .m-about-group__item {
        min-height: 100px;
        padding: 14px;
        border-radius: 16px;
    }

    .m-about-group__header {
        h3 {
            font-size: 16px;
        }
    }

    .u-group-icon {
        &.el-icon-message {
            width: 1.125rem;
            height: 0.875rem;
        }

        &.el-icon-service {
            width: 1.2083rem;
            height: 1rem;
        }

        &.el-icon-user {
            width: 1.125rem;
            height: 1.125rem;
        }

        &.el-icon-position {
            width: 1.125rem;
            height: 0.6667rem;
        }

        &.el-icon-setting {
            width: 1rem;
            height: 1.125rem;
        }

        &.el-icon-trophy {
            width: 1.125rem;
            height: 1.0417rem;
        }

        &.el-icon-sugar {
            width: 1rem;
            height: 0.875rem;
        }
    }

    .u-group-icon__wrap {
        flex-basis: 1.25rem;
        width: 1.25rem;
        height: 1.5rem;
    }

    .u-group-desc {
        font-size: 12px;
    }

    .u-group-value {
        font-size: 13px;
        white-space: nowrap;
    }

    .m-about-group__actions {
        position: absolute;
        right: 14px;
        bottom: 14px;
    }

    .u-group-action {
        flex-basis: 32px;
        width: 32px;
        height: 32px;

        img {
            width: 18px;
            height: 18px;
        }
    }
}

@media screen and (max-width: @phone) {
    .p-about-group {
        width: 100%;
        max-width: none;
        padding: 0;
    }

    .m-about-group__list {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .m-about-group__item {
        min-height: 132px;
        margin-bottom: 0;
        padding: 20px 56px 20px 20px;
        border-radius: 16px;
    }

    .m-about-group__header {
        h3 {
            font-size: 22px;
        }
    }

    .u-group-desc {
        font-size: 15px;
    }

    .u-group-value {
        font-size: 16px;
    }

    .m-about-group__actions {
        position: absolute;
        right: 16px;
        bottom: 20px;
        opacity: 1;
    }

    .u-group-action {
        flex-basis: 40px;
        width: 40px;
        height: 40px;

        img {
            width: 22px;
            height: 22px;
        }
    }
}
</style>
