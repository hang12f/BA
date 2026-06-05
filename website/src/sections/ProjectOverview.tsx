import { motion } from 'framer-motion';
import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import Badge from '../components/ui/Badge';
import { useInView } from '../hooks/useInView';

const METHODOLOGY_STEPS = [
  { step: '01', title: '数据预处理', description: '清洗 3,923 条原始评论：中位数/众数填补缺失值、统一机型名称、解析日期和航线字段、构建 ReviewLength 和 TotalServiceScore 等特征。', icon: '🧹' },
  { step: '02', title: '探索分析与机器学习', description: '开展 9 个方向的分析：验证偏差、相关性分析、负面偏差、时间趋势、短板识别、ML 分类、舱位敏感度、评分不一致性、根因分析。', icon: '🔬' },
  { step: '03', title: '可视化与商业洞察', description: '使用 Matplotlib/Seaborn 生成 12 张专业图表，提炼 7 条可执行的商业洞察，通过频率×严重度框架排序改进优先级。', icon: '📊' },
];

const OBJECTIVES = [
  { icon: '🎯', text: '识别客户满意度和忠诚度的关键驱动因素' },
  { icon: '📉', text: '追踪 10 年（2014–2023）服务质量变化趋势' },
  { icon: '🤖', text: '构建机器学习模型预测客户推荐行为' },
  { icon: '🔍', text: '检测评分异常和服务短板' },
  { icon: '💡', text: '提供数据驱动的商业改进建议' },
];

export default function ProjectOverview() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <SectionWrapper id="overview" title="项目概览" subtitle="端到端 PySpark 大数据分析流程——从原始客户反馈到可执行的商业智能">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {OBJECTIVES.map((obj, i) => (
          <AnimatedCard key={i} delay={i * 0.1}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{obj.icon}</span>
              <p className="text-slate-300 text-sm leading-relaxed">{obj.text}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div ref={ref}>
        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-2xl font-bold text-center mb-4">
          <span className="text-gradient">分析方法论</span>
        </motion.h3>
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-slate-400 text-center mb-12">
          从原始数据到商业洞察的三阶段结构化流程
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-12" />
          {METHODOLOGY_STEPS.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}>
              <AnimatedCard className="text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-primary-grad flex items-center justify-center mx-auto mb-4 text-2xl">{step.icon}</div>
                <div className="text-xs text-primary-light font-mono font-bold mb-2">阶段 {step.step}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap justify-center gap-3 mt-16">
        <Badge variant="primary" size="md">Apache PySpark</Badge>
        <Badge variant="accent" size="md">Spark MLlib</Badge>
        <Badge variant="success" size="md">Python 3</Badge>
        <Badge variant="warning" size="md">Pandas</Badge>
        <Badge variant="primary" size="md">Matplotlib</Badge>
        <Badge variant="accent" size="md">Seaborn</Badge>
        <Badge variant="success" size="md">React + ECharts</Badge>
      </motion.div>
    </SectionWrapper>
  );
}
