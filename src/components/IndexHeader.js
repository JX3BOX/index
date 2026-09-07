import CommonHeader from "@jx3box/jx3box-ui/src/CommonHeader.vue";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { resolveGameClient } from "@/utils/page-tracking";
// 首页的本地 client 模拟同时作用于公共头，保证导航与正文使用同一个客户端。
export default {
    name: "IndexHeader",
    extends: CommonHeader,
    computed: {
        client() {
            return resolveGameClient();
        },
        siteRoot() {
            return this.client === "origin" ? JX3BOX.__OriginRoot : JX3BOX.__Root;
        },
    },
};
