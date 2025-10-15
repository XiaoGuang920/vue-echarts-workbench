import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Bubble Chart JSON Transformer
 */
export class BubbleChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    // 預設樣式配置
    const defaultItemStyle = { opacity: 0.7 }
    const defaultLabelStyle = {
      show: false as const,
      position: 'top' as const,
      color: themeColors.text,
      fontSize: 10,
      fontWeight: 'normal' as const,
    }
    const defaultEmphasisItemStyle = {
      borderColor: themeColors.background,
      borderWidth: 2,
      opacity: 1,
    }

    let minSize: number | null = null
    let maxSize: number | null = null

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
        const seriesColor = itemStyle.color || chartColors[index % chartColors.length]

        if (Array.isArray(seriesData)) {
          const bubbleSizes: number[] = []

          seriesData.forEach(item => {
            if (Array.isArray(item)) {
              // 數據格式：[x, y, size] 或 [x, y]
              const size = item[2]
              if (typeof size === 'number') {
                bubbleSizes.push(size)
              }
            } else if (typeof item === 'object' && item !== null) {
              // 數據格式：{value: [x, y, size], name: string} 或類似格式
              const dataObj = item as Record<string, unknown>

              if ('value' in dataObj) {
                const value = dataObj.value
                if (Array.isArray(value) && typeof value[2] === 'number') {
                  bubbleSizes.push(value[2])
                }
              }
            }
          })

          if (bubbleSizes.length > 0) {
            const currentMin = Math.min(...bubbleSizes)
            const currentMax = Math.max(...bubbleSizes)

            minSize = minSize === null ? currentMin : Math.min(minSize, currentMin)
            maxSize = maxSize === null ? currentMax : Math.max(maxSize, currentMax)
          }
        }

        const label = (series.label || {}) as Record<string, unknown>
        const emphasis = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyle = (emphasis.itemStyle || {}) as Record<string, unknown>

        return {
          ...series,
          name: series.name || `Bubble ${index + 1}`,
          type: series.type || 'scatter',
          data: seriesData,
          itemStyle: {
            ...itemStyle,
            color: seriesColor,
            ...defaultItemStyle,
          },
          label: {
            ...defaultLabelStyle,
            ...label,
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
    const defaultAxisNameTextStyle = {
      fontFamily: 'Arial, sans-serif',
      color: themeColors.text,
      fontSize: 12,
      fontWeight: 'normal' as const,
    }
    const defaultAxisLabel = {
      fontFamily: 'Arial, sans-serif',
      color: themeColors.text,
      fontSize: 12,
      fontWeight: 'normal' as const,
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

    const xAxisObj = (Array.isArray(input.xAxis) ? input.xAxis[0] : input.xAxis || {}) as Record<
      string,
      unknown
    >
    const xAxisNameTextStyleObj = (xAxisObj.nameTextStyle || {}) as Record<string, unknown>
    const xAxisLabelObj = (xAxisObj.axisLabel || {}) as Record<string, unknown>

    const yAxisObj = (Array.isArray(input.yAxis) ? input.yAxis[0] : input.yAxis || {}) as Record<
      string,
      unknown
    >
    const yAxisNameTextStyleObj = (yAxisObj.nameTextStyle || {}) as Record<string, unknown>
    const yAxisLabelObj = (yAxisObj.axisLabel || {}) as Record<string, unknown>

    const visualMapObj = (
      Array.isArray(input.visualMap) ? input.visualMap[0] : input.visualMap || {}
    ) as Record<string, unknown>
    const visualMapInRangeObj = (visualMapObj.inRange || {}) as Record<string, unknown>

    const legendObj = (
      Array.isArray(input.legend) ? input.legend[0] : input.legend || {}
    ) as Record<string, unknown>
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const gridObj = (input.grid || {}) as Record<string, unknown>

    const toolboxObj = (input.toolbox || {}) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'bubbleLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Bubble Chart',
        left: (titleObj.left as string) || 'center',
        top: (titleObj.top as number) || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
        },
      },
      xAxis: {
        ...xAxisObj,
        type: xAxisObj.type || 'value',
        data: xAxisObj.data || [],
        name: xAxisObj.name || '',
        nameTextStyle: {
          ...defaultAxisNameTextStyle,
          ...xAxisNameTextStyleObj,
        },
        axisLabel: {
          ...defaultAxisLabel,
          ...xAxisLabelObj,
          rotate: xAxisLabelObj.rotate || 0,
        },
      },
      yAxis: {
        ...yAxisObj,
        type: yAxisObj.type || 'value',
        name: yAxisObj.name || '',
        nameTextStyle: {
          ...defaultAxisNameTextStyle,
          ...yAxisNameTextStyleObj,
        },
        axisLabel: {
          ...defaultAxisLabel,
          ...yAxisLabelObj,
        },
      },
      visualMap: {
        ...visualMapObj,
        type: visualMapObj.type || 'continuous',
        min: visualMapObj.min || minSize,
        max: visualMapObj.max || maxSize,
        show: visualMapObj.show ?? false,
        dimension: visualMapObj.dimension || 2,
        inRange: {
          ...visualMapInRangeObj,
          symbolSize: visualMapInRangeObj.symbolSize || [5, 50],
        },
      },
      legend: {
        ...legendObj,
        show: legendObj.show ?? true,
        left: legendObj.left || 'center',
        bottom: legendObj.bottom || 5,
        textStyle: {
          ...defaultLegendTextStyle,
          ...legendTextStyleObj,
        },
      },
      dataZoom: input.dataZoom || [],
      grid: {
        ...gridObj,
        left: gridObj.left || '8%',
        right: gridObj.right || '10%',
        top: gridObj.top || '20%',
        bottom: gridObj.bottom || '15%',
        containLabel: gridObj.containLabel ?? true,
      },
      toolbox: {
        ...toolboxObj,
        show: toolboxObj.show ?? true,
        orient: toolboxObj.orient || 'horizontal',
        left: toolboxObj.left || 'right',
        top: toolboxObj.top || 'top',
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
    } as ExtendedEChartsOption
  }
}
