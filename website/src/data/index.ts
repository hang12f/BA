import type { AnalysisModule, ProjectStat, TechItem, BusinessInsight, MLModelResult } from '../types';

// ============================================================
// 项目统计数据
// ============================================================
export const projectStats: ProjectStat[] = [
  { label: '客户评论', value: 3701, description: '预处理清洗后有效数据' },
  { label: '分析模块', value: 9, description: '来源：ss2 + ss3 扩展' },
  { label: '机器学习模型', value: 4, description: '逻辑回归·决策树·随机森林·GBT' },
  { label: '最佳 AUC', value: 0.9702, decimals: 4, description: '逻辑回归 — 推荐预测' },
  { label: '服务维度', value: 6, description: '座椅·客舱·地面·餐饮·娱乐·性价比' },
  { label: '数据跨度', value: 10, suffix: '+', description: '2014–2023 年' },
];

// ============================================================
// 技术栈
// ============================================================
export const techStack: TechItem[] = [
  // 大数据
  { name: 'PySpark', category: 'big-data', icon: '⚡', description: '分布式数据处理引擎' },
  { name: 'Spark SQL', category: 'big-data', icon: '📊', description: 'DataFrame SQL 查询' },
  { name: 'Spark MLlib', category: 'big-data', icon: '🤖', description: '机器学习流水线' },
  { name: 'Pandas', category: 'big-data', icon: '🐼', description: '数据操作与预处理' },
  { name: 'NumPy', category: 'big-data', icon: '🔢', description: '数值计算库' },

  // 编程语言
  { name: 'Python', category: 'language', icon: '🐍', description: '主要分析语言' },
  { name: 'SQL', category: 'language', icon: '🗃️', description: '数据查询' },
  { name: 'TypeScript', category: 'language', icon: '📘', description: '前端开发' },

  // 机器学习
  { name: '随机森林', category: 'ml', icon: '🌲', description: '集成分类与回归器' },
  { name: 'GBT', category: 'ml', icon: '🚀', description: '梯度提升树' },
  { name: '逻辑回归', category: 'ml', icon: '📈', description: '二分类基线模型' },
  { name: '决策树', category: 'ml', icon: '🌳', description: '可解释分类模型' },
  { name: 'Scikit-learn', category: 'ml', icon: '🧪', description: '机器学习工具与指标' },

  // 可视化
  { name: 'Matplotlib', category: 'visualization', icon: '📉', description: '静态图表生成' },
  { name: 'Seaborn', category: 'visualization', icon: '🎨', description: '统计可视化' },
  { name: 'Apache ECharts', category: 'visualization', icon: '📊', description: '交互式网页图表' },

  // Web
  { name: 'React', category: 'web', icon: '⚛️', description: 'UI 组件框架' },
  { name: 'Vite', category: 'web', icon: '⚡', description: '构建工具' },
  { name: 'TailwindCSS', category: 'web', icon: '🎯', description: '原子化 CSS 框架' },
  { name: 'Framer Motion', category: 'web', icon: '🎬', description: '动画库' },
];

