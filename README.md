# 企业级 Agent 工程管理平台

一个基于 React + Vite + Ant Design 的企业级 Agent 管理平台原型。

## 功能特性

### 1. 控制台（Dashboard）
- 平台总数据展示（Agent 总数、Skill 总数、今日调用量、总成功率）
- 异常趋势图表
- 质量分排行
- 个人资源统计

### 2. Agent 管理
- Agent 列表（支持搜索、筛选）
- 新建 Agent（极简配置：名称、ID、描述、System Prompt、绑定 Skill）
- Agent 详情（三个 Tab）
  - 基础配置：信息展示、System Prompt 编辑、Skill 绑定管理
  - 追踪记录：Langfuse 嵌入展示全链路追踪
  - 效果评估：调用趋势、Skill 调用排行、质量分等

### 3. Skill 中心
- Skill 列表（支持搜索、筛选）
- 新建 Skill（表单配置）
- 上传 Skill（文件上传）
- Skill 详情（三个 Tab）
  - 基本信息：SKILL.md 内容、资源文件
  - 关联使用：绑定 Agent 列表、调用统计
  - 技能评估：质量分、错误分布、版本对比

### 4. 系统设置
- Langfuse 配置
- 评估配置
- 通知配置

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design 5
- React Router 6
- Recharts（图表库）

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
.
├── src/
│   ├── components/       # 组件
│   │   └── Layout.tsx   # 布局组件
│   ├── pages/           # 页面
│   │   ├── Dashboard.tsx
│   │   ├── AgentList.tsx
│   │   ├── AgentNew.tsx
│   │   ├── AgentDetail.tsx
│   │   ├── SkillList.tsx
│   │   ├── SkillNew.tsx
│   │   ├── SkillUpload.tsx
│   │   ├── SkillDetail.tsx
│   │   └── Settings.tsx
│   ├── types.ts         # TypeScript 类型定义
│   ├── mockData.ts      # 模拟数据
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 设计说明

- 采用 Ant Design 企业级 UI 风格
- 左侧固定导航菜单
- 响应式布局
- 统一的交互设计
- 完整的业务流程闭环
