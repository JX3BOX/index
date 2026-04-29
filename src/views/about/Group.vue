<template>
    <div class="p-about-group">
        <div class="m-about-group__list">
            <article v-for="(item, index) in group" :key="item.name" class="m-about-group__item">
                <div class="m-about-group__header">
                    <img class="u-group-icon" :class="item.icon" :src="getIcon(item, index)" alt="" />
                    <h3>{{ getTitle(item) }}</h3>
                </div>
                <p class="u-group-desc">{{ getDesc(item) }}</p>
                <div class="m-about-group__footer">
                    <span class="u-group-value">{{ getValue(item) }}</span>
                    <div class="m-about-group__actions">
                        <button
                            class="u-group-action u-group-action--copy"
                            type="button"
                            title="复制"
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
                            title="前往"
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
    methods: {
        getTitle(item) {
            return item.name.replace(/（.*?）/g, "");
        },
        getDesc(item) {
            const matched = item.name.match(/（(.*?)）/);
            if (matched) return matched[1].replace("/", " / ");
            return item.email ? "反馈或商务问题建议" : "社群交流";
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

            ElMessage.success("已复制");
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
}

.m-about-group__list {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.m-about-group__item {
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
        margin: 0;
        color: #333;
        font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
        font-size: 24px;
        font-weight: 700;
        line-height: 1.35;
        white-space: nowrap;
    }
}

.u-group-icon {
    width: 36px;
    height: 36px;
    object-fit: contain;
    &.el-icon-message {
        width: 27px;
        height: 21px;
    }
    &.el-icon-service {
        width: 29px;
        height: 24px;
    }
    &.el-icon-user {
        width: 27px;
        height: 27px;
    }

    &.el-icon-position {
        width: 27px;
        height: 16px;
    }

    &.el-icon-setting {
        width: 24px;
        height: 27px;
    }
    &.el-icon-trophy {
        width: 27px;
        height: 25px;
    }
    &.el-icon-sugar {
        width: 24px;
        height: 21px;
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
    flex: 1 1 auto;
    gap: 16px;
    min-width: 0;
}

.u-group-value {
    color: #6690d3;
    font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
    font-size: 18px;
    font-weight: 900;
    line-height: 1.35;
    white-space: nowrap;
}

.m-about-group__actions {
    display: flex;
    align-items: center;
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

    .u-group-desc {
        font-size: 12px;
    }

    .u-group-value {
        font-size: 13px;
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
        padding: 16px;
    }

    .m-about-group__list {
        grid-template-columns: 1fr;
    }

    .m-about-group__actions {
        opacity: 1;
    }
}
</style>
