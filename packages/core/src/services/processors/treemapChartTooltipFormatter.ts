import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import type { SeriesOption } from 'echarts'

import { ColorManager } from '../../utils/colorManager'

/**
 * Treemap Chart Tooltip Formatter
 */
export class TreemapChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let percent = '-'
      let parentInfo = ''

      if (params.name) {
        name = params.name
      }

      let currentValue = 0

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          currentValue = params.value
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          const treemapData = params.value as number[]
          if (treemapData.length >= 1) {
            currentValue = treemapData[0]
            value = treemapData[0].toLocaleString()
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

            const findNodeInfo = (
              dataArray: Array<Record<string, unknown>>,
              targetName: string,
              currentLevel: number = 1,
              parentName: string = ''
            ): { level: number; parent: string; parentValue?: number } => {
              for (const item of dataArray) {
                if (typeof item === 'object' && item !== null) {
                  if ('name' in item && item.name === targetName) {
                    let parentValue: number | undefined = undefined

                    if (currentLevel > 1) {
                      const parentData = dataArray.find(
                        p =>
                          typeof p === 'object' &&
                          p !== null &&
                          'children' in p &&
                          Array.isArray(p.children) &&
                          p.children.some(
                            child =>
                              typeof child === 'object' &&
                              child !== null &&
                              'name' in child &&
                              child.name === targetName
                          )
                      )
                      if (
                        parentData &&
                        'value' in parentData &&
                        typeof parentData.value === 'number'
                      ) {
                        parentValue = parentData.value
                      }
                    }

                    return {
                      level: currentLevel,
                      parent: parentName,
                      parentValue,
                    }
                  }

                  if ('children' in item && Array.isArray(item.children)) {
                    const result = findNodeInfo(
                      item.children as Array<Record<string, unknown>>,
                      targetName,
                      currentLevel + 1,
                      item.name as string
                    )
                    if (result.level > 0) return result
                  }
                }
              }
              return { level: 0, parent: '', parentValue: undefined }
            }

            const totalValue = calculateTotalValue(series.data as Array<Record<string, unknown>>)
            const nodeInfo = findNodeInfo(series.data as Array<Record<string, unknown>>, name)

            if (totalValue > 0) {
              const percentValue = (currentValue / totalValue) * 100
              percent = `${percentValue.toFixed(1)}%`
            }

            if (nodeInfo.parent) {
              parentInfo = nodeInfo.parent

              if (nodeInfo.level === 2 && nodeInfo.parentValue && nodeInfo.parentValue > 0) {
                const parentPercent = ((currentValue / nodeInfo.parentValue) * 100).toFixed(1)
                parentInfo += ` (${parentPercent}%)`
              }
            }
          }
        } catch (error) {
          console.warn('Treemap 層級計算失敗:', error)
          percent = '-'
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
        min-width: 200px;
        max-width: 280px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 6px;
        ">
          <div style="
            width: 14px;
            height: 10px;
            border-radius: 2px;
            margin-right: 8px;
            background: linear-gradient(135deg, ${color}, ${color}80);
            border: 1px solid ${color}60;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 6px;
              border-radius: 1px;
              background-color: ${tooltipColors.background};
              position: absolute;
              top: 1px;
              left: 2px;
            "></div>
          </div>
          <span style="font-size: 14px;">${name}</span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 8px;
        ">
          ${
            parentInfo
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
                所屬:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${parentInfo}
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
              全體占比:
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
