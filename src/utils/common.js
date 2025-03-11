import { getLink } from "@jx3box/jx3box-common/js/utils";
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";

const prefix = {
    std: __Root,
    origin: __OriginRoot,
    all : location.origin + '/',
};

function getPostLink(type, id, client = 'std') {
    return prefix[client] + getLink(type, id).slice(1);
}

export { getPostLink };
