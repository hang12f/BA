import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

interface HeatmapDataPoint {
  value: [number, number, number];
}

interface HeatmapChartProps {
  xLabels: string[];
  yLabels: string[];
  data: number[][];
  height?: number;
  className?: string;
  min?: number;
  max?: number;
  name?: string;
}

export default function HeatmapChart({
  xLabels, yLabels, data, height = 400, className = '', min = 1, max = 10, name = 'Value',
}: HeatmapChartProps) {
  const seriesData: HeatmapDataPoint[] = [];
  let actualMin = Infinity;
  let actualMax = -Infinity;

  data.forEach((row, y) => {
    row.forEach((val, x) => {
      seriesData.push({ value: [x, y, val] });
      actualMin = Math.min(actualMin, val);
      actualMax = Math.max(actualMax, val);
    });
  });

  const option: EChartsOption = {
    tooltip: {
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
      formatter: (params: unknown) => {
        const p = params as { value: number[] };
        const [x, y, v] = p.value;
        return `${xLabels[x]} × ${yLabels[y]}<br/>${name}: <b>${v?.toFixed(1)}</b>`;
      },
    },
    grid: { left: '10%', right: '5%', bottom: '8%', top: '5%' },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } },
      splitArea: { show: false },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { show: false },
      splitArea: { show: false },
    },
    visualMap: {
      min: min || actualMin,
      max: max || actualMax,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['#EF4444', '#F59E0B', '#FDE68A', '#A7F3D0', '#10B981'],
      },
      textStyle: { color: '#94A3B8', fontSize: 10 },
    },
    series: [{
      type: 'heatmap',
      data: seriesData,
      label: {
        show: true,
        color: '#94A3B8',
        fontSize: 10,
        formatter: (p: unknown) => (p as { value: number[] }).value[2]?.toFixed(1),
      },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
      itemStyle: { borderColor: 'rgba(15, 23, 42, 0.8)', borderWidth: 2 },
    }],
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
