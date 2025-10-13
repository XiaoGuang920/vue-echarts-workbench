import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '@/utils/colorManager'

/**
 * Stacked Bar Chart Tooltip Formatter
 */
export class StackedBarChartTooltipFormatter implements TooltipFormatter {
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
          const stackedData = params.value as number[]
          if (stackedData.length >= 2) {
            value = stackedData[1].toLocaleString()
          } else if (stackedData.length === 1) {
            value = stackedData[0].toLocaleString()
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
            const stackedData = dataObj.value as number[]
            value = stackedData[stackedData.length - 1]?.toLocaleString() || '無資料'
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
                width: 12px;
                height: 8px;
                border-radius: 2px;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
                border: 1px solid ${color}40;
              ">
                <div style="
                  width: 8px;
                  height: 4px;
                  border-radius: 1px;
                  background-color: ${tooltipColors.background};
                  position: absolute;
                  top: 1px;
                  left: 1px;
                "></div>
              </div>
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
              ${yAxisName || '數值'}:
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

  detailFormat(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      const categoryName = paramsArray[0]?.name || '未知'

      const yAxisLabel = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || 'Y軸'
        : chartOptions?.yAxis?.name || 'Y軸'

      let totalValue = 0
      const seriesData = paramsArray.map(param => {
        let value = 0
        let displayValue = '無資料'
        const seriesName = param.seriesName || '未知系列'
        const color = param.color || '#000'

        if (param.value !== null && param.value !== undefined) {
          if (typeof param.value === 'number') {
            value = param.value
            displayValue = param.value.toLocaleString()
          } else if (Array.isArray(param.value)) {
            const stackedData = param.value as number[]
            if (stackedData.length >= 2) {
              value = stackedData[1]
              displayValue = stackedData[1].toLocaleString()
            } else if (stackedData.length === 1) {
              value = stackedData[0]
              displayValue = stackedData[0].toLocaleString()
            }
          } else if (
            typeof param.data === 'object' &&
            param.data !== null &&
            'value' in param.data
          ) {
            const dataObj = param.data as { value: unknown }
            if (typeof dataObj.value === 'number') {
              value = dataObj.value
              displayValue = dataObj.value.toLocaleString()
            } else if (Array.isArray(dataObj.value)) {
              const stackedData = dataObj.value as number[]
              value = stackedData[stackedData.length - 1] || 0
              displayValue = stackedData[stackedData.length - 1]?.toLocaleString() || '無資料'
            }
          }
        }

        totalValue += value

        return {
          seriesName,
          value,
          displayValue,
          color,
          percentage: 0, // 稍後計算
        }
      })

      // 計算每個系列的百分比
      seriesData.forEach(item => {
        item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
      })

      // 按數值排序（從大到小）
      seriesData.sort((a, b) => b.value - a.value)

      // 生成系列資訊的 HTML
      const seriesRows = seriesData
        .map((item, index) => {
          const isLargest = index === 0
          return `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          padding: 6px 8px;
          border-radius: 4px;
          background: ${item.color}08;
          ${isLargest ? `box-shadow: 0 2px 4px ${item.color}20;` : ''}
        ">
          <div style="display: flex; align-items: center; flex: 1;">
            <div style="
              width: 14px;
              height: 10px;
              border-radius: 2px;
              background-color: ${item.color};
              margin-right: 10px;
              position: relative;
            ">
              <div style="
                width: 10px;
                height: 6px;
                border-radius: 1px;
                background-color: ${tooltipColors.background};
                position: absolute;
                top: 1px;
                left: 1px;
              "></div>
            </div>
            <div style="flex: 1;">
              <div style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
                margin-bottom: 2px;
              ">
                ${item.seriesName}
                ${isLargest ? '<span style="color: ' + item.color + '; font-size: 10px;">⭐</span>' : ''}
              </div>

            </div>
          </div>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 14px;
            font-weight: bold;
            margin-left: 12px;
          ">
            ${item.displayValue}

            <div style="
              font-size: 10px;
              color: ${tooltipColors.lightText};
              opacity: 0.7;
            ">
              (${item.percentage.toFixed(1)}%)
            </div>
          </span>
        </div>
      `
        })
        .join('')

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 220px;
        max-width: 300px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 6px;
        ">
          <span style="font-size: 14px;">${categoryName}</span>
        </div>

        <div style="
          max-height: 280px;
          overflow-y: auto;
          margin: 8px 0;
        ">
          ${seriesRows}
        </div>

        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border}40;
          background: ${tooltipColors.border}10;
          padding: 6px 8px;
          border-radius: 4px;
          margin-top: 6px;
        ">
          <span style="
            color: ${tooltipColors.lightText};
            font-size: 11px;
            font-weight: 500;
          ">
            ${yAxisLabel} 總計:
          </span>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 14px;
            font-weight: bold;
          ">
            ${totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    `
    }
  }
}
