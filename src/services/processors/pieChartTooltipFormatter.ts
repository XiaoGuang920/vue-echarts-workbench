import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '@/utils/colorManager'

/**
 * Pie Chart Tooltip Formatter
 */
export class PieChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let percent = '0%'
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
          // 處理多維數據格式
          const pieData = params.value as number[]
          if (pieData.length >= 1) {
            value = pieData[0].toLocaleString()
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
            const pieData = dataObj.value as number[]
            value = pieData[0]?.toLocaleString() || '無資料'
          }
        }
      }

      if (params.percent !== undefined) {
        percent = `${params.percent.toFixed(1)}%`
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'percent' in params.data
      ) {
        const dataObj = params.data as { percent: unknown }
        if (typeof dataObj.percent === 'number') {
          percent = `${dataObj.percent.toFixed(1)}%`
        }
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
        max-width: 200px;
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
          seriesName && seriesName !== '圓餅圖'
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
              ">
                <div style="
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background-color: ${tooltipColors.background};
                  position: absolute;
                  top: 2px;
                  left: 2px;
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
              數值:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
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
              占比:
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${percent}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }
}
