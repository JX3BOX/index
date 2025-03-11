Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

// import VueClipboard from 'vue-clipboard2'
// Vue.use(VueClipboard)

// 通用UI模块
import JX3BOX_UI from "@jx3box/jx3box-common-ui";
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";
Vue.use(JX3BOX_UI);
// import Comments from "@jx3box/jx3box-comment-ui"
// Vue.use(Comments)

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.install(Vue);

import "./icons"; // svgicon

// 数据与路由
// import router from "./router";
import store from "./store";

import App from "./App.vue";
new Vue({
    // router,
    store,
    render: (h) => h(App),
}).$mount("#app");
