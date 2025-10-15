import type { ExtendedEChartsOption } from '../../types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import type { RadarComponentOption } from 'echarts'

import { ColorManager } from '../../utils/colorManager'

/**
 * Radar Chart Tooltip Formatter
 */
export class RadarChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'

      if (params.name) {
        name = params.name
      }

      const radarOption = chartOptions?.radar as RadarComponentOption | undefined
      const indicators = radarOption?.indicator || []

      let dataValues: number[] = []
      if (Array.isArray(params.value)) {
        dataValues = params.value as number[]
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          dataValues = dataObj.value as number[]
        }
      }

      const radarData = indicators.map(
        (indicator: { name?: string; max?: number }, index: number) => ({
          name: indicator.name || `維度 ${index + 1}`,
          value: dataValues[index] !== undefined ? dataValues[index] : 0,
          max: indicator.max || 100,
          displayValue:
            dataValues[index] !== undefined ? dataValues[index].toLocaleString() : '無資料',
        })
      )

      const color = params.color || '#FFFFFF'

      const validValues = dataValues.filter(v => v !== undefined && v !== null)
      const averageValue =
        validValues.length > 0
          ? (validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(1)
          : '0'

      const dataRows = radarData
        .map((item: { name: string; displayValue: string; value: number; max: number }) => {
          const percentage = item.max > 0 ? ((item.value / item.max) * 100).toFixed(0) : '0'
          return `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 3px 0;
              padding: 2px 0;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 60px;
                flex: 1;
              ">
                ${item.name}
              </span>
              <div style="
                display: flex;
                align-items: center;
                margin-left: 8px;
              ">
                <span style="
                  color: ${tooltipColors.darkText};
                  font-size: 12px;
                  font-weight: bold;
                  margin-right: 4px;
                ">
                  ${item.displayValue}
                </span>
                <span style="
                  color: ${tooltipColors.lightText};
                  font-size: 10px;
                  opacity: 0.7;
                ">
                  (${percentage}%)
                </span>
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
            width: 10px;
            height: 10px;
            border: 2px solid ${color};
            border-radius: 50%;
            margin-right: 8px;
            background-color: transparent;
            position: relative;
          ">
            <div style="
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: ${color};
              position: absolute;
              top: 1px;
              left: 1px;
            "></div>
          </div>
          <span style="font-size: 14px; font-weight: bold;">${name}</span>
        </div>

        <div style="
          padding: 8px 0;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${dataRows}
        </div>

        ${
          validValues.length > 0
            ? `
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 6px;
            border-top: 1px solid ${tooltipColors.border}40;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 10px;
              margin-right: 4px;
            ">
              平均值:
            </span>
            <span style="
              color: ${color};
              font-size: 11px;
              font-weight: bold;
            ">
              ${averageValue}
            </span>
          </div>
        `
            : ''
        }
      </div>
    `
    }
  }
}
