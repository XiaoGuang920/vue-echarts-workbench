import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts'

import { ColorManager } from '../../utils/colorManager'

/**
 * Heatmap Chart Tooltip Formatter
 */
export class HeatmapChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let xLabel = '未知'
      let yLabel = '未知'
      let value = '無資料'

      if (Array.isArray(params.value)) {
        // 數據格式：[xIndex, yIndex, value]
        const heatmapData = params.value as [number, number, number]
        const xIndex = heatmapData[0]
        const yIndex = heatmapData[1]
        const dataValue = heatmapData[2]

        // 從軸配置中獲取標籤
        const xAxis = chartOptions?.xAxis as XAXisComponentOption | undefined
        const yAxis = chartOptions?.yAxis as YAXisComponentOption | undefined

        const xAxisData = (xAxis as unknown as { data?: string[] })?.data
        const yAxisData = (yAxis as unknown as { data?: string[] })?.data

        xLabel = xAxisData?.[xIndex] || `X${xIndex}`
        yLabel = yAxisData?.[yIndex] || `Y${yIndex}`
        value =
          dataValue !== undefined && dataValue !== null ? dataValue.toLocaleString() : '無資料'
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        // 數據格式：{value: [xIndex, yIndex, value], ...}
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const heatmapData = dataObj.value as [number, number, number]
          const xIndex = heatmapData[0]
          const yIndex = heatmapData[1]
          const dataValue = heatmapData[2]

          const xAxis = chartOptions?.xAxis as XAXisComponentOption | undefined
          const yAxis = chartOptions?.yAxis as YAXisComponentOption | undefined

          const xAxisData = (xAxis as unknown as { data?: string[] })?.data
          const yAxisData = (yAxis as unknown as { data?: string[] })?.data

          xLabel = xAxisData?.[xIndex] || `X${xIndex}`
          yLabel = yAxisData?.[yIndex] || `Y${yIndex}`
          value =
            dataValue !== undefined && dataValue !== null ? dataValue.toLocaleString() : '無資料'
        }
      }

      const xAxis = chartOptions?.xAxis as XAXisComponentOption | undefined
      const yAxis = chartOptions?.yAxis as YAXisComponentOption | undefined
      const xAxisName = xAxis?.name || 'X 軸'
      const yAxisName = yAxis?.name || 'Y 軸'

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
      ">
        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${xAxisName}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${xLabel}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${yLabel}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 4px;
            border-top: 1px solid ${tooltipColors.border}40;
          ">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 6px;
                background-color: ${color};
                border: 1px solid ${tooltipColors.border};
              "></div>
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
              ">
                數值:
              </span>
            </div>
            <span style="
              color: ${color};
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }
}
