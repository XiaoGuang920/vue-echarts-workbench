import type { EChartsOption } from 'echarts'

import type {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  EffectScatterChart,
  RadarChart,
  HeatmapChart,
  FunnelChart,
  GaugeChart,
  MapChart,
  TreeChart,
  CandlestickChart,
  SunburstChart,
  GraphChart,
  SankeyChart,
  TreemapChart,
  ThemeRiverChart,
  ParallelChart,
  BoxplotChart,
} from 'echarts/charts'

// ECharts 模組聯合型別
export type EChartsModule =
  | typeof LineChart
  | typeof BarChart
  | typeof PieChart
  | typeof ScatterChart
  | typeof EffectScatterChart
  | typeof RadarChart
  | typeof HeatmapChart
  | typeof FunnelChart
  | typeof GaugeChart
  | typeof MapChart
  | typeof TreeChart
  | typeof CandlestickChart
  | typeof SunburstChart
  | typeof GraphChart
  | typeof SankeyChart
  | typeof TreemapChart
  | typeof ThemeRiverChart
  | typeof ParallelChart
  | typeof BoxplotChart

// 圖表選項介面
export interface ChartOption {
  use: () => Promise<EChartsModule[]>
}

export type ChartOptionsConfig = Record<string, ChartOption>

export type DashboardMetricTrend = { type: 'up' | 'down'; value: number; color: string }

export type DashboardMetric = {
  value: number
  icon: string
  color: string
  unit: string
  trend: DashboardMetricTrend
  description: string
}

export interface ExtendedEChartsOption
  extends Omit<EChartsOption, 'graphic'>,
    DashboardMetricTrend {
  chartType?: string
  gridX?: number
  gridY?: number
  gridWidth?: number
  gridHeight?: number
  label?: string
  tooltipType?: 'light' | 'dark'
  customTheme?: string

  graphic?: any

  [key: string]: any
}
