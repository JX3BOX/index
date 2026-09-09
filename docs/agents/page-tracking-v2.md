# 首页页面追踪接入

完整业务、接口、数据表和部署说明统一维护在 `backend/service-cms/docs/stat/3-event/client-event-tracking.md`。

- `main.js` 安装 `src/utils/analytics.js` 创建的插件；createIndexPageTracking 仅安装第三模块页面追踪。
- 页面追踪核心直接导入 `@jx3box/jx3box-common/js/page-tracking.js`，首页不保留采集器副本或转导文件。
- 公共包自动管理根组件生命周期与 Router，无需 App.vue 页面指令；具体元素使用 `v-track:click`。
- Heartbeat 和访问分析均通过 CommonHeader 接入；首页不单独创建 Traffic Core 或占用 Router，也不声明 v-track-page。
- `src/router/index.js` 定义首页布局版本；前端按实际域名、pathname 查询注册页面。两个首页分别归属各自注册记录。
- `src/utils/game-client.js` 只负责首页业务内容切换；本地入口根据该业务选择明确设置模拟域名。
- 八项事件是 App 下载、橱窗推广、打开首屏头条、切换首屏头条、魔盒矩阵、今日骚话、活动、首页帖子；前端标识必须与各页面后台定义一致。
- 先部署支持域名匹配的后端，再发布公共包、升级首页依赖并部署。管理端预览也需更新。当前本地 node_modules 同步不等于公共包发布。
