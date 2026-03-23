import { createApp } from "vue";
import App from "@/views/search/Index.vue";
const app = createApp(App);

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import { install as JX3BOX_UI } from "@jx3box/jx3box-ui";
import "@jx3box/jx3box-common/css/normalize.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
import "@jx3box/jx3box-common/css/element-fonticon.css";
import "@jx3box/jx3box-common/css/font.css";
import "@/assets/css/tailwind.css";

import store from "@/store";

app.use(store);
app.use(JX3BOX_UI);
app.use(ElementPlus, { locale: zhCn });

app.mount("#app");
