Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
// 数据与路由

import App from "@/views/Jx3.vue";
new Vue({
    render: (h) => h(App),
}).$mount("#app");
