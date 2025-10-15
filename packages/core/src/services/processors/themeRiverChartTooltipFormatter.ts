import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '../../utils/colorManager'

/**
 * Theme River Chart Tooltip Formatter
 */
export class ThemeRiverChartTooltipFormatter implements TooltipFormatter {
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

  detailFormat(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      let dateValue = '未知時間'
      if (paramsArray[0] && Array.isArray(paramsArray[0].value)) {
        const themeRiverData = paramsArray[0].value as [string, number, string]
        dateValue = themeRiverData[0] || '未知時間'
      }

      const seriesData = paramsArray
        .map(param => {
          let themeName = '未知主題'
          let value = 0
          let displayValue = '無資料'
          const color = param.color || '#000'

          if (Array.isArray(param.value)) {
            // Theme River 數據格式：[date, value, name]
            const themeRiverData = param.value as [string, number, string]
            themeName = themeRiverData[2] || '未知主題'
            value = themeRiverData[1] || 0
            displayValue = value.toLocaleString()
          }

          return {
            themeName,
            value,
            displayValue,
            color,
            percentage: 0,
          }
        })
        .filter(item => item.value > 0)

      const totalValue = seriesData.reduce((sum, item) => sum + item.value, 0)

      seriesData.forEach(item => {
        item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
      })

      seriesData.sort((a, b) => b.value - a.value)

      const themeRows = seriesData
        .map((item, index) => {
          const isLargest = index === 0
          const barWidth = totalValue > 0 ? (item.value / totalValue) * 100 : 0

          return `
        <div style="
          margin: 6px 0;
          padding: 8px;
          border-radius: 6px;
          background: ${item.color}08;
          ${isLargest ? `border: 1px solid ${item.color}40; box-shadow: 0 2px 4px ${item.color}20;` : ''}
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          ">
            <div style="display: flex; align-items: center; flex: 1;">
              <div style="
                width: 14px;
                height: 10px;
                border-radius: 2px;
                background-color: ${item.color};
                margin-right: 8px;
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
              <span style="
                font-size: 12px;
                color: ${tooltipColors.darkText};
                font-weight: 600;
              ">
                ${item.themeName}
                ${isLargest ? '<span style="color: ' + item.color + '; font-size: 10px; margin-left: 4px;">⭐</span>' : ''}
              </span>
            </div>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 12px;
            ">
              ${item.displayValue}
            </span>
            <span style="
              font-size: 10px;
              color: ${tooltipColors.lightText};
              opacity: 0.7;
              margin-left: 8px;
            ">
              (${item.percentage.toFixed(1)}%)
            </span>
          </div>

          <!-- 進度條 -->
          <div style="
            height: 4px;
            background: ${tooltipColors.border}20;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 4px;
          ">
            <div style="
              height: 100%;
              width: ${barWidth}%;
              background: linear-gradient(90deg, ${item.color}, ${item.color}80);
              border-radius: 2px;
              transition: width 0.3s ease;
            "></div>
          </div>
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
        min-width: 260px;
      ">
        <!-- 標題區域 -->
        <div style="
          font-weight: bold;
          margin-bottom: 10px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 8px;
        ">
          <div style="display: flex; align-items: center;">
            <div style="
              width: 4px;
              height: 16px;
              background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
              border-radius: 2px;
              margin-right: 8px;
            "></div>
            <span style="font-size: 14px;">${dateValue}</span>
          </div>
        </div>

        <!-- 主題列表 -->
        <div style="
          max-height: 320px;
          overflow-y: auto;
          margin-top: 8px;
        ">
          ${themeRows}
        </div>
      </div>
    `
    }
  }
}
