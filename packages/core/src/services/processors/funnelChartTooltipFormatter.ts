import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '../../utils/colorManager'

/**
 * Funnel Chart Tooltip Formatter
 */
export class FunnelChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      // 處理漏斗圖數據
      let name = '未知'
      let value = '無資料'
      let percent = '0%'

      if (params.name) {
        name = params.name
      }

      // 處理數值
      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          }
        }
      }

      // 計算百分比
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

      // 獲取顏色
      const color = params.color || '#FFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
      ">
        <div style="margin-bottom: 8px;">
          <div style="display: flex; align-items: center;">
            <div style="
              width: 12px;
              height: 8px;
              margin-right: 8px;
              background: linear-gradient(45deg, ${color}, ${color}80);
              clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
            "></div>
            <span style="
              font-size: 12px;
              color: ${tooltipColors.darkText};
              font-weight: 600;
            ">
              ${name}
            </span>
          </div>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
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
