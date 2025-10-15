import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Pie Chart JSON Transformer
 */
export class PieChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    // Normalize series to array
    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s: unknown, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || seriesData.length === 0) return null

        const seriesItemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const seriesLabelObj = (series.label || {}) as Record<string, unknown>
        const seriesEmphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyleObj = (seriesEmphasisObj.itemStyle || {}) as Record<string, unknown>

        // Process data items
        const processedData = seriesData
          .map((dataItem: unknown, pieIndex: number) => {
            // Handle object data items
            if (
              typeof dataItem === 'object' &&
              dataItem !== null &&
              !Array.isArray(dataItem) &&
              !(dataItem instanceof Date)
            ) {
              const pieDataItem = dataItem as Record<string, unknown>
              const dataItemStyleObj = (pieDataItem.itemStyle || {}) as Record<string, unknown>

              const seriesColor =
                (dataItemStyleObj.color as string) || chartColors[pieIndex % chartColors.length]

              return {
                ...pieDataItem,
                name: (pieDataItem.name as string) || `Bar ${pieIndex + 1}`,
                value: (pieDataItem.value as number) ?? 0,
                itemStyle: {
                  ...dataItemStyleObj,
                  color: (dataItemStyleObj.color as string) || seriesColor,
                },
              }
            }

            // Handle number data items
            if (typeof dataItem === 'number') {
              const seriesColor =
                (seriesItemStyleObj.color as string) || chartColors[pieIndex % chartColors.length]

              return {
                name: `Bar ${pieIndex + 1}`,
                value: dataItem,
                itemStyle: {
                  color: seriesColor,
                },
              }
            }

            // Handle array data items [name, value]
            if (Array.isArray(dataItem) && dataItem.length >= 2) {
              const seriesColor =
                (seriesItemStyleObj.color as string) || chartColors[pieIndex % chartColors.length]

              return {
                name: typeof dataItem[0] === 'string' ? dataItem[0] : `Bar ${pieIndex + 1}`,
                value: typeof dataItem[1] === 'number' ? dataItem[1] : 0,
                itemStyle: {
                  color: seriesColor,
                },
              }
            }

            // Handle other cases
            const seriesColor =
              (seriesItemStyleObj.color as string) || chartColors[pieIndex % chartColors.length]

            return {
              name: `Pie ${pieIndex + 1}`,
              value: 0,
              itemStyle: {
                color: seriesColor,
              },
            }
          })
          .filter(Boolean)

        return {
          ...series,
          name: (series.name as string) || `Pie ${index + 1}`,
          type: (series.type as string) || 'pie',
          radius: (series.radius as string | string[]) || ['40%', '70%'],
          center: (series.center as string | string[]) || ['50%', '50%'],
          data: processedData,
          label: {
            ...seriesLabelObj,
            show: (seriesLabelObj.show as boolean) ?? true,
            position: (seriesLabelObj.position as string) || 'top',
            color: (seriesLabelObj.color as string) || themeColors.text,
            fontSize: (seriesLabelObj.fontSize as number) || 10,
            fontWeight: (seriesLabelObj.fontWeight as string | number) || 'normal',
          },
          emphasis: {
            ...seriesEmphasisObj,
            itemStyle: {
              ...emphasisItemStyleObj,
              shadowBlur: (emphasisItemStyleObj.shadowBlur as number) || 10,
              shadowOffsetX: (emphasisItemStyleObj.shadowOffsetX as number) || 0,
              shadowColor: (emphasisItemStyleObj.shadowColor as string) || `${themeColors.text}80`,
            },
          },
        }
      })
      .filter(s => s !== null)

    // Define default configs
    const defaultTextStyle = { fontSize: 12 } as const
    const defaultTitleTextStyle = { fontSize: 16 } as const

    // Extract union types to intermediate variables
    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'pieLlight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Pie Chart',
        left: (titleObj.left as string | number) || 'center',
        top: (titleObj.top as string | number) || 10,
        textStyle: {
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          fontSize: (titleTextStyleObj.fontSize as number) || defaultTitleTextStyle.fontSize,
          fontWeight: (titleTextStyleObj.fontWeight as string | number) || 'bold',
          color: (titleTextStyleObj.color as string) || themeColors.text,
        },
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? true,
        left: (legendObj.left as string | number) || 'center',
        bottom: (legendObj.bottom as string | number) || 5,
        textStyle: {
          ...legendTextStyleObj,
          fontFamily: (legendTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          color: (legendTextStyleObj.color as string) || themeColors.text,
          fontSize: (legendTextStyleObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (legendTextStyleObj.fontWeight as string | number) || 'normal',
        },
      },
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        left: (toolboxObj.left as string | number) || 'right',
        top: (toolboxObj.top as string | number) || 'top',
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...saveAsImageObj,
            show: (saveAsImageObj.show as boolean) ?? true,
            title: (saveAsImageObj.title as string) || '下載圖片',
            name: (saveAsImageObj.name as string) || 'chart-image',
            backgroundColor: (saveAsImageObj.backgroundColor as string) || themeColors.background,
          },
        },
      },
    }

    return {
      ...input,
      ...chartOptions,
    } as unknown as ExtendedEChartsOption
  }
}
