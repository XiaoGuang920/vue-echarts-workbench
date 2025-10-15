import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Mix Line Bar Chart JSON Transformer
 */
export class MixLineBarChartTransformer implements ChartTransformer {
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

        const itemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyleObj = (emphasisObj.itemStyle || {}) as Record<string, unknown>

        const seriesColor =
          (itemStyleObj.color as string) || chartColors[index % chartColors.length]

        // Handle bar type
        if (series.type === 'bar') {
          return {
            name: (series.name as string) || `Bar ${index + 1}`,
            type: 'bar',
            data: seriesData,
            itemStyle: {
              ...itemStyleObj,
              color: (itemStyleObj.color as string) || seriesColor,
            },
            yAxisIndex: (series.yAxisIndex as number) || 0,
            barGap: (series.barGap as string) || '30%',
            emphasis: {
              ...emphasisObj,
              itemStyle: {
                ...emphasisItemStyleObj,
                shadowBlur: (emphasisItemStyleObj.shadowBlur as number) || 10,
                shadowColor: (emphasisItemStyleObj.shadowColor as string) || `${seriesColor}88`,
              },
            },
          }
        }
        // Handle line type
        else if (series.type === 'line') {
          const lineStyleObj = (series.lineStyle || {}) as Record<string, unknown>

          return {
            name: (series.name as string) || `Line ${index + 1}`,
            type: 'line',
            data: seriesData,
            lineStyle: {
              ...lineStyleObj,
              color: (lineStyleObj.color as string) || seriesColor,
              width: (lineStyleObj.width as number) || 2,
            },
            itemStyle: {
              ...itemStyleObj,
              color: (itemStyleObj.color as string) || seriesColor,
              borderColor: (itemStyleObj.borderColor as string) || themeColors.background,
              borderWidth: (itemStyleObj.borderWidth as number) || 2,
            },
            symbol: (series.symbol as string) || 'circle',
            symbolSize: (series.symbolSize as number) || 6,
            yAxisIndex: (series.yAxisIndex as number) || 1,
            smooth: (series.smooth as boolean) ?? true,
            emphasis: {
              ...emphasisObj,
              itemStyle: {
                ...emphasisItemStyleObj,
                borderWidth: (emphasisItemStyleObj.borderWidth as number) || 3,
                shadowBlur: (emphasisItemStyleObj.shadowBlur as number) || 10,
                shadowColor: (emphasisItemStyleObj.shadowColor as string) || `${seriesColor}88`,
              },
            },
          }
        }

        return null
      })
      .filter(Boolean)

    // Normalize yAxis to array
    const inputYAxis = Array.isArray(input.yAxis) ? input.yAxis : input.yAxis ? [input.yAxis] : []

    const yAxis = inputYAxis.map((y: unknown, index: number) => {
      const yAxisItem = y as Record<string, unknown>
      const nameTextStyleObj = (yAxisItem.nameTextStyle || {}) as Record<string, unknown>
      const axisLabelObj = (yAxisItem.axisLabel || {}) as Record<string, unknown>
      const axisLineObj = (yAxisItem.axisLine || {}) as Record<string, unknown>
      const axisLineStyleObj = (axisLineObj.lineStyle || {}) as Record<string, unknown>

      return {
        name: (yAxisItem.name as string) || (index === 0 ? 'Bar Value' : 'Line Value'),
        type: (yAxisItem.type as string) || 'value',
        position: (yAxisItem.position as string) || (index === 0 ? 'left' : 'right'),
        nameTextStyle: {
          ...nameTextStyleObj,
          fontFamily: (nameTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          color: (nameTextStyleObj.color as string) || themeColors.text,
          fontSize: (nameTextStyleObj.fontSize as number) || 12,
          fontWeight: (nameTextStyleObj.fontWeight as string) || 'normal',
        },
        axisLabel: {
          ...axisLabelObj,
          fontFamily: (axisLabelObj.fontFamily as string) || 'Arial, sans-serif',
          color: (axisLabelObj.color as string) || themeColors.text,
          fontSize: (axisLabelObj.fontSize as number) || 12,
          fontWeight: (axisLabelObj.fontWeight as string) || 'normal',
        },
        axisLine: {
          ...axisLineObj,
          lineStyle: {
            ...axisLineStyleObj,
            color: (axisLineStyleObj.color as string) || themeColors.axis,
          },
        },
      }
    })

    // Define default configs
    const defaultTextStyle = { fontSize: 12 } as const
    const defaultTitleTextStyle = { fontSize: 16 } as const

    // Extract union types to intermediate variables
    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const xAxisObj = (
      Array.isArray(input.xAxis) ? input.xAxis[0] || {} : input.xAxis || {}
    ) as Record<string, unknown>
    const xAxisNameTextStyleObj = (xAxisObj.nameTextStyle || {}) as Record<string, unknown>
    const xAxisLabelObj = (xAxisObj.axisLabel || {}) as Record<string, unknown>

    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const gridObj = Array.isArray(input.grid) ? input.grid[0] || {} : input.grid || {}

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'mixLineBarLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Mix Line Bar Chart',
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
      xAxis: {
        ...xAxisObj,
        type: (xAxisObj.type as string) || 'category',
        data: (xAxisObj.data as unknown[]) || [],
        name: (xAxisObj.name as string) || '',
        nameTextStyle: {
          ...xAxisNameTextStyleObj,
          fontFamily: (xAxisNameTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          color: (xAxisNameTextStyleObj.color as string) || themeColors.text,
          fontSize: (xAxisNameTextStyleObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (xAxisNameTextStyleObj.fontWeight as string | number) || 'normal',
        },
        axisLabel: {
          ...xAxisLabelObj,
          fontFamily: (xAxisLabelObj.fontFamily as string) || 'Arial, sans-serif',
          color: (xAxisLabelObj.color as string) || themeColors.text,
          fontSize: (xAxisLabelObj.fontSize as number) || defaultTextStyle.fontSize,
          fontWeight: (xAxisLabelObj.fontWeight as string | number) || 'normal',
          rotate: (xAxisLabelObj.rotate as number) || 0,
        },
      },
      yAxis: yAxis,
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
