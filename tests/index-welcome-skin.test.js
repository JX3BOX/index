const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const welcomePath = path.join(root, "src/views/index/components/welcome.vue");
const cmsPath = path.join(root, "src/service/cms.js");
const docPath = path.join(root, "docs/agents/skin.md");

const welcome = fs.readFileSync(welcomePath, "utf8");
const cms = fs.readFileSync(cmsPath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

assert(
    welcome.includes("design/skin/default/pc_calendar.png"),
    "Welcome calendar should use the pc_calendar default skin image"
);
assert(welcome.includes('const PC_CALENDAR_SUBTYPE = "pc_calendar"'), "Welcome calendar should target pc_calendar");
assert(welcome.includes("if (!User.isLogin())"), "Welcome calendar should skip user skin requests when logged out");
assert(welcome.includes("getUserSkin({ user_id: uid })"), "Welcome calendar should request user skin by user_id");
assert(welcome.includes('normalizeTheme(item.theme) === "all"'), "Welcome calendar should prefer theme=all");
assert(welcome.includes("normalizeTheme(item.theme) === theme"), "Welcome calendar should match the current theme");
assert(!welcome.includes("design/decoration/images"), "Welcome calendar should not use legacy decoration image paths");
assert(!welcome.includes("getUserDecoration({ using: 1, type: \"calendar\" })"), "Welcome calendar should not use legacy decoration API");
assert(cms.includes("/api/cms/user/skin"), "CMS service should expose user skin API");
assert(doc.includes("design/skin/default/pc_calendar.png"), "Skin docs should record the default pc_calendar path");
