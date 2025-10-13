import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '@/utils/colorManager'

/**
 * Scatter Chart Tooltip Formatter
 */
export class ScatterChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let value = '無資料'
      let xValue = '無資料'
      let yValue = '無資料'
      let seriesName = ''

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
          yValue = value // 單維數據時，將值作為 Y 值
        } else if (Array.isArray(params.value)) {
          // 處理二維數據 [x, y]
          const scatterData = params.value as number[]
          if (scatterData.length >= 2) {
            xValue = scatterData[0] !== undefined ? scatterData[0].toLocaleString() : '無資料'
            yValue = scatterData[1] !== undefined ? scatterData[1].toLocaleString() : '無資料'
            value = yValue // 主要顯示 Y 值
          } else if (scatterData.length === 1) {
            value = scatterData[0].toLocaleString()
            yValue = value
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
            yValue = value
          } else if (Array.isArray(dataObj.value)) {
            const scatterData = dataObj.value as number[]
            if (scatterData.length >= 2) {
              xValue = scatterData[0] !== undefined ? scatterData[0].toLocaleString() : '無資料'
              yValue = scatterData[1] !== undefined ? scatterData[1].toLocaleString() : '無資料'
              value = yValue
            } else if (scatterData.length === 1) {
              value = scatterData[0].toLocaleString()
              yValue = value
            }
          }
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || ''
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || ''
        : chartOptions?.yAxis?.name || ''

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 220px;
      ">
        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;
                background-color: ${color};
                box-shadow: 0 0 4px ${color}40;
              "></div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${
            xAxisName
              ? `
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
          `
              : ''
          }

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
              ${yAxisName || '數值'}:
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
