# 页面事件追踪 V2

采集器 `src/utils/page-tracking.js` 在 `src/App.vue` 应用根元素统一挂载 `v-page-tracking="$route.path"`，首页组件不再单独挂载。当前覆盖 `main.js` 对应的首页应用（含电视台和下载路由），各路由是否采集均以后台注册状态为准。公共 Traffic SDK 及其既有首页范围保留；旧 TrackingSink 和曝光/滚动档位埋点已退出首页。

- 正式服：`www.jx3box.com/index/`，键 `index.std`。
- 怀旧服：`origin.jx3box.com/index/`，键 `index.origin`。
- 本地：`/index/?client=origin`。仅 localhost/127.0.0.1 接受此模拟参数。Vuex、公共头导航和内容模块使用同一客户端。
- PC/mobile 按 `(max-width: 1133px)` 判断，和 `@ipad` 保持同步；不是按 UA、域名或触摸能力判断。
- 布局版本优先读取当前路由 `meta.analytics.layout_version`，未声明时使用 `DEFAULT_LAYOUT_VERSION=web-v1`。首页路由引用 `INDEX_LAYOUT_VERSION=index-home-v2`，与已有注册值一致。采集和预览桥使用同一个动态版本读取函数。页面主要结构改变时更新前端版本，历史版本不可直接叠加在新布局上。

V2 配置请求按当前真实域名、路径、客户端及视口查询，采集器不再限制 `/index`，也不再生成 `index.std/index.origin` 兜底键。只有服务端返回启用状态及合法 `page_key` 后，才读取采集身份并创建访问。未注册、暂停或配置失败时不新增追踪事件；已有待确认事件仍按原归属重试。

应用根指令在路由更新后重新检查范围，使用真实路径（忽略查询参数）；同一通配范围下的不同具体路径也会创建独立访问，并重置最大深度。配置响应校验页面代次与当前路径，避免旧页面慢响应启动新页采集。同一页面约每 60 秒刷新配置，范围改变或暂停后恢复时重新建立访问。新注册页自动接受采集端的布局版本，已有首页固定版本保持兼容。

当前应用内新增注册页面无需逐页挂 `v-page-tracking`；定向事件仍通过 `v-track` 显式标记。独立前端项目（如宏库）和本仓库其他独立入口（如 notice/about/search）仍需在各自应用入口接入一次采集器，注册操作本身不会向其他应用注入脚本。本次未接入这些独立入口。

首批指令：`index.banner.open`、`index.banner.switch`、`index.tools.open`、`index.tools.customize`、`index.posts.tab`、`index.posts.open`、`index.posts.more`。

```vue
<button v-track:click="'index.tools.customize'">自定义工具</button>
```

指令使用固定键，不传 DOM 文本、表单、链接或动态内容 ID。未注册的键不会成为定向事件；普通安全区域点击仍记录坐标。`data-track-ignore`、输入、富文本、公共头账号区域、弹窗不采集。

预览参数 `jx3box_analytics_preview=1` 停止本项目采集、公共头 heartbeat/Traffic、Observer、Clarity 和百度统计，并安装回传布局版本、客户端、视口宽度、文档高度与 scroll_y 的 postMessage 桥。应用根容器使用 `display: contents` 不改变页面布局，预览桥监听 documentElement 尺寸和页面滚动。公共头统计入口通过本仓库 webpack 的定向模块替换包装，不修改 node_modules；升级 UI 包后需复核 CommonHeader 对 `./utils/client-stat` 的导入与导出名称。

管理端默认以 PC 1920×1080、移动 Web 375×667 的固定视口嵌入样例，文档高度变化仅用于计算热力坐标，不改变 iframe 视口高度。预览桥只接受已握手的管理端父窗口发出的 `jx3box:tracking-preview:scroll`，校验来源和有限数值并将滚动距离限制在文档范围内；滚动后回传位置用于同步热力。该协议仅在预览模式安装，不触发业务采集。

本地开发建议在忽略的 `.env.development.local` 中设置：

```dotenv
VUE_APP_CMS_API=http://localhost:7100
```

V2 采集、Traffic 和其他 CMS 接口统一沿用此 CMS 地址及项目既有代理配置。后端默认禁止 localhost 写入业务统计，本地 `client=origin` 可以查看客户端渲染；需要采集联调时，应使用独立测试数据库并显式开启 `PAGE_TRACKING_ALLOW_LOCAL=1`。

当前与管理端同时启动时使用 `DEV_PORT=12029 npm run dev`；管理端在 12028。

队列最多 300 条，sessionStorage 保存当前标签页的待确认事件；退后台使用 Beacon，收到服务端 ACK 才移除。重试使用原 event id，服务端幂等。最大深度按每次页面/布局会话取最大值，跨日期或切换响应式端/视口分组开始新会话。

验证：`npm test`、针对改动文件 ESLint、`npm run build:prod`。后端说明位于 service-cms 的 `docs/agents/page-tracking-v2.md`。
