<template>
    <div></div>
</template>

<script>
import { getPost } from "@/service/cms";
import { getAppID } from "@jx3box/jx3box-common/js/utils";
import { getPostLink } from "@/utils/common";
export default {
    name: "post",
    computed: {
        id() {
            return getAppID();
        },
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                val && this.loadPost();
            },
        },
    },
    methods: {
        loadPost() {
            getPost(this.id).then((res) => {
                const data = res.data.data;
                if (data?.post_status == "migration") {
                    location.href = getPostLink("community", data.ID, data?.client);
                    return;
                }
                if (data.post_type == "post") {
                    location.href = getPostLink("bbs", data.ID, data?.client);
                    return;
                }

                location.href = getPostLink(data.post_type, data.ID, data?.client);
            });
        },
    },
};
</script>
