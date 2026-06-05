# BA Customer Review Analysis — 交互式展示网站

基于 React + Vite + TypeScript + TailwindCSS + Framer Motion + Apache ECharts 的数据分析作品集网站。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

访问 `http://localhost:5173` 查看完整网站。

## 网站结构

```
src/
├── components/
│   ├── charts/          # ECharts 图表组件（雷达图、柱状图、折线图、热力图、散点图、饼图）
│   ├── layout/          # 布局组件（导航栏、页脚、区域包装器）
│   └── ui/              # UI 组件（动画卡片、渐变文字、统计卡片、徽章、图表容器）
├── sections/
│   ├── Hero.tsx         # 全屏首页
│   ├── ProjectOverview.tsx     # 项目概览
│   ├── DatasetOverview.tsx     # 数据集概览
│   ├── TechStack.tsx           # 技术栈
│   ├── AnalysisDashboard.tsx   # 分析仪表盘
│   ├── analysis/        # A1-A9 分析模块
│   ├── MLResults.tsx           # 机器学习结果
│   ├── BusinessInsights.tsx    # 商业洞察
│   ├── ProjectArchitecture.tsx # 项目架构
│   └── Conclusion.tsx          # 总结与展望
├── data/                # 静态数据层
├── hooks/               # 自定义 Hooks
├── theme/               # 主题系统
└── types/               # TypeScript 类型定义
```

## 技术栈

- **React 19** — UI 框架
- **Vite 8** — 构建工具
- **TypeScript** — 类型安全
- **TailwindCSS 3** — 原子化 CSS
- **Framer Motion** — 动画引擎
- **Apache ECharts** — 交互式图表
