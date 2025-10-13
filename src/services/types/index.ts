import type { ExtendedEChartsOption } from '@/types/echarts'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

export interface ChartTransformer {
  transform(chart: ExtendedEChartsOption): Promise<ExtendedEChartsOption>
}

export interface TransformResult {
  success: boolean
  msg: string
  data: ExtendedEChartsOption
}

export interface TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string

  detailFormat?(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string
}
