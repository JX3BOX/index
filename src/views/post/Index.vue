<template>
    <div>

    </div>
</template>

<script>
import {getPost} from "@/service/cms"
import { getAppID } from "@jx3box/jx3box-common/js/utils";
export default {
    name : "post",
    computed: {
        id() {
            return getAppID();
        }
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                val && this.loadPost();
            }
        }
    },
    methods: {
        loadPost() {
            getPost(this.id).then((res) => {
                const data = res.data.data;
                if (data?.post_status == 'migration') {
                    location.href = `/community/${data.ID}`;
                }
                if (data.post_type == 'post') {
                    location.href = `/bbs/${data.ID}`;
                }

                location.href = `/${data.post_type}/${data.ID}`;
            })
        }
    }
}
</script>
