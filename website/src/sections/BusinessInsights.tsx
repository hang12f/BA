import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCard from '../components/ui/AnimatedCard';
import { useInView } from '../hooks/useInView';

const INSIGHTS = [
  { id: 'i1', title: '已验证用户评价更加严格', subtitle: '信任差距', icon: '✅', detail: '已验证用户（真实乘客）在所有 6 个服务维度上的评分比未验证用户低 14.1%。已验证反馈对运营决策更可靠——未验证评论中的系统性偏差可能掩盖真实服务问题。', stat: '−14.1%', statLabel: '评分差距', color: '#3B82F6' },
  { id: 'i2', title: '性价比是满意度的核心驱动力', subtitle: '#1 杠杆', icon: '💰', detail: '性价比与 OverallRating 的相关性最强（r=0.873）——比第二名高出 21%。性价比每提升 1 分，整体满意度约提升 2 分。定价和价值沟通是英航投资回报率最高的杠杆。', stat: 'r = 0.873', statLabel: 'Pearson 相关系数', color: '#F59E0B' },
  { id: 'i3', title: '餐饮和娱乐是主要短板', subtitle: '最弱环节', icon: '🎬', detail: '机上娱乐是 47.8% 评论中的最弱维度，餐饮紧随其后（46.7%）。这两个维度在近半数航班中拖累整体体验——现代化改造 IFE 和餐饮可带来最广泛的满意度提升。', stat: '47.8%', statLabel: '最弱环节频率', color: '#EF4444' },
  { id: 'i4', title: '机器学习精确预测推荐行为', subtitle: 'AI 驱动的忠诚度', icon: '🤖', detail: '逻辑回归在推荐预测中 AUC 达到 0.970——与生产级系统竞争力相当。英航可部署该模型在客户流失前主动识别风险，实现主动客户保留。全部 4 个模型准确率超过 88%。', stat: 'AUC 0.970', statLabel: '最佳模型性能', color: '#8B5CF6' },
  { id: 'i5', title: '高频高严重度投诉应优先处理', subtitle: '优先级框架', icon: '🎯', detail: '使用 Priority = 频率 × 影响度评分，地面服务是 #1 改进目标（P=3,039，占投诉 51.1%）。仅解决地面服务和餐饮两个领域即可化解 84% 的低分投诉。数据科学直接量化了投资回报最大的方向。', stat: '84%', statLabel: '两项改进可解决', color: '#10B981' },
];

function InsightSlide({ insight, index }: { insight: typeof INSIGHTS[0]; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'center center'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -50 : 50, 0]);

  return (
    <motion.div ref={containerRef} style={{ opacity, scale, x }} className="min-h-[80vh] flex items-center justify-center py-20">
      <div className="container-custom max-w-4xl">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 text-center lg:text-left">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.6, type: 'spring' }} className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto lg:mx-0 mb-6" style={{ background: insight.color + '15', border: `2px solid ${insight.color}30` }}>
              {insight.icon}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="text-5xl md:text-6xl font-bold data-number mb-2" style={{ color: insight.color }}>{insight.stat}</div>
              <div className="text-sm text-slate-500">{insight.statLabel}</div>
            </motion.div>
          </div>
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="text-xs font-mono mb-3 tracking-widest uppercase" style={{ color: insight.color }}>核心洞察 {index + 1} / {INSIGHTS.length}</div>
              <h3 className="text-xl text-slate-400 font-medium mb-1">{insight.subtitle}</h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{insight.title}</h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">{insight.detail}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BusinessInsights() {
  const { ref, isInView } = useInView({ threshold: 0.05 });
  const { ref: finalRef, isInView: finalInView } = useInView({ threshold: 0.2 });

  return (
    <section id="insights" className="relative" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center pt-20 pb-10">
        <h2 className="section-heading"><span className="text-gradient">商业洞察</span></h2>
        <p className="section-subheading mx-auto">五条数据驱动的核心结论，将原始分析转化为战略行动</p>
      </motion.div>

      {INSIGHTS.map((insight, i) => (<InsightSlide key={insight.id} insight={insight} index={i} />))}

      <div ref={finalRef} className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={finalInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">项目<span className="text-gradient">统计</span></h2>
            <p className="text-slate-400 text-lg">完整的数据科学作品集</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 9, label: '分析模块', sub: 'ss2 (6) + ss3 (3)', icon: '🔬' },
              { value: 27, label: '输出数据集', sub: '完整结果的 CSV 文件', icon: '📊' },
              { value: 12, label: '可视化图表', sub: 'Matplotlib + ECharts', icon: '📈' },
              { value: 4, label: 'ML 模型', sub: '逻辑回归 · 决策树 · 随机森林 · GBT', icon: '🤖' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 40 }} animate={finalInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}>
                <AnimatedCard glow>
                  <div className="text-center">
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <div className="text-4xl md:text-5xl font-bold text-white data-number mb-2">{stat.value}</div>
                    <div className="text-sm font-semibold text-slate-300 mb-1">{stat.label}</div>
                    <div className="text-xs text-slate-500">{stat.sub}</div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
