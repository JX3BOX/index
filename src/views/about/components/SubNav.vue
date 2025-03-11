<template>
    <nav class="a-sub-nav" :class="{ 'is--phone': side }">
        <div class="nav-logo-wrap">
            <router-link to="/">
                <img class="u-logo" svg-inline fill="white" src="@/assets/img/logo.svg" />
                <span class="about-title">关于我们</span>
            </router-link>
        </div>
        <ul class="sub-nav-list" :class="{ 'is-open': isOpen }">
            <router-link
                :to="route.children ? route.children[0].path : route.path"
                v-for="route in $router.options.routes"
                :key="route.path"
                custom
                class="sub-nav-item hvr-underline-from-center"
            >
                {{ route.meta.title }}
            </router-link>
        </ul>
    </nav>
</template>

<script>
export default {
    name: "SubNav",
    props: ["side"],
    data() {
        return {
            isOpen: false,
        };
    },
    computed: {},
};
</script>

<style lang="less">
.a-sub-nav {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 48px;
    padding-bottom: 32px;
    width: 100%;
    height: 50px;
    overflow: hidden;
    .nav-logo-wrap {
        min-width: 200px;
        padding-left: 54px;
        a {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #fff;
        }
        .u-logo {
            width: 40px;
            height: 40px;
        }
        .about-title {
            padding-left: 13px;
            font-weight: 700;
            font-size: 34px;
        }
    }
    .sub-nav-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .sub-nav-item {
            list-style: none;
            margin: 0 10px;
            width: 140px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: #fff;
            cursor: pointer;
            &.router-link-exact-active {
                color: #24292e;
                background-color: #fff;
                font-weight: 700;
                border-radius: 30px;
            }
            &:hover {
                font-weight: 700;
            }
        }
    }

    &.is--phone {
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        align-items: flex-start;
        .sub-nav-list {
            flex-direction: column;
            align-items: flex-start;
            padding: 0;
            margin: 0;
            width: 100%;
            .sub-nav-item {
                color: #24292e;
                width: calc(100% - 30px);
                border-radius: 10px;
                text-align: left;
                padding-left: 30px;
                margin: 0;
                &.router-link-exact-active {
                    color: #0366d6;
                }
            }
        }
    }
}

@media screen and (max-width: @ipad) {
    .a-sub-nav {
        .nav-logo-wrap {
            display: none;
        }
    }
}
/* Underline From Center */
.hvr-underline-from-center {
    display: inline-block;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    position: relative;
    overflow: hidden;
}
.hvr-underline-from-center:before {
    content: "";
    position: absolute;
    z-index: -1;
    left: 51%;
    right: 51%;
    bottom: 0;
    background: #fff;
    height: 4px;
    -webkit-transition-property: left, right;
    transition-property: left, right;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}
.hvr-underline-from-center:hover:before,
.hvr-underline-from-center:focus:before,
.hvr-underline-from-center:active:before {
    left: 0;
    right: 0;
}
</style>
