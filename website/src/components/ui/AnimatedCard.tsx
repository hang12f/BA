import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  hover = true,
  glow = false,
  onClick,
}: AnimatedCardProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`
        bg-card-grad border border-border/40 rounded-2xl p-6
        ${hover ? 'card-hover' : ''}
        ${glow ? 'glow-border' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
