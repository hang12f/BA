import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useInView } from '../../hooks/useInView';

const DIMS = ['座椅舒适度', '客舱服务', '地面服务', '餐饮', '机上娱乐', '性价比'];
const VD = [2.76, 3.14, 2.71, 2.73, 2.85, 2.47];
const UV = [2.93, 3.30, 2.89, 2.75, 2.72, 2.79];

export default function A1Verified() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const rdr = useRef<ReactEChartsCore>(null);
  useEffect(() => {
    if (!isInView || !rdr.current) return;
    const inst = rdr.current.getEchartsInstance();
    let f = 0;
    const t = setInterval(() => { f++; const p = Math.min(f / 60, 1); const e = 1 - Math.pow(1 - p, 3); inst.setOption({ series: [{ data: [{ value: UV.map(v => v * e) }] }, { data: [{ value: VD.map(v => v * e) }] }] }); if (f >= 60) clearInterval(t); }, 25);
    return () => clearInterval(t);
  }, [isInView]);

  const ro = {
    tooltip: { trigger: 'item', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: ['未验证 (2,548)', '真实验证 (1,153)'], bottom: 0, textStyle: { color: '#94A3B8', fontSize: 12 } },
    radar: { center: ['50%', '45%'], radius: '65%', indicator: DIMS.map(d => ({ name: d, max: 4.5 })), axisName: { color: '#94A3B8', fontSize: 11 }, splitArea: { areaStyle: { color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)'] } }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } } },
    series: [
      { type: 'radar', name: '未验证 (2,548)', symbol: 'circle', symbolSize: 6, lineStyle: { width: 2, color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: '#3B82F6', opacity: 0.1 }, data: [{ value: UV.map(() => 0) }] },
      { type: 'radar', name: '真实验证 (1,153)', symbol: 'circle', symbolSize: 6, lineStyle: { width: 2, color: '#06B6D4' }, itemStyle: { color: '#06B6D4' }, areaStyle: { color: '#06B6D4', opacity: 0.1 }, data: [{ value: VD.map(() => 0) }] },
    ],
  };

  const bo = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: ['未验证', '已验证'], bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['1-2', '3-4', '5-6', '7-8', '9-10'], axisLabel: { color: '#94A3B8', fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [
      { type: 'bar', name: '未验证', data: [212, 467, 523, 719, 627], itemStyle: { color: '#3B82F6', borderRadius: [6, 6, 0, 0] }, barWidth: '35%' },
      { type: 'bar', name: '已验证', data: [156, 332, 299, 248, 118], itemStyle: { color: '#06B6D4', borderRadius: [6, 6, 0, 0] }, barWidth: '35%' },
    ],
  };

  return (
    <SectionWrapper id="a1" title="A1：已验证 vs 未验证评论对比" subtitle="真实乘客的评价有何不同？" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">🔍</div><div><h3 className="text-lg font-semibold text-white mb-2">验证偏差</h3><p className="text-slate-400 text-sm leading-relaxed">英航数据包含 <strong className="text-primary-light">1,153 条已验证评论</strong>（来自真实航班）和 <strong className="text-secondary">2,548 条未验证评论</strong>。分析揭示出系统性差异：已验证用户在所有维度上平均<span className="text-danger font-semibold">严格约 14.1%</span>，评分差距达 <span className="text-highlight font-mono font-bold">0.70 分</span>。</p></div></div>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">服务画像雷达图</h4><p className="text-xs text-slate-500 mb-2">滚动即逐步绘制</p><ReactEChartsCore ref={rdr} echarts={echarts} option={ro} style={{ height: 380 }} /></motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5"><h4 className="text-sm font-semibold text-slate-300 mb-1">评分分布（按验证状态）</h4><p className="text-xs text-slate-500 mb-2">未验证用户集中在高评分区间</p><ReactEChartsCore echarts={echarts} option={bo} style={{ height: 380 }} /></motion.div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <AnimatedCard delay={0.3}><h4 className="text-sm font-semibold text-primary-light mb-3">📊 关键数据</h4><div className="space-y-2">{[{ l: '未验证平均分', v: '4.95', c: '#3B82F6' }, { l: '已验证平均分', v: '4.25', c: '#06B6D4' }, { l: '评分差距', v: '−14.1%', c: '#EF4444' }, { l: '最大差距维度', v: '性价比', c: '#F59E0B' }].map(s => (<div key={s.l} className="flex justify-between items-center p-2 rounded-lg bg-surface-2/50"><span className="text-xs text-slate-400">{s.l}</span><span className="text-sm font-bold font-mono" style={{ color: s.c }}>{s.v}</span></div>))}</div></AnimatedCard>
        <AnimatedCard delay={0.45}><h4 className="text-sm font-semibold text-accent mb-3">💡 商业洞察</h4><p className="text-xs text-slate-400 leading-relaxed mb-3">已验证评论是服务质量的更可靠指标。未验证评论中的系统性向上偏差提示英航应在运营决策中<strong className="text-white">对已验证反馈给予更高权重</strong>。</p></AnimatedCard>
        <AnimatedCard delay={0.6}><h4 className="text-sm font-semibold text-success mb-3">🎯 建议</h4><ul className="space-y-2 text-xs text-slate-400"><li className="flex items-start gap-2"><span className="text-primary-light">▸</span>运营决策以已验证评论为准</li><li className="flex items-start gap-2"><span className="text-primary-light">▸</span>深入调查性价比感知差距</li><li className="flex items-start gap-2"><span className="text-primary-light">▸</span>两段数据对比监控趋势</li></ul></AnimatedCard>
      </div>
    </SectionWrapper>
  );
}
