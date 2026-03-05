<template>
    <section class="m-download bg-gray-900 p-8 text-white shadow-xl relative overflow-hidden mb-6">
        <div class="m-download__content text-center relative z-10">
            <h3 class="m-download__title text-xs font-black flex items-center mb-6 tracking-widest uppercase m-0">
                <img src="@/assets/img/index/download.svg" alt="" svg-inline class="w-4 h-4 mr-2 text-yellow-300" />
                关注与下载
            </h3>

            <!-- <div class="m-download__qrcode bg-white p-3 mb-6 shadow-2xl inline-block mx-auto">
                <div
                    class="m-download__qrcode-inner aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden group"
                >
                    <img
                        class="m-download__qrcode-image"
                        src="@/assets/img/mobile/miniprogram.jpg"
                        alt="扫码关注魔盒"
                    />
                </div>
            </div> -->

            <div class="grid grid-cols-2 gap-3">
                <button
                    class="m-download__btn flex flex-col items-center p-3 rounded-2xl transition-all"
                    type="button"
                    disabled
                    aria-disabled="true"
                >
                    <img src="@/assets/img/index/ios.svg" class="w-6 h-6" alt="iOS" />
                    <span class="text-xs font-black m-download__btn-text">iOS</span>
                </button>

                <button
                    class="m-download__btn flex flex-col items-center p-3 rounded-2xl transition-all"
                    type="button"
                    disabled
                    aria-disabled="true"
                >
                    <img src="@/assets/img/index/android.svg" class="w-6 h-6 text-white" svg-inline alt="Android" />
                    <span class="text-xs font-black m-download__btn-text">Android</span>
                </button>

                <button
                    class="m-download__btn flex flex-col items-center p-3 rounded-2xl transition-all"
                    type="button"
                    disabled
                    aria-disabled="true"
                >
                    <img src="@/assets/img/index/harmoneyos.svg" class="w-6 h-6" alt="HarmonyOS" />
                    <span class="text-xs font-black m-download__btn-text">HarmonyOS</span>
                </button>
            </div>
        </div>

        <div class="m-download__glow absolute top-0 right-0 w-32 h-32"></div>
    </section>
</template>

<script>
export default {
    name: "IndexDownloadV5",
};
</script>

<style lang="less">
.m-download {
    border-radius: 2.5rem;
    .m-download__qrcode {
        border-radius: 1.5rem;
    }

    .m-download__qrcode-inner {
        border-radius: 1rem;
    }

    .m-download__qrcode-image {
        width: 200px;
    }

    .m-download__qrcode-mask {
        opacity: 0;
        background: rgba(255, 255, 255, 0.65);
    }

    .m-download__qrcode-inner:hover .m-download__qrcode-mask {
        opacity: 1;
    }

    .m-download__btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: not-allowed;
    }

    .m-download__btn-icon {
        color: #d1d5db;
        border-color: #d1d5db;
    }

    .m-download__btn-text {
        color: #9ca3af;
    }

    .m-download__btn:disabled {
        opacity: 0.7;
    }

    .m-download__glow {
        background: rgba(245, 158, 11, 0.1);
        filter: blur(48px);
    }
}

@media screen and (max-width: @phone) {
    .m-download {
        border-radius: 1.5rem;
        padding: 1.25rem;
    }
}
</style>
