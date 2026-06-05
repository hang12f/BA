import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../components/layout/SectionWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import { techStack } from '../data';

const CATEGORIES = [
  { key: 'big-data', label: '大数据处理', icon: '⚡' },
  { key: 'language', label: '编程语言', icon: '💻' },
  { key: 'ml', label: '机器学习', icon: '🤖' },
  { key: 'visualization', label: '数据可视化', icon: '📊' },
  { key: 'web', label: 'Web 技术', icon: '🌐' },
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const filteredTech = activeCategory === 'all' ? techStack : techStack.filter((t) => t.category === activeCategory);

  return (
    <SectionWrapper id="tech-stack" title="技术栈" subtitle="支撑本项目的完整技术生态系统——从数据处理到交互式可视化">
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === 'all' ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-surface-2 text-slate-400 border border-border/30 hover:text-white hover:border-slate-600'}`}>
          全部技术
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat.key ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-surface-2 text-slate-400 border border-border/30 hover:text-white hover:border-slate-600'}`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTech.map((tech, i) => (
          <motion.div key={tech.name} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
            <AnimatedCard delay={i * 0.05}>
              <div className="text-center">
                <div className="text-3xl mb-3">{tech.icon}</div>
                <h4 className="text-sm font-semibold text-white mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{tech.description}</p>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
