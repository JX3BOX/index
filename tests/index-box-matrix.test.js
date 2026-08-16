const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transformSync } = require("@babel/core");
const transformModulesCommonjs = require("@babel/plugin-transform-modules-commonjs");
const { parse } = require("@vue/compiler-sfc");

const root = path.resolve(__dirname, "..");
const boxPath = path.join(root, "src/views/index/components/box.vue");
const source = fs.readFileSync(boxPath, "utf8");
const script = parse(source, { filename: boxPath }).descriptor.script.content;
const compiled = transformSync(script, {
    babelrc: false,
    configFile: false,
    plugins: [transformModulesCommonjs],
}).code;

let remoteSave = async () => ({ data: { code: 0 } });
let savedRemoteSetting = null;
let activeStorage = new Map();
const localStorage = {
    getItem: (key) => activeStorage.get(key) ?? null,
    setItem: (key, value) => activeStorage.set(key, value),
};

const moduleMocks = {
    lodash: require("lodash"),
    "@/assets/data/box.json": require("../src/assets/data/box.json"),
    "@jx3box/jx3box-common/js/utils": { buildTarget: () => "_blank" },
    "@jx3box/jx3box-common/data/jx3box.json": { __cdn: "" },
    vuedraggable: {},
    "@jx3box/jx3box-common/js/user": {
        isLogin: () => true,
        isEditor: () => false,
        getInfo: () => ({ uid: 1 }),
    },
    "@/service/user.js": {
        getMeta: async () => ({ data: { data: null } }),
        setMeta: async (key, setting) => {
            savedRemoteSetting = { key, setting };
            return await remoteSave();
        },
    },
    "@/service/setting.js": {
        getHelperPnt: async () => ({ data: { data: {} } }),
        getMenu: async () => ({ data: { data: { val: [] } } }),
    },
    "./mini_bread.vue": {},
};

const componentModule = { exports: {} };
vm.runInNewContext(`(function (require, module, exports) { ${compiled}\n})`, {
    location: { href: "https://www.jx3box.com" },
    localStorage,
    console: { ...console, error: () => {}, warn: () => {} },
})((id) => {
    if (!Object.prototype.hasOwnProperty.call(moduleMocks, id)) throw new Error(`Unexpected import: ${id}`);
    return moduleMocks[id];
}, componentModule, componentModule.exports);

const component = componentModule.exports.default;

function createMatrix() {
    const notifications = [];
    const storage = new Map();
    const matrix = {
        ...component.data(),
        $store: { state: { client: "std" } },
        $t: (key) => key,
        $notify: (payload) => notifications.push(payload),
    };
    Object.assign(matrix, component.methods);
    Object.defineProperty(matrix, "custom", {
        get: () => component.computed.custom.call(matrix),
    });
    Object.defineProperty(matrix, "setting", {
        get: () => component.computed.setting.call(matrix),
    });
    activeStorage = storage;
    return { matrix, notifications, storage };
}

(async () => {
    const defaults = [
        { uuid: "a", client: "all", status: true, lf: true, hasMark: true, markTime: 2000 },
        { uuid: "b", client: "all", status: true, lf: false, hasMark: true },
        { uuid: "new", client: "all", status: true, lf: false },
    ];

    const { matrix, notifications, storage } = createMatrix();

    matrix.buildRawData(defaults);
    matrix.buildData({
        order: ["a", "b", "removed"],
        hide: [],
        lf: [],
    });

    assert.deepStrictEqual(Array.from(matrix.order), ["a", "b", "new"], "new menu IDs should be appended by identity");
    assert.deepStrictEqual(Array.from(matrix.hide), [], "an empty hidden list should replace stale state");
    assert.deepStrictEqual(Array.from(matrix.lf), [], "an empty line-break list should survive restoration");
    assert.deepStrictEqual(
        Array.from(matrix.data, (item) => item.uuid),
        ["a", "b", "new"],
        "removed menu IDs should not survive restoration"
    );

    matrix.loadSeenMarks();
    assert.strictEqual(matrix.shouldShowMark(defaults[0]), true, "unread configured marks should be visible");
    assert.strictEqual(matrix.shouldShowMark(defaults[1]), true, "legacy hasMark entries should remain dismissible");
    assert.strictEqual(matrix.shouldShowMark(defaults[2]), false, "items without hasMark should not show a dot");

    matrix.markAsSeen(defaults[0]);
    assert.strictEqual(matrix.shouldShowMark(defaults[0]), false, "clicking an item should hide its current mark");
    assert.strictEqual(JSON.parse(storage.get("boxmatrix_seen_marks_v1")).a, 2000);

    defaults[0].markTime = 3000;
    assert.strictEqual(matrix.shouldShowMark(defaults[0]), true, "a newer configured time should show the dot again");

    matrix.options.disabled = false;
    matrix.markAsSeen(defaults[1]);
    assert.strictEqual(matrix.shouldShowMark(defaults[1]), true, "editing the layout must not mark an item as seen");
    matrix.options.disabled = true;
    matrix.markAsSeen(defaults[1]);
    assert.strictEqual(matrix.shouldShowMark(defaults[1]), false, "legacy dots should disappear after a normal click");

    matrix.options.disabled = false;
    await matrix.save();
    assert.strictEqual(matrix.options.disabled, true, "successful saves should leave edit mode");
    assert.deepStrictEqual(savedRemoteSetting, { key: "boxmatrix", setting: matrix.setting });
    assert.strictEqual(JSON.parse(storage.get("boxmatrix")).lf.length, 0, "saved settings should retain lf: []");
    assert.strictEqual(notifications.at(-1).type, "success");

    remoteSave = async () => {
        throw new Error("remote write failed");
    };
    matrix.options.disabled = false;
    await matrix.save();
    assert.strictEqual(matrix.options.disabled, false, "failed remote saves should keep edit mode open");
    assert.strictEqual(notifications.at(-1).type, "error");

    matrix.defined = false;
    matrix.options.disabled = false;
    await matrix.save();
    assert.strictEqual(matrix.options.disabled, true, "saving without changes should still close edit mode");

    assert(
        source.includes(':href="options.disabled ? item.href : null"'),
        "edit mode should remove the anchor href instead of navigating to an empty URL"
    );
    assert(source.includes('v-if="shouldShowMark(item)"'), "dot rendering should use per-user read state");

    console.log("index box matrix tests passed");
})()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
