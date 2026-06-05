import { motion } from 'framer-motion';
import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import Badge from '../components/ui/Badge';
import { useInView } from '../hooks/useInView';

const LIMITATIONS = [
  { icon: '📊', title: '数据范围', text: '分析仅限英航自身评论。跨航空公司对标分析可提供竞争背景。' },
  { icon: '⏰', title: '时间因素', text: 'COVID-19（2020-2021）显著扰乱了航空出行模式。后疫情常态化仍在进行中。' },
  { icon: '🔤', title: '文本分析深度', text: '当前文本分析采用关键词匹配。进阶 NLP（BERT、情感分析、主题建模）可提取更丰富的信息。' },
  { icon: '⚙️', title: '模型调优', text: 'ML 模型使用默认参数。超参数调优和特征筛选可进一步提升性能。' },
];

const FUTURE_WORK = [
  { icon: '🧠', title: '进阶 NLP', text: '应用基于 Transformer 的情感分析和主题建模，从评论文本中提取更深层次的洞察。' },
  { icon: '🔮', title: '预测分析', text: '构建时间序列预测模型，预判未来满意度趋势并主动发现问题。' },
  { icon: '🌐', title: '跨航司对比', text: '整合竞争对手的评论数据，进行标杆分析和竞争情报研究。' },
  { icon: '📱', title: '实时仪表盘', text: '部署连接流式评论数据的实时更新仪表盘，支持运营监控。' },
];

export default function Conclusion() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <SectionWrapper id="conclusion" title="总结与展望" subtitle="关键收获、局限性及未来研究方向" dark>
      <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-secondary/5 border border-primary/20 p-8 mb-12 text-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">项目总结</h3>
          <p className="text-slate-300 leading-relaxed mb-6">
            本项目展示了完整的 <strong className="text-primary-light">PySpark 大数据分析流程</strong>——
            从原始 CSV 数据采集、预处理，到 9 个分析模块、机器学习建模，再到商业智能洞察。
            分析揭示了明确且可执行的结论：性价比是满意度的核心驱动力，地面服务是 #1 改进优先级，
            机器学习模型能以 97% AUC 预测客户忠诚度。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="primary" size="md">9 个分析模块</Badge>
            <Badge variant="accent" size="md">4 种 ML 模型</Badge>
            <Badge variant="success" size="md">7 条商业洞察</Badge>
            <Badge variant="warning" size="md">27 个数据集</Badge>
            <Badge variant="primary" size="md">12 张图表</Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-bold text-white mb-6 text-center"><span className="text-gradient-accent">局限性</span></h3>
          <div className="space-y-4">
            {LIMITATIONS.map((lim, i) => (
              <motion.div key={lim.title} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}>
                <AnimatedCard><div className="flex items-start gap-3"><span className="text-xl shrink-0">{lim.icon}</span><div><h4 className="text-sm font-semibold text-white mb-1">{lim.title}</h4><p className="text-xs text-slate-400 leading-relaxed">{lim.text}</p></div></div></AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-6 text-center"><span className="text-gradient">未来方向</span></h3>
          <div className="space-y-4">
            {FUTURE_WORK.map((fw, i) => (
              <motion.div key={fw.title} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}>
                <AnimatedCard><div className="flex items-start gap-3"><span className="text-xl shrink-0">{fw.icon}</span><div><h4 className="text-sm font-semibold text-white mb-1">{fw.title}</h4><p className="text-xs text-slate-400 leading-relaxed">{fw.text}</p></div></div></AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.8 }} className="text-center">
        <p className="text-slate-500 text-sm">使用 React · TypeScript · TailwindCSS · Framer Motion · Apache ECharts 构建</p>
        <p className="text-slate-600 text-xs mt-1">数据分析作品集 · 大数据与数据科学</p>
      </motion.div>
    </SectionWrapper>
  );
}
