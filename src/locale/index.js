import zhCNIndex from "./zh-CN/index";
import enUSIndex from "./en-US/index";
import zhTWIndex from "./zh-TW/index";
import viIndex from "./vi/index";

export const APP_I18N_MESSAGES = {
    "zh-CN": {
        index: zhCNIndex,
    },
    "en-US": {
        index: enUSIndex,
    },
    "zh-TW": {
        index: zhTWIndex,
    },
    vi: {
        index: viIndex,
    },
};

export function mergeAppLocaleMessages(i18n) {
    if (!i18n || !i18n.global || typeof i18n.global.mergeLocaleMessage !== "function") return;
    Object.entries(APP_I18N_MESSAGES).forEach(([locale, message]) => {
        i18n.global.mergeLocaleMessage(locale, message);
    });
}
