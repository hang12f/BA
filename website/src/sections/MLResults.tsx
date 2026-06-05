import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import Badge from '../components/ui/Badge';
import { useInView } from '../hooks/useInView';

const RESULTS = [
  { model: '逻辑回归', accuracy: 0.9102, f1: 0.9101, auc: 0.9702, icon: '📈', color: '#F59E0B', rank: '🥇 最佳 AUC' },
  { model: 'GBT', accuracy: 0.9045, f1: 0.9043, auc: 0.9636, icon: '🚀', color: '#8B5CF6', rank: '🥈 最佳 F1' },
  { model: '随机森林', accuracy: 0.9045, f1: 0.9040, auc: 0.9696, icon: '🌲', color: '#3B82F6', rank: '🥉 均衡表现' },
  { model: '决策树', accuracy: 0.8837, f1: 0.8839, auc: 0.8918, icon: '🌳', color: '#10B981', rank: '最可解释' },
];

export default function MLResults() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const barOption = {
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', borderColor: '#1E3A5F', textStyle: { color: '#F1F5F9' } },
    legend: { data: ['准确率', 'F1', 'AUC'], bottom: 0, textStyle: { color: '#94A3B8', fontSize: 12 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: RESULTS.map(r => r.model), axisLabel: { color: '#94A3B8', fontSize: 10, rotate: 15 }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } } },
    yAxis: { type: 'value', min: 0.8, max: 1, axisLabel: { color: '#94A3B8', fontSize: 11, formatter: (v: number) => (v * 100).toFixed(0) + '%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } } },
    series: [
      { type: 'bar', name: '准确率', data: RESULTS.map(r => r.accuracy), itemStyle: { color: '#3B82F6', borderRadius: [6, 6, 0, 0] }, barWidth: '22%' },
      { type: 'bar', name: 'F1', data: RESULTS.map(r => r.f1), itemStyle: { color: '#8B5CF6', borderRadius: [6, 6, 0, 0] }, barWidth: '22%' },
      { type: 'bar', name: 'AUC', data: RESULTS.map(r => r.auc), itemStyle: { color: '#10B981', borderRadius: [6, 6, 0, 0] }, barWidth: '22%' },
    ],
  };

  return (
    <SectionWrapper id="ml-results" title="机器学习模型结果" subtitle="客户推荐行为二分类预测——四种模型横向对比" dark>
      <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {RESULTS.map((r, i) => (
          <motion.div key={r.model} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <AnimatedCard glow={i === 0}>
              <div className="text-2xl mb-2">{r.icon}</div>
              <div className="flex items-center gap-2 mb-2"><h4 className="text-sm font-semibold text-white">{r.model}</h4><Badge variant={i === 0 ? 'warning' : i === 1 ? 'accent' : 'primary'}>{r.rank}</Badge></div>
              <div className="space-y-1.5">
                {[{ l: '准确率', v: (r.accuracy * 100).toFixed(2) + '%' }, { l: 'F1 分数', v: (r.f1 * 100).toFixed(2) + '%' }, { l: 'AUC', v: r.auc.toFixed(4) }].map(m => (
                  <div key={m.l} className="flex justify-between text-xs"><span className="text-slate-500">{m.l}</span><span className="font-mono font-bold" style={{ color: r.color }}>{m.v}</span></div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="bg-surface/60 border border-border/30 rounded-2xl p-5 mb-8">
        <h4 className="text-sm font-semibold text-slate-300 mb-1">模型指标对比</h4>
        <p className="text-xs text-slate-500 mb-2">所有模型准确率超 88%，AUC 表现优秀</p>
        <ReactEChartsCore echarts={echarts} option={barOption} style={{ height: 400 }} />
      </motion.div>

      <AnimatedCard delay={0.6}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔧</div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">ML 流水线</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              所有模型使用相同预处理流程：<code className="text-primary-light text-xs bg-primary/5 px-1.5 py-0.5 rounded">StringIndexer</code> → <code className="text-primary-light text-xs bg-primary/5 px-1.5 py-0.5 rounded">OneHotEncoder</code> → <code className="text-primary-light text-xs bg-primary/5 px-1.5 py-0.5 rounded">VectorAssembler</code>。
              特征包括服务评分、旅客类型、舱位、飞行月份和评论长度。70/30 训练测试分割保证稳健评估。
              模型超参数采用合理默认值，聚焦对比分析而非穷举调参。
            </p>
          </div>
        </div>
      </AnimatedCard>
    </SectionWrapper>
  );
}
