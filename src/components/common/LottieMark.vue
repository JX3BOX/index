<!-- src/components/common/LottieMark.vue (simplified) -->
<template>
    <span class="lottie-mark-wrapper" :style="wrapperStyle" :class="wrapperClass">
        <!-- 背景：Lottie 动画 -->
        <span
            ref="lottieContainer"
            class="lottie-container"
            :class="className"
            aria-hidden="true"
        ></span>
        <!-- 文本：支持 slot 或 mark -->
        <span class="corner-mark-text" :style="textStyle">
            <slot>{{ mark }}</slot>
        </span>
    </span>
</template>

<script>
import lottie from "lottie-web";
import { cloneDeep } from "lodash";
import defaultAnimationData from "@/assets/data/boxmark.json";

export default {
    name: "LottieMark",
    props: {
        // 自定义文字
        mark: { type: String, default: "" },
        // 尺寸
        width: { type: String, default: "auto" },
        height: { type: String, default: "15px" },
        // 轻量样式
        fontSize: { type: String, default: "12px" },
        textColor: { type: String, default: "#fff" },
        radius: { type: String, default: "6px" },
        // 背景色（覆盖动画填充色）
        bgColor: { type: String, default: "" },
        // 主题 class（兼容旧用法 ishot|isnew|isbeta|isdoing）
        className: { type: String, default: "ishot" },
    },
    computed: {
        wrapperStyle() {
            return { width: this.width, height: this.height, borderRadius: `${this.radius} 0 ${this.radius} 0` };
        },
        wrapperClass() {
            return this.className ? [this.className] : [];
        },
        textStyle() {
            return { fontSize: this.fontSize, color: this.textColor };
        },
    },
    data() {
        return { animation: null };
    },
    mounted() {
        this.loadAnimation();
    },
    watch: {
        bgColor() {
            this.loadAnimation();
        },
        className() {
            this.loadAnimation();
        },
    },
    beforeDestroy() {
        if (this.animation) this.animation.destroy();
    },
    methods: {
        colorFromClassName(name) {
            const map = {
                ishot: "#cc0000",
                isnew: "#2fcb53",
                isbeta: "#6f42c1",
                isdoing: "#fba524",
            };
            return map[name] || "";
        },
        hexToRgbNormalized(hex) {
            if (!hex) return null;
            const m = hex.replace('#','').match(/.{1,2}/g);
            if (!m || m.length < 3) return null;
            const [r,g,b] = m.map(v => parseInt(v,16));
            return [r/255, g/255, b/255, 1];
        },
        recolorBg(json, hexColor) {
            if (!json || !hexColor) return json;
            const rgba = this.hexToRgbNormalized(hexColor);
            if (!rgba) return json;
            try {
                const layer = (json.layers || []).find(l => l.nm === 'bg');
                if (!layer) return json;
                const group = (layer.shapes || []).find(s => s.it);
                if (!group) return json;
                const fill = group.it.find(it => it.ty === 'fl' && it.c && it.c.k);
                if (!fill) return json;
                fill.c.k = rgba;
            } catch (e) {
                // ignore
            }
            return json;
        },
        loadAnimation() {
            const ref = this.$refs.lottieContainer;
            if (!ref) return;
            if (this.animation) {
                this.animation.destroy();
                this.animation = null;
            }
            // 计算目标颜色：优先 bgColor，否则按 className 映射
            const targetColor = this.bgColor || this.colorFromClassName(this.className);
            const data = this.recolorBg(cloneDeep(defaultAnimationData), targetColor);

            this.animation = lottie.loadAnimation({
                container: ref,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: data,
            });
            this.animation.addEventListener("DOMLoaded", () => this.$emit("ready", this.animation));
            this.animation.addEventListener("complete", () => this.$emit("complete"));
            this.animation.addEventListener("loopComplete", () => this.$emit("loop-complete"));
        },
    },
};
</script>

<style lang="less">
.lottie-mark-wrapper {
    position: static; // 由外部类（如 .u-mark）控制定位
    display: inline-flex; // 让容器根据文字自然撑开
    align-items: center;
    justify-content: center;
    overflow: hidden;
    pointer-events: none; // 不拦截父级链接点击
}
.lottie-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
.corner-mark-text {
    position: relative; // 覆盖在动画之上，但不脱离文档流
    z-index: 1;
    pointer-events: none;
}
</style>
