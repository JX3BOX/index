<template>
    <div class="m-calendar-item-wrapper">
        <div class="m-pop-content">
            <a
                class="u-link"
                :class="linkClassName(data)"
                :style="{
                    color: data.bgcolor && '#fff',
                    //fontWeight: !data.bgcolor && data.color && 'bold',
                    backgroundImage: `url(${resolveImagePath(data.img)})`,
                    backgroundColor: data.bgcolor || 'rgba(255,255,255,0.6)',
                }"
                :href="`/calendar/view/${data.id}`"
                target="_blank"
            >
                {{ data.title || data.desc }}
            </a>
        </div>
    </div>
</template>

<script>
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "calendar-item",
    props: {
        data: {
            type: Object,
            default: null,
        },
    },
    methods: {
        linkClassName({ type }) {
            if (type === 1) {
                return "is-event";
            }
            return "is-activity";
        },
        resolveImagePath,
    },
};
</script>

<style lang="less" scoped>
.m-pop-content {
    .fz(12px);
        .u-link {
            .nobreak;
            .db;
            cursor: pointer;
            border-radius: 3px;
            padding: 2px 3px;
            margin-bottom: 4px;
        }

        .u-date-count {
            .mt(6px);
            text-align: right;
        }
}
</style>
