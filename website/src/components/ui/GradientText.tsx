interface GradientTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  className?: string;
  accent?: boolean;
}

export default function GradientText({
  children,
  as: Tag = 'span',
  className = '',
  accent = false,
}: GradientTextProps) {
  return (
    <Tag
      className={`bg-clip-text text-transparent ${
        accent ? 'bg-accent-grad' : 'bg-primary-grad'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
