import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Theme River Chart JSON Transformer
 */
export class ThemeRiverChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    let uniqueNamesCount = 0

    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s: unknown, index: number) => {
        const series = s as Record<string, unknown>
        const data = series.data

        if (!data || (Array.isArray(data) && data.length === 0)) return undefined

        if (Array.isArray(data)) {
          const uniqueNames = new Set<string>()
          data.forEach((item: unknown) => {
            if (Array.isArray(item) && item.length >= 3) {
              uniqueNames.add(String(item[2]))
            }
          })
          uniqueNamesCount = uniqueNames.size
        }

        const name = (series.name as string) || `Theme River ${index + 1}`
        const labelObj = (series.label || {}) as Record<string, unknown>
        const itemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyleObj = (emphasisObj.itemStyle || {}) as Record<string, unknown>

        return {
          type: 'themeRiver' as const,
          name,
          data,
          label: {
            show: true,
            fontSize: 12,
            fontFamily: 'sans-serif',
            color: themeColors.text,
            ...labelObj,
          },
          itemStyle: {
            ...itemStyleObj,
          },
          emphasis: {
            ...emphasisObj,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: themeColors.shadow,
              ...emphasisItemStyleObj,
            },
          },
          ...series,
        }
      })
      .filter(s => s !== null)

    const defaultColors = chartColors.slice(0, uniqueNamesCount)

    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const singleAxisObj = Array.isArray(input.singleAxis)
      ? input.singleAxis[0] || {}
      : input.singleAxis || {}
    const singleAxisLabelObj = (singleAxisObj.axisLabel || {}) as Record<string, unknown>
    const singleAxisLineObj = (singleAxisObj.axisLine || {}) as Record<string, unknown>
    const singleAxisLineStyleObj = (singleAxisLineObj.lineStyle || {}) as Record<string, unknown>

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    return {
      gridWidth: 4,
      gridHeight: 4,
      gridX: 0,
      gridY: 0,
      color: defaultColors as unknown as string,
      series: series as unknown,
      title: {
        text: 'Theme River Chart',
        left: 'center',
        top: 20,
        textStyle: {
          fontFamily: 'sans-serif',
          fontSize: 18,
          fontWeight: 'bold',
          color: themeColors.text,
          ...titleTextStyleObj,
        },
        ...titleObj,
      },
      legend: {
        show: true,
        left: 'center',
        bottom: 5,
        textStyle: {
          fontFamily: 'sans-serif',
          color: themeColors.text,
          ...legendTextStyleObj,
        },
        ...legendObj,
      },
      singleAxis: {
        type: 'time' as const,
        axisLabel: {
          color: themeColors.text,
          ...singleAxisLabelObj,
        },
        axisLine: {
          lineStyle: {
            color: themeColors.axis,
            ...singleAxisLineStyleObj,
          },
          ...singleAxisLineObj,
        },
        ...singleAxisObj,
      },
      toolbox: {
        show: true,
        orient: 'horizontal' as const,
        right: 0,
        top: 0,
        feature: {
          saveAsImage: {
            show: true,
            title: '儲存圖片',
            type: 'png' as const,
            backgroundColor: 'white',
            ...saveAsImageObj,
          },
          ...toolboxFeatureObj,
        },
        ...toolboxObj,
      },
      ...input,
    } as unknown as ExtendedEChartsOption
  }
}
