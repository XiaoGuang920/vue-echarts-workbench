import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '@/utils/colorManager'

/**
 * Bubble Chart Tooltip Formatter
 */
export class BubbleChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let xValue = '無資料'
      let yValue = '無資料'

      if (Array.isArray(params.value)) {
        // 數據格式：[x, y, size]
        const bubbleData = params.value as number[]
        xValue = bubbleData[0] !== undefined ? bubbleData[0].toLocaleString() : '無資料'
        yValue = bubbleData[1] !== undefined ? bubbleData[1].toLocaleString() : '無資料'
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        // 數據格式：{value: [x, y, size], name: string}
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const bubbleData = dataObj.value as number[]
          xValue = bubbleData[0] !== undefined ? bubbleData[0].toLocaleString() : '無資料'
          yValue = bubbleData[1] !== undefined ? bubbleData[1].toLocaleString() : '無資料'
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || 'X 軸'
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || 'Y 軸'
        : chartOptions?.yAxis?.name || 'Y 軸'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 180px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
            background-color: ${color};
          "></div>
          <span style="
            color: ${tooltipColors.lightText};
            font-weight: 500;
          ">
            ${seriesName}
          </span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 4px 0 0 0;
          border-top: 1px solid ${tooltipColors.border};
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
              ${xValue}
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
              ${yValue}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }
}
