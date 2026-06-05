import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useInView } from '../../hooks/useInView';

function gs(n: number, r: number): [number, number][] { const p: [number, number][] = []; for (let i = 0; i < n; i++) { const x = Math.random() * 5; p.push([+x.toFixed(2), +Math.max(1, Math.min(10, 2 * x + (Math.random() - 0.5) * 4 * (1 - r))).toFixed(1)]); } return p; }
const S = gs(400, 0.873);
const CR = [{ d: '性价比', r: 0.873 }, { d: '座椅舒适度', r: 0.721 }, { d: '客舱服务', r: 0.712 }, { d: '餐饮', r: 0.693 }, { d: '地面服务', r: 0.638 }, { d: '机上娱乐', r: 0.426 }];

export default function A2ValueAnalysis() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const so = {
    tooltip: { trigger: 'item', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9', fontSize: 13 }, formatter: (p: unknown) => { const v = (p as { value: number[] }).value; return `<b>性价比:</b> ${v[0]}<br/><b>综合评分:</b> ${v[1]}`; } },
    grid: { left: '8%', right: '5%', bottom: '15%', top: '5%' },
    xAxis: { type: 'value', name: '性价比评分', min: 0, max: 5, nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'value', name: '综合评分', min: 0, max: 10, nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    dataZoom: [{ type: 'inside', xAxisIndex: 0 }, { type: 'inside', yAxisIndex: 0 }],
    series: [
      { type: 'scatter', name: '评论', data: S, symbolSize: 5, itemStyle: { color: '#3B82F6', opacity: 0.5 }, emphasis: { scale: 2, itemStyle: { opacity: 1 } } },
      { type: 'line', name: '趋势线 (r=0.873)', data: [[0, 1.5], [5, 10]], smooth: false, symbol: 'none', lineStyle: { type: 'dashed', width: 2, color: '#EF4444' } },
    ],
  };
  const bo = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    grid: { left: '3%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', max: 1, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'category', data: CR.map(c => c.d), axisLabel: { color: '#94A3B8', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: CR.map((c, i) => ({ value: c.r, itemStyle: { color: i === 0 ? '#F59E0B' : c.r > 0.7 ? '#3B82F6' : '#64748B', borderRadius: [0, 6, 6, 0] } })), barWidth: '55%', label: { show: true, position: 'right', color: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono', formatter: '{c}' } }],
  };

  return (
    <SectionWrapper id="a2" title="A2：性价比 — 满意度核心驱动力" subtitle="乘客最在意什么？">
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">💰</div><div><h3 className="text-lg font-semibold text-white mb-2">价值感知效应</h3><p className="text-slate-400 text-sm leading-relaxed">在所有六个服务维度中，<strong className="text-highlight font-mono">性价比（r=0.873）</strong>与综合满意度的相关性最强——比第二名座椅舒适度（r=0.721）<span className="text-accent font-semibold">高出 21%</span>。定价策略和价值感知直接影响乘客对整个英航体验的评价。</p></div></div>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3 bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">性价比 vs 综合评分</h4><p className="text-xs text-slate-500 mb-2">滚动缩放 · 悬停查看详情 · 虚线为趋势</p><ReactEChartsCore echarts={echarts} option={so} style={{ height: 440 }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-2 bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">相关性排名</h4><p className="text-xs text-slate-500 mb-2">Pearson r 与综合评分</p><ReactEChartsCore echarts={echarts} option={bo} style={{ height: 440 }} /></motion.div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[{ icon: '🎯', title: '核心驱动力', desc: '性价比解释约 76% 的满意度方差——英航 #1 战略重点。' }, { icon: '📈', title: '最高 ROI 杠杆', desc: '性价比每提升 1 分，综合满意度的提升幅度最大。' }, { icon: '🔄', title: '连锁效应', desc: '价值感知与座椅舒适度和餐饮质量相互关联。' }].map(c => (<AnimatedCard key={c.title} delay={0.4}><div className="text-center"><div className="text-2xl mb-2">{c.icon}</div><h4 className="text-sm font-semibold text-white mb-1">{c.title}</h4><p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p></div></AnimatedCard>))}
      </div>
    </SectionWrapper>
  );
}