// ============================================================
// 分析模块（A1–A9）
// ============================================================
export const analysisModules: AnalysisModule[] = [
  {
    id: 'a1',
    number: 1,
    title: '已验证 vs 未验证评论对比',
    subtitle: '真实乘客的评价是否不同？',
    description: '对比已验证（实际乘机）和未验证评论在六个服务维度上的评分差异，揭示系统性评价偏差。',
    methodology: '按验证状态分组聚合，雷达图对比6个服务维度，分析评分区间（1-2、3-4、5-6、7-8、9-10）的分布差异。',
    keyFindings: [
      '未验证用户评分更高（平均 4.95 vs 4.25）',
      '已验证用户在所有维度上平均严格约 14.1%',
      '性价比差距最大：2.79（未验证）vs 2.47（已验证）',
      '未验证：2,548 条 | 已验证：1,153 条',
    ],
    chartTypes: ['radar', 'bar'],
    imageRef: 'a1_verified.png',
    tags: ['探索分析', '偏差分析', '验证'],
  },
  {
    id: 'a2',
    number: 2,
    title: '性价比 — 满意度核心驱动力',
    subtitle: '乘客最在意什么？',
    description: '通过 Pearson 相关性分析，确定性价比是整体满意度最显著的预测因子（r=0.873），远超其他服务维度。',
    methodology: '使用 PySpark MLlib Correlation.corr() 计算 Pearson 相关系数矩阵，按与 OverallRating 的相关强度排序。',
    keyFindings: [
      '性价比是 #1 满意度驱动因素（r = 0.873）',
      '座椅舒适度排名第二（r = 0.721）',
      '客舱服务排名第三（r = 0.712）',
      '机上娱乐相关性最低（r = 0.426）',
      '性价比满意度因舱位和旅客类型差异显著',
    ],
    chartTypes: ['bar'],
    imageRef: 'a2_value_correlation.png',
    tags: ['相关性', '特征重要性', '探索分析'],
  },
  {
    id: 'a3',
    number: 3,
    title: '评论长度 vs 评分 — 负面偏差',
    subtitle: '不满意的乘客写得更长',
    description: '分析评论文本长度与总体评分的关系，验证"负面偏差"现象——不满意的客户撰写的评论明显更长。',
    methodology: '从 ReviewBody 特征工程提取 ReviewLength，按评分分组聚合，双轴图表结合评论数量和平均长度。',
    keyFindings: [
      '低评分（1-2）：平均 1,003 字符 — 比高评分长 55.1%',
      '高评分（9-10）：平均 662 字符',
      '明显反比关系：评分越低，评论越长',
      '中评分（5-6）评论长度也偏高（~952 字符）',
    ],
    chartTypes: ['bar', 'line'],
    imageRef: 'a3_review_length.png',
    tags: ['文本分析', '行为分析', '偏差分析'],
  },
  {
    id: 'a4',
    number: 4,
    title: '年度服务质量趋势',
    subtitle: '英航服务如何随时间演变？',
    description: '追踪 2014 至 2023 年服务质量变化趋势，涵盖 OverallRating 和全部六个服务维度的年度对比，配合情感分布和月度热力图。',
    methodology: '按年月聚合平均评分，多线趋势可视化，堆叠情感柱状图，年×月热力图检测季节性模式。',
    keyFindings: [
      '综合评分从 2014 年 6.11 下降至 2023 年 3.23',
      '2015 年以来所有服务维度持续下降',
      '2017 年降幅最大（平均 3.86 vs 2016 年 4.84）',
      '近年（2020-2023）始终低于 4.5 平均分',
      '正面评价占比逐年下降',
    ],
    chartTypes: ['line', 'bar', 'heatmap'],
    imageRef: 'a4_yearly_trends.png',
    tags: ['时间序列', '趋势分析', '时序分析'],
  },
  {
    id: 'a5',
    number: 5,
    title: '服务短板分析',
    subtitle: '找出拖累整体体验的服务环节',
    description: '短板分析识别每条约车中评分最低的服务维度，揭示哪些环节最频繁地拖累整体体验。',
    methodology: '使用 PySpark least()/greatest() 函数逐条计算最低分服务项，进行差距分析并按舱位和评分等级细分。',
    keyFindings: [
      '机上娱乐是 47.8% 评论中的最弱环节',
      '餐饮在 46.7% 的评论中排名最低',
      '地面服务在 44.2% 的评论中是短板',
      '客舱服务表现最好（仅 29.0% 最弱）',
      '服务差距因舱位类别差异显著',
    ],
    chartTypes: ['bar'],
    imageRef: 'a5_weakest_link.png',
    tags: ['差距分析', '服务质量', '运营优化'],
  },
  {
    id: 'a6',
    number: 6,
    title: '推荐行为分类预测',
    subtitle: '机器学习能否预测客户忠诚度？',
    description: '使用四种机器学习模型对客户推荐意愿（是/否）进行二分类预测，配合特征工程、独热编码和综合评估指标。',
    methodology: 'Spark MLlib Pipeline：StringIndexer + OneHotEncoder + VectorAssembler，70/30 训练测试分割，Accuracy、F1、AUC 指标评估。',
    keyFindings: [
      '逻辑回归 AUC 最高：0.9702',
      'GBT F1 最优：0.9043',
      '全部模型准确率超过 88%',
      '随机森林混淆矩阵显示良好的类别分离',
      '特征重要性显示性价比为最重要预测因子',
    ],
    chartTypes: ['bar'],
    imageRef: 'a6_classification.png',
    tags: ['机器学习', '分类预测', 'MLlib'],
  },
  {
    id: 'a7',
    number: 7,
    title: '舱位服务敏感度分析',
    subtitle: '不同舱位乘客最在意什么？',
    description: '按舱位细分 Spearman 相关性分析，揭示不同舱位中哪些服务维度对整体满意度影响最大。',
    methodology: '按座位类型（经济舱、豪华经济舱、商务舱、头等舱）分别计算 OverallRating 与各服务维度的 Spearman 秩相关系数，以热力图加粗框高亮展示。',
    keyFindings: [
      '不同舱位服务敏感度模式差异显著',
      '经济舱乘客对性价比最敏感',
      '商务舱乘客更关注客舱服务',
      '豪华经济舱对餐饮有独特的高敏感度',
      '每个舱位通过最大相关系数高亮识别核心驱动因素',
    ],
    chartTypes: ['heatmap', 'bar'],
    imageRef: 'a7_cabin_sensitivity.png',
    tags: ['细分分析', '舱位分析', '相关性'],
  },
  {
    id: 'a8',
    number: 8,
    title: '评分与推荐不一致性检测',
    subtitle: '高分不等于忠诚',
    description: '双模型对比分析：满意度驱动因素（回归）vs 忠诚度驱动因素（分类），外加异常检测——评分与推荐不一致的样本。',
    methodology: '双随机森林模型（回归预测 OverallRating，分类预测 RecommendedLabel），特征重要性对比，异常群体画像（HRLR / LRHR）。',
    keyFindings: [
      '性价比驱动满意度但未必驱动忠诚度',
      '客舱服务和餐饮是更强的忠诚度驱动因素',
      'HRLR 异常（高分不推荐）：48 例（1.3%）',
      'LRHR 异常（低分推荐）：32 例（0.9%）',
      '异常群体呈现独特的服务消费模式',
    ],
    chartTypes: ['bar', 'radar', 'scatter'],
    imageRef: 'a8_inconsistency.png',
    tags: ['双模型', '异常检测', '忠诚度'],
  },
  {
    id: 'a9',
    number: 9,
    title: '低分根因与改进优先级',
    subtitle: '英航应优先投入哪些方向？',
    description: '通过关键词匹配对低分评论（≤4）进行投诉分类，进行频率-严重度分析，并使用 Priority = Frequency × Impact 评分排序改进优先级。',
    methodology: '基于 UDF 的关键词匹配覆盖 8 大投诉类别，频率分析、严重度评分（5 − AvgRating），Priority 排序提供可执行的改进建议。',
    keyFindings: [
      '地面服务是 #1 优先级（占投诉 51.1%，Priority: 3039）',
      '餐饮排名第二（32.8%，Priority: 1729）',
      '座椅舒适度排名第三（7.8%，Priority: 468）',
      '延误取消严重度最高（Avg 1.37）但频率较低',
      '优先级 = 频率 × 影响度，为资源投入提供数据驱动指导',
    ],
    chartTypes: ['bar', 'pie'],
    imageRef: 'a9_root_cause.png',
    tags: ['根因分析', '文本分析', '商业策略'],
  },
];

