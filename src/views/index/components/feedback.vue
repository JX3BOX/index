<template>
    <a
        class="m-feedback group relative flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden no-underline mb-6"
        :href="feedback"
        target="_blank"
        rel="noopener noreferrer"
    >
        <div
            class="m-feedback__glow absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-20 rounded-full transition-transform duration-500"
        ></div>

        <div class="flex items-center space-x-3 relative z-10">
            <div class="bg-white bg-opacity-20 p-2 rounded-xl">
                <img svg-inline class="w-5 h-5" src="@/assets/img/index/circle.svg" alt="Feedback" />
            </div>
            <div class="flex flex-col items-start leading-tight">
                <span class="text-sm font-bold tracking-wide">{{ $t("index.feedback.title") }}</span>
                <span class="m-feedback__sub text-xs">{{ $t("index.feedback.subtitle") }}</span>
            </div>
        </div>

        <el-icon class="m-feedback__arrow w-4 h-4 opacity-75"><ArrowRight /></el-icon>
    </a>
</template>

<script>

export default {
    name: "IndexFeedbackV5",
    components: {
    },
    data: function () {
        return {
            feedback: "/dashboard/feedback",
        };
    },
};
</script>

<style lang="less">
.m-feedback {
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);

    &:active {
        transform: scale(0.98);
    }
    .m-feedback__sub {
        color: #c7d2fe;
        font-size: 10px;
    }

    .m-feedback__arrow {
        transition: transform 0.2s ease;
    }

    .m-feedback__glow {
        background-color: #706ce4;
    }

    &:hover {
        .m-feedback__arrow {
            transform: translateX(4px);
        }

        .m-feedback__glow {
            transform: translate(50%, -50%) scale(1.5);
        }
    }
}
</style>
