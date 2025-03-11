import { $next, $cms } from "@jx3box/jx3box-common/js/https";
const API_PREFIX = `/api/next2`;

// 获取分类
function getTopicBucket(params) {
    return $cms().get(`/api/cms/topic/bucket`, { params });
}

// 获取公开的讨论主题帖子列表
const getTopicList = (params) => {
    return $next().get(`${API_PREFIX}/community/discussion/topic/list`, { params });
};

// 获取最新讨论-主题帖和回复各4条
const getMixLatest = () => {
    return $next().get(`${API_PREFIX}/community/discussion/mix-latest`);
};

export { getTopicList, getTopicBucket, getMixLatest };
