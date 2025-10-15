import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '../../utils/colorManager'

/**
 * Candlestick Chart Tooltip Formatter
 */
export class CandlestickChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const statusColors = ColorManager.getStatusColors()
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let seriesName = ''
      let openPrice = '無資料'
      let closePrice = '無資料'
      let highPrice = '無資料'
      let lowPrice = '無資料'
      let change = '0'
      let changePercent = '0.00%'

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      // [index, 開盤, 最高, 最低, 收盤]
      if (Array.isArray(params.value)) {
        const candlestickData = params.value as number[]
        if (candlestickData.length >= 4) {
          const open = candlestickData[1] // 開盤價
          const close = candlestickData[2] // 收盤價
          const high = candlestickData[3] // 最高價
          const low = candlestickData[4] // 最低價

          openPrice = open?.toFixed(2) || '無資料'
          highPrice = high?.toFixed(2) || '無資料'
          lowPrice = low?.toFixed(2) || '無資料'
          closePrice = close?.toFixed(2) || '無資料'

          // 計算漲跌 - 收盤價 vs 開盤價
          if (open && close) {
            const changeValue = close - open
            change = changeValue >= 0 ? `+${changeValue.toFixed(2)}` : changeValue.toFixed(2)
            changePercent =
              changeValue >= 0
                ? `+${((changeValue / open) * 100).toFixed(2)}%`
                : `${((changeValue / open) * 100).toFixed(2)}%`
          }
        }
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const candlestickData = dataObj.value as number[]
          if (candlestickData.length >= 4) {
            const open = candlestickData[1]
            const close = candlestickData[2]
            const high = candlestickData[3]
            const low = candlestickData[4]

            openPrice = open?.toFixed(2) || '無資料'
            highPrice = high?.toFixed(2) || '無資料'
            lowPrice = low?.toFixed(2) || '無資料'
            closePrice = close?.toFixed(2) || '無資料'

            if (open && close) {
              const changeValue = close - open
              change = changeValue >= 0 ? `+${changeValue.toFixed(2)}` : changeValue.toFixed(2)
              changePercent =
                changeValue >= 0
                  ? `+${((changeValue / open) * 100).toFixed(2)}%`
                  : `${((changeValue / open) * 100).toFixed(2)}%`
            }
          }
        }
      }

      const changeValue = parseFloat(change.replace('+', ''))
      const isRise = changeValue >= 0
      const trendColor = isRise ? statusColors.success : statusColors.error
      const trendIcon = isRise ? '▲' : '▼'
      const trendText = isRise ? '上漲' : '下跌'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        max-width: 240px;
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
          <span style="
            font-size: 10px;
            font-weight: normal;
            color: ${trendColor};
            background: ${trendColor}15;
            border: 1px solid ${trendColor}40;
            padding: 2px 6px;
            border-radius: 10px;
          ">${trendText}</span>
        </div>

        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 12px;
                height: 8px;
                border: 1px solid ${trendColor};
                margin-right: 8px;
                background-color: ${trendColor};
                position: relative;
              ">
                <div style="
                  width: 1px;
                  height: 14px;
                  background-color: ${trendColor};
                  position: absolute;
                  left: 50%;
                  top: -2px;
                  transform: translateX(-50%);
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
          padding: 8px 0;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            padding: 4px;
            background: ${trendColor}10;
            border-radius: 4px;
          ">
            <span style="
              color: ${trendColor};
              font-size: 12px;
              font-weight: bold;
              display: flex;
              align-items: center;
            ">
              ${trendIcon} ${change}
            </span>
            <span style="
              color: ${trendColor};
              font-size: 11px;
              font-weight: bold;
            ">
              ${changePercent}
            </span>
          </div>

          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 12px;
            padding-top: 4px;
            border-top: 1px solid ${tooltipColors.border}40;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                開盤:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 11px;
                font-weight: bold;
              ">
                ${openPrice}
              </span>
            </div>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                收盤:
              </span>
              <span style="
                color: ${trendColor};
                font-size: 11px;
                font-weight: bold;
              ">
                ${closePrice}
              </span>
            </div>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                最高:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 11px;
                font-weight: bold;
              ">
                ${highPrice}
              </span>
            </div>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                最低:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 11px;
                font-weight: bold;
              ">
                ${lowPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    `
    }
  }
}
