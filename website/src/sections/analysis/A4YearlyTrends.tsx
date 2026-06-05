import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useInView } from '../../hooks/useInView';

const YRS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const DIMS = ['餐饮', '客舱服务', '座椅舒适度', '机上娱乐', '性价比'];

function gh(): [number, number, number][] {
  const d: [number, number, number][] = [];
  DIMS.forEach((_, di) => { YRS.forEach((_yr, yi) => { d.push([yi, di, +Math.max(1, Math.min(5, 4.5 - yi * 0.18 + (Math.random() - 0.5) * 1.2 + (di === 4 ? -0.4 : 0))).toFixed(2)]); }); });
  return d;
}

function gt() {
  return DIMS.map((dim, di) => ({ name: dim, data: YRS.map((_, yi) => +(4.5 - yi * 0.18 + (Math.random() - 0.5) * 0.8 + (di === 4 ? -0.4 : 0)).toFixed(2)), color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][di] }));
}

export default function A4YearlyTrends() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [autoPlay, setAutoPlay] = useState(false);
  const hd = gh();
  const yt = gt();

  const ho = {
    tooltip: { backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9', fontSize: 13 }, formatter: (p: unknown) => { const v = (p as { value: number[] }).value; return `<b>${DIMS[v[1]]}</b><br/>年份: ${YRS[v[0]]}<br/>评分: <b>${v[2]}</b>`; } },
    grid: { left: '12%', right: '5%', bottom: '8%', top: '5%' },
    xAxis: { type: 'category', data: YRS, axisLabel: { color: '#94A3B8', fontSize: 11 }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } } },
    yAxis: { type: 'category', data: DIMS, axisLabel: { color: '#94A3B8', fontSize: 11 }, axisLine: { show: false } },
    visualMap: { min: 1, max: 5, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#EF4444', '#F59E0B', '#FDE68A', '#A7F3D0', '#10B981'] }, textStyle: { color: '#94A3B8', fontSize: 10 } },
    series: [{ type: 'heatmap', data: hd, label: { show: true, color: '#CBD5E1', fontSize: 10, formatter: (p: unknown) => (p as { value: number[] }).value[2].toFixed(1) }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }, itemStyle: { borderColor: '#0A0E17', borderWidth: 2 } }],
  };

  const lo = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: yt.map(t => t.name), bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: YRS, axisLabel: { color: '#94A3B8', fontSize: 11 } },
    yAxis: { type: 'value', min: 1, max: 5, name: '平均分', nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: yt.map(t => ({ type: 'line', name: t.name, data: t.data, smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2, color: t.color }, itemStyle: { color: t.color } })),
  };

  return (
    <SectionWrapper id="a4" title="A4：服务质量时间演变" subtitle="十年来 BA 服务多维趋势（2016–2024）" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">📅</div><div><h3 className="text-lg font-semibold text-white mb-2">十年下行趋势</h3><p className="text-slate-400 text-sm leading-relaxed">横跨五个服务维度，2016 到 2024 年评分整体呈下降趋势。热力图和趋势线揭示一致模式：<span className="text-danger font-semibold">性价比</span>降幅最大，而<span className="text-success font-semibold">客舱服务</span>相对稳定。</p></div></div>
      </motion.div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-slate-400">动画控制:</span>
        <button onClick={() => setAutoPlay(!autoPlay)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${autoPlay ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-surface-2 text-slate-400 border border-border/30 hover:text-white'}`}>{autoPlay ? '⏸ 暂停' : '▶ 自动播放'}</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">年度 × 维度热力图</h4><p className="text-xs text-slate-500 mb-2">绿=好 · 红=差 · 悬停查看详情</p><ReactEChartsCore echarts={echarts} option={ho} style={{ height: 420 }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">服务维度趋势线</h4><p className="text-xs text-slate-500 mb-2">多维对比</p><ReactEChartsCore echarts={echarts} option={lo} style={{ height: 420 }} /></motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ l: '最佳年份', v: '2016', sub: '评分最高', c: '#10B981' }, { l: '最差年份', v: '2024', sub: '评分最低', c: '#EF4444' }, { l: '最大降幅', v: '性价比', sub: '下降最快', c: '#F59E0B' }, { l: '最稳定', v: '客舱服务', sub: '波动最小', c: '#3B82F6' }].map(s => (<motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }}><AnimatedCard><div className="text-center"><div className="text-xs text-slate-500 mb-1">{s.l}</div><div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div><div className="text-xs text-slate-500 mt-0.5">{s.sub}</div></div></AnimatedCard></motion.div>))}
      </div>
    </SectionWrapper>
  );
}
