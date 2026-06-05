import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import { useInView } from '../hooks/useInView';

const PIPELINE_NODES = [
  { id: 'input', label: 'BA_AirlineReviews.csv', icon: '📄', desc: '原始数据：3,923 条评论，15+ 列', phase: '输入', color: '#3B82F6' },
  { id: 'clean', label: '数据清洗', icon: '🧹', desc: '中位数填充、众数填充、名称标准化', phase: '预处理', color: '#06B6D4' },
  { id: 'feature', label: '特征工程', icon: '🔧', desc: 'ReviewLength、TotalServiceScore、航线/日期解析', phase: '预处理', color: '#8B5CF6' },
  { id: 'spark', label: 'PySpark 处理', icon: '⚡', desc: 'SparkSession、DataFrame、SQL、窗口函数', phase: '处理', color: '#F59E0B' },
  { id: 'analysis', label: 'A1–A9 分析模块', icon: '🔬', desc: '9 个分析方向：ss2 + ss3', phase: '分析', color: '#10B981' },
  { id: 'ml', label: '机器学习模型', icon: '🤖', desc: '逻辑回归 · 决策树 · 随机森林 · GBT', phase: '分析', color: '#EF4444' },
  { id: 'viz', label: '数据可视化', icon: '📊', desc: '12 张图表：Matplotlib + Seaborn + ECharts', phase: '输出', color: '#EC4899' },
  { id: 'insights', label: '商业洞察', icon: '💡', desc: '7 条可执行洞察及优先级排序', phase: '输出', color: '#F59E0B' },
];

const PHASES = ['输入', '预处理', '处理', '分析', '输出'];

export default function ProjectArchitecture() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => setActivePhase(prev => (prev + 1) % PHASES.length), 3000);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <SectionWrapper id="architecture" title="项目架构" subtitle="端到端数据处理流程——从原始 CSV 到商业智能" dark>
      <div ref={ref} className="flex flex-wrap justify-center gap-2 mb-12">
        {PHASES.map((p, i) => (
          <button key={p} onClick={() => setActivePhase(i)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activePhase === i ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-lg shadow-primary/10' : 'bg-surface-2 text-slate-400 border border-border/30 hover:text-white'}`}>
            {i + 1}. {p}
          </button>
        ))}
      </div>

      <div className="relative mb-12">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-highlight/50 hidden lg:block" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {PIPELINE_NODES.map((node, i) => (
            <motion.div key={node.id} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative"
              onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}>
              <div className={`p-4 rounded-2xl border text-center transition-all duration-300 cursor-default ${hoveredNode === node.id ? 'border-primary/50 shadow-lg scale-105 bg-surface' : activePhase === PHASES.indexOf(node.phase) ? 'border-primary/30 bg-primary/5 shadow-lg shadow-primary/5' : 'border-border/30 bg-surface/60'}`}>
                <div className="text-2xl mb-2">{node.icon}</div>
                <div className="text-xs font-semibold text-white mb-1 leading-tight">{node.label}</div>
                {hoveredNode === node.id && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-surface-2 border border-border/50 shadow-2xl z-20">
                    <p className="text-xs text-slate-300 leading-relaxed">{node.desc}</p>
                  </motion.div>
                )}
              </div>
              {i < PIPELINE_NODES.length - 1 && <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 text-slate-600 z-10 text-lg">→</div>}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: '输入', items: ['BA_AirlineReviews.csv', '~3.8 MB 原始数据', '3,923 条客户评论', '15+ 列字段'], icon: '📥', color: '#3B82F6' },
          { title: '处理', items: ['PySpark DataFrames', 'Spark SQL 查询', '窗口函数', 'UDF 关键词匹配'], icon: '⚙️', color: '#F59E0B' },
          { title: '分析', items: ['9 个分析模块', '相关性 & 趋势分析', '4 种分类器', '异常检测'], icon: '🔬', color: '#10B981' },
          { title: '输出', items: ['27 个输出数据集', '12 张可视化', '7 条商业洞察', '交互式网页仪表盘'], icon: '📤', color: '#8B5CF6' },
        ].map((col, i) => (
          <AnimatedCard key={col.title} delay={0.5 + i * 0.12}>
            <div className="text-2xl mb-3">{col.icon}</div>
            <h4 className="text-sm font-semibold text-white mb-3" style={{ color: col.color }}>{col.title}</h4>
            <ul className="space-y-2">{col.items.map(item => (<li key={item} className="flex items-center gap-2 text-xs text-slate-400"><span className="w-1 h-1 rounded-full" style={{ background: col.color }} />{item}</li>))}</ul>
          </AnimatedCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
