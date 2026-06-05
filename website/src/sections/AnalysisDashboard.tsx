import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import Badge from '../components/ui/Badge';
import { analysisModules } from '../data';
import { useInView } from '../hooks/useInView';

function useCountUp(end: number, isInView: boolean, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(end * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, isInView, duration]);
  return decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();
}

function KpiCard({ label, value, suffix, prefix, decimals, icon, trend, color, delay }: {
  label: string; value: number; suffix?: string; prefix?: string; decimals?: number;
  icon: string; trend?: string; color: string; delay: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const display = useCountUp(value, isInView, 2000, decimals);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-card-grad border border-border/30 p-5 group hover:border-primary/40 transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style={{ background: color }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3"><span className="text-2xl">{icon}</span>{trend && <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-2">{trend}</span>}</div>
        <div className="text-3xl md:text-4xl font-bold data-number text-white mb-1">{prefix}{display}{suffix}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--kpi-color)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ '--kpi-color': color } as React.CSSProperties} />
    </motion.div>
  );
}

function RatingDistChart() {
  const option = {
    tooltip: { backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9', fontSize: 13 } },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], axisLabel: { color: '#94A3B8', fontSize: 12 }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '评论数', nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [{ type: 'bar', data: [865, 424, 406, 259, 234, 190, 313, 370, 310, 330].map((v, i) => ({ value: v, itemStyle: { color: i < 3 ? '#EF4444' : i < 6 ? '#F59E0B' : '#10B981', borderRadius: [6, 6, 0, 0] } })), barWidth: '60%', emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(59,130,246,0.3)' } } }],
  };
  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: 260 }} />;
}

function RecGauge() {
  const option = {
    tooltip: { backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    series: [{ type: 'pie', radius: ['65%', '82%'], center: ['50%', '55%'], startAngle: 180, itemStyle: { borderColor: '#0A0E17', borderWidth: 3 }, label: { show: false }, data: [{ value: 2548, name: '推荐', itemStyle: { color: '#10B981' } }, { value: 1153, name: '不推荐', itemStyle: { color: '#374151' } }], emphasis: { scaleSize: 6 } }],
    graphic: [{ type: 'text', left: 'center', top: '38%', style: { text: '68.8%', fontSize: 32, fontWeight: 'bold', fill: '#F1F5F9', fontFamily: 'JetBrains Mono' } }, { type: 'text', left: 'center', top: '52%', style: { text: '愿意推荐', fontSize: 12, fill: '#94A3B8' } }],
  };
  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: 260 }} />;
}

function SentimentPie() {
  const option = {
    tooltip: { trigger: 'item', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    series: [{ type: 'pie', radius: ['45%', '72%'], center: ['50%', '45%'], itemStyle: { borderRadius: 6, borderColor: '#0A0E17', borderWidth: 3 }, label: { show: false }, emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' }, scaleSize: 8 }, data: [{ value: 1980, name: '正面 (≥6)', itemStyle: { color: '#10B981' } }, { value: 1721, name: '负面 (<6)', itemStyle: { color: '#EF4444' } }] }],
  };
  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: 260 }} />;
}

function YearlyTrendSpark() {
  const option = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'], axisLabel: { color: '#94A3B8', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '平均评分', nameTextStyle: { color: '#94A3B8', fontSize: 10 }, axisLabel: { color: '#94A3B8', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, min: 2, max: 7 },
    series: [{ type: 'line', data: [6.11, 5.63, 4.84, 3.86, 4.51, 4.75, 4.03, 4.30, 3.94, 3.23], smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 2.5, color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0.02)' }]) } }],
  };
  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: 260 }} />;
}

export default function AnalysisDashboard() {
  const { ref, isInView } = useInView({ threshold: 0.05 });
  const handleModuleClick = (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <SectionWrapper id="analysis-dashboard" title="分析仪表盘" subtitle="交互式驾驶舱——项目 KPI、数据概览图表和 9 个分析模块的快速导航" dark>
      <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <KpiCard label="评论总数" value={3701} icon="📊" color="#3B82F6" trend="清洗后" delay={0} />
        <KpiCard label="平均评分" value={4.73} decimals={2} icon="⭐" color="#F59E0B" trend="/ 10" delay={0.08} />
        <KpiCard label="推荐比例" value={68.8} suffix="%" icon="👍" color="#10B981" trend="2,548 是" delay={0.16} />
        <KpiCard label="验证比例" value={31.2} suffix="%" icon="✅" color="#06B6D4" trend="1,153 条" delay={0.24} />
        <KpiCard label="低评率 (≤4)" value={52.9} suffix="%" icon="⚠️" color="#EF4444" trend="1,954 条" delay={0.32} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2 bg-surface/60 border border-border/30 rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">综合评分分布</h4><RatingDistChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">推荐比例</h4><RecGauge />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">情感分布</h4><SentimentPie />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5 mb-12">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">年度满意度趋势（2014–2023）</h4><YearlyTrendSpark />
      </motion.div>

      <motion.h3 initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }} className="text-xl font-bold text-center mb-8">
        <span className="text-gradient">探索全部 9 个分析模块</span>
      </motion.h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {analysisModules.map((mod, i) => (
          <motion.div key={mod.id} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}>
            <AnimatedCard glow onClick={() => handleModuleClick(mod.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-grad flex items-center justify-center text-white font-bold text-sm">A{mod.number}</div>
                <div className="flex gap-1.5 flex-wrap justify-end">{mod.tags.slice(0, 2).map(tag => <Badge key={tag} variant="primary">{tag}</Badge>)}</div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{mod.title}</h3>
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{mod.subtitle}</p>
              <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
                <div className="flex gap-1">{mod.chartTypes.map(ct => <span key={ct} className="text-xs px-2 py-0.5 rounded-md bg-surface-2 text-slate-400 font-mono">{ct}</span>)}</div>
                <span className="text-primary-light text-xs font-medium group-hover:translate-x-1 transition-transform">查看 →</span>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
