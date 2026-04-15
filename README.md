# 徐工矿机事件管理平台原型 PWA

这是一个可直接部署到 GitHub Pages 的 Vite + React + Tailwind PWA 原型项目。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub Pages 自动部署

1. 把整个项目推送到 GitHub 仓库根目录。
2. 在仓库 Settings → Pages 中选择 **GitHub Actions**。
3. 推送到 `main` 分支后，工作流会自动构建并发布。

## 当前原型包含

- Dashboard 页面
- 我的任务页
- 事件清单页
- 设备页（事件 / 油液分析 / 点检结果同页签）
- 计划维修页
- 事件处理弹窗（事件分析 + 智能知识库链路 + 备件信息）

## 说明

- `base` 已配置为相对路径，适合 GitHub Pages。
- PWA 由 `vite-plugin-pwa` 提供，安装后可被浏览器识别为可安装应用。
