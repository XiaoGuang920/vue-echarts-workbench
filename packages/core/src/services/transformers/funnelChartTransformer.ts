import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Funnel Chart JSON Transformer
 */
export class FunnelChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    // 預設樣式配置
    const defaultLabelStyle = {
      show: true as const,
      position: 'inside' as const,
      color: themeColors.text,
      fontSize: 10,
      fontWeight: 'normal' as const,
      formatter: '{b}: {c}',
    }
    const defaultLabelLine = {
      show: false as const,
    }
    const defaultEmphasisItemStyle = {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: themeColors.shadow,
    }

    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || (Array.isArray(seriesData) && seriesData.length === 0)) return undefined

        const itemStyle = (series.itemStyle || {}) as Record<string, unknown>

        const processedData = seriesData
          .map((dataItem, funnelIndex) => {
            if (dataItem == null) return undefined

            if (typeof dataItem === 'object' && !Array.isArray(dataItem)) {
              const funnelItem = dataItem as Record<string, unknown>
              const funnelItemStyle = (funnelItem.itemStyle || {}) as Record<string, unknown>
              const seriesColor = itemStyle.color || chartColors[funnelIndex % chartColors.length]

              return {
                name: funnelItem.name || `Funnel ${funnelIndex + 1}`,
                value: funnelItem.value,
                itemStyle: {
                  color: funnelItemStyle.color || seriesColor,
                },
              }
            } else if (typeof dataItem === 'number') {
              const seriesColor = itemStyle.color || chartColors[funnelIndex % chartColors.length]

              return {
                name: `Funnel ${funnelIndex + 1}`,
                value: dataItem,
                itemStyle: {
                  color: seriesColor,
                },
              }
            }

            return undefined
          })
          .filter((item): item is NonNullable<typeof item> => item !== undefined)
          .sort((a, b) => {
            const valueA = typeof a.value === 'number' ? a.value : 0
            const valueB = typeof b.value === 'number' ? b.value : 0
            return valueB - valueA
          })

        const label = (series.label || {}) as Record<string, unknown>
        const labelLine = (series.labelLine || {}) as Record<string, unknown>
        const emphasis = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyle = (emphasis.itemStyle || {}) as Record<string, unknown>

        return {
          ...series,
          name: series.name || `Funnel ${index + 1}`,
          type: series.type || 'funnel',
          left: series.left || '10%',
          top: series.top || 70,
          width: series.width || '80%',
          height: series.height || '75%',
          minSize: series.minSize || '0%',
          maxSize: series.maxSize || '100%',
          orient: series.orient || 'vertical',
          sort: series.sort || 'descending',
          gap: series.gap || 2,
          data: processedData,
          label: {
            ...defaultLabelStyle,
            ...label,
          },
          labelLine: {
            ...defaultLabelLine,
            ...labelLine,
          },
          emphasis: {
            ...emphasis,
            itemStyle: {
              ...defaultEmphasisItemStyle,
              ...emphasisItemStyle,
            },
          },
        }
      })
      .filter((series): series is NonNullable<typeof series> => series !== undefined)

    // 預設配置
    const defaultTitleTextStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: themeColors.text,
    }
    const defaultLegendTextStyle = {
      fontFamily: 'Arial, sans-serif',
      color: themeColors.text,
      fontSize: 12,
      fontWeight: 'normal' as const,
    }
    const defaultSaveAsImage = {
      show: true,
      title: '下載圖片',
      name: 'chart-image',
      backgroundColor: themeColors.background,
    }

    // 提取中間變數
    const titleObj = (Array.isArray(input.title) ? input.title[0] : input.title || {}) as Record<
      string,
      unknown
    >
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = (
      Array.isArray(input.legend) ? input.legend[0] : input.legend || {}
    ) as Record<string, unknown>
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const gridObj = (Array.isArray(input.grid) ? input.grid[0] : input.grid || {}) as Record<
      string,
      unknown
    >

    const toolboxObj = (
      Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox || {}
    ) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'funnelLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Funnel Chart',
        left: (titleObj.left as string) || 'center',
        top: (titleObj.top as number) || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
        },
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? true,
        left: (legendObj.left as string) || 'center',
        bottom: (legendObj.bottom as number) || 5,
        textStyle: {
          ...defaultLegendTextStyle,
          ...legendTextStyleObj,
        },
      },
      dataZoom: input.dataZoom || [],
      grid: {
        ...gridObj,
        left: (gridObj.left as string | number) || '8%',
        right: (gridObj.right as string | number) || '10%',
        top: (gridObj.top as string | number) || '20%',
        bottom: (gridObj.bottom as string | number) || '15%',
        containLabel: (gridObj.containLabel as boolean) ?? true,
      },
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        left: (toolboxObj.left as string) || 'right',
        top: (toolboxObj.top as string) || 'top',
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...defaultSaveAsImage,
            ...saveAsImageObj,
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
