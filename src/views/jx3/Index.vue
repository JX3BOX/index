<template>
    <div></div>
</template>

<script>
export default {
    name: "Jx3",
    methods: {
        init() {
            // Root
            const jx3box = "https://www.jx3box.com";
            const pathname = location.pathname;
            if (pathname == "/") {
                location.href = jx3box;
            }

            // Namespace
            const bbs = jx3box + "/namespace";
            const api = "https://cms.jx3box.com/api/cms/namespace/key";
            const key = decodeURIComponent(pathname.slice(1));
            fetch(`https://next2.jx3box.com/api/summary-any/namespace-${key}`);
            fetch(`${api}?key=${key}`)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data && data.code == 0) {
                        const namespace = data.data;
                        if (namespace.source_type == "team") {
                            location.href = jx3box + "/team/org/" + namespace.source_id;
                        } else {
                            location.href = namespace.link || bbs;
                        }
                    } else {
                        location.href = bbs + "?namespace=" + key;
                    }
                })
                .catch((err) => {
                    // 网络请求异常时跳转到bbs
                    location.href = bbs + "?namespace=" + key;
                });
        },
    },
    created() {
        this.init();
    },
};
</script>
