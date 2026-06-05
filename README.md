# 英国航空客户反馈数据分析 (British Airways Customer Review Analysis)

> 基于 PySpark 的大数据分析项目 | 数据科学作品集

[![Tech](https://img.shields.io/badge/PySpark-3.x-orange)](https://spark.apache.org/)
[![Python](https://img.shields.io/badge/Python-3.x-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF)](https://vite.dev/)

## 📊 项目概览

本项目对英国航空（British Airways）约 3,923 条客户评论进行端到端大数据分析，涵盖数据预处理、探索性分析、机器学习建模和商业智能洞察。使用 **Apache PySpark** 作为核心处理引擎，配合 **Spark MLlib** 进行机器学习建模。

### 🎯 分析模块（A1–A9）

| 编号 | 模块 | 说明 |
|------|------|------|
| A1 | 已验证 vs 未验证评论对比 | 验证偏差分析：真实乘客 vs 非验证用户评分差异 |
| A2 | 性价比 — 满意度核心驱动力 | Pearson 相关性分析：性价比是最强满意度预测因子 (r=0.873) |
| A3 | 评论长度 vs 评分 — 负面偏差 | 负面评论比正面评论长 55% |
| A4 | 年度服务质量趋势 | 2014–2023 年 6 大服务维度时间趋势 |
| A5 | 服务短板分析 | 识别拖累整体体验的最弱服务环节 |
| A6 | 推荐行为分类预测 | 4 种 ML 模型预测客户推荐意愿 (AUC 0.97) |
| A7 | 舱位服务敏感度分析 | 不同舱位/旅客类型的服务敏感度差异 |
| A8 | 评分与推荐不一致性检测 | HRLR/LRHR 异常群体识别 |
| A9 | 低分根因分析与改进优先级 | Priority = Frequency × Impact 优先级排序 |

### 🤖 机器学习模型

| 模型 | 准确率 | F1 | AUC |
|------|--------|-----|------|
| 逻辑回归 | 91.02% | 0.9101 | **0.9702** |
| GBT | 90.45% | **0.9043** | 0.9636 |
| 随机森林 | 90.45% | 0.9040 | 0.9696 |
| 决策树 | 88.37% | 0.8839 | 0.8918 |

### 💡 核心商业洞察

1. ✅ **已验证用户评价更严格** — 评分差距 −14.1%
2. 💰 **性价比是满意度 #1 驱动因素** — r = 0.873
3. 🎬 **机上娱乐和餐饮是主要短板** — 占比 48% 和 47%
4. 🤖 **机器学习精确预测推荐行为** — AUC 0.970
5. 🎯 **地面服务是 #1 改进优先级** — Priority = 3,039

## 🏗️ 项目结构

```
├── BA_AirlineReviews.csv          # 原始数据（~3,923 条评论）
├── run_merged_analysis.py         # 分析主程序（PySpark）
├── run_merged_visualization.py    # 可视化程序（Matplotlib）
├── data/                          # 分析输出数据（27 个 CSV）
├── result/                        # 可视化图表（12 张 PNG）
├── website/                       # 交互式展示网站（React）
│   ├── src/
│   │   ├── components/            # 可复用组件
│   │   ├── sections/              # 页面区域
│   │   ├── data/                  # 数据层
│   │   ├── hooks/                 # 自定义 Hooks
│   │   └── theme/                 # 主题系统
│   └── public/images/             # 静态图表资源
└── README.md
```

## 🚀 快速开始

### 运行 Python 分析（需要 Spark 环境）

```bash
# 安装依赖
pip install pyspark pandas numpy matplotlib seaborn findspark scipy

# 运行分析
python run_merged_analysis.py

# 生成可视化
python run_merged_visualization.py
```

### 启动网站

```bash
cd website
npm install
npm run dev
```

访问 `http://localhost:5173` 查看交互式展示网站。

### 构建网站

```bash
cd website
npm run build    # 输出到 website/dist/
npm run preview  # 预览构建结果
```

## 🛠️ 技术栈

### 数据分析
- **Apache PySpark** — 分布式数据处理
- **Spark SQL** — 数据查询
- **Spark MLlib** — 机器学习
- **Pandas / NumPy** — 数据处理
- **Matplotlib / Seaborn** — 数据可视化

### 网站开发
- **React 19** + **Vite 8** + **TypeScript**
- **TailwindCSS 3** — 样式框架
- **Framer Motion** — 动画引擎
- **Apache ECharts** — 交互式图表

## 📈 项目统计

- 📊 **9** 个分析模块
- 📁 **27** 个输出数据集
- 📈 **12** 张可视化图表
- 🤖 **4** 种机器学习模型
- 📝 **~3,923** 条客户评论
- 📅 **10** 年数据跨度（2014–2023）

## 📄 License

MIT — 数据科学作品集项目
