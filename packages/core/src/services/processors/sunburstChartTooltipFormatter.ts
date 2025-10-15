import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import type { SeriesOption } from 'echarts'

import { ColorManager } from '../../utils/colorManager'

/**
 * Sunburst Chart Tooltip Formatter
 */
export class SunburstChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let percent = '-'

      if (params.name) {
        name = params.name
      }

      let currentValue = 0

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          currentValue = params.value
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          const sunburstData = params.value as number[]
          if (sunburstData.length >= 1) {
            currentValue = sunburstData[0]
            value = sunburstData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            currentValue = dataObj.value
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const sunburstData = dataObj.value as number[]
            if (sunburstData.length >= 1) {
              currentValue = sunburstData[0]
              value = sunburstData[0]?.toLocaleString() || '無資料'
            }
          }
        }
      }

      if (currentValue > 0) {
        try {
          const seriesArray = Array.isArray(chartOptions?.series)
            ? chartOptions.series
            : chartOptions?.series
              ? [chartOptions.series]
              : []
          const series = (seriesArray[params.seriesIndex || 0] as SeriesOption) || null
          if (series && 'data' in series && Array.isArray(series.data)) {
            const calculateTotalValue = (dataArray: Array<Record<string, unknown>>): number => {
              let total = 0

              for (const item of dataArray) {
                if (typeof item === 'object' && item !== null) {
                  if ('value' in item && typeof item.value === 'number') {
                    total += item.value
                  }

                  if ('children' in item && Array.isArray(item.children)) {
                    total += calculateTotalValue(item.children as Array<Record<string, unknown>>)
                  }
                }
              }

              return total
            }

            const totalValue = calculateTotalValue(series.data as Array<Record<string, unknown>>)

            if (totalValue > 0) {
              const percentValue = (currentValue / totalValue) * 100
              percent = `${percentValue.toFixed(1)}%`
            }
          }
        } catch (error) {
          console.warn('旭日圖占比計算失敗:', error)
          percent = '-'
        }
      } else {
        if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'children' in params.data &&
          Array.isArray(params.data.children)
        ) {
          try {
            const children = params.data.children as Array<Record<string, unknown>>
            let childrenTotal = 0

            for (const child of children) {
              if ('value' in child && typeof child.value === 'number') {
                childrenTotal += child.value
              }
            }

            if (childrenTotal > 0) {
              currentValue = childrenTotal
              value = childrenTotal.toLocaleString()

              const seriesArray = Array.isArray(chartOptions?.series)
                ? chartOptions.series
                : chartOptions?.series
                  ? [chartOptions.series]
                  : []
              const series = (seriesArray[params.seriesIndex || 0] as SeriesOption) || null
              if (series && 'data' in series && Array.isArray(series.data)) {
                const calculateTotalValue = (dataArray: Array<Record<string, unknown>>): number => {
                  let total = 0

                  for (const item of dataArray) {
                    if (typeof item === 'object' && item !== null) {
                      if ('value' in item && typeof item.value === 'number') {
                        total += item.value
                      }

                      if ('children' in item && Array.isArray(item.children)) {
                        total += calculateTotalValue(
                          item.children as Array<Record<string, unknown>>
                        )
                      }
                    }
                  }

                  return total
                }

                const totalValue = calculateTotalValue(
                  series.data as Array<Record<string, unknown>>
                )
                if (totalValue > 0) {
                  const percentValue = (childrenTotal / totalValue) * 100
                  percent = `${percentValue.toFixed(1)}%`
                }
              }
            }
          } catch (error) {
            console.warn('旭日圖子節點占比計算失敗:', error)
            percent = '-'
          }
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
        min-width: 180px;
        max-width: 260px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            background: conic-gradient(from 0deg, ${color}, ${color}80, ${color});
            position: relative;
            border: 1px solid ${color}40;
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
          <span style="font-size: 13px; font-weight: bold;">${name}</span>
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
