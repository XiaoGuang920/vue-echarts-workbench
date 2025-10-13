import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '@/utils/colorManager'

/**
 * Map Chart Tooltip Formatter
 */
export class MapChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let regionName = '未知地區'
      let value = '無資料'
      let additionalInfo = ''

      if (params.name) {
        regionName = params.name
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 如果是數組格式 [經度, 緯度, 數值] 或 [數值, 其他資訊]
          const mapData = params.value as unknown[]
          if (mapData.length >= 1 && typeof mapData[0] === 'number') {
            value = mapData[0].toLocaleString()
          }
          if (mapData.length >= 2 && typeof mapData[1] === 'string') {
            additionalInfo = mapData[1]
          }
        } else if (typeof params.data === 'object' && params.data !== null) {
          const dataObj = params.data as Record<string, unknown>
          if ('value' in dataObj && typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          }
          if ('category' in dataObj && typeof dataObj.category === 'string') {
            additionalInfo = dataObj.category
          }
          if ('description' in dataObj && typeof dataObj.description === 'string') {
            additionalInfo = dataObj.description
          }
        }
      }

      const color = params.color || '#FFFF'

      const unit = chartOptions?.series?.[0]?.name || ''

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
          <span style="font-size: 12px; font-weight: bold;">${regionName}</span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 2px;
                margin-right: 6px;
                background-color: ${color};
                border: 1px solid ${tooltipColors.border}40;
              "></div>
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
              ">
                數值:
              </span>
            </div>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>

          ${
            unit
              ? `
            <div style="
              display: flex;
              justify-content: center;
              margin-top: 2px;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
                opacity: 0.8;
              ">
                單位: ${unit}
              </span>
            </div>
          `
              : ''
          }

          ${
            additionalInfo
              ? `
            <div style="
              margin-top: 4px;
              padding-top: 4px;
              border-top: 1px solid ${tooltipColors.border}40;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
                font-style: italic;
              ">
                ${additionalInfo}
              </span>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `
    }
  }
}