// ============================================================
// 机器学习模型结果
// ============================================================
export const mlResults: MLModelResult[] = [
  { model: '逻辑回归', accuracy: 0.9102, f1: 0.9101, auc: 0.9702 },
  { model: '决策树', accuracy: 0.8837, f1: 0.8839, auc: 0.8918 },
  { model: '随机森林', accuracy: 0.9045, f1: 0.9040, auc: 0.9696 },
  { model: 'GBT', accuracy: 0.9045, f1: 0.9043, auc: 0.9636 },
];

// ============================================================
// 商业洞察
// ============================================================
export const businessInsights: BusinessInsight[] = [
  {
    id: 'bi-1',
    icon: '💰',
    title: '价值感知决定一切',
    description: '性价比是满意度和推荐预测的 #1 驱动因素（r=0.873）。英航应优先优化定价策略和价值沟通。',
    impact: 'high',
    color: '#F59E0B',
  },
  {
    id: 'bi-2',
    icon: '📉',
    title: '十年持续下滑',
    description: '综合满意度从 2014 年 6.11 降至 2023 年 3.23，降幅达 47%。需要全服务维度的系统性干预。',
    impact: 'high',
    color: '#EF4444',
  },
  {
    id: 'bi-3',
    icon: '🎬',
    title: '机上娱乐是最大短板',
    description: '近 48% 的评论指出机上娱乐评分最低。现代化改造 IFE 系统可能带来最广泛的满意度提升。',
    impact: 'high',
    color: '#3B82F6',
  },
  {
    id: 'bi-4',
    icon: '🛫',
    title: '地面服务是当务之急',
    description: '地面服务占低分投诉的 51%，严重度高（Avg 1.95）。值机、登机和行李处理需要立即改进。',
    impact: 'high',
    color: '#8B5CF6',
  },
  {
    id: 'bi-5',
    icon: '🤖',
    title: '机器学习预测忠诚度 AUC 达 97%',
    description: '逻辑回归在推荐预测中达到 0.97 AUC。英航可部署该模型在客户流失前主动识别风险。',
    impact: 'medium',
    color: '#10B981',
  },
  {
    id: 'bi-6',
    icon: '👔',
    title: '客舱服务成就超越满意的忠诚',
    description: '客舱服务在忠诚度分类模型中的重要性高于满意度回归模型。卓越服务造就推荐者，而非仅是满意者。',
    impact: 'medium',
    color: '#06B6D4',
  },
  {
    id: 'bi-7',
    icon: '📝',
    title: '负面评论内容更长（+55%）',
    description: '不满客户撰写约 1000+ 字符的评论——这是具体、可执行反馈的富矿。优先阅读和响应低分评论。',
    impact: 'medium',
    color: '#EC4899',
  },
];

