<template>
    <a
        class="m-feedback-v5 group relative flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden no-underline mb-6"
        :href="feedback"
        target="_blank"
        rel="noopener noreferrer"
    >
        <div
            class="m-feedback-v5__glow absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-20 h-20 bg-white bg-opacity-20 rounded-full blur-2xl transition-transform duration-500"
        ></div>

        <div class="flex items-center space-x-3 relative z-10">
            <div class="bg-white bg-opacity-20 p-2 rounded-xl">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-5 h-5"
                    aria-hidden="true"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M8 10h8"></path>
                    <path d="M8 7h8"></path>
                    <path d="M8 13h4"></path>
                </svg>
            </div>
            <div class="flex flex-col items-start leading-tight">
                <span class="text-sm font-bold tracking-wide">反馈中心</span>
                <span class="m-feedback-v5__sub text-xs">Feedback Center</span>
            </div>
        </div>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="m-feedback-v5__arrow w-4 h-4 opacity-75"
            aria-hidden="true"
        >
            <path d="m9 18 6-6-6-6"></path>
        </svg>
    </a>
</template>

<script>
export default {
    name: "IndexFeedbackV5",
    data: function () {
        return {
            feedback: "/feedback",
        };
    },
};
</script>

<style lang="less">
.m-feedback-v5 {
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);

    &:active {
        transform: scale(0.98);
    }
}

.m-feedback-v5__sub {
    color: #c7d2fe;
    font-size: 10px;
}

.m-feedback-v5__arrow {
    transition: transform 0.2s ease;
}

.m-feedback-v5:hover .m-feedback-v5__arrow {
    transform: translateX(4px);
}

.m-feedback-v5:hover .m-feedback-v5__glow {
    transform: translate(50%, -50%) scale(1.5);
}
</style>
