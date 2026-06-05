import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { theme } from '../../theme';

interface BarChartProps {
  categories: string[];
  series: { name: string; data: number[]; color?: string }[];
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  className?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  onEvents?: Record<string, (params: unknown) => void>;
}

export default function BarChart({
  categories, series, height = 400, horizontal = false, stacked = false,
  className = '', yAxisLabel, xAxisLabel, onEvents,
}: BarChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: series.map(s => s.name),
      bottom: 0,
      textStyle: { color: '#94A3B8', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: series.length > 1 ? '15%' : '8%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: horizontal ? 'value' : 'category',
      data: horizontal ? undefined : categories,
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
      axisTick: { show: false },
      splitLine: { show: false },
      name: horizontal ? xAxisLabel : undefined,
      nameTextStyle: { color: '#94A3B8', fontSize: 11 },
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      data: horizontal ? categories : undefined,
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      name: horizontal ? undefined : yAxisLabel,
      nameTextStyle: { color: '#94A3B8', fontSize: 11 },
    },
    series: series.map((s, i) => ({
      type: 'bar',
      name: s.name,
      data: s.data,
      itemStyle: {
        color: s.color || theme.chartColors[i],
        borderRadius: [4, 4, 0, 0],
      },
      barWidth: '50%',
      stack: stacked ? 'total' : undefined,
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(59,130,246,0.3)' },
      },
    })),
  };

  return (
    <div className={className}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height }}
        opts={{ renderer: 'canvas' }}
        onEvents={onEvents}
      />
    </div>
  );
}
