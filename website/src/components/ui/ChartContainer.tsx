import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  className?: string;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  height = 400,
  className = '',
}: ChartContainerProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`bg-surface/60 border border-border/30 rounded-2xl p-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h4 className="text-lg font-semibold text-slate-200">{title}</h4>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      <div style={{ height }}>{children}</div>
    </motion.div>
  );
}
