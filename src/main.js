// 1.Create APP
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

// 2.Router
import router from "./router";
app.use(router);

// 3.Store
import store from "./store";
app.use(store);

// 4.i18n
// import { Jx3boxUiI18n, getJx3boxUiAvailableLocales } from "../index.js";
//
// const __langKey = (localStorage.getItem("lang") || "zh-cn").toLowerCase();
// const __langMap = {
    // "zh-cn": "zh-CN",
    // "en-us": "en-US",
    // "zh-tw": "zh-TW",
    // vi: "vi",
// };
// const __preferredI18nLocale = __langMap[__langKey] || "zh-CN";
// const __supportedI18nLocales = getJx3boxUiAvailableLocales();
// const __i18nLocale = __supportedI18nLocales.includes(__preferredI18nLocale) ? __preferredI18nLocale : "zh-CN";
//
// app.use(Jx3boxUiI18n, {
    // locale: __i18nLocale,
// });

// 5.Components
import { createHead } from "@vueuse/head";
const head = createHead();
app.use(head);

// 6.UI

// 6.1 JX3BOX UI
import "@jx3box/jx3box-common/css/normalize.css";
import "@jx3box/jx3box-common/css/font.css";
import { install as JX3BOX_UI } from "@jx3box/jx3box-ui";
app.use(JX3BOX_UI);

// 6.2 Element Plus
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import vi from "element-plus/es/locale/lang/vi";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";

const __elementLocaleMap = {
    "zh-CN": zhCn,
    "en-US": en,
    "zh-TW": zhTw,
    vi,
};
// TODO:国际化
// const __elementLocale = __elementLocaleMap[__i18nLocale] || zhCn;
app.use(ElementPlus, {
    // locale: __elementLocale,
});
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 6.3 Tailwind
import "@jx3box/jx3box-common/css/tailwind.css";


// 7. 其它扩展

// 7.1 Matomo统计上报
import VueMatomo from 'vue-matomo'
app.use(VueMatomo, {
    host: 'https://matomo.2kog.com/',
    siteId: 2
});

// Final.Mount DOM
app.mount("#app");
