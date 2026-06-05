// Design tokens for consistent theming across the site
export const theme = {
  colors: {
    background: '#0A0E17',
    surface: '#111827',
    surface2: '#1E293B',
    border: '#1E3A5F',
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    secondary: '#06B6D4',
    accent: '#8B5CF6',
    highlight: '#F59E0B',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },

  // ECharts dark theme configuration
  echartsDark: {
    textStyle: { color: '#94A3B8' },
    backgroundColor: 'transparent',
    title: { textStyle: { color: '#F1F5F9' } },
    legend: { textStyle: { color: '#94A3B8' } },
    tooltip: {
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9' },
    },
  },

  // ECharts color palette matching site theme
  chartColors: [
    '#3B82F6', // primary
    '#06B6D4', // secondary
    '#8B5CF6', // accent
    '#F59E0B', // highlight
    '#10B981', // success
    '#EF4444', // danger
    '#EC4899', // pink
    '#6366F1', // indigo
  ],
} as const;

export type Theme = typeof theme;
