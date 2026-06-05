import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface SectionWrapperProps {
  id: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
  dark?: boolean;
}

export default function SectionWrapper({
  id,
  title,
  subtitle,
  className = '',
  children,
  dark = false,
}: SectionWrapperProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id={id}
      ref={ref}
      className={`section-padding relative ${dark ? 'bg-surface/50' : ''} ${className}`}
    >
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <div className="container-custom relative z-10">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-16 md:mb-20"
          >
            {title && (
              <h2 className="section-heading">
                <span className="text-gradient">{title}</span>
              </h2>
            )}
            {subtitle && <p className="section-subheading mx-auto">{subtitle}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
