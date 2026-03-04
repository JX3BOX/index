<template>
    <section
        v-if="data && data.length"
        class="m-jx3code bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-6"
    >
        <div class="m-jx3code__header flex items-center space-x-2 px-5 py-4">
            <div class="bg-yellow-100 p-1 rounded">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4 text-amber-500"
                    aria-hidden="true"
                >
                    <path
                        d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
                    ></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 17v2"></path>
                    <path d="M13 11v2"></path>
                </svg>
            </div>
            <span class="font-bold text-gray-700">今日福利</span>
        </div>

        <div class="m-jx3code__body p-6 flex flex-col items-center text-center">
            <div v-for="(item, i) in data" :key="`${item.title || 'code'}-${i}`" class="m-jx3code__item w-full">
                <button
                    type="button"
                    class="m-jx3code__code-group relative w-full"
                    @click="copy(item.title, `${item.title || 'code'}-${i}`)"
                    :aria-label="`复制激活码 ${item.title || ''}`"
                >
                    <h3
                        class="m-jx3code__code text-5xl font-extrabold tracking-tight mb-2 transition-opacity break-words"
                        :style="{ color: item.color || '#e88a31' }"
                    >
                        {{ item.title }}
                    </h3>
                    <div class="m-jx3code__tooltip">点击复制激活码</div>
                </button>

                <p class="text-sm text-gray-500 mb-4">{{ item.desc }}</p>

                <button
                    type="button"
                    class="m-jx3code__copy-btn"
                    @click="copy(item.title, `${item.title || 'code'}-${i}`)"
                    :class="copied_key === `${item.title || 'code'}-${i}` ? 'm-jx3code__copy-btn--success' : ''"
                >
                    <svg
                        v-if="copied_key === `${item.title || 'code'}-${i}`"
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="mr-2"
                    >
                        <path d="M9 12l2 2 4-4"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        class="mr-2"
                    >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                    {{ copied_key === `${item.title || "code"}-${i}` ? "已成功复制" : "复制激活码" }}
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import { getConfigBanner } from "@/service/cms";

export default {
    name: "IndexJx3codeV5",
    data: function () {
        return {
            data: [],
            copied_key: "",
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        resetCopiedState: function (key) {
            this.copied_key = key;
            setTimeout(() => {
                if (this.copied_key === key) {
                    this.copied_key = "";
                }
            }, 1200);
        },
        copyByExecCommand: function (text, key) {
            const input = document.createElement("textarea");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            const copied = document.execCommand("copy");
            document.body.removeChild(input);

            if (copied) {
                this.resetCopiedState(key);
                this.$message({
                    message: "复制成功",
                    type: "success",
                });
            } else {
                this.$message({
                    message: "复制失败，请手动复制",
                    type: "warning",
                });
            }
        },
        copy: function (text, key) {
            if (!text) return;
            const onCopied = () => {
                this.resetCopiedState(key);
                this.$message({
                    message: "复制成功",
                    type: "success",
                });
            };

            if (navigator?.clipboard?.writeText) {
                navigator.clipboard
                    .writeText(text)
                    .then(() => {
                        onCopied();
                    })
                    .catch(() => {
                        this.copyByExecCommand(text, key);
                    });
                return;
            }

            this.copyByExecCommand(text, key);
        },
        loadData: function () {
            getConfigBanner({ client: this.client, type: "code", status: 1, _valid: 1 }).then((res) => {
                this.data = res?.data?.data?.list || [];
            });
        },
    },
    created: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
.m-jx3code {
    .m-jx3code__code {
        margin: 0;
        cursor: pointer;
        line-height: 1.1;
        font-size: 22px;

        &:hover {
            opacity: 0.8;
        }
    }
    .m-jx3code__header {
        border-bottom: 1px dashed #e5e7eb;
    }

    .m-jx3code__tooltip {
        position: absolute;
        top: -2rem;
        left: 50%;
        transform: translateX(-50%);
        background: #1f2937;
        color: #fff;
        font-size: 10px;
        line-height: 1;
        padding: 5px 8px;
        border-radius: 6px;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
        white-space: nowrap;
    }

    .m-jx3code__code-group {
        cursor: pointer;
        border: 0;
        background: transparent;
        padding: 0;
        text-align: center;
    }

    .m-jx3code__code-group:hover .m-jx3code__tooltip {
        opacity: 1;
    }

    .m-jx3code__copy-btn {
        border-color: #f3f4f6;
        border-radius: 12px;
        border-width: 2px;
        border-style: solid;
        background: #fff;
        color: #6b7280;
        font-size: 14px;
        font-weight: 700;
        padding: 12px;
        transition: all 0.2s ease;
        width: 100%;
        .pointer;
        .flex;
        align-items: center;
        justify-content: center;

        &:hover {
            border-color: #fde68a;
            color: #f98003;
        }
    }

    .m-jx3code__copy-btn--success {
        background: #f0fdf4;
        border-color: #bbf7d0;
        color: #16a34a;

        &:hover {
            border-color: #bbf7d0;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-jx3code__body {
        padding: 1rem;
    }

    .m-jx3code__code {
        font-size: 2.25rem;
    }
}
</style>
