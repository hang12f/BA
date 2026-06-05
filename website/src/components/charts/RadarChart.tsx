import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { theme } from '../../theme';

interface RadarChartProps {
  indicators: { name: string; max: number }[];
  series: { name: string; values: number[]; color?: string }[];
  height?: number;
  className?: string;
  chartRef?: React.Ref<ReactEChartsCore>;
}

export default function RadarChart({ indicators, series, height = 400, className = '', chartRef }: RadarChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
    },
    legend: {
      data: series.map(s => s.name),
      bottom: 0,
      textStyle: { color: '#94A3B8', fontSize: 12 },
      itemGap: 20,
    },
    radar: {
      center: ['50%', '45%'],
      radius: '65%',
      indicator: indicators,
      axisName: { color: '#94A3B8', fontSize: 11 },
      splitArea: {
        areaStyle: { color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)'] },
      },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    series: series.map((s, i) => ({
      type: 'radar',
      name: s.name,
      data: [{ value: s.values, name: s.name }],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, color: s.color || theme.chartColors[i] },
      itemStyle: { color: s.color || theme.chartColors[i] },
      areaStyle: { color: s.color || theme.chartColors[i], opacity: 0.1 },
    })),
  };

  return (
    <div className={className}>
      <ReactEChartsCore
        ref={chartRef}
        echarts={echarts}
        option={option}
        style={{ height }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
