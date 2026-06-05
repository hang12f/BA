import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useInView } from '../../hooks/useInView';

function gs(): [number, number][] { const p: [number, number][] = []; for (let i = 0; i < 350; i++) { const r = Math.floor(Math.random() * 10) + 1; p.push([r, Math.max(50, Math.round(1100 - r * 55 + (Math.random() - 0.5) * 600))]); } return p; }
const SC = gs();
const RL = [{ r: 1, len: 947 }, { r: 2, len: 1059 }, { r: 3, len: 970 }, { r: 4, len: 871 }, { r: 5, len: 958 }, { r: 6, len: 945 }, { r: 7, len: 871 }, { r: 8, len: 749 }, { r: 9, len: 678 }, { r: 10, len: 646 }];

export default function A3ReviewLength() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const sOpt = {
    tooltip: { trigger: 'item', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9', fontSize: 13 }, formatter: (p: unknown) => { const v = (p as { value: number[] }).value; return `<b>评分:</b> ${v[0]}<br/><b>长度:</b> ${v[1]} 字符`; } },
    grid: { left: '8%', right: '4%', bottom: '12%', top: '8%' },
    xAxis: { type: 'value', name: '综合评分', min: 0, max: 11, nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'value', name: '评论长度（字符）', nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 5, borderColor: '#1E3A5F', backgroundColor: '#111827', textStyle: { color: '#94A3B8' } }],
    series: [
      { type: 'scatter', name: '评论', data: SC, symbolSize: 6, itemStyle: { color: '#3B82F6', opacity: 0.45 }, emphasis: { scale: 2, itemStyle: { opacity: 1 } } },
      { type: 'line', name: '回归趋势', data: [[1, 1020], [10, 640]], smooth: false, symbol: 'none', lineStyle: { type: 'dashed', width: 2.5, color: '#EF4444' } },
    ],
  };
  const bOpt = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: RL.map(r => String(r.r)), name: '评分', nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 } },
    yAxis: { type: 'value', name: '平均长度（字符）', nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [{ type: 'bar', data: RL.map(r => ({ value: r.len, itemStyle: { color: r.r <= 3 ? '#EF4444' : r.r <= 6 ? '#F59E0B' : '#10B981', borderRadius: [6, 6, 0, 0] } })), barWidth: '60%' }],
  };

  return (
    <SectionWrapper id="a3" title="A3：评论长度 vs 评分 — 负面偏差" subtitle="不满意的乘客写得更长" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">📝</div><div><h3 className="text-lg font-semibold text-white mb-2">不满之声更响亮</h3><p className="text-slate-400 text-sm leading-relaxed">评分为 <strong className="text-danger">1-2 星的客户撰写约 1,003 字符</strong>（平均），比 <span className="text-highlight font-bold font-mono">5 星用户的 646 字符多出 55.1%</span>。这种负面偏差是心理学经典现象：愤怒驱动更详细的表达。对英航而言，低分评论是具体反馈的<em>金矿</em>。</p></div></div>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">散点图：评分 × 评论长度</h4><p className="text-xs text-slate-500 mb-2">拖拽滑块缩放 · 虚线为回归趋势</p><ReactEChartsCore echarts={echarts} option={sOpt} style={{ height: 400 }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">各评分平均长度</h4><p className="text-xs text-slate-500 mb-2">红=低评 · 黄=中评 · 绿=高评</p><ReactEChartsCore echarts={echarts} option={bOpt} style={{ height: 400 }} /></motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ l: '低分均长（1-2）', v: '1,003', u: '字符', c: '#EF4444' }, { l: '高分均长（9-10）', v: '662', u: '字符', c: '#10B981' }, { l: '负面偏差', v: '+55.1%', u: '更长', c: '#F59E0B' }, { l: '峰值长度', v: '1,059', u: '评分2时', c: '#EF4444' }].map(s => (<motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}><AnimatedCard><div className="text-center"><div className="text-xs text-slate-500 mb-1">{s.l}</div><div className="text-2xl font-bold data-number" style={{ color: s.c }}>{s.v}</div><div className="text-xs text-slate-500 mt-0.5">{s.u}</div></div></AnimatedCard></motion.div>))}
      </div>
      <AnimatedCard delay={0.6}><h4 className="text-sm font-semibold text-accent mb-3">🎯 战略意义</h4><div className="grid sm:grid-cols-3 gap-4">{['优先分析 1-4 分评论——含最丰富、最详细反馈', '中评分（5-6）也偏高——矛盾心理驱动详细表达', '简短高分≠满意浅薄——只是无需详细描述'].map(t => (<div key={t} className="flex items-start gap-2"><span className="text-primary-light mt-0.5">▸</span><p className="text-xs text-slate-400">{t}</p></div>))}</div></AnimatedCard>
    </SectionWrapper>
  );
}
