import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";

export { resolveImagePath };

export function nl2br(str, br) {
    return str.split(/\r\n|\n\r|\\n|\r/).join(br || '</br>');
}
