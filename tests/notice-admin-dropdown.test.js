const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const singlePath = path.join(root, "src/views/notice/components/NoticeSingle.vue");
const zhCnPath = path.join(root, "src/locale/zh-CN/notice.js");

const single = fs.readFileSync(singlePath, "utf8");
const zhCn = fs.readFileSync(zhCnPath, "utf8");

assert(single.includes("<el-dropdown"), "Notice admin actions should use an Element Plus dropdown");
assert(single.includes("notice.single.more"), "Dropdown trigger should use the notice.single.more label");
assert(single.includes("notice.single.manage"), "Dropdown should keep the manage action label");
assert(single.includes("notice.single.push"), "Dropdown should include the push action label");
assert(single.includes('command="openAdminPanel"'), "Manage menu item should open the admin panel");
assert(single.includes('command="openDesignTask"'), "Push menu item should open the design task dialog");
assert(single.includes("DesignTask"), "Notice detail should mount the DesignTask dialog");
assert(single.includes(":post=\"designTaskPost\""), "DesignTask should receive a post payload with notice defaults");
assert(single.includes('subtype: "notice"'), "DesignTask push type should default to notice");
assert(zhCn.includes('more: "更多"'), "Chinese notice locale should define the More label");
assert(zhCn.includes('push: "推送"'), "Chinese notice locale should define the Push label");
