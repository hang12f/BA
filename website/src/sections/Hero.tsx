import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StatCard from '../components/ui/StatCard';
import ScrollIndicator from '../components/ui/ScrollIndicator';
import { projectStats } from '../data';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      <div className="absolute inset-0 bg-hero-grad" />
      <motion.div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" style={{ y }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <motion.div style={{ opacity }} className="relative z-10 container-custom text-center py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            数据分析作品集展示
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          <span className="bg-clip-text text-transparent bg-primary-grad">英国航空</span>
          <br />
          <span className="text-slate-900">客户反馈数据分析</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-4 text-balance">
          基于 <span className="text-primary-light font-semibold">Apache PySpark</span> 的端到端大数据分析项目
          ——从数据预处理、探索性分析到机器学习建模与商业智能洞察
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.72 }}
          className="text-slate-700 text-base md:text-lg font-medium mb-2 tracking-wide">
          项目负责人：翁又晴 &nbsp;·&nbsp; 项子航
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
          className="text-slate-500 text-sm md:text-base mb-12">
          9 个分析模块 · 4 种机器学习模型 · 交互式可视化 · 10 年数据跨度
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {projectStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} decimals={stat.decimals} suffix={stat.suffix} description={stat.description} accent />
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      <ScrollIndicator />
    </section>
  );
}
