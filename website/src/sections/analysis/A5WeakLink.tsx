import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useInView } from '../../hooks/useInView';

const WD = [
  { name: '机上娱乐', pct: 47.8, count: 1770, sug: '现代化改造 IFE 系统：增加流媒体、更大屏幕、更好内容库。这是所有舱位中最频繁的痛点。' },
  { name: '餐饮', pct: 46.7, count: 1727, sug: '提升餐食质量和多样性。与优质餐饮服务商合作。考虑饮食偏好和地域风味。' },
  { name: '地面服务', pct: 44.2, count: 1634, sug: '优化值机、登机和行李处理流程。加强机场员工培训，减少等待时间。' },
  { name: '座椅舒适度', pct: 39.1, count: 1448, sug: '增加经济舱座椅间距。升级缓冲材料。考虑长途航线的工效学重新设计。' },
  { name: '客舱服务', pct: 29.0, count: 1072, sug: '继续投入乘务员培训。这是英航的相对优势——保持并增强。' },
];

export default function A5WeakLink() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [sel, setSel] = useState<number | null>(null);
  const [sa, setSa] = useState(false);
  const sorted = [...WD].sort((a, b) => sa ? a.pct - b.pct : b.pct - a.pct);

  const bo = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9', fontSize: 13 }, formatter: (ps: unknown) => { const p = (ps as { name: string; value: number }[])[0]; return `<b>${p.name}</b><br/>最弱环节占比: <b>${p.value}%</b>`; } },
    grid: { left: '3%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', max: 60, name: '% 的评论', nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'category', data: sorted.map(d => d.name), axisLabel: { color: '#94A3B8', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: sorted.map((d, i) => ({ value: d.pct, itemStyle: { color: i === 0 ? '#EF4444' : i === 1 ? '#F59E0B' : '#3B82F6', borderRadius: [0, 8, 8, 0] } })), barWidth: '55%', label: { show: true, position: 'right', color: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono', formatter: '{c}%' } }],
  };

  return (
    <SectionWrapper id="a5" title="A5：服务短板分析" subtitle="找出拖累整体体验的服务环节">
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">🔗</div><div><h3 className="text-lg font-semibold text-white mb-2">短板原理</h3><p className="text-slate-400 text-sm leading-relaxed">链条的强度取决于最弱的一环。通过识别每条评论中评分最低的服务维度，我们揭示哪些维度<em>最频繁</em>拖累整体体验。<strong className="text-danger">机上娱乐</strong>在近 <span className="text-highlight font-bold font-mono">48%</span> 的评论中是最弱环节。</p></div></div>
      </motion.div>
      <div className="flex items-center gap-3 mb-6"><span className="text-sm text-slate-400">排序:</span><button onClick={() => setSa(!sa)} className="px-4 py-2 rounded-full text-xs font-medium bg-surface-2 text-slate-400 border border-border/30 hover:text-white transition-all">{sa ? '↑ 升序' : '↓ 降序（默认）'}</button><span className="text-xs text-slate-600 ml-auto">点击条形图查看改进建议</span></div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">服务短板排名</h4><p className="text-xs text-slate-500 mb-2">该维度评分最低的评论占比</p><ReactEChartsCore echarts={echarts} option={bo} style={{ height: 400 }} onEvents={{ click: (p: unknown) => { const i = (p as { dataIndex: number }).dataIndex; setSel(i === sel ? null : i); } }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}>
          <AnimatedCard><h4 className="text-sm font-semibold text-accent mb-4">{sel !== null ? `🔧 改进计划: ${sorted[sel].name}` : '📋 点击条形图查看详情'}</h4>
            {sel !== null ? (<div><div className="flex items-center gap-3 mb-3"><div className="text-3xl font-bold data-number" style={{ color: sel === 0 ? '#EF4444' : '#F59E0B' }}>{sorted[sel].pct}%</div><div className="text-xs text-slate-400">的评论<br/>{sorted[sel].count.toLocaleString()} 条</div></div><p className="text-xs text-slate-400 leading-relaxed">{sorted[sel].sug}</p></div>)
              : (<div className="space-y-3">{sorted.map((d, i) => (<button key={d.name} onClick={() => setSel(i)} className="w-full text-left p-3 rounded-xl bg-surface-2/50 border border-border/20 hover:border-primary/30 transition-all text-xs"><span className="text-slate-300">{d.name}</span><span className="float-right font-mono font-bold" style={{ color: i === 0 ? '#EF4444' : '#94A3B8' }}>{d.pct}%</span></button>))}</div>)}
          </AnimatedCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
