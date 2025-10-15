import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import type { XAXisComponentOption, YAXisComponentOption } from 'echarts'

import { ColorManager } from '../../utils/colorManager'

/**
 * Line Chart Tooltip Formatter
 */
export class LineChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    console.log(ColorManager.getTooltipColors(isDark))
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
          // 處理多維數據 [x, y] 或 [timestamp, value]
          const lineData = params.value as number[]
          if (lineData.length >= 2) {
            value = lineData[1].toLocaleString()
          } else if (lineData.length === 1) {
            value = lineData[0].toLocaleString()
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
            const lineData = dataObj.value as number[]
            value = lineData[lineData.length - 1]?.toLocaleString() || '無資料'
          }
        }
      }

      const xAxis = chartOptions?.xAxis as XAXisComponentOption | undefined
      const xAxisName = xAxis?.name || ''

      const yAxis = chartOptions?.yAxis
      let yAxisName = ''
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
            max-width: 240px;
          ">
          ${tooltipColors.background}
            ${
              seriesName
                ? `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; align-items: center;">
                  <div style="
                    width: 16px;
                    height: 2px;
                    border-radius: 1px;
                    margin-right: 8px;
                    background-color: ${color};
                    position: relative;
                  ">
                    <div style="
                      width: 4px;
                      height: 4px;
                      border-radius: 50%;
                      background-color: ${color};
                      position: absolute;
                      right: -2px;
                      top: -1px;
                    "></div>
                  </div>
                  <span style="
                    font-size: 14px;
                    color: ${tooltipColors.lightText};
                    font-weight: bold;
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
              border-top: 1px solid ${tooltipColors.border};
              padding-top: 8px;
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
                  ${xAxisName || '數值'}:
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
                  ${value}
                </span>
              </div>
            </div>
          </div>
        `
    }
  }
}
