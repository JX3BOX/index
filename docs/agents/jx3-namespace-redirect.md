# JX3 命名空间跳转页

## 页面定位

`/jx3/*` 是一个无界面的命名空间解析与跳转入口，不负责渲染业务内容。它从当前 URL 的最后一段取得命名空间 key，向 CMS 查询该 key 的归属，再把访问者导向团队主页、命名空间配置的链接或命名空间广场。

相关文件：

- `vue.config.js`：声明 `jx3` 多页面入口，构建产物为 `jx3/index.html`。
- `src/pages/jx3.js`：创建 Vue 应用，挂载 `src/views/jx3/Index.vue`。
- `src/views/jx3/Index.vue`：解析 key、发送请求并执行整页跳转。

## 启动过程

`src/pages/jx3.js` 本身不含业务判断，只完成以下工作：

1. 引入 Vue 的 `createApp()`；
2. 以 `src/views/jx3/Index.vue` 为根组件创建应用；
3. 将应用挂载到公共模板的 `#app` 节点。

根组件在 `created()` 生命周期立即调用 `init()`。模板只有一个空 `<div>`，因此页面正常表现是短暂空白后发生整页跳转。

## key 解析

页面读取 `location.pathname`，按 `/` 拆分并过滤空段，然后把最后一个路径段作为 key：

```text
/jx3/example       -> example
/jx3/foo/example/  -> example
```

最后一段会经过 `decodeURIComponent()` 解码。查询参数和 hash 不属于 `pathname`，不会进入 key。

若没有取得 key，页面跳转到命名空间广场：

```text
https://www.jx3box.com/namespace
```

代码还为 `pathname === "/"` 设置了首页跳转 `https://www.jx3box.com`。不过跳转赋值后没有立即 `return`，当前调用仍会继续执行，随后通常又会进入“key 为空”的命名空间广场分支；浏览器最终采用哪个导航取决于导航提交时机。按现有多页面部署路径，常规入口通常是 `/jx3/...`，不会走到该分支。

## 请求链路

取得 key 后，页面会发出两个请求。

### 访问摘要上报

```text
GET https://next2.jx3box.com/api/summary-any/namespace-{key}
```

该请求是 fire-and-forget：不等待响应，也不读取结果，不会影响后续 CMS 查询和跳转。其作用从调用形式看是记录或汇总该命名空间的访问；这是基于接口命名的推断，当前仓库没有更多响应处理逻辑。

### 命名空间查询

```text
GET https://cms.jx3box.com/api/cms/namespace/key?key={key}
```

页面直接使用原生 `fetch()`，没有经过项目 service、统一请求实例或环境变量。响应先调用 `res.json()`，再以业务字段 `data.code == 0` 判断查询是否成功。

成功响应中实际使用的命名空间字段为：

- `source_type`：来源类型；
- `source_id`：来源对象 ID；
- `link`：命名空间配置的目标链接。

## 跳转规则

规则按以下顺序执行：

1. `data.code == 0` 且 `namespace.source_type == "team"`：跳转团队主页 `https://www.jx3box.com/team/org/{source_id}`。
2. 查询成功但不是团队类型：优先跳转 `namespace.link`；link 为空时回退到 `https://www.jx3box.com/namespace`。
3. CMS 返回非成功业务码：跳转 `https://www.jx3box.com/namespace?namespace={key}`。
4. 请求、JSON 解析或 Promise 链发生异常：同样跳转 `https://www.jx3box.com/namespace?namespace={key}`。

流程可概括为：

```text
读取 pathname 最后一段
  -> key 为空：命名空间广场
  -> key 有值：异步上报访问摘要
              -> CMS 按 key 查询
                  -> team：团队主页
                  -> 其他已登记类型：配置 link，缺失则广场
                  -> 未登记或请求异常：带 namespace 参数的广场
```

所有导航均通过 `location.href` 完成，会离开当前 Vue 应用并触发完整页面加载。

## 当前边界与注意事项

- `decodeURIComponent()` 位于 Promise 链之外。URL 包含非法百分号编码时会同步抛错，页面将停留在空白状态，CMS 兜底逻辑不会执行。
- key 被直接插入两个请求 URL，没有调用 `encodeURIComponent()`。若解码后的 key 含 `?`、`#`、`&` 等保留字符，请求语义可能被改变。
- `namespace.link` 被直接交给 `location.href`，当前前端不校验协议、域名或链接格式；其安全边界依赖 CMS 写入侧的数据约束。
- `fetch()` 不会因 HTTP 4xx/5xx 自动 reject。只要响应体能解析成 JSON，就会进入业务码分支；不能解析 JSON 才会进入 `catch`。
- 摘要上报请求没有异常处理。失败不影响主流程，但浏览器控制台可能出现未处理的请求错误。
- 页面使用固定生产域名，本地开发和预览环境也会请求、跳转到生产站点。
- 判断使用宽松相等 `==`，因此数字 `0` 和字符串 `"0"` 都被视为成功；团队类型则同样使用宽松相等。

## 修改时的核对清单

- 保持该页面“只解析和跳转”的职责，不在这里承载命名空间详情 UI。
- 修改路径规则时确认 key 应来自固定的 `/jx3/:key` 段还是最后一个路径段；当前实现采用后者。
- 修改成功判断或返回字段前，先核对 CMS `/api/cms/namespace/key` 的真实响应合同。
- 新增来源类型时明确其目标地址，并保留 link 缺失、业务失败和网络失败的兜底。
- 调整 URL 拼接时分别考虑路径段编码与查询参数编码，避免把解码后的 key 原样拼入 URL。
- 若接入环境配置或统一请求层，注意摘要服务和 CMS 服务属于两个不同域名。
