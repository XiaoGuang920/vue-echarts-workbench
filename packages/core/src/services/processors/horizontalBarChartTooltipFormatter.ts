import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts'

import { ColorManager } from '../../utils/colorManager'

/**
 * Horizontal Bar Chart Tooltip Formatter
 */
export class HorizontalBarChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let seriesName = ''

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 處理多維數據 [category, value] 或其他格式
          const barData = params.value as number[]
          if (barData.length >= 2) {
            value = barData[1].toLocaleString()
          } else if (barData.length === 1) {
            value = barData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const barData = dataObj.value as number[]
            value = barData[barData.length - 1]?.toLocaleString() || '無資料'
          }
        }
      }

      const xAxis = chartOptions?.xAxis as XAXisComponentOption | undefined
      const xAxisName = xAxis?.name || '' // 數值軸

      const yAxis = chartOptions?.yAxis
      let yAxisName = '' // 分類軸
      if (Array.isArray(yAxis) && yAxis.length > 0) {
        yAxisName = (yAxis[0] as YAXisComponentOption)?.name || ''
      } else if (yAxis) {
        yAxisName = (yAxis as YAXisComponentOption)?.name || ''
      }

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
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 13px;">${name}</span>
        </div>

        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 8px;
                height: 12px;
                border-radius: 2px;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
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
            yAxisName
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
                ${yAxisName}:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${name}
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
              ${xAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
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
