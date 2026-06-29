const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const welcomePath = path.join(root, "src/views/index/components/welcome.vue");
const cmsServicePath = path.join(root, "src/service/cms.js");

const welcome = fs.readFileSync(welcomePath, "utf8");
const cmsService = fs.readFileSync(cmsServicePath, "utf8");

assert(
    cmsService.includes("/api/cms/user/decoration/v2"),
    "CMS user decoration service should use the v2 decoration endpoint"
);
assert(
    welcome.includes('subtype: "pc_calendar"'),
    "Welcome calendar decoration request should target the pc_calendar subtype"
);
assert(
    welcome.includes("backgroundPosition"),
    "Welcome picture style should bind the decoration background position"
);
assert(
    welcome.includes("resolveDecorationImage"),
    "Welcome decoration should resolve the v2 image field directly"
);
assert(
    welcome.includes("resolveDecorationPosition"),
    "Welcome decoration should map v2 position values to CSS background-position"
);
assert(
    welcome.includes("resolveDecorationItem"),
    "Welcome decoration should select image and position from the v2 decoration array payload"
);
assert(
    welcome.includes("Array.isArray(decoration?.decorations)"),
    "Welcome decoration should support decorations as an array"
);
assert(
    welcome.includes("DEFAULT_DECORATION_IMAGE"),
    "Welcome decoration should keep an explicit local default image"
);
assert(
    welcome.includes("applyDefaultDecoration"),
    "Welcome decoration should explicitly fall back to the local default when no remote image exists"
);
