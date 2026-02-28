<template>
    <footer class="c-footer-v4 c-footer">
        <div class="c-footer-v4__main">
            <section class="c-footer-v4__brand">
                <div class="c-footer-v4__logo-wrap">
                    <div class="c-footer-v4__logo">
                        <img class="u-pic" svg-inline src="@/assets/img/logo.svg" />
                    </div>
                    <div class="c-footer-v4__name">JX3BOX</div>
                </div>
                <p class="c-footer-v4__desc">
                    <!-- TODO: 文案待调整 -->
                    在这里，开发者与玩家共同构建大唐江湖。我们坚持开源协作，致力于通过技术手段优化玩家的游戏体验。
                </p>
                <div class="c-footer-v4__socials">
                    <div v-for="item in socials" :key="item.name" class="c-footer-v4__social-wrap">
                        <el-popover
                            v-if="item.qrcode"
                            trigger="hover"
                            placement="top"
                            popper-class="c-footer-v4__popover"
                        >
                            <div class="c-footer-v4__qrcode">
                                <img class="c-footer-v4__qrcode-img" :src="item.qrcode" :alt="item.name" />
                                <span class="c-footer-v4__qrcode-text">{{ item.name }}</span>
                            </div>
                            <a slot="reference" class="c-footer-v4__social" :title="item.name" href="javascript:;">
                                <img svg-inline :class="`u-${item.key}`" :src="item.icon" :alt="item.name" />
                            </a>
                        </el-popover>
                        <a
                            v-else
                            class="c-footer-v4__social"
                            :href="item.href"
                            target="_blank"
                            rel="noopener noreferrer"
                            :title="item.name"
                        >
                            <img svg-inline :class="`u-${item.key}`" :src="item.icon" :alt="item.name" />
                        </a>
                    </div>
                </div>
            </section>

            <section class="c-footer-v4__links">
                <h3 class="c-footer-v4__title">关于我们</h3>
                <a
                    v-for="item in aboutLinks"
                    :key="item.name"
                    class="c-footer-v4__link"
                    :href="item.href"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ item.name }}
                </a>
            </section>

            <section class="c-footer-v4__links">
                <h3 class="c-footer-v4__title">法律合规</h3>
                <a
                    v-for="item in legalLinks"
                    :key="item.name"
                    class="c-footer-v4__link"
                    :href="item.href"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ item.name }}
                </a>
            </section>

            <section class="c-footer-v4__download">
                <h3 class="c-footer-v4__title">下载中心</h3>
                <div class="c-footer-v4__download-grid">
                    <!-- TODO: 下载图片待完善 -->
                    <div v-for="item in downloadLinks" :key="item.name" class="c-footer-v4__download-wrap">
                        <el-popover trigger="hover" placement="top" popper-class="c-footer-v4__popover">
                            <div class="c-footer-v4__download-qrcode">
                                <img class="c-footer-v4__download-qrcode-img" :src="item.qrcode" :alt="item.name" />
                                <span class="c-footer-v4__download-qrcode-text">扫码下载 {{ item.name }}</span>
                            </div>
                            <a
                                slot="reference"
                                class="c-footer-v4__download-item"
                                :href="item.href || 'javascript:;'"
                                :target="item.href ? '_blank' : null"
                                :rel="item.href ? 'noopener noreferrer' : null"
                            >
                                <span class="c-footer-v4__download-icon">
                                    <img svg-inline :src="item.icon" :alt="item.name" />
                                </span>
                                <span>{{ item.name }}</span>
                            </a>
                        </el-popover>
                    </div>
                </div>
                <a
                    class="c-footer-v4__bot"
                    href="https://jq.qq.com/?_wv=1027&k=XkO6DVvm"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img class="c-footer-v4__bot-icon" src="@/assets/img/left/qqbot2.png" alt="QQ机器人" />
                    <div class="c-footer-v4__bot-info">
                        <span class="c-footer-v4__bot-label">QQ 机器人服务</span>
                        <strong>3889010020</strong>
                    </div>
                    <span class="c-footer-v4__bot-action">添加</span>
                </a>
            </section>
        </div>

        <div class="c-footer-v4__extra">
            <h3 class="c-footer-v4__title">更多入口</h3>
            <div class="c-footer-v4__extra-links">
                <a
                    v-for="item in extraLinks"
                    :key="item.name"
                    class="c-footer-v4__extra-link"
                    :href="item.href"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ item.name }}
                </a>
            </div>
        </div>

        <div class="c-footer-v4__bottom">
            <span class="c-footer-v4__copyright">© 2024 JX3BOX. 由开源社区驱动。</span>
            <div class="c-footer-v4__record">
                <span>湘ICP备2021002288号</span>
                <span>湘公网安备 43019002001234号</span>
            </div>
            <div class="c-footer-v4__bottom-links">
                <a href="https://rx-planet.com/contact" target="_blank" rel="noopener noreferrer">联系我们</a>
                <a href="https://www.jx3box.com/feedback" target="_blank" rel="noopener noreferrer">反馈建议</a>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {
            socials: [
                {
                    name: "公众号",
                    key: "wechat",
                    href: "",
                    icon: require("@/assets/img/wechat.svg"),
                    qrcode: require("@/assets/img/right/qrcode.png"),
                },
                {
                    name: "B站",
                    key: "bilibili",
                    href: "https://space.bilibili.com/398184590",
                    icon: require("@/assets/img/footer/bilibili.svg"),
                },
                {
                    name: "微博",
                    key: "weibo",
                    href: "https://weibo.com/jx3box",
                    icon: require("@/assets/img/tv/weibo.svg"),
                },
                {
                    name: "抖音",
                    key: "douyin",
                    href: "https://www.douyin.com/",
                    icon: require("@/assets/img/tv/douyin.svg"),
                },
            ],
            aboutLinks: [
                { name: "团队成员", href: "https://www.jx3box.com/about/" },
                { name: "加入我们", href: "https://www.jx3box.com/notice/21899" },
                { name: "开发文档", href: "https://www.jx3box.com/tool?subtype=4" },
                { name: "品牌资产", href: "https://github.com/JX3BOX" },
            ],
            legalLinks: [
                { name: "用户协议", href: "https://www.jx3box.com/about/license" },
                { name: "创作公约", href: "https://www.jx3box.com/about/treaty" },
                { name: "隐私保护", href: "https://www.jx3box.com/about/privacy" },
                { name: "免责声明", href: "https://www.jx3box.com/about/incentives" },
            ],
            extraLinks: [
                { name: "游戏版本", href: "https://www.jx3box.com/topic" },
                { name: "活动中心", href: "https://www.jx3box.com/event" },
                { name: "全站地图", href: "https://www.jx3box.com/app/" },
            ],
            downloadLinks: [
                {
                    name: "App Store",
                    href: "",
                    icon: require("@/assets/img/footer/ios.svg"),
                    qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "Android",
                    href: "",
                    icon: require("@/assets/img/footer/android.svg"),
                    qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "鸿蒙 NEXT",
                    href: "",
                    icon: require("@/assets/img/footer/harmony.svg"),
                    qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
                {
                    name: "小程序",
                    href: "",
                    icon: require("@/assets/img/footer/miniprogram.svg"),
                    qrcode: require("@/assets/img/mobile/mp.jpg"),
                },
            ],
        };
    },
};
</script>

