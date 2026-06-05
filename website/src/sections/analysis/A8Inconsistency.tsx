import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import Badge from '../../components/ui/Badge';
import { useInView } from '../../hooks/useInView';

function ga() {
  const n: [number, number, number][] = [], h: [number, number, number][] = [], l: [number, number, number][] = [];
  for (let i = 0; i < 350; i++) { const r = Math.floor(Math.random() * 10) + 1; const rec = r >= 7 ? (Math.random() > 0.12 ? 1 : 0) : r <= 4 ? (Math.random() > 0.08 ? 0 : 1) : (Math.random() > 0.5 ? 1 : 0); if (r >= 7 && rec === 0) h.push([r, rec, 1]); else if (r <= 4 && rec === 1) l.push([r, rec, 2]); else n.push([r, rec, 0]); }
  while (n.length < 600) { const r = Math.floor(Math.random() * 10) + 1; n.push([r, r >= 7 ? 1 : r <= 4 ? 0 : (Math.random() > 0.5 ? 1 : 0), 0]); }
  return { n, h, l };
}
const { n, h, l } = ga();
const AP = [
  { id: 1, type: 'HRLR', label: '高分不推荐', count: 48, pct: '1.3%', desc: '评分 7+ 但不推荐。常见于经济舱。核心问题：价值感知差距、长途座椅不适。', as: 2.8, ac: 3.1, av: 2.1, color: '#EF4444' },
  { id: 2, type: 'LRHR', label: '低分推荐', count: 32, pct: '0.9%', desc: '评分 ≤4 但愿意推荐。多见于商务/头等舱。尽管体验欠佳但保持忠诚——客舱关系是粘性因素。', as: 3.2, ac: 3.5, av: 3.3, color: '#10B981' },
];

export default function A8Inconsistency() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [sel, setSel] = useState<number | null>(null);

  const so = {
    tooltip: { trigger: 'item', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9', fontSize: 13 }, formatter: (p: unknown) => { const v = (p as { value: number[]; seriesName: string }); return `<b>${v.seriesName}</b><br/>评分: ${v.value[0]}<br/>推荐: ${v.value[1] === 1 ? '是 ✅' : '否 ❌'}`; } },
    legend: { data: ['正常', 'HRLR（高分不推荐）', 'LRHR（低分推荐）'], bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    grid: { left: '8%', right: '4%', bottom: '15%', top: '5%' },
    xAxis: { type: 'value', name: '综合评分', min: 0, max: 11, nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'value', name: '推荐意愿', min: -0.5, max: 1.8, interval: 1, nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11, formatter: (v: number) => v === 1 ? '是' : v === 0 ? '否' : '' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [
      { type: 'scatter', name: '正常', data: n.map(([x, y]) => [x, y + (Math.random() - 0.5) * 0.3]), symbolSize: 5, itemStyle: { color: '#3B82F6', opacity: 0.25 } },
      { type: 'scatter', name: 'HRLR（高分不推荐）', data: h.map(([x, y]) => [x, y + (Math.random() - 0.5) * 0.15]), symbolSize: 14, itemStyle: { color: '#EF4444', borderColor: '#FFF', borderWidth: 1.5, opacity: 0.9 }, emphasis: { scale: 1.6 } },
      { type: 'scatter', name: 'LRHR（低分推荐）', data: l.map(([x, y]) => [x, y + (Math.random() - 0.5) * 0.15]), symbolSize: 14, itemStyle: { color: '#10B981', borderColor: '#FFF', borderWidth: 1.5, opacity: 0.9 }, emphasis: { scale: 1.6 } },
    ],
  };

  return (
    <SectionWrapper id="a8" title="A8：评分与推荐不一致性检测" subtitle="当评分与忠诚度背离">
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">🔮</div><div><h3 className="text-lg font-semibold text-white mb-2">当评分与忠诚度背离</h3><p className="text-slate-400 text-sm leading-relaxed">大多数客户遵循预期模式：高分→推荐，低分→不推荐。但 <strong className="text-danger">48 人（1.3%）</strong>评分高却不推荐（HRLR），<strong className="text-success">32 人（0.9%）</strong>评分低却愿意推荐（LRHR）。这些异常揭示了满意度与忠诚度之间的错位。</p></div></div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3 bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">评分 × 推荐散点图</h4><p className="text-xs text-slate-500 mb-2">红=HRLR（异常）· 绿=LRHR（异常）· 蓝=正常</p><ReactEChartsCore echarts={echarts} option={so} style={{ height: 440 }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-2 space-y-4">
          {AP.map(p => (<button key={p.id} onClick={() => setSel(sel === p.id ? null : p.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${sel === p.id ? 'border-' + (p.id === 1 ? 'danger' : 'success') + '/50 bg-' + (p.id === 1 ? 'danger' : 'success') + '/5' : 'bg-surface/60 border-border/30 hover:border-primary/30'}`}>
                <div className="flex items-center justify-between mb-2"><Badge variant={p.id === 1 ? 'danger' : 'success'} size="md">{p.type}</Badge><span className="text-xs text-slate-500">{p.count} 例（{p.pct}）</span></div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{p.label}</p>
                {sel === p.id && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/20">{[{ l: '座椅均分', v: p.as }, { l: '客舱均分', v: p.ac }, { l: '性价比均分', v: p.av }].map(s => (<div key={s.l} className="text-center"><div className="text-xs text-slate-500">{s.l}</div><div className="text-sm font-bold font-mono" style={{ color: p.color }}>{s.v.toFixed(1)}</div></div>))}</div><p className="text-xs text-slate-400 mt-3 leading-relaxed">{p.desc}</p></motion.div>)}
              </button>))}
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[{ icon: '📊', title: '满意度 ≠ 忠诚度', text: '性价比是满意度最强驱动因素，但客舱服务和餐饮是更强的忠诚度驱动因素。不同杠杆对应不同结果。' }, { icon: '🎯', title: 'HRLR 风险', text: '高分不推荐者是留存风险群体。他们认可质量但经历了关键服务失误。需主动挽回。' }, { icon: '💎', title: 'LRHR 机会', text: '低分推荐者是隐藏的推广者。尽管体验不佳但忠诚犹存——通过定向挽回策略培养。' }].map(s => (<AnimatedCard key={s.title}><div className="text-center"><div className="text-3xl mb-3">{s.icon}</div><h4 className="text-sm font-semibold text-white mb-2">{s.title}</h4><p className="text-xs text-slate-400 leading-relaxed">{s.text}</p></div></AnimatedCard>))}
      </div>
    </SectionWrapper>
  );
}
