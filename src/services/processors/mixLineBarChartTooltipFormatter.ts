import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TooltipFormatter } from '../types'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

import { ColorManager } from '@/utils/colorManager'

/**
 * Mix Line and Bar Chart Tooltip Formatter
 */
export class MixLineBarChartTooltipFormatter implements TooltipFormatter {
  format(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const seriesType = params.seriesType || 'unknown'

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const iconStyle =
        seriesType === 'line'
          ? `
          width: 12px;
          height: 2px;
          border-radius: 1px;
          margin-right: 8px;
          background-color: ${color};
        `
          : `
          width: 10px;
          height: 10px;
          border-radius: 2px;
          margin-right: 8px;
          background-color: ${color};
        `

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          min-width: 180px;
        ">
          <div style="
            font-weight: bold;
            margin-bottom: 8px;
            color: ${tooltipColors.darkText};
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span>${name}</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; flex: 1;">
              <div style="${iconStyle}"></div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>

            <div style="text-align: right; margin-left: 12px;">
              <div style="
                font-size: 14px;
                font-weight: bold;
                color: ${tooltipColors.darkText};
              ">
                ${value}
              </div>
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
    void chartOptions

    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      const xAxisName = paramsArray[0]?.name || '未知'

      const seriesData = paramsArray.map(param => {
        let value = '無資料'
        const seriesName = param.seriesName || '未知系列'
        const seriesType = param.seriesType || 'unknown'
        const color = param.color || '#000'

        if (param.value !== null && param.value !== undefined) {
          if (typeof param.value === 'number') {
            value = param.value.toLocaleString()
          } else if (Array.isArray(param.value)) {
            const mixData = param.value as number[]
            if (mixData.length >= 2) {
              value = mixData[1].toLocaleString()
            } else if (mixData.length === 1) {
              value = mixData[0].toLocaleString()
            }
          } else if (
            typeof param.data === 'object' &&
            param.data !== null &&
            'value' in param.data
          ) {
            const dataObj = param.data as { value: unknown }
            if (typeof dataObj.value === 'number') {
              value = dataObj.value.toLocaleString()
            } else if (Array.isArray(dataObj.value)) {
              const mixData = dataObj.value as number[]
              value = mixData[mixData.length - 1]?.toLocaleString() || '無資料'
            }
          }
        }

        return {
          seriesName,
          seriesType,
          value,
          color,
        }
      })

      const lineData = seriesData.filter(item => item.seriesType === 'line')
      const barData = seriesData.filter(item => item.seriesType === 'bar')
      const otherData = seriesData.filter(item => !['line', 'bar'].includes(item.seriesType))

      const renderSeriesGroup = (
        title: string,
        data: typeof seriesData,
        iconType: 'line' | 'bar' | 'other'
      ) => {
        if (data.length === 0) return ''

        const getIcon = (color: string, type: 'line' | 'bar' | 'other') => {
          switch (type) {
            case 'line':
              return `
              <div style="
                width: 16px;
                height: 2px;
                border-radius: 1px;
                background-color: ${color};
                position: relative;
                margin-right: 8px;
              ">
                <div style="
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background-color: ${color};
                  position: absolute;
                  right: -2px;
                  top: -1px;
                "></div>
              </div>
            `
            case 'bar':
              return `
              <div style="
                width: 12px;
                height: 8px;
                border-radius: 2px;
                background-color: ${color};
                margin-right: 8px;
              "></div>
            `
            default:
              return `
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: ${color};
                margin-right: 8px;
              "></div>
            `
          }
        }

        const seriesRows = data
          .map(
            item => `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          padding: 4px 6px;
          border-radius: 4px;
          background: ${item.color}08;
        ">
          <div style="display: flex; align-items: center; flex: 1;">
            ${getIcon(item.color as string, iconType)}
            <span style="
              font-size: 12px;
              color: ${tooltipColors.lightText};
              font-weight: 500;
            ">
              ${item.seriesName}
            </span>
          </div>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 13px;
            font-weight: bold;
            margin-left: 12px;
          ">
            ${item.value}
          </span>
        </div>
      `
          )
          .join('')

        return `
        <div style="margin-top: 8px;">
          ${seriesRows}
        </div>
      `
      }

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
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 6px;
        ">
          <span style="font-size: 14px;">${xAxisName}</span>
        </div>

        <div style="
          max-height: 300px;
          overflow-y: auto;
        ">
          ${renderSeriesGroup('', lineData, 'line')}
          ${renderSeriesGroup('', barData, 'bar')}
          ${otherData.length > 0 ? renderSeriesGroup('', otherData, 'other') : ''}
        </div>
      </div>
    `
    }
  }
}
