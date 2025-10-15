import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Radar Chart JSON Transformer
 */
export class RadarChartTransformer implements ChartTransformer {
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

        // Process radar data items
        const processedData = seriesData.map((dataItem: unknown, dataIndex: number) => {
          const defaultSeriesColor = chartColors[dataIndex % chartColors.length]

          // Handle object data items with value property
          if (typeof dataItem === 'object' && dataItem !== null && !Array.isArray(dataItem)) {
            const radarDataItem = dataItem as Record<string, unknown>

            if ('value' in radarDataItem) {
              const itemStyleObj = (radarDataItem.itemStyle || {}) as Record<string, unknown>
              const lineStyleObj = (radarDataItem.lineStyle || {}) as Record<string, unknown>
              const areaStyleObj = (radarDataItem.areaStyle || {}) as Record<string, unknown>
              const labelObj = (radarDataItem.label || {}) as Record<string, unknown>

              return {
                ...radarDataItem,
                name: (radarDataItem.name as string) || `Radar ${dataIndex + 1}`,
                value: Array.isArray(radarDataItem.value) ? radarDataItem.value : [],
                itemStyle: {
                  ...itemStyleObj,
                  color: (itemStyleObj.color as string) || defaultSeriesColor,
                },
                lineStyle: {
                  ...lineStyleObj,
                  color: (lineStyleObj.color as string) || defaultSeriesColor,
                },
                areaStyle: {
                  ...areaStyleObj,
                  color: (areaStyleObj.color as string) || `${defaultSeriesColor}33`,
                },
                label: {
                  ...labelObj,
                  show: (labelObj.show as boolean) ?? true,
                  position: (labelObj.position as string) || 'top',
                  color: (labelObj.color as string) || themeColors.text,
                  fontSize: (labelObj.fontSize as number) || 10,
                  fontWeight: (labelObj.fontWeight as string | number) || 'normal',
                },
                symbol: (radarDataItem.symbol as string) || 'circle',
                symbolSize: (radarDataItem.symbolSize as number) || 6,
              }
            }
          }

          // Handle array data items
          if (Array.isArray(dataItem)) {
            return {
              name: `Radar Data ${dataIndex + 1}`,
              value: dataItem,
              itemStyle: {
                color: defaultSeriesColor,
              },
              lineStyle: {
                color: defaultSeriesColor,
              },
              areaStyle: {
                color: `${defaultSeriesColor}33`,
              },
              label: {
                show: true,
                position: 'top',
                color: themeColors.text,
                fontSize: 10,
                fontWeight: 'normal',
              },
              symbol: 'circle',
              symbolSize: 6,
            }
          }

          // Handle other cases
          return {
            name: `Radar Data ${dataIndex + 1}`,
            value: [],
          }
        })

        return {
          ...series,
          name: (series.name as string) || `Radar ${index + 1}`,
          type: (series.type as string) || 'radar',
          data: processedData,
        }
      })
      .filter(s => s !== null)

    // Extract radar configuration
    const radarObj = (
      Array.isArray(input.radar) ? input.radar[0] || {} : input.radar || {}
    ) as Record<string, unknown>
    const radarAxisNameObj = (radarObj.axisName || {}) as Record<string, unknown>
    const radarSplitLineObj = (radarObj.splitLine || {}) as Record<string, unknown>
    const radarSplitLineStyleObj = (radarSplitLineObj.lineStyle || {}) as Record<string, unknown>
    const radarSplitAreaObj = (radarObj.splitArea || {}) as Record<string, unknown>
    const radarAxisLineObj = (radarObj.axisLine || {}) as Record<string, unknown>
    const radarAxisLineStyleObj = (radarAxisLineObj.lineStyle || {}) as Record<string, unknown>

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
      tooltipType: input.tooltipType || 'radarLight',
      radar: {
        ...radarObj,
        center: (radarObj.center as string[]) || ['50%', '50%'],
        radius: (radarObj.radius as string | number) || '65%',
        indicator: (radarObj.indicator as unknown[]) || [],
        shape: (radarObj.shape as string) || 'polygon',
        splitNumber: (radarObj.splitNumber as number) || 5,
        axisName: {
          ...radarAxisNameObj,
          color: (radarAxisNameObj.color as string) || themeColors.text,
          fontSize: (radarAxisNameObj.fontSize as number) || 12,
          fontWeight: (radarAxisNameObj.fontWeight as string | number) || 'normal',
        },
        splitLine: {
          ...radarSplitLineObj,
          lineStyle: {
            ...radarSplitLineStyleObj,
            color: (radarSplitLineStyleObj.color as string) || themeColors.axis,
            width: (radarSplitLineStyleObj.width as number) || 1,
            type: (radarSplitLineStyleObj.type as string) || 'solid',
          },
        },
        splitArea: {
          ...radarSplitAreaObj,
          show: (radarSplitAreaObj.show as boolean) ?? false,
        },
        axisLine: {
          ...radarAxisLineObj,
          lineStyle: {
            ...radarAxisLineStyleObj,
            color: (radarAxisLineStyleObj.color as string) || themeColors.axis,
            width: (radarAxisLineStyleObj.width as number) || 1,
            type: (radarAxisLineStyleObj.type as string) || 'solid',
          },
        },
      },
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Radar Chart',
        left: (titleObj.left as string | number) || 'center',
        top: (titleObj.top as string | number) || 10,
        textStyle: {
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          fontSize: (titleTextStyleObj.fontSize as number) || 16,
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
          fontSize: (legendTextStyleObj.fontSize as number) || 12,
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
