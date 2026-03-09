<template>
    <div class="m-bmap-simple">
        <div class="u-list" :class="list.length % 2 ? 'is-odd' : 'is-even'" v-if="maps.length">
            <div class="u-row" v-for="(row, index) in list" :key="index">
                <el-tooltip v-for="(floor, cIndex) in row" :key="cIndex" placement="top" popper-class="u-bmap-tooltip">
                    <template #content>
                        <div class="u-tip">
                            <div class="u-top">
                                <div class="u-avatar">
                                    <img :src="floor.bossAvatar" :alt="floor.bossName" />
                                </div>
                                <div class="u-right">
                                    <div class="u-name">{{ floor.bossName }}</div>
                                    <div class="u-desc">
                                        <div
                                            v-if="floor.effect && floor.effect.tags && floor.effect.tags.length"
                                            class="u-tag"
                                        >
                                            {{ floor.effect.tags.join("/") }}
                                            + {{ floor.effect.reward }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="floor.nEffectID && floor.effect" class="u-bottom">
                                <div class="u-name">{{ floor.effect.szName }}</div>
                                <div class="u-desc">{{ floor.effect.szDescription }}</div>
                            </div>
                        </div>
                    </template>
                    <div
                        class="u-column"
                        :class="{
                            'is-effect': floor.nEffectID,
                            'is-elite': !((cIndex + 1) % 10),
                        }"
                    >
                        <div class="u-img-index" @click="toMap(index * column + cIndex + 1)">
                            <div class="u-img">
                                <img
                                    class="u-effect"
                                    :src="floor.effect ? iconLink(floor.effect.dwIconID) : iconLink(18505)"
                                />
                            </div>
                            <div class="u-index">
                                <span class="u-index-number">{{ index * column + cIndex + 1 }}</span>
                            </div>
                        </div>
                        <div class="u-name">{{ floor.bossName }}</div>
                        <div class="u-gift">
                            <span class="u-tag" v-if="floor.effect && floor.effect.tags && floor.effect.tags.length">{{
                                floor.effect.tags[0]
                            }}</span>
                            <span class="u-coin" v-if="floor.effect && floor.effect.reward"
                                >+{{ floor.effect.reward }}</span
                            >
                        </div>
                        <div class="u-elite"></div>
                    </div>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { cloneDeep } from "lodash";

function arr1to2(arr, number) {
    const arr2 = [];
    const data = cloneDeep(arr);
    let len = data.length;
    for (let i = 0, j = 0; i < len; i += number, j++) {
        arr2[j] = data.splice(0, number);
    }
    return arr2;
}

export default {
    name: "BaizhanMap",
    props: {
        maps: {
            type: Array,
            required: true,
        },
        column: {
            type: Number,
            default: 10,
        },
    },
    computed: {
        list() {
            return arr1to2(this.maps, this.column);
        },
    },
    methods: {
        iconLink,
        toMap(i) {
            if (!isNaN(i)) {
                window.open(`https://www.jx3box.com/fb/baizhan?floor=${i}`, "_blank");
            }
        },
    },
};
</script>

