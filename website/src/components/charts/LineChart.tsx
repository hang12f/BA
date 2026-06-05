import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { theme } from '../../theme';

interface LineSeriesData {
  name: string;
  data: number[];
  color?: string;
  yAxisIndex?: number;
  areaStyle?: boolean;
}

interface LineChartProps {
  xAxisData: (string | number)[];
  series: LineSeriesData[];
  height?: number;
  className?: string;
  smooth?: boolean;
}

export default function LineChart({
  xAxisData, series, height = 400, className = '', smooth = true,
}: LineChartProps) {
  const useDualAxis = series.some(s => s.yAxisIndex === 1);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
    },
    legend: {
      data: series.map(s => s.name),
      bottom: 0,
      textStyle: { color: '#94A3B8', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: useDualAxis ? '8%' : '4%',
      bottom: '15%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
      axisTick: { show: false },
    },
    yAxis: series.some(s => s.yAxisIndex === 1) ? [
      {
        type: 'value',
        axisLabel: { color: '#94A3B8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      },
      {
        type: 'value',
        axisLabel: { color: '#94A3B8', fontSize: 11 },
        splitLine: { show: false },
      },
    ] : {
      type: 'value',
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    },
    series: series.map((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      yAxisIndex: s.yAxisIndex || 0,
      smooth,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2.5, color: s.color || theme.chartColors[i] },
      itemStyle: { color: s.color || theme.chartColors[i] },
      areaStyle: s.areaStyle ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: (s.color || theme.chartColors[i]) + '40' },
          { offset: 1, color: (s.color || theme.chartColors[i]) + '05' },
        ]),
      } : undefined,
    })),
  };

  return (
    <div className={className}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
