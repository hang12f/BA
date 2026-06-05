import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../../components/layout/SectionWrapper';
import AnimatedCard from '../../components/ui/AnimatedCard';
import Badge from '../../components/ui/Badge';
import { useInView } from '../../hooks/useInView';

const MODELS = [
  { name: '随机森林', acc: 0.9045, prec: 0.912, rec: 0.896, f1: 0.9040, auc: 0.9696, desc: '30 棵决策树集成。对过拟合稳健，处理非线性关系好。性能与可解释性的最佳平衡。', icon: '🌲', color: '#3B82F6' },
  { name: '决策树', acc: 0.8837, prec: 0.890, rec: 0.878, f1: 0.8839, auc: 0.8918, desc: '单棵树最大深度 8。高度可解释——可追踪每条决策路径。因复杂度有限，性能略低。', icon: '🌳', color: '#10B981' },
  { name: 'GBT', acc: 0.9045, prec: 0.915, rec: 0.894, f1: 0.9043, auc: 0.9636, desc: '20 次迭代的梯度提升树。序贯修正前一棵树的错误。F1 最高——精确率-召回率最佳平衡。', icon: '🚀', color: '#8B5CF6' },
  { name: '逻辑回归', acc: 0.9102, prec: 0.908, rec: 0.912, f1: 0.9101, auc: 0.9702, desc: '线性基线模型。AUC 意外胜出——说明决策边界大致线性。训练快，输出概率值。', icon: '📈', color: '#F59E0B' },
];

export default function A6Classification() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [am, setAm] = useState(0);
  const m = MODELS[am];

  const bo = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: ['准确率', '精确率', '召回率', 'F1'], bottom: 0, textStyle: { color: '#94A3B8', fontSize: 11 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: MODELS.map(m => m.name), axisLabel: { color: '#94A3B8', fontSize: 10, rotate: 15 } },
    yAxis: { type: 'value', min: 0.8, max: 1, axisLabel: { color: '#94A3B8', fontSize: 11, formatter: (v: number) => (v * 100).toFixed(0) + '%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [
      { type: 'bar', name: '准确率', data: MODELS.map(m => m.acc), itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }, barWidth: '18%' },
      { type: 'bar', name: '精确率', data: MODELS.map(m => m.prec), itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }, barWidth: '18%' },
      { type: 'bar', name: '召回率', data: MODELS.map(m => m.rec), itemStyle: { color: '#F59E0B', borderRadius: [4, 4, 0, 0] }, barWidth: '18%' },
      { type: 'bar', name: 'F1', data: MODELS.map(m => m.f1), itemStyle: { color: '#8B5CF6', borderRadius: [4, 4, 0, 0] }, barWidth: '18%' },
    ],
  };

  return (
    <SectionWrapper id="a6" title="A6：推荐行为分类预测" subtitle="机器学习能否预测客户忠诚度？" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4"><div className="text-4xl">🤖</div><div><h3 className="text-lg font-semibold text-white mb-2">机器学习遇见客户忠诚度</h3><p className="text-slate-400 text-sm leading-relaxed">使用 10 项特征训练四种分类器预测客户推荐意愿。最佳模型（<strong className="text-highlight">逻辑回归</strong>）AUC 达 <span className="text-highlight font-bold font-mono">0.9702</span>，展示了生产级部署潜力。</p></div></div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">{MODELS.map((md, i) => (<button key={md.name} onClick={() => setAm(i)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${am === i ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-lg shadow-primary/10' : 'bg-surface-2 text-slate-400 border border-border/30 hover:text-white hover:border-slate-600'}`}><span>{md.icon}</span> {md.name}</button>))}</div>

      <motion.div key={am} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-surface/60 border border-primary/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4"><span className="text-3xl">{m.icon}</span><div><h4 className="text-lg font-bold text-white">{m.name}</h4><p className="text-xs text-slate-400">{m.desc}</p></div><Badge variant="warning" size="md">{`AUC: ${m.auc.toFixed(4)}`}</Badge></div>
        <div className="grid grid-cols-4 gap-4">
          {[{ l: '准确率', v: (m.acc * 100).toFixed(2) + '%', c: '#3B82F6' }, { l: '精确率', v: (m.prec * 100).toFixed(2) + '%', c: '#10B981' }, { l: '召回率', v: (m.rec * 100).toFixed(2) + '%', c: '#F59E0B' }, { l: 'F1', v: (m.f1 * 100).toFixed(2) + '%', c: '#8B5CF6' }].map(s => (<div key={s.l} className="text-center p-3 rounded-xl bg-surface-2/50"><div className="text-xs text-slate-500 mb-1">{s.l}</div><div className="text-xl font-bold font-mono" style={{ color: s.c }}>{s.v}</div></div>))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5 mb-8"><h4 className="text-sm font-semibold text-slate-300 mb-1">模型指标对比</h4><p className="text-xs text-slate-500 mb-2">切换上面按钮查看各模型详情</p><ReactEChartsCore echarts={echarts} option={bo} style={{ height: 400 }} /></motion.div>

      <AnimatedCard delay={0.3}><h4 className="text-sm font-semibold text-accent mb-3">🔧 ML 流水线架构</h4><div className="flex flex-wrap items-center gap-2 text-xs">{['原始数据', 'StringIndexer', 'OneHotEncoder', 'VectorAssembler', '70/30 分割', '4 种分类器', '交叉验证', '最佳模型'].map((s, i) => (<span key={s} className="flex items-center gap-2"><span className="px-3 py-1.5 rounded-lg bg-surface-2 text-slate-300 border border-border/20 font-medium">{s}</span>{i < 7 && <span className="text-slate-600">→</span>}</span>))}</div></AnimatedCard>
    </SectionWrapper>
  );
}
