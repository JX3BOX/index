<template>
    <div class="about-detail-wrapper">
        <div class="m-about-title">剑三真好玩 魔盒真好用</div>
        <!-- <div class="index-title">
            <div>游戏生活</div>
            <div>由我亲手来掌控</div>
        </div> -->
        <!-- <div class="about-index-btn-list">
            <a href="">用文章了解门派</a>
            <a href="">用数据解决未知</a>
            <a href="">用工具辅助开荒</a>
            <a href="">带着友善分享讨论</a>
            <a href="">带着和谐展现自我</a>
        </div> -->
    </div>
</template>

<script>
export default {
    name: "Index",
    computed: {},
};
</script>

<style lang="less">
.m-about-title {
    background: url("@{cdn}design/about/title.png") no-repeat 0 0;
    background-size: 100% auto;
    width: 1095px / 2;
    height: 641px / 2;
    margin: 0 auto;
    text-indent: -200%;
}
.about-detail-wrapper {
    color: #fff;
    .index-title {
        margin-left: 150px;
        margin-top: 80px;
        margin-bottom: 0;
        font-size: 100px;
        font-weight: bold;
    }
    .about-index-btn-list {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        a {
            margin: 30px 10px;
            padding: 10px 20px;
            border-radius: 30px;
            border: 1px solid #fff;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
        }
    }
}
.m-about-content-phone {
    .about-detail-wrapper {
        width: 100% !important;
        .index-title {
            margin-top: 150px;
            margin-bottom: 50px;
            margin-left: 0;
            font-size: 40px;
            text-align: center;
            div {
                margin-bottom: 10px;
            }
        }
        .about-index-btn-list {
            justify-content: flex-start;
            align-items: flex-start;

            a {
                padding-top: 20px;
                padding-bottom: 20px;
                height: 200px;
            }
        }
    }
}
</style>
