# 作品统一跳转页

## 页面定位

`/post/:id` 不是作品详情页，而是旧链接或统一入口使用的中转页。页面根据作品 ID 查询 CMS 中的真实作品数据，再按作品类型、迁移状态和客户端线路跳转到最终详情地址。

相关文件：

- `vue.config.js`：声明多页面入口，构建产物为 `post/index.html`。
- `src/pages/post.js`：创建 Vue 应用并挂载 `src/views/post/Index.vue`。
- `src/views/post/Index.vue`：查询作品并执行跳转。
- `src/service/cms.js`：提供作品详情接口 `GET /api/cms/post/:id`。
- `src/utils/common.js`：根据作品类型、ID 和客户端线路生成最终地址。

## 入口与 ID 解析

访问形式为 `/post/:id`，例如 `/post/123`。

`Index.vue` 的计算属性 `id` 调用公共包的 `getAppID()`。该方法把当前路径按 `/` 切分并读取第二段，因此 `/post/123` 得到字符串 `123`；路径第二段不是数字或不存在时得到 `0`。

组件通过带有 `immediate: true` 的 watcher 监听 `id`：

- `id` 为有效真值时调用 `loadPost()`；
- `id` 为 `0` 时不请求接口，页面保持空白。

## 数据请求

`loadPost()` 调用 `getPost(id)`，对应：

```text
GET /api/cms/post/:id
```

页面使用响应中的 `res.data.data` 作为作品对象，跳转逻辑依赖以下字段：

- `ID`：作品 ID；
- `post_status`：作品状态；
- `post_type`：作品真实类型；
- `client`：客户端线路，通常为 `std` 或 `origin`。

## 跳转规则

规则按以下顺序执行，前面的规则优先级更高：

1. `post_status === "migration"`：无论原 `post_type` 是什么，都按 `community` 类型跳转。
2. 非迁移作品且 `post_type === "post"`：按 `bbs` 类型跳转。
3. 其他作品：保持接口返回的 `post_type` 跳转。

可概括为：

```text
/post/:id
  -> 查询 CMS 作品
  -> migration ? community
  -> post 类型 ? bbs
  -> 其他类型保持不变
  -> 拼接客户端域名并整页跳转
```

最终通过 `location.href` 导航，会离开当前 Vue 页面并产生一次完整页面加载。

## 最终地址生成

`getPostLink(type, id, client)` 分两步生成地址：

1. 公共包 `getLink(type, id)` 根据内容类型生成站内路径；不同类型可能对应 `/:type/:id`、`/:type/view/:id` 等不同结构。
2. 根据 `client` 添加站点根域名：
   - `std` 使用 `JX3BOX.__Root`；
   - `origin` 使用 `JX3BOX.__OriginRoot`；
   - `all` 使用当前页面的 `location.origin`。

调用方未传 `client` 时默认使用 `std`。

## 页面表现与边界

- 模板只有一个空 `<div>`，正常情况下用户只会短暂看到空白页，然后被重定向。
- 当前没有 loading、错误提示或兜底跳转。
- ID 缺失或非法时不会发起请求，也不会提示错误。
- 接口请求失败、响应缺少 `data`，或作品字段不完整时没有显式处理；请求失败会停留在空白页，字段缺失还可能在后续取值或拼接地址时报错。
- `client` 若不是 `std`、`origin`、`all` 之一，地址前缀映射不到值。后续扩展客户端枚举时，需要同步检查 `src/utils/common.js`。

## 修改时的核对清单

- 不要把该入口当作详情渲染页；它的核心职责只有“解析 ID、查真实类型、兼容历史数据、跳转”。
- 调整规则时保持 `migration` 的优先级高于 `post_type === "post"`。
- 新增作品类型时，确认公共包 `getLink()` 已能生成该类型的正确路径。
- 新增客户端线路时，同时补充 `getPostLink()` 的域名映射。
- 若增加异常态，至少覆盖非法 ID、接口失败、空响应和未知客户端，避免无限空白。
