import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

const DATA_FEATURES = [
  { name: 'ReviewHeader', type: '文本', desc: '评论标题/摘要' },
  { name: 'ReviewBody', type: '文本', desc: '完整评论内容' },
  { name: 'OverallRating', type: '数值 (1-10)', desc: '整体满意度评分' },
  { name: 'SeatComfort', type: '数值 (1-5)', desc: '座椅舒适度评分' },
  { name: 'CabinStaffService', type: '数值 (1-5)', desc: '客舱服务评分' },
  { name: 'GroundService', type: '数值 (1-5)', desc: '地面/机场服务评分' },
  { name: 'Food&Beverages', type: '数值 (1-5)', desc: '餐饮质量评分' },
  { name: 'InflightEntertainment', type: '数值 (1-5)', desc: '机上娱乐系统评分' },
  { name: 'ValueForMoney', type: '数值 (1-5)', desc: '性价比感知评分' },
  { name: 'Recommended', type: '二值 (yes/no)', desc: '是否推荐英航？' },
  { name: 'TypeOfTraveller', type: '分类', desc: '旅客类型' },
  { name: 'SeatType', type: '分类', desc: '舱位等级' },
  { name: 'Route', type: '文本', desc: '航班航线（解析为出发地/目的地）' },
  { name: 'DateFlown', type: '日期', desc: '航班日期（解析为年月）' },
  { name: 'Aircraft', type: '分类', desc: '机型（已标准化）' },
];

const PREPROCESSING_STEPS = [
  '删除无关列（Unnamed、Wifi&Connectivity）',
  '数值型缺失值用中位数填充（保持分布特征）',
  '分类型缺失值用众数填充',
  '统一机型名称（如 "Boeing 747 400" → "Boeing 747-400"）',
  '解析 DateFlown → FlightMonth + FlightYear',
  '解析 Route → Departure + Destination（含城市名映射）',
  '从 ReviewBody 构建 ReviewLength 特征',
  '创建 RecommendedLabel（yes→1, no→0）',
  '计算 5 个服务维度的 TotalServiceScore',
];

export default function DatasetOverview() {
  return (
    <SectionWrapper id="dataset" title="数据集概览" subtitle="英国航空客户评论数据——结构、质量与预处理流程" dark>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <AnimatedCard delay={0}><StatCard label="原始评论" value={3923} description="原始数据" /></AnimatedCard>
        <AnimatedCard delay={0.1}><StatCard label="清洗后数量" value={3701} description="完整可用样本" /></AnimatedCard>
        <AnimatedCard delay={0.2}><StatCard label="特征数量" value={15} description="特征工程后" /></AnimatedCard>
        <AnimatedCard delay={0.3}><StatCard label="时间跨度" value={10} suffix=" 年" description="2014 – 2023" /></AnimatedCard>
      </div>

      <AnimatedCard className="overflow-hidden p-0 mb-12">
        <div className="p-6 border-b border-border/30">
          <h3 className="text-lg font-semibold text-white">数据字段定义</h3>
          <p className="text-sm text-slate-500 mt-1">预处理与特征工程后的核心字段</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 text-slate-400">
                <th className="text-left px-6 py-3 font-medium">字段名</th>
                <th className="text-left px-6 py-3 font-medium">类型</th>
                <th className="text-left px-6 py-3 font-medium hidden md:table-cell">说明</th>
              </tr>
            </thead>
            <tbody>
              {DATA_FEATURES.map((f, i) => (
                <tr key={f.name} className={`border-b border-border/10 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="px-6 py-3"><code className="text-primary-light text-xs bg-primary/5 px-2 py-0.5 rounded">{f.name}</code></td>
                  <td className="px-6 py-3"><Badge variant={f.type.includes('数值') ? 'primary' : f.type.includes('文本') ? 'accent' : f.type.includes('二值') ? 'warning' : 'success'}>{f.type}</Badge></td>
                  <td className="px-6 py-3 text-slate-400 hidden md:table-cell">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.2}>
        <h3 className="text-lg font-semibold text-white mb-2">数据预处理流程</h3>
        <p className="text-sm text-slate-500 mb-6">采用 ss3 的填充策略——中位数填充保留更多行，优于直接删除</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PREPROCESSING_STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 border border-border/20">
              <span className="text-primary-light font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-slate-300 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </SectionWrapper>
  );
}
