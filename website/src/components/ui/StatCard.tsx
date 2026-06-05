import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  description?: string;
  accent?: boolean;
}

function useCountUp(end: number, isInView: boolean, duration = 1500, decimals = 0) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(end * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, isInView, duration]);

  return decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();
}

export default function StatCard({
  label,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  description,
  accent = false,
}: StatCardProps) {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const displayValue = useCountUp(value, isInView, 1500, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center p-6"
    >
      <div
        className={`text-3xl md:text-4xl lg:text-5xl font-bold data-number mb-2 ${
          accent ? 'text-gradient' : 'text-white'
        }`}
      >
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-slate-400 text-sm md:text-base font-medium">{label}</div>
      {description && (
        <div className="text-slate-500 text-xs mt-1">{description}</div>
      )}
    </motion.div>
  );
}
