# 首页皮肤接入

## 岁时绘 pc_calendar

PC 首页左侧欢迎挂件位于 `src/views/index/components/welcome.vue`，对应岁时绘皮肤部位 `pc_calendar`。

-   默认皮肤请求 CDN 路径 `design/skin/default/pc_calendar.png`。
-   未登录、用户没有启用皮肤、启用皮肤缺少 `pc_calendar` 部位、接口失败或部位图片为空时，保持默认皮肤。
-   登录后请求 `api/cms/user/skin`，参数传当前用户 `user_id`，页面只消费返回记录里的 `skins[]`。
-   同一部位选择顺序为 `theme=all`、当前主题 `light/dark`、旧数据无 `theme` 字段。没有匹配资源不跨主题降级。
-   相对图片路径统一拼接 `JX3BOX.__cdn` 后再交给 `resolveImagePath()` 处理。
