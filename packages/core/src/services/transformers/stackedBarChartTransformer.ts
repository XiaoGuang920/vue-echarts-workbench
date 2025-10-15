import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Stacked Bar Chart JSON Transformer
 */
export class StackedBarChartTransformer implements ChartTransformer {
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
        const seriesColor =
          (seriesItemStyleObj.color as string) || chartColors[index % chartColors.length]

        const seriesLabelObj = (series.label || {}) as Record<string, unknown>

        return {
          ...series,
          name: (series.name as string) || `Stacked Bar ${index + 1}`,
          type: (series.type as string) || 'bar',
          data: seriesData,
          label: {
            ...seriesLabelObj,
            show: (seriesLabelObj.show as boolean) ?? false,
            position: (seriesLabelObj.position as string) || 'top',
            color: (seriesLabelObj.color as string) || themeColors.text,
            fontSize: (seriesLabelObj.fontSize as number) || 10,
            fontWeight: (seriesLabelObj.fontWeight as string | number) || 'normal',
          },
          itemStyle: {
            ...seriesItemStyleObj,
            color: seriesColor,
          },
          stack: 'total',
        }
      })
      .filter(s => s !== null)

    // Extract union types to intermediate variables
    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const xAxisObj = (
      Array.isArray(input.xAxis) ? input.xAxis[0] || {} : input.xAxis || {}
    ) as Record<string, unknown>
    const xAxisNameTextStyleObj = (xAxisObj.nameTextStyle || {}) as Record<string, unknown>
    const xAxisLabelObj = (xAxisObj.axisLabel || {}) as Record<string, unknown>

    const yAxisObj = (
      Array.isArray(input.yAxis) ? input.yAxis[0] || {} : input.yAxis || {}
    ) as Record<string, unknown>
    const yAxisNameTextStyleObj = (yAxisObj.nameTextStyle || {}) as Record<string, unknown>
    const yAxisLabelObj = (yAxisObj.axisLabel || {}) as Record<string, unknown>

    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const gridObj = (Array.isArray(input.grid) ? input.grid[0] || {} : input.grid || {}) as Record<
      string,
      unknown
    >

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'stackedBarLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Stacked Bar Chart',
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
      xAxis: {
        ...xAxisObj,
        type: (xAxisObj.type as string) || 'category',
        data: (xAxisObj.data as unknown[]) || [],
        name: (xAxisObj.name as string) || '',
        nameTextStyle: {
          ...xAxisNameTextStyleObj,
          fontFamily: (xAxisNameTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          color: (xAxisNameTextStyleObj.color as string) || themeColors.text,
          fontSize: (xAxisNameTextStyleObj.fontSize as number) || 12,
          fontWeight: (xAxisNameTextStyleObj.fontWeight as string | number) || 'normal',
        },
        axisLabel: {
          ...xAxisLabelObj,
          fontFamily: (xAxisLabelObj.fontFamily as string) || 'Arial, sans-serif',
          color: (xAxisLabelObj.color as string) || themeColors.text,
          fontSize: (xAxisLabelObj.fontSize as number) || 12,
          fontWeight: (xAxisLabelObj.fontWeight as string | number) || 'normal',
          rotate: (xAxisLabelObj.rotate as number) || 0,
        },
      },
      yAxis: {
        ...yAxisObj,
        type: (yAxisObj.type as string) || 'value',
        name: (yAxisObj.name as string) || '',
        nameTextStyle: {
          ...yAxisNameTextStyleObj,
          fontFamily: (yAxisNameTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          color: (yAxisNameTextStyleObj.color as string) || themeColors.text,
          fontSize: (yAxisNameTextStyleObj.fontSize as number) || 12,
          fontWeight: (yAxisNameTextStyleObj.fontWeight as string | number) || 'normal',
        },
        axisLabel: {
          ...yAxisLabelObj,
          fontFamily: (yAxisLabelObj.fontFamily as string) || 'Arial, sans-serif',
          color: (yAxisLabelObj.color as string) || themeColors.text,
          fontSize: (yAxisLabelObj.fontSize as number) || 12,
          fontWeight: (yAxisLabelObj.fontWeight as string | number) || 'normal',
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
