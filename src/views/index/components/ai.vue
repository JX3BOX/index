<template>
    <section
        class="m-ai bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group mb-6"
    >
        <div class="m-ai__content relative z-10">
            <div class="flex items-center space-x-2 mb-4">
                <img src="@/assets/img/entry/index/index/star.svg" class="w-4 h-4 text-yellow-300" svg-inline alt="" />
                <h3 class="text-xs font-bold tracking-tight m-0">魔盒 AI 助手</h3>
            </div>

            <div class="m-ai__form relative">
                <textarea
                    v-model="question"
                    placeholder="快捷全站检索"
                    class="m-ai__textarea w-full bg-white bg-opacity-10 border border-white border-opacity-20 p-3 pr-12 text-xs text-white outline-none transition-all resize-none h-20"
                ></textarea>

                <button
                    class="m-ai__submit absolute bottom-2 right-2 p-2 bg-yellow-300 shadow-lg active:scale-95 transform"
                    type="button"
                    @click="onSubmit"
                >
                    <img src="@/assets/img/entry/index/index/send.svg" svg-inline class="w-3 h-3 text-black" alt="" />
                </button>
            </div>
        </div>

        <img
            svg-inline
            src="@/assets/img/entry/index/index/aibg.svg"
            class="absolute -bottom-4 -left-4 w-20 h-20 text-white text-opacity-10 rotate-12"
            alt=""
        />
    </section>
</template>

<script>
export default {
    name: "IndexAIV5",
    data: function () {
        return {
            question: "",
        };
    },
    methods: {
        onSubmit: function () {
            const q = (this.question || "").trim();
            const link = q ? `/tool/39410?q=${encodeURIComponent(q)}` : "/tool/39410";
            window.open(link, "_blank");
        },
    },
};
</script>

<style lang="less">
.m-ai {
    border-radius: 1rem;
    .m-ai__textarea {
        border-radius: 1rem;
        box-sizing: border-box;
        display: block;

        &::placeholder {
            color: #c7d2fe;
        }

        &:focus {
            background: rgba(255, 255, 255, 0.2);
        }
    }

    .m-ai__submit {
        appearance: none;
        -webkit-appearance: none;
        border: 0;
        border-radius: 0.75rem;
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        cursor: pointer;
    }
}

@media screen and (max-width: @phone) {
    .m-ai {
        border-radius: 1.25rem;
    }
}
</style>
