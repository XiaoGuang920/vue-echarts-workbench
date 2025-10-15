import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Horizontal Bar Chart JSON Transformer
 */
export class HorizontalBarChartTransformer implements ChartTransformer {
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
      .map((s, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || seriesData.length === 0) return undefined

        const itemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const seriesColor =
          (itemStyleObj.color as string) || chartColors[index % chartColors.length]

        const labelObj = (series.label || {}) as Record<string, unknown>

        return {
          ...series,
          name: (series.name as string) || `Horizontal Bar ${index + 1}`,
          type: (series.type as string) || 'bar',
          data: seriesData,
          label: {
            ...labelObj,
            show: (labelObj.show as boolean) ?? false,
            position: (labelObj.position as string) || 'right',
            color: (labelObj.color as string) || themeColors.text,
            fontSize: (labelObj.fontSize as number) || 10,
            fontWeight: (labelObj.fontWeight as string) || 'normal',
          },
          itemStyle: {
            ...itemStyleObj,
            color: seriesColor,
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
      tooltipType: input.tooltipType || 'horizontalBarLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Horizontal Bar Chart',
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
        type: (xAxisObj.type as string) || 'value',
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
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? true,
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
