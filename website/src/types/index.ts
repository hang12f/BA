// Analysis module metadata
export interface AnalysisModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  methodology: string;
  keyFindings: string[];
  chartTypes: ('radar' | 'bar' | 'line' | 'heatmap' | 'scatter' | 'pie')[];
  imageRef: string;
  tags: string[];
}

// Key statistic display
export interface ProjectStat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  description?: string;
}

// Technology stack item
export interface TechItem {
  name: string;
  category: 'big-data' | 'language' | 'ml' | 'visualization' | 'web';
  icon: string;
  description: string;
}

// Business insight card
export interface BusinessInsight {
  id: string;
  icon: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  color: string;
}

// ML model result
export interface MLModelResult {
  model: string;
  accuracy: number;
  f1: number;
  auc: number;
}

// Section props
export interface SectionProps {
  id: string;
  className?: string;
}

// Navigation item
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Chart option type (ECharts)
import type { EChartsOption } from 'echarts';
export type ChartOption = EChartsOption;
