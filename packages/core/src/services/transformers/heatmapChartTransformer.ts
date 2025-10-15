import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Heatmap Chart JSON Transformer
 */
export class HeatmapChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const gradientColors = [ColorManager.getGradientColor(0), ColorManager.getGradientColor(100)]

    let minSize: number = 0
    let maxSize: number = 0

    // Normalize series to array
    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || seriesData.length === 0) return undefined

        if (Array.isArray(seriesData)) {
          const heatmapSizes: number[] = []

          seriesData.forEach((item: unknown) => {
            if (Array.isArray(item)) {
              // 數據格式：[x, y, size] 或 [x, y]
              const size = item[2]
              if (typeof size === 'number') {
                heatmapSizes.push(size)
              }
            } else if (typeof item === 'object' && item !== null) {
              // 數據格式：{value: [x, y, size], name: string} 或類似格式
              const dataObj = item

              if (typeof dataObj === 'object' && 'value' in dataObj) {
                const value = dataObj.value
                if (Array.isArray(value) && typeof value[2] === 'number') {
                  heatmapSizes.push(value[2])
                }
              }
            }
          })

          if (heatmapSizes.length > 0) {
            const currentMin = Math.min(...heatmapSizes)
            const currentMax = Math.max(...heatmapSizes)

            minSize = minSize === 0 ? currentMin : Math.min(minSize, currentMin)
            maxSize = maxSize === 0 ? currentMax : Math.max(maxSize, currentMax)
          }
        }

        // Extract nested objects
        const labelObj = (series.label || {}) as Record<string, unknown>
        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyleObj = (emphasisObj.itemStyle || {}) as Record<string, unknown>

        return {
          ...series,
          name: (series.name as string) || `Heatmap ${index + 1}`,
          type: (series.type as string) || 'heatmap',
          data: seriesData,
          label: {
            ...labelObj,
            show: (labelObj.show as boolean) ?? false,
            position: (labelObj.position as string) || 'inside',
            color: (labelObj.color as string) || themeColors.text,
            fontSize: (labelObj.fontSize as number) || 10,
            fontWeight: (labelObj.fontWeight as string) || 'normal',
          },
          emphasis: {
            ...emphasisObj,
            itemStyle: {
              ...emphasisItemStyleObj,
              borderColor: (emphasisItemStyleObj.borderColor as string) || themeColors.background,
              borderWidth: (emphasisItemStyleObj.borderWidth as number) || 2,
              opacity: (emphasisItemStyleObj.opacity as number) || 1,
            },
          },
        }
      })
      .filter((s: unknown): s is NonNullable<typeof s> => s !== undefined)

    // Define default configs
    const defaultTextStyle = {
      fontFamily: 'Arial, sans-serif' as const,
      fontSize: 12 as const,
      fontWeight: 'normal' as const,
    }

    const defaultTitleTextStyle = {
      fontFamily: 'Arial, sans-serif' as const,
      fontSize: 16 as const,
      fontWeight: 'bold' as const,
    }

    // Extract intermediate variables from union types
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
    const visualMapTextStyleObj = (visualMapObj.textStyle || {}) as Record<string, unknown>
    const visualMapInRangeObj = (visualMapObj.inRange || {}) as Record<string, unknown>

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
      tooltipType: input.tooltipType || 'heatmapLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Heatmap Chart',
        left: titleObj.left || 'center',
        top: titleObj.top || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || defaultTitleTextStyle.fontFamily,
          fontSize: (titleTextStyleObj.fontSize as number) || defaultTitleTextStyle.fontSize,
          fontWeight: (titleTextStyleObj.fontWeight as string) || defaultTitleTextStyle.fontWeight,
          color: (titleTextStyleObj.color as string) || themeColors.text,
        },
      },
      xAxis: {
        ...xAxisObj,
        type: (xAxisObj.type as string) || 'category',
        data: xAxisObj.data || [],
        name: (xAxisObj.name as string) || '',
        nameTextStyle: {
          ...defaultTextStyle,
          ...xAxisNameTextStyleObj,
          fontFamily: (xAxisNameTextStyleObj.fontFamily as string) || defaultTextStyle.fontFamily,
          color: (xAxisNameTextStyleObj.color as string) || themeColors.text,
          fontSize: (xAxisNameTextStyleObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (xAxisNameTextStyleObj.fontWeight as string) || defaultTextStyle.fontWeight,
        },
        axisLabel: {
          ...defaultTextStyle,
          ...xAxisLabelObj,
          fontFamily: (xAxisLabelObj.fontFamily as string) || defaultTextStyle.fontFamily,
          color: (xAxisLabelObj.color as string) || themeColors.text,
          fontSize: (xAxisLabelObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (xAxisLabelObj.fontWeight as string) || defaultTextStyle.fontWeight,
          rotate: (xAxisLabelObj.rotate as number) || 0,
        },
      },
      yAxis: {
        ...yAxisObj,
        type: (yAxisObj.type as string) || 'category',
        name: (yAxisObj.name as string) || '',
        nameTextStyle: {
          ...defaultTextStyle,
          ...yAxisNameTextStyleObj,
          fontFamily: (yAxisNameTextStyleObj.fontFamily as string) || defaultTextStyle.fontFamily,
          color: (yAxisNameTextStyleObj.color as string) || themeColors.text,
          fontSize: (yAxisNameTextStyleObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (yAxisNameTextStyleObj.fontWeight as string) || defaultTextStyle.fontWeight,
        },
        axisLabel: {
          ...defaultTextStyle,
          ...yAxisLabelObj,
          fontFamily: (yAxisLabelObj.fontFamily as string) || defaultTextStyle.fontFamily,
          color: (yAxisLabelObj.color as string) || themeColors.text,
          fontSize: (yAxisLabelObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (yAxisLabelObj.fontWeight as string) || defaultTextStyle.fontWeight,
        },
      },
      visualMap: {
        ...visualMapObj,
        show: (visualMapObj.show as boolean) ?? true,
        min: (visualMapObj.min as number) || minSize * 0.8,
        max: (visualMapObj.max as number) || maxSize * 1.2,
        left: visualMapObj.left || 'center',
        bottom: visualMapObj.bottom || '10%',
        orient: (visualMapObj.orient as string) || 'horizontal',
        text: visualMapObj.text || ['高', '低'],
        textStyle: {
          ...defaultTextStyle,
          ...visualMapTextStyleObj,
          fontFamily: (visualMapTextStyleObj.fontFamily as string) || defaultTextStyle.fontFamily,
          color: (visualMapTextStyleObj.color as string) || themeColors.text,
          fontSize: (visualMapTextStyleObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (visualMapTextStyleObj.fontWeight as string) || defaultTextStyle.fontWeight,
        },
        inRange: {
          ...visualMapInRangeObj,
          color: visualMapInRangeObj.color || gradientColors,
        },
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? false,
        left: legendObj.left || 'center',
        bottom: legendObj.bottom || 5,
        textStyle: {
          ...defaultTextStyle,
          ...legendTextStyleObj,
          fontFamily: (legendTextStyleObj.fontFamily as string) || defaultTextStyle.fontFamily,
          color: (legendTextStyleObj.color as string) || themeColors.text,
          fontSize: (legendTextStyleObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (legendTextStyleObj.fontWeight as string) || defaultTextStyle.fontWeight,
        },
      },
      dataZoom: input.dataZoom || [],
      grid: {
        ...gridObj,
        left: gridObj.left || '8%',
        right: gridObj.right || '10%',
        top: gridObj.top || '20%',
        bottom: gridObj.bottom || '15%',
        containLabel: (gridObj.containLabel as boolean) ?? true,
      },
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        left: toolboxObj.left || 'right',
        top: toolboxObj.top || 'top',
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