<style lang="less">
.c-footer-v4 {
    padding: 28px 30px 16px;
    background: #242b36;
    color: #a6aebd;
}

.c-footer-v4__main {
    display: grid;
    grid-template-columns: minmax(240px, 1.2fr) minmax(140px, 0.8fr) minmax(140px, 0.8fr) minmax(320px, 1.2fr);
    gap: 20px;
}

.c-footer-v4__logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.c-footer-v4__logo {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    .u-pic {
        width: 56px;
        height: 56px;
        fill: #fff;
    }
}

.c-footer-v4__name {
    color: #fff;
    font-size: 26px;
    line-height: 1.15;
    font-weight: 700;
}

.c-footer-v4__desc {
    margin: 16px 0;
    max-width: 360px;
    font-size: 14px;
    line-height: 1.8;
    color: #7f8898;
}

.c-footer-v4__socials {
    display: flex;
    gap: 10px;
}

.c-footer-v4__social-wrap {
    position: relative;
}

.c-footer-v4__social {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #303744;
    border: 1px solid #3b4351;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    img,
    svg {
        width: 20px;
        height: 20px;
    }

    svg {
        * {
            fill: currentColor !important;
            stroke: none !important;
        }
    }
}

.c-footer-v4__qrcode {
    padding: 10px 0;
    width: 136px;
    text-align: center;
    .flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.c-footer-v4__qrcode-img {
    width: 124px;
    height: 124px;
    display: block;
    border-radius: 4px;
}

.c-footer-v4__qrcode-text {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #c9d1de;
    white-space: nowrap;
}

.c-footer-v4__title {
    margin: 4px 0 12px;
    color: #f5f7fa;
    font-size: 16px;
    line-height: 1.2;
    font-weight: 600;
}

.c-footer-v4__links {
    display: flex;
    flex-direction: column;
}

.c-footer-v4__link {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 10px;
    color: #aeb7c6;
    font-size: 14px;
    line-height: 1.4;
}

.c-footer-v4__download-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.c-footer-v4__download-wrap {
    position: relative;
}

.c-footer-v4__download-item {
    height: 48px;
    border-radius: 10px;
    border: 1px solid #434b58;
    background: #313843;
    color: #b4bccb;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    gap: 10px;
    &:hover {
        .c-footer-v4__download-icon {
            filter: invert(25%) sepia(65%) saturate(2319%) hue-rotate(198deg) brightness(104%) contrast(103%);
        }
    }
}

.c-footer-v4__download-qrcode {
    padding: 10px 0;
    text-align: center;
    width: 100%;
    .flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.c-footer-v4__popover {
    background: #2c3340;
    border: 1px solid #3f4754;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    min-width: 140px;
    padding: 0 !important;

    .popper__arrow,
    .popper__arrow:after {
        display: none !important;
    }
}

.c-footer-v4__download-qrcode-img {
    width: 124px;
    height: 124px;
    border-radius: 4px;
    display: block;
}

.c-footer-v4__download-qrcode-text {
    display: block;
    margin-top: 8px;
    color: #c9d1de;
    font-size: 12px;
    white-space: nowrap;
}

.c-footer-v4__download-icon {
    width: 18px;
    height: 18px;
    text-align: center;
    color: inherit;

    img,
    svg {
        width: 18px;
        height: 18px;
        display: block;
        filter: invert(90%) sepia(13%) saturate(205%) hue-rotate(178deg) brightness(92%) contrast(91%);
    }
}

.c-footer-v4__bot {
    margin-top: 14px;
    border-radius: 12px;
    border: 1px solid #3f4754;
    background: #303743;
    padding: 14px;
    display: flex;
    align-items: center;
    color: #d3d9e4;
}

.c-footer-v4__bot-icon {
    width: 28px;
    height: 28px;
    margin-right: 10px;
}

.c-footer-v4__bot-info {
    display: flex;
    flex-direction: column;
    .c-footer-v4__bot-label {
        color: #909ab0;
        font-size: 12px;
    }
    strong {
        margin-top: 2px;
        color: #fff;
        font-size: 18px;
        line-height: 1.1;
        letter-spacing: 0.5px;
    }
}

.c-footer-v4__bot-action {
    margin-left: auto;
    padding: 6px 14px;
    border-radius: 999px;
    background: #2d446f;
    color: #75a8ff;
    font-size: 13px;
}

.c-footer-v4__extra {
    margin-top: 14px;
}

.c-footer-v4__extra-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
}

.c-footer-v4__extra-link {
    color: #95a0b3;
    font-size: 14px;
}

.c-footer-v4__bottom {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid #3a4250;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
}

.c-footer-v4__copyright,
.c-footer-v4__record span {
    color: #6f7888;
    font-size: 12px;
}

.c-footer-v4__record {
    display: flex;
    gap: 10px;
}

.c-footer-v4__bottom-links {
    margin-left: auto;
    display: flex;
    gap: 16px;
    a {
        color: #919bab;
        font-size: 13px;
    }
}

@media screen and (max-width: 1600px) {
    .c-footer-v4 {
        padding: 22px 24px 14px;
    }

    .c-footer-v4__main {
        grid-template-columns: minmax(220px, 1fr) minmax(120px, 0.8fr) minmax(120px, 0.8fr) minmax(260px, 1fr);
    }

    .c-footer-v4__logo {
        width: 48px;
        height: 48px;
        .u-pic {
            width: 48px;
            height: 48px;
        }
    }

    .c-footer-v4__name {
        font-size: 22px;
    }

    .c-footer-v4__title {
        margin-bottom: 10px;
        font-size: 15px;
    }

    .c-footer-v4__desc {
        margin: 12px 0;
        font-size: 14px;
    }

    .c-footer-v4__link,
    .c-footer-v4__download-item,
    .c-footer-v4__extra-link {
        font-size: 13px;
    }

    .c-footer-v4__download-item {
        height: 44px;
    }

    .c-footer-v4__bot-info {
        strong {
            font-size: 16px;
        }
    }

    .c-footer-v4__bot-action {
        font-size: 12px;
    }
}

@media screen and (max-width: 1133px) {
    .c-footer-v4 {
        border-radius: 0;
    }

    .c-footer-v4__main {
        grid-template-columns: 1fr;
    }

    .c-footer-v4__bottom {
        flex-direction: column;
        align-items: flex-start;
    }

    .c-footer-v4__bottom-links {
        margin-left: 0;
    }
}
</style>
