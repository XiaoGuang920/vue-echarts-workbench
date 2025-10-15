import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Polar Bar Chart JSON Transformer
 */
export class PolarBarChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    let dataLength = 0

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

        dataLength = seriesData.length

        const itemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const labelObj = (series.label || {}) as Record<string, unknown>
        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyleObj = (emphasisObj.itemStyle || {}) as Record<string, unknown>

        return {
          name: `Polar Bar ${index + 1}`,
          type: 'bar',
          data: [],
          angleAxisIndex: 0,
          radiusAxisIndex: 0,
          coordinateSystem: 'polar',
          itemStyle: {
            color: chartColors[index % chartColors.length],
            borderColor: themeColors.background,
            borderWidth: 1,
            opacity: 0.8,
            ...itemStyleObj,
          },
          label: {
            show: false,
            position: 'middle',
            color: themeColors.text,
            fontSize: 12,
            fontWeight: 'normal',
            ...labelObj,
          },
          emphasis: {
            itemStyle: {
              borderColor: themeColors.background,
              borderWidth: 2,
              opacity: 1,
              ...emphasisItemStyleObj,
            },
            ...emphasisObj,
          },
          ...series,
        }
      })
      .filter(s => s !== null)

    // Extract angleAxis data
    const angleAxisObj = (
      Array.isArray(input.angleAxis) ? input.angleAxis[0] || {} : input.angleAxis || {}
    ) as Record<string, unknown>
    let categories = (angleAxisObj.data as unknown[]) || undefined
    if (!categories && dataLength > 0) {
      categories = Array.from({ length: dataLength }, (_, idx) => `類別${idx + 1}`)
    }

    // Extract union types to intermediate variables
    const angleAxisLabelObj = (angleAxisObj.axisLabel || {}) as Record<string, unknown>

    const radiusAxisObj = (
      Array.isArray(input.radiusAxis) ? input.radiusAxis[0] || {} : input.radiusAxis || {}
    ) as Record<string, unknown>
    const radiusAxisLabelObj = (radiusAxisObj.axisLabel || {}) as Record<string, unknown>

    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: 4,
      gridHeight: 4,
      gridX: 0,
      gridY: 0,
      tooltipType: 'polarBarLight',
      series: series,
      polar: {
        center: ['50%', '50%'],
        radius: '60%',
        ...(input.polar || {}),
      },
      angleAxis: {
        type: 'category' as const,
        data: categories,
        startAngle: 90,
        axisLabel: {
          fontSize: 12,
          color: themeColors.text,
          ...angleAxisLabelObj,
        },
        ...angleAxisObj,
      },
      radiusAxis: {
        type: 'value' as const,
        min: 0,
        max: 100,
        axisLabel: {
          fontSize: 12,
          color: themeColors.text,
          ...radiusAxisLabelObj,
        },
        ...radiusAxisObj,
      },
      title: {
        text: 'Polar Bar Chart',
        left: 'center',
        top: 10,
        textStyle: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 16,
          fontWeight: 'bold',
          color: themeColors.text,
          ...titleTextStyleObj,
        },
        ...titleObj,
      },
      xAxis: {
        show: false,
        ...(input.xAxis || {}),
      },
      yAxis: {
        show: false,
        ...(input.yAxis || {}),
      },
      legend: {
        show: false,
        ...(input.legend || {}),
      },
      dataZoom: [],
      toolbox: {
        show: true,
        orient: 'horizontal',
        left: 'right',
        top: 'top',
        feature: {
          saveAsImage: {
            show: true,
            title: '下載圖片',
            name: 'chart-image',
            backgroundColor: themeColors.background,
            ...saveAsImageObj,
          },
          ...toolboxFeatureObj,
        },
        ...toolboxObj,
      },
    }

    return {
      ...chartOptions,
      ...input,
    } as unknown as ExtendedEChartsOption
  }
}
