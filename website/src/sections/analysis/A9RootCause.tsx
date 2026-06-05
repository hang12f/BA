import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import Badge from '../../components/ui/Badge';
import { useInView } from '../../hooks/useInView';

const COMPS = [
  { cat: '地面服务', freq: 51.1, sev: 3.05, pri: 3039, samples: ['"值机排了一个多小时——完全无法接受"', '"直飞航班丢了行李，地面人员态度冷漠"', '"登机混乱，带小孩也不优先"'], color: '#EF4444' },
  { cat: '餐饮', freq: 32.8, sev: 2.70, pri: 1729, samples: ['"餐食冰冷，味道像纸板"', '"到15排就只剩意面了"', '"早餐只有一个小可颂——6小时航班不够吃"'], color: '#F59E0B' },
  { cat: '座椅舒适度', freq: 7.8, sev: 3.08, pri: 468, samples: ['"座椅极窄，8小时挤得难受"', '"经济舱腿部空间太小——膝盖一直顶着"', '"靠背几乎不动，根本睡不着"'], color: '#3B82F6' },
  { cat: '延误取消', freq: 4.6, sev: 3.63, pri: 327, samples: ['"航班提前2小时取消，未提供替代方案"', '"延误6小时，错过转机，没有赔偿"', '"滞留整夜，英航毫无沟通"'], color: '#8B5CF6' },
  { cat: '客舱服务', freq: 2.6, sev: 3.22, pri: 164, samples: ['"要杯水时乘务员态度很差"', '"机组人员聊了一路，似乎对服务不感兴趣"', '"明明备注了纪念日，完全没有提及"'], color: '#10B981' },
  { cat: '预订退款', freq: 0.9, sev: 3.39, pri: 61, samples: ['"退款花了4个月，打了无数个电话"', '"隐藏费用让票价贵了40%"'], color: '#06B6D4' },
];

const QD = COMPS.map((c, i) => ({ value: [c.freq, c.sev, c.pri, i], name: c.cat, itemStyle: { color: c.color }, symbolSize: Math.sqrt(c.pri) * 1.2 }));

export default function A9RootCause() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [sel, setSel] = useState<number | null>(null);

  const qo = {
    tooltip: { trigger: 'item', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' }, formatter: (p: unknown) => { const v = (p as { name: string; value: number[] }); return `<b>${v.name}</b><br/>频率: <b>${v.value[0]}%</b><br/>严重度: <b>${v.value[1].toFixed(2)}</b><br/>优先级: <b>${v.value[2]}</b>`; } },
    grid: { left: '12%', right: '5%', bottom: '8%', top: '8%' },
    xAxis: { type: 'value', name: '频率（% 投诉占比）', nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'value', name: '严重度（5 − 平均评分）', min: 1, max: 5, nameTextStyle: { color: '#94A3B8', fontSize: 12 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [{ type: 'scatter', data: QD, label: { show: true, formatter: '{b}', position: 'right', color: '#94A3B8', fontSize: 11, distance: 8 }, emphasis: { scale: 1.5 } }],
  };

  const bo = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    grid: { left: '3%', right: '8%', bottom: '8%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: '优先级评分', nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    yAxis: { type: 'category', data: COMPS.map(c => c.cat).reverse(), axisLabel: { color: '#94A3B8', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: COMPS.map(c => c.pri).reverse().map((v, i) => ({ value: v, itemStyle: { color: COMPS[COMPS.length - 1 - i].color, borderRadius: [0, 8, 8, 0] } })), barWidth: '55%', label: { show: true, position: 'right', color: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono', formatter: 'P={c}' } }],
  };

  return (
    <SectionWrapper id="a9" title="A9：低分根因分析与改进优先级" subtitle="压轴大戏——英航应优先投入哪里？" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-accent/5 border border-primary/20 p-8 mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4"><span className="text-gradient">#1 优先事项</span>：改进地面服务</h3>
          <p className="text-slate-300 text-base leading-relaxed mb-4">使用 <strong className="text-highlight">优先级 = 频率 × 影响度</strong> 框架，<span className="text-danger font-bold"> 地面服务</span>明确成为最优先事项——占<span className="text-highlight font-mono font-bold">51.1%</span>的低分投诉，平均评分仅 <span className="text-highlight font-mono font-bold">1.95/10</span>。改进值机、登机和行李处理即可化解过半负面体验。</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"><span className="text-xs text-primary-light">优先级评分: 3,039</span><span className="text-slate-600">|</span><span className="text-xs text-slate-400">第二名 餐饮仅 1,729（低 43%）</span></div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">频率 × 严重度象限</h4><p className="text-xs text-slate-500 mb-2">气泡大小 = 优先级 · 右上角 = 最需关注</p><ReactEChartsCore echarts={echarts} option={qo} style={{ height: 440 }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">改进优先级排序</h4><p className="text-xs text-slate-500 mb-2">优先级 = 频率 ×（5 − 平均评分）</p><ReactEChartsCore echarts={echarts} option={bo} style={{ height: 440 }} /></motion.div>
      </div>

      <h4 className="text-lg font-semibold text-white mb-4 text-center">📋 点击投诉类别查看典型评论</h4>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {COMPS.map((c, i) => (<motion.button key={c.cat} onClick={() => setSel(sel === i ? null : i)} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
          className={`text-left p-5 rounded-2xl border transition-all ${sel === i ? 'border-' + (i === 0 ? 'danger' : i === 1 ? 'warning' : 'primary') + '/50 bg-surface-2' : 'bg-surface/60 border-border/30 hover:border-primary/30'}`}>
          <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-white">{c.cat}</span><Badge variant={i === 0 ? 'danger' : i === 1 ? 'warning' : 'primary'} size="sm">{`P=${c.pri}`}</Badge></div>
          <div className="flex gap-3 text-xs mb-2"><span style={{ color: c.color }}>频率: <strong>{c.freq}%</strong></span><span style={{ color: c.color }}>严重度: <strong>{c.sev.toFixed(2)}</strong></span></div>
          {sel === i && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}><div className="mt-3 pt-3 border-t border-border/20 space-y-2">{c.samples.map((s, j) => (<p key={j} className="text-xs text-slate-400 italic leading-relaxed bg-surface-2/30 rounded-lg p-2 border border-border/10">{s}</p>))}</div></motion.div>)}
        </motion.button>))}
      </div>

      <AnimatedCard delay={0.8}><div className="text-center"><h4 className="text-lg font-bold text-white mb-3">🏆 数据驱动的行动计划</h4><p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">分析最终结论：<strong className="text-highlight">地面服务</strong>必须是英航 #1 投资重点。它既是最高频投诉（51.1%）也是最高严重度之一（Avg 1.95）。结合<strong className="text-primary-light">餐饮</strong>（32.8%，P=1,729），仅解决这两个领域就可化解 <strong className="text-white">84% 的低分投诉</strong>。这就是数据科学直接转化为商业 ROI 的地方。</p></div></AnimatedCard>
    </SectionWrapper>
  );
}
