import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface ScatterSeries {
  name: string;
  data: [number, number][];
  color?: string;
  symbolSize?: number;
}

interface ScatterChartProps {
  series: ScatterSeries[];
  height?: number;
  className?: string;
  xAxisName?: string;
  yAxisName?: string;
}

export default function ScatterChart({
  series, height = 400, className = '', xAxisName, yAxisName,
}: ScatterChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
      formatter: (params: unknown) => {
        const p = params as { seriesName: string; value: number[] };
        return `${p.seriesName}<br/>${xAxisName || 'X'}: ${p.value[0]?.toFixed(4)}<br/>${yAxisName || 'Y'}: ${p.value[1]?.toFixed(4)}`;
      },
    },
    legend: {
      data: series.map(s => s.name),
      bottom: 0,
      textStyle: { color: '#94A3B8', fontSize: 12 },
    },
    grid: { left: '8%', right: '5%', bottom: '15%', top: '5%' },
    xAxis: {
      type: 'value',
      name: xAxisName,
      nameTextStyle: { color: '#94A3B8', fontSize: 12 },
      axisLabel: { color: '#94A3B8', fontSize: 11, formatter: (v: number) => v.toFixed(3) },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: '#94A3B8', fontSize: 12 },
      axisLabel: { color: '#94A3B8', fontSize: 11, formatter: (v: number) => v.toFixed(3) },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
    },
    series: series.map(s => ({
      type: 'scatter',
      name: s.name,
      data: s.data.map(([x, y]) => [x, y]),
      symbolSize: s.symbolSize || 12,
      itemStyle: {
        color: s.color,
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
      },
      emphasis: { scale: 1.4 },
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
