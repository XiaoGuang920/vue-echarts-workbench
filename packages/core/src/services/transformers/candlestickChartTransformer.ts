import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Candlestick Chart JSON Transformer
 */
export class CandlestickChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const statusColors = ColorManager.getStatusColors()
    const themeColors = ColorManager.getThemeColors()

    // 預設樣式配置
    const defaultItemStyle = {
      color: statusColors.success,
      color0: statusColors.error,
      borderColor: statusColors.success,
      borderColor0: statusColors.error,
      borderWidth: 1,
    }
    const defaultLabelStyle = {
      show: false as const,
      position: 'top' as const,
      color: themeColors.text,
      fontSize: 10,
      fontWeight: 'normal' as const,
    }
    const defaultEmphasisItemStyle = {
      color: statusColors.success,
      color0: statusColors.error,
      borderColor: statusColors.success,
      borderColor0: statusColors.error,
      borderWidth: 2,
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
        const label = (series.label || {}) as Record<string, unknown>
        const emphasis = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyle = (emphasis.itemStyle || {}) as Record<string, unknown>

        return {
          ...series,
          name: series.name || `Candlestick ${index + 1}`,
          type: series.type || 'candlestick',
          data: seriesData,
          itemStyle: {
            ...defaultItemStyle,
            ...itemStyle,
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
    const xAxisLineObj = (xAxisObj.axisLine || {}) as Record<string, unknown>
    const xAxisSplitLineObj = (xAxisObj.splitLine || {}) as Record<string, unknown>

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

    const gridObj = (input.grid || {}) as Record<string, unknown>

    const toolboxObj = (input.toolbox || {}) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'candlestickLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Candlestick Chart',
        left: (titleObj.left as string) || 'center',
        top: (titleObj.top as number) || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
        },
      },
      xAxis: {
        ...xAxisObj,
        type: (xAxisObj.type as string) || 'category',
        data: (xAxisObj.data as unknown[]) || [],
        name: (xAxisObj.name as string) || '',
        nameTextStyle: {
          ...defaultAxisNameTextStyle,
          ...xAxisNameTextStyleObj,
        },
        axisLabel: {
          ...defaultAxisLabel,
          ...xAxisLabelObj,
          rotate: (xAxisLabelObj.rotate as number) || 45,
        },
        scale: (xAxisObj.scale as boolean) ?? true,
        boundaryGap: (xAxisObj.boundaryGap as boolean) ?? true,
        axisLine: {
          ...xAxisLineObj,
          onZero: (xAxisLineObj.onZero as boolean) ?? false,
        },
        splitLine: {
          ...xAxisSplitLineObj,
          show: (xAxisSplitLineObj.show as boolean) ?? false,
        },
        min: xAxisObj.min || 'dataMin',
        max: xAxisObj.max || 'dataMax',
      },
      yAxis: {
        ...yAxisObj,
        type: (yAxisObj.type as string) || 'value',
        name: (yAxisObj.name as string) || '',
        nameTextStyle: {
          ...defaultAxisNameTextStyle,
          ...yAxisNameTextStyleObj,
        },
        axisLabel: {
          ...defaultAxisLabel,
          ...yAxisLabelObj,
        },
        min: yAxisObj.min,
        max: yAxisObj.max,
        interval: yAxisObj.interval,
      },
      legend: {
        ...legendObj,
        show: legendObj.show ?? false,
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
        left: (gridObj.left as string | number) || '8%',
        right: (gridObj.right as string | number) || '10%',
        top: (gridObj.top as string | number) || '20%',
        bottom: (gridObj.bottom as string | number) || '15%',
        containLabel: (gridObj.containLabel as boolean) ?? true,
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
    } as unknown as ExtendedEChartsOption
  }
}
