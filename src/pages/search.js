import { createApp } from "vue";
import App from "@/views/search/Index.vue";
const app = createApp(App);

import store from "./store";
app.use(store);

app.mount("#app");
