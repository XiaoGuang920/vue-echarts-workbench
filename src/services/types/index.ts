import type { ExtendedEChartsOption } from '@/types/echarts'

export interface ChartTransformer {
  transform(chart: ExtendedEChartsOption): Promise<ExtendedEChartsOption>
}

export interface TransformResult {
  success: boolean
  msg: string
  data: ExtendedEChartsOption
}