<style lang="less">
.m-bmap-simple {
    padding: 10px 0;
    .u-list {
        margin: 0 auto;
        position: relative;
        .flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        @border-color: #eee;

        .u-row {
            position: relative;
            .flex;
            gap: 12px;
            height: 75px;

            .u-column {
                position: relative;
                .flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                width: 60px;
                font-size: 12px;

                // @s=32px @b=2px @e=@s+@b*6=44px
                .u-elite {
                    display: none;
                    position: absolute;
                    top: -2px;
                    z-index: 0;
                    width: 44px;
                    height: 39.6px;
                    background-color: #9b7137;
                    transform: rotate(90deg);
                    clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
                }
                &.is-elite {
                    .u-elite {
                        display: block;
                    }
                }
                .u-img-index {
                    cursor: pointer;
                    &:hover {
                        .u-img {
                            filter: brightness(1.2) saturate(1.2);
                            transform: scale(1.1);
                        }
                    }
                }
                .u-img {
                    position: relative;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    flex: none;
                    cursor: pointer;
                    transition: 0.2s ease-in-out;
                    border: 2px solid #d9e0e3;
                    box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    z-index: 1;
                    // @s + @b = 34px
                    .u-effect {
                        width: 34px;
                        height: 34px;
                        position: relative;
                        top: -2px;
                    }
                }

                // @s=32px @b=2px @mark=16px
                // top: @s - @b - @mark/2 = 32 - 2 - 8 = 22px
                // margin-left: -@mark/2 = -8px
                // left: (-@mark - @b)/2 - 1px = (-16 - 2)/2 - 1 = -9 - 1 = -10px
                // width: (@mark + @b)*2 = (16+2)*2 = 36px
                .u-index {
                    position: absolute;
                    top: 22px;
                    left: 50%;
                    margin-left: -8px;
                    width: 16px;
                    height: 16px;
                    text-align: center;
                    z-index: 2;

                    &::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                        transform: rotate(45deg);
                        background-color: #868686;
                        box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
                    }

                    .u-index-number {
                        line-height: 16px;
                        position: absolute;
                        left: -10px;
                        z-index: 5;
                        display: block;
                        font-size: 12px;
                        color: #eee;
                        width: 36px;
                        text-align: center;
                    }
                }

                .u-name {
                    font-size: 12px;
                    margin-top: 5px;
                    transform: scale(0.9);
                    white-space: nowrap;
                }

                .u-gift {
                    width: 160px;
                    font-size: 20px;
                    transform: scale(0.5);
                    margin-top: -5px;
                    color: #900;
                    text-align: center;
                    white-space: nowrap;
                }
                .u-coin {
                    margin-left: 5px;
                    color: orange;
                }
                &.is-effect {
                    .u-index::after {
                        background-color: #9b7137;
                    }
                }
            }
            &:nth-of-type(even) {
                flex-direction: row-reverse;
                &:not(:last-of-type) {
                    &::before {
                        position: absolute;
                        content: "";
                        left: -15px;
                        top: 16px;
                        width: 1px;
                        height: 95px;
                        background-color: @border-color;
                    }
                    &:not(:last-of-type) {
                        .u-column {
                            &:last-of-type {
                                &::before {
                                    position: absolute;
                                    left: -15px;
                                    top: 16px;
                                    content: "";
                                    width: 15px;
                                    height: 1px;
                                    background-color: @border-color;
                                }
                            }
                            &::after {
                                position: absolute;
                                right: -15px;
                                top: 16px;
                                content: "";
                                width: 20px;
                                height: 1px;
                                background-color: @border-color;
                            }
                        }
                    }
                }
            }
            &:nth-of-type(odd) {
                &:not(:last-of-type) {
                    &::after {
                        position: absolute;
                        content: "";
                        right: -15px;
                        top: 16px;
                        width: 1px;
                        height: 95px;
                        background-color: @border-color;
                    }
                    .u-column {
                        &::after {
                            position: absolute;
                            right: -15px;
                            top: 16px;
                            content: "";
                            width: 20px;
                            height: 1px;
                            background-color: @border-color;
                        }
                    }
                }
                &:not(:first-of-type) {
                    .u-column {
                        &:first-of-type {
                            &::before {
                                position: absolute;
                                left: -15px;
                                top: 16px;
                                content: "";
                                width: 15px;
                                height: 1px;
                                background-color: @border-color;
                            }
                        }
                    }
                }
            }
        }
        &.is-odd {
            .u-row {
                &:last-of-type {
                    .u-column {
                        &:not(:last-of-type) {
                            &::after {
                                position: absolute;
                                right: -15px;
                                top: 16px;
                                content: "";
                                width: 20px;
                                height: 1px;
                                background-color: @border-color;
                            }
                        }
                    }
                }
            }
        }
        &.is-even {
            .u-row {
                &:last-of-type {
                    .u-column {
                        &::after {
                            position: absolute;
                            right: -15px;
                            top: 16px;
                            content: "";
                            width: 20px;
                            height: 1px;
                            background-color: @border-color;
                        }
                    }
                }
            }
        }
    }
}
.is-map-phone {
    .m-bmap-simple {
        .u-list {
            align-items: flex-start;
            overflow-y: hidden;
            overflow-x: auto;
            padding: 10px 20px;
        }
    }
}
.u-bmap-tooltip {
    max-width: 200px;
    background-color: rgba(0, 0, 0, 0.8) !important;
    .u-top {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        .u-avatar {
            width: 36px;
            height: 36px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .u-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            .u-name {
                font-size: 13px;
                font-weight: bold;
                color: #ff0;
            }
            .u-tag {
                color: orange;
            }
        }
    }
    .u-bottom {
        font-size: 12px;
        line-height: 1.5;
        margin-top: 10px;
        & > div {
            margin-bottom: 3px;
        }
    }
}
</style>
