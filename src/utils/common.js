import { getLink } from "@jx3box/jx3box-common/js/utils";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const { __Root, __OriginRoot } = JX3BOX;

const prefix = {
    std: __Root,
    origin: __OriginRoot,
    all : location.origin + '/',
};

function getPostLink(type, id, client = 'std') {
    return prefix[client] + getLink(type, id).slice(1);
}

export { getPostLink };
