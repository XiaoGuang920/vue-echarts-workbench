import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

/**
 * Default Tooltip Formatter
 */
export class DefaultTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void isDark
    void chartOptions

    return (params: CallbackDataParams) => {
      void params
      return ''
    }
  }
}
