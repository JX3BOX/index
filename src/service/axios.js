import axios from "axios";
axios.defaults.withCredentials = true;

import Vue from "vue";
import { Message, Notification } from "element-ui";
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(err) {
        if (err.response && err.response.data) {
            Vue.$message.error(`${err.response.data.msg}`);
        } else {
            Vue.$message.error("网络请求异常");
        }
        console.log(err)
        return Promise.reject(error);
    }
);

export default axios
