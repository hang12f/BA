import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { theme } from '../../theme';

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  className?: string;
  radius?: [string, string];
  roseType?: boolean;
}

export default function PieChart({
  data, height = 400, className = '', radius = ['40%', '70%'], roseType = false,
}: PieChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1E293B',
      borderColor: '#1E3A5F',
      textStyle: { color: '#F1F5F9', fontSize: 13 },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#94A3B8', fontSize: 12 },
    },
    series: [{
      type: 'pie',
      radius,
      center: ['40%', '50%'],
      roseType: roseType ? 'radius' : undefined,
      itemStyle: { borderRadius: 4, borderColor: '#0A0E17', borderWidth: 2 },
      label: {
        color: '#94A3B8',
        fontSize: 11,
        formatter: '{b}\n{d}%',
      },
      emphasis: {
        label: { fontSize: 16, fontWeight: 'bold' },
        scaleSize: 8,
      },
      data: data.map((d, i) => ({
        ...d,
        itemStyle: { color: theme.chartColors[i % theme.chartColors.length] },
      })),
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
