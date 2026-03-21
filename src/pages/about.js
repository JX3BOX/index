import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import { install as JX3BOX_UI } from "@jx3box/jx3box-ui";
import "@jx3box/jx3box-common/css/normalize.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
import "@jx3box/jx3box-common/css/element-fonticon.css";
import "@jx3box/jx3box-common/css/font.css";
import "@/assets/css/tailwind.css";

import reporter from "@jx3box/jx3box-common/js/reporter";

import router from "@/router/about";
import store from "@/store";
import App from "@/views/about/About.vue";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(JX3BOX_UI);
app.use(ElementPlus, { locale: zhCn });
reporter.installVue3(app);

app.mount("#app");
