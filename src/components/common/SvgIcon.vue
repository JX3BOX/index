<template>
    <svg
        v-if="!online"
        :class="svgClass"
        :style="{ width: size + 'em', height: size + 'em' }"
        aria-hidden="true"
        v-on="$listeners"
    >
        <use :xlink:href="iconName" />
    </svg>
    <img v-else :src="iconName" :class="svgClass" svg-inline />
</template>

<script>
export default {
    name: "SvgIcon",
    props: {
        iconClass: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            default: "",
        },
        size: {
            type: String,
            default: "1",
        },
        online: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        iconName() {
            if (this.online) {
                return this.iconClass;
            } else {
                return `#icon-${this.iconClass}`;
            }
        },
        svgClass() {
            if (this.online) {
                return this.className || "u-icon";
            } else {
                if (this.className) {
                    return "svg-icon " + this.className;
                } else {
                    return "svg-icon";
                }
            }
        },
    },
};
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: 16px;
    text-rendering: geometricPrecision;
}
</style>
