import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useInView } from '../../hooks/useInView';

const CABINS = ['头等舱', '商务舱', '豪华经济舱', '经济舱'];
const TRAVELERS = ['独自出行', '情侣', '家庭', '商务旅客'];
const DIMS = ['座椅舒适度', '客舱服务', '地面服务', '餐饮', '机上娱乐', '性价比'];

const CS: Record<string, number[]> = {
  '头等舱': [3.8, 4.2, 3.5, 3.0, 2.8, 3.1],
  '商务舱': [3.5, 4.0, 3.0, 2.8, 2.5, 3.3],
  '豪华经济舱': [3.2, 3.5, 2.8, 3.2, 2.2, 3.6],
  '经济舱': [2.8, 3.0, 2.5, 2.6, 2.0, 3.8],
};
const TD: Record<string, number[]> = {
  '独自出行': [3.2, 3.8, 3.0, 2.7, 2.3, 3.5],
  '情侣': [3.0, 3.5, 2.8, 3.0, 2.5, 3.2],
  '家庭': [2.5, 2.8, 2.2, 3.2, 2.8, 3.8],
  '商务旅客': [3.5, 4.0, 3.3, 2.5, 2.0, 2.8],
};

export default function A7CabinSensitivity() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [vm, setVm] = useState<'cabin' | 'traveler'>('cabin');
  const [sc, setSc] = useState('经济舱');

  const co = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: CABINS, bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: DIMS, axisLabel: { color: '#94A3B8', fontSize: 10, rotate: 20 } },
    yAxis: { type: 'value', name: '客舱服务平均评分', max: 5, nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: CABINS.map((c, i) => ({ type: 'bar', name: c, data: CS[c], itemStyle: { color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][i], borderRadius: [6, 6, 0, 0], opacity: sc === c ? 1 : 0.4 }, barWidth: '18%' })),
  };
  const to = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: TRAVELERS, bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: DIMS, axisLabel: { color: '#94A3B8', fontSize: 10, rotate: 20 } },
    yAxis: { type: 'value', name: '客舱服务平均评分', max: 5, nameTextStyle: { color: '#94A3B8', fontSize: 11 }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: TRAVELERS.map((t, i) => ({ type: 'bar', name: t, data: TD[t], itemStyle: { color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i], borderRadius: [6, 6, 0, 0] }, barWidth: '18%' })),
  };

  return (
    <SectionWrapper id="a7" title="A7：舱位服务敏感度分析" subtitle="不同乘客，不同优先" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">🎯</div><div><h3 className="text-lg font-semibold text-white mb-2">不同乘客，不同优先</h3><p className="text-slate-400 text-sm leading-relaxed">客舱服务敏感度因舱位和旅客类型差异显著。<strong className="text-primary-light">商务旅客</strong>和<strong className="text-accent">头等舱</strong>乘客对客舱服务评分最高，而<strong className="text-warning">家庭旅客</strong>更关注餐饮和娱乐。</p></div></div>
      </motion.div>
      <div className="flex items-center gap-3 mb-6"><span className="text-sm text-slate-400">查看维度:</span>{[{ k: 'cabin', l: '🏷️ 按舱位' }, { k: 'traveler', l: '👥 按旅客类型' }].map(v => (<button key={v.k} onClick={() => setVm(v.k as 'cabin' | 'traveler')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${vm === v.k ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-surface-2 text-slate-400 border border-border/30 hover:text-white'}`}>{v.l}</button>))}</div>
      {vm === 'cabin' ? (<>
        <div className="flex flex-wrap gap-2 mb-4">{CABINS.map(c => (<button key={c} onClick={() => setSc(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${sc === c ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-surface-2 text-slate-500 border border-border/20 hover:text-white'}`}>{c}</button>))}</div>
        <motion.div key="cabin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5 mb-8"><h4 className="text-sm font-semibold text-slate-300 mb-1">舱位敏感度</h4><ReactEChartsCore echarts={echarts} option={co} style={{ height: 420 }} /></motion.div>
      </>) : (
        <motion.div key="traveler" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5 mb-8"><h4 className="text-sm font-semibold text-slate-300 mb-1">旅客类型敏感度</h4><ReactEChartsCore echarts={echarts} option={to} style={{ height: 420 }} /></motion.div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ icon: '💼', title: '商务旅客', text: '客舱服务敏感度最高。重视高效专业的服务。' }, { icon: '👑', title: '头等舱', text: '所有维度均有高端期待。客舱服务是核心差异化因素。' }, { icon: '👨‍👩‍👧', title: '家庭旅客', text: '性价比和餐饮最重要。机上娱乐对儿童至关重要。' }, { icon: '✈️', title: '经济舱', text: '性价比占主导。基本舒适度和公平定价是核心需求。' }].map(s => (<AnimatedCard key={s.title}><div className="text-center"><div className="text-2xl mb-2">{s.icon}</div><h4 className="text-sm font-semibold text-white mb-1">{s.title}</h4><p className="text-xs text-slate-400 leading-relaxed">{s.text}</p></div></AnimatedCard>))}
      </div>
    </SectionWrapper>
  );
}