// ============================================================
// A1 图表数据
// ============================================================
export const a1RadarData = {
  indicators: [
    { name: '座椅舒适度', max: 4.5 },
    { name: '客舱服务', max: 4.5 },
    { name: '地面服务', max: 4.5 },
    { name: '餐饮', max: 4.5 },
    { name: '机上娱乐', max: 4.5 },
    { name: '性价比', max: 4.5 },
  ],
  series: [
    { name: '未验证', values: [2.93, 3.30, 2.89, 2.75, 2.72, 2.79], color: '#3B82F6' },
    { name: '已验证（真实）', values: [2.76, 3.14, 2.71, 2.73, 2.85, 2.47], color: '#06B6D4' },
  ],
};

export const a1RatingDistData = {
  categories: ['1-2', '3-4', '5-6', '7-8', '9-10'],
  series: [
    { name: '未验证', data: [212, 467, 523, 719, 627], color: '#3B82F6' },
    { name: '已验证', data: [156, 332, 299, 248, 118], color: '#06B6D4' },
  ],
};

// ============================================================
// A2 相关性数据
// ============================================================
export const a2CorrelationData = {
  categories: ['机上娱乐', '地面服务', '餐饮', '客舱服务', '座椅舒适度', '性价比'],
  series: [
    { name: 'Pearson r', data: [0.426, 0.638, 0.693, 0.712, 0.721, 0.873], color: '#3B82F6' },
  ],
};

