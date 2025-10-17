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

  detailFormat(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams | CallbackDataParams[]) => string {
    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      const xAxisName = paramsArray[0]?.name || '未知'

      const yAxis = chartOptions?.yAxis
      let yAxisLabel = 'Y 軸'
      if (Array.isArray(yAxis) && yAxis.length > 0) {
        yAxisLabel = (yAxis[0] as YAXisComponentOption)?.name || 'Y 軸'
      } else if (yAxis) {
        yAxisLabel = (yAxis as YAXisComponentOption)?.name || 'Y 軸'
      }

      const seriesData = paramsArray.map(param => {
        let value = '無資料'
        const seriesName = param.seriesName || '未知系列'
        const color = param.color || '#000'

        if (param.value !== null && param.value !== undefined) {
          if (typeof param.value === 'number') {
            value = param.value.toLocaleString()
          } else if (Array.isArray(param.value)) {
            const lineData = param.value as number[]
            if (lineData.length >= 2) {
              value = lineData[1].toLocaleString()
            } else if (lineData.length === 1) {
              value = lineData[0].toLocaleString()
            }
          } else if (
            typeof param.data === 'object' &&
            param.data !== null &&
            'value' in param.data
          ) {
            const dataObj = param.data as { value: unknown }
            if (typeof dataObj.value === 'number') {
              value = dataObj.value.toLocaleString()
            } else if (Array.isArray(dataObj.value)) {
              const lineData = dataObj.value as number[]
              value = lineData[lineData.length - 1]?.toLocaleString() || '無資料'
            }
          }
        }

        return {
          seriesName,
          value,
          color,
        }
      })

      const getLineIcon = (color: string) => `
        <div style="
          width: 16px;
          height: 2px;
          border-radius: 1px;
          background-color: ${color};
          position: relative;
          margin-right: 8px;
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
      `

      const seriesRows = seriesData
        .map(
          item => `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          padding: 4px 6px;
          border-radius: 4px;
          background: ${item.color}08;
        ">
          <div style="display: flex; align-items: center; flex: 1;">
            ${getLineIcon(item.color as string)}
            <span style="
              font-size: 12px;
              color: ${tooltipColors.lightText};
              font-weight: 500;
            ">
              ${item.seriesName}
            </span>
          </div>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 13px;
            font-weight: bold;
            margin-left: 12px;
          ">
            ${item.value}
          </span>
        </div>
      `
        )
        .join('')

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          max-width: 280px;
        ">
          <div style="
            font-weight: bold;
            margin-bottom: 8px;
            color: ${tooltipColors.darkText};
            display: flex;
            flex-direction: column;
            border-bottom: 2px solid ${tooltipColors.border};
            padding-bottom: 6px;
          ">
            <span style="font-size: 14px; margin-top: 2px; font-weight: bold;">${xAxisName}</span>
          </div>

          <div style="
            max-height: 300px;
            overflow-y: auto;
          ">
            <div style="
              font-size: 11px;
              color: ${tooltipColors.lightText};
              margin-bottom: 4px;
              font-weight: 500;
            ">
              ${yAxisLabel}
            </div>
            ${seriesRows}
          </div>
        </div>
      `
    }
  }
}
