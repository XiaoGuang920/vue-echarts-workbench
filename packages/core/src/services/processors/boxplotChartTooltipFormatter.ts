import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '../../utils/colorManager'

/**
 * Boxplot Chart Tooltip Formatter
 */
export class BoxplotChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let categoryName = '未知'
      let min = '無資料'
      let q1 = '無資料'
      let median = '無資料'
      let q3 = '無資料'
      let max = '無資料'
      let iqr = '無資料'
      let range = '無資料'

      if (params.name) {
        categoryName = params.name
      }

      // 箱線圖數據格式：[min, Q1, median, Q3, max] 或 [x, min, Q1, median, Q3, max]
      if (Array.isArray(params.value)) {
        const boxplotData = params.value as number[]

        // 判斷是否包含 x 座標
        const hasXCoord = boxplotData.length === 6
        const offset = hasXCoord ? 1 : 0

        if (boxplotData.length >= 5 + offset) {
          const minValue = boxplotData[0 + offset]
          const q1Value = boxplotData[1 + offset]
          const medianValue = boxplotData[2 + offset]
          const q3Value = boxplotData[3 + offset]
          const maxValue = boxplotData[4 + offset]

          min = minValue?.toFixed(2) || '無資料'
          q1 = q1Value?.toFixed(2) || '無資料'
          median = medianValue?.toFixed(2) || '無資料'
          q3 = q3Value?.toFixed(2) || '無資料'
          max = maxValue?.toFixed(2) || '無資料'

          // 計算四分位距 (IQR = Q3 - Q1)
          if (q3Value !== undefined && q1Value !== undefined) {
            const iqrValue = q3Value - q1Value
            iqr = iqrValue.toFixed(2)
          }

          // 計算全距 (Range = Max - Min)
          if (maxValue !== undefined && minValue !== undefined) {
            const rangeValue = maxValue - minValue
            range = rangeValue.toFixed(2)
          }
        }
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const boxplotData = dataObj.value as number[]
          const hasXCoord = boxplotData.length === 6
          const offset = hasXCoord ? 1 : 0

          if (boxplotData.length >= 5 + offset) {
            const minValue = boxplotData[0 + offset]
            const q1Value = boxplotData[1 + offset]
            const medianValue = boxplotData[2 + offset]
            const q3Value = boxplotData[3 + offset]
            const maxValue = boxplotData[4 + offset]

            min = minValue?.toFixed(2) || '無資料'
            q1 = q1Value?.toFixed(2) || '無資料'
            median = medianValue?.toFixed(2) || '無資料'
            q3 = q3Value?.toFixed(2) || '無資料'
            max = maxValue?.toFixed(2) || '無資料'

            if (q3Value !== undefined && q1Value !== undefined) {
              const iqrValue = q3Value - q1Value
              iqr = iqrValue.toFixed(2)
            }

            if (maxValue !== undefined && minValue !== undefined) {
              const rangeValue = maxValue - minValue
              range = rangeValue.toFixed(2)
            }
          }
        }
      }

      const color = params.color || '#667eea'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 240px;
        max-width: 300px;
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
              background: linear-gradient(180deg, ${color} 0%, ${color}80 100%);
              border-radius: 2px;
              margin-right: 8px;
            "></div>
            <span style="font-size: 14px;">${categoryName}</span>
          </div>
        </div>

        <!-- 統計數據 -->
        <div style="
          display: flex;
          flex-direction: column;
          gap: 6px;
        ">
          <!-- 最大值 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${tooltipColors.border}05;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 8px;
                height: 1px;
                background: ${color};
                margin-right: 6px;
              "></span>
              最大值
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${max}
            </span>
          </div>

          <!-- Q3 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${color}08;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
            ">
              第三四分位數 (Q3)
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${q3}
            </span>
          </div>

          <!-- 中位數 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            border-radius: 4px;
            background: ${color}15;
            border: 1px solid ${color}40;
          ">
            <span style="
              color: ${color};
              font-size: 11px;
              font-weight: 600;
            ">
              中位數 (Median)
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
            ">
              ${median}
            </span>
          </div>

          <!-- Q1 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${color}08;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
            ">
              第一四分位數 (Q1)
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${q1}
            </span>
          </div>

          <!-- 最小值 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${tooltipColors.border}05;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 8px;
                height: 1px;
                background: ${color};
                margin-right: 6px;
              "></span>
              最小值
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${min}
            </span>
          </div>
        </div>

        <!-- 統計指標 -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          border-top: 1px solid ${tooltipColors.border}40;
        ">
          <div style="
            text-align: center;
            padding-top: 6px;
            background: ${tooltipColors.border}05;
            border-radius: 4px;
          ">
            <div style="
              font-size: 9px;
              color: ${tooltipColors.lightText};
              margin-bottom: 2px;
            ">
              四分位距 (IQR)
            </div>
            <div style="
              font-size: 12px;
              font-weight: bold;
              color: ${tooltipColors.darkText};
            ">
              ${iqr}
            </div>
          </div>

          <div style="
            text-align: center;
            padding-top: 6px;
            background: ${tooltipColors.border}05;
            border-radius: 4px;
          ">
            <div style="
              font-size: 9px;
              color: ${tooltipColors.lightText};
              margin-bottom: 2px;
            ">
              全距 (Range)
            </div>
            <div style="
              font-size: 12px;
              font-weight: bold;
              color: ${tooltipColors.darkText};
            ">
              ${range}
            </div>
          </div>
        </div>
      </div>
    `
    }
  }
}
