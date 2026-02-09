<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SMART 问题设计教练（Vite + React + Vercel + DeepSeek）

这个项目从 Google AI Studio 导出后，已改造成 **GitHub + Vercel 可部署版本**，并通过 **Vercel Serverless Function** 调用 DeepSeek API（**API Key 不会暴露到前端**）。

## 目录结构

- `src/`：前端 UI（Vite + React）
- `api/coach.cjs`：Vercel Serverless Function（代理 DeepSeek 请求）
- `vercel.json`：Vercel 构建与路由配置

## 本地运行（推荐使用 Vercel Dev）

**前置：** Node.js 18+、Vercel CLI

1. 安装依赖
   ```bash
   npm install
   ```

2. 配置环境变量
   - 复制 `.env.example` 为 `.env`（或在 Vercel 中配置）
   - 填写 `DEEPSEEK_API_KEY`

3. 启动（同时运行前端 + Serverless）
   ```bash
   vercel dev
   ```

## 部署到 Vercel（GitHub + Vercel）

1. 将此仓库推送到 GitHub
2. Vercel 新建项目并选择该仓库
3. 在 Vercel → Project → Settings → Environment Variables 添加：
   - `DEEPSEEK_API_KEY`（必填）
   - `DEEPSEEK_MODEL`（可选，默认 `deepseek-chat`）
4. 部署完成后，前端会通过 `/api/coach` 调用 DeepSeek

## 安全说明

- **不要**在前端代码中写入或注入任何 API Key
- 只在 Vercel 环境变量中配置 `DEEPSEEK_API_KEY`