// ============================================================
// A3 评论长度数据
// ============================================================
export const a3ReviewLengthData = {
  xAxisData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  series: [
    { name: '平均评论长度', data: [947, 1059, 970, 871, 958, 945, 871, 749, 678, 646], color: '#EF4444', areaStyle: true },
  ],
};

// ============================================================
// A4 年度趋势数据
// ============================================================
export const a4YearlyTrendData = {
  xAxisData: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  series: [
    { name: '综合', data: [6.11, 5.63, 4.84, 3.86, 4.51, 4.75, 4.03, 4.30, 3.94, 3.23], color: '#3B82F6' },
    { name: '座椅', data: [3.67, 3.11, 2.93, 2.56, 2.78, 2.86, 2.99, 2.89, 2.79, 2.49], color: '#06B6D4' },
    { name: '客舱', data: [3.89, 3.48, 3.33, 2.83, 3.15, 3.28, 3.38, 3.33, 3.07, 2.90], color: '#8B5CF6' },
    { name: '地面', data: [4.00, 3.00, 2.89, 2.74, 2.90, 2.90, 2.97, 2.55, 2.47, 2.23], color: '#F59E0B' },
    { name: '性价比', data: [3.22, 3.12, 2.71, 2.29, 2.60, 2.68, 2.38, 2.58, 2.28, 1.99], color: '#EF4444' },
  ],
};

// ============================================================
// A5 短板数据
// ============================================================
export const a5WeakLinkData = {
  categories: ['客舱服务', '座椅舒适度', '地面服务', '餐饮', '机上娱乐'],
  series: [
    { name: '% 的评论（评分最低维度）', data: [28.97, 39.12, 44.15, 46.66, 47.82], color: '#3B82F6' },
  ],
};

// ============================================================
// A6 机器学习性能数据
// ============================================================
export const a6MLData = {
  categories: ['逻辑回归', '决策树', '随机森林', 'GBT'],
  series: [
    { name: '准确率', data: [0.9102, 0.8837, 0.9045, 0.9045], color: '#3B82F6' },
    { name: 'F1', data: [0.9101, 0.8839, 0.9040, 0.9043], color: '#06B6D4' },
    { name: 'AUC', data: [0.9702, 0.8918, 0.9696, 0.9636], color: '#10B981' },
  ],
};

// ============================================================
// A8 双模型重要性数据
// ============================================================
export const a8DualImportanceData = {
  categories: ['性价比', '座椅舒适度', '餐饮', '客舱服务', '地面服务', '娱乐', '评论长度'],
  series: [
    { name: '满意度（回归）', data: [0.449, 0.198, 0.152, 0.120, 0.060, 0.005, 0.008], color: '#3B82F6' },
    { name: '忠诚度（分类）', data: [0.377, 0.194, 0.163, 0.138, 0.077, 0.022, 0.011], color: '#8B5CF6' },
  ],
};

export const a8ScatterData = {
  series: [
    {
      name: '对角线上方 = 忠诚度驱动',
      data: [[0.449, 0.377], [0.120, 0.138], [0.152, 0.163], [0.060, 0.077], [0.005, 0.022], [0.008, 0.011]] as [number, number][],
      color: '#8B5CF6',
    },
    {
      name: '对角线下方 = 满意度驱动',
      data: [[0.198, 0.194]] as [number, number][],
      color: '#3B82F6',
    },
  ],
};

// ============================================================
// A9 根因数据
// ============================================================
export const a9PriorityData = {
  categories: ['机上娱乐', '行李', '预订退款', '客舱服务', '延误取消', '座椅舒适度', '餐饮', '地面服务'],
  series: [
    { name: '优先级评分', data: [1, 4, 61, 164, 327, 468, 1729, 3039], color: '#3B82F6' },
  ],
};

export const a9PieData = [
  { name: '地面服务', value: 998 },
  { name: '餐饮', value: 640 },
  { name: '座椅舒适度', value: 152 },
  { name: '延误取消', value: 90 },
  { name: '客舱服务', value: 51 },
  { name: '预订退款', value: 18 },
  { name: '行李', value: 1 },
  { name: '机上娱乐', value: 1 },
];
