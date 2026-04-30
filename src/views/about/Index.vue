<template>
    <div class="p-about-index">
        <div class="m-about-slogan">
            <h1>
                <span>为侠者</span>
                <em>筑魔盒</em>
            </h1>
            <p>剑网3玩家实用工具 · 专业 · 全面 · 热爱</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Index",
};
</script>

<style lang="less">
.p-about-index {
    position: relative;
    z-index: 2;
    width: 100%;
    padding-top: clamp(150px, 22vh, 240px);
}

.m-about-slogan {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    width: max-content;
    max-width: 100%;

    h1 {
        display: flex;
        align-items: flex-start;
        gap: 32px;
        margin: 0;
        font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
        font-size: clamp(64px, 6.25vw, 120px);
        font-weight: 900;
        line-height: 1;
        color: #333;
        white-space: nowrap;
    }

    em {
        font-style: normal;
        color: transparent;
        background: linear-gradient(90deg, #4b3bed 0%, #958bff 100%);
        -webkit-background-clip: text;
        background-clip: text;
    }

    p {
        box-sizing: border-box;
        width: 730px;
        max-width: 100%;
        margin: 0;
        padding: 12px 80px;
        border: 1px solid #989cb1;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.8);
        color: #666;
        font-family: "OPPOSans", "Microsoft YaHei", sans-serif;
        font-size: clamp(18px, 1.67vw, 32px);
        font-weight: 500;
        line-height: 1.35;
        text-align: center;
        white-space: nowrap;
    }
}

@media screen and (min-width: 721px) and (max-width: 1279px) {
    .p-about-index {
        padding-top: clamp(120px, 21vh, 160px);
    }

    .m-about-slogan {
        gap: 16px;
        align-items: flex-start;

        h1 {
            gap: 18px;
            font-size: clamp(48px, 5.3vw, 58px);
        }

        p {
            width: 390px;
            padding: 6px 22px;
            font-size: 16px;
        }
    }
}

@media screen and (max-width: @phone) {
    .p-about-index {
        padding-top: 0;
    }

    .m-about-slogan {
        width: 100%;
        padding: 80px 20px 0;
        box-sizing: border-box;

        h1 {
            justify-content: center;
            gap: 14px;
            width: 100%;
            font-size: 42px;
        }

        p {
            width: 100%;
            padding: 10px 18px;
            font-size: 16px;
            white-space: normal;
        }
    }
}
</style>
