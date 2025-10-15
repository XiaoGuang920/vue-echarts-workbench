import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Ring Progress Chart JSON Transformer
 */
export class RingProgressChartTransformer implements ChartTransformer {
  /**
   * 計算網格佈局
   * @param totalCount 總數量
   * @returns { cols, rows } 列數和行數
   */
  private calculateGridLayout(totalCount: number): { cols: number; rows: number } {
    if (totalCount === 1) return { cols: 1, rows: 1 }
    if (totalCount === 2) return { cols: 2, rows: 1 }
    if (totalCount <= 4) return { cols: 2, rows: 2 }
    if (totalCount <= 6) return { cols: 3, rows: 2 }
    if (totalCount <= 9) return { cols: 3, rows: 3 }
    if (totalCount <= 12) return { cols: 4, rows: 3 }
    // 超過12個，使用4列
    return { cols: 4, rows: Math.ceil(totalCount / 4) }
  }

  /**
   * 計算中心位置
   * @param index 索引
   * @param cols 列數
   * @param rows 行數
   * @returns [x%, y%] 中心位置
   */
  private calculateCenter(index: number, cols: number, rows: number): [string, string] {
    const col = index % cols
    const row = Math.floor(index / cols)

    // 計算每個格子的寬度和高度百分比
    const cellWidth = 100 / cols
    const cellHeight = 100 / rows

    // 計算中心點（格子中心）
    const x = cellWidth * (col + 0.5)
    const y = cellHeight * (row + 0.5)

    return [`${x}%`, `${y}%`]
  }

  /**
   * 計算半徑
   * @param cols 列數
   * @param rows 行數
   * @returns [innerRadius%, outerRadius%] 內外半徑
   */
  private calculateRadius(cols: number, rows: number): [string, string] {
    const maxDimension = Math.max(cols, rows)
    let baseRadius = 35

    if (maxDimension === 1) baseRadius = 70
    else if (maxDimension === 2) baseRadius = 40
    else if (maxDimension === 3) baseRadius = 28
    else if (maxDimension === 4) baseRadius = 22
    else baseRadius = 18

    const innerRadius = Math.floor(baseRadius * 0.7)
    const outerRadius = baseRadius

    return [`${innerRadius}%`, `${outerRadius}%`]
  }

  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    // Normalize series to array
    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const seriesCount = inputSeries.length
    const { cols, rows } = this.calculateGridLayout(seriesCount)
    const defaultRadius = this.calculateRadius(cols, rows)

    const series = inputSeries
      .map((s: unknown, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || (Array.isArray(seriesData) && seriesData.length === 0)) return null

        const center =
          (series.center as [string, string]) || this.calculateCenter(index, cols, rows)
        const radius = (series.radius as [string, string]) || defaultRadius

        const processedData = Array.isArray(seriesData)
          ? seriesData.map((item: unknown, dataIndex: number) => {
              const defaultColor = chartColors[dataIndex % chartColors.length]

              if (typeof item === 'number') {
                return {
                  value: item,
                  name: `數據 ${dataIndex + 1}`,
                  itemStyle: {
                    color: defaultColor,
                  },
                }
              }

              const dataItem = item as Record<string, unknown>
              const dataItemStyle = (dataItem.itemStyle || {}) as Record<string, unknown>

              return {
                ...dataItem,
                itemStyle: {
                  color: defaultColor,
                  ...dataItemStyle,
                },
              }
            })
          : seriesData

        const seriesItemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const seriesLabelObj = (series.label || {}) as Record<string, unknown>
        const seriesLabelLineObj = (series.labelLine || {}) as Record<string, unknown>
        const seriesEmphasisObj = (series.emphasis || {}) as Record<string, unknown>

        return {
          ...series,
          type: 'pie' as const,
          name: (series.name as string) || `Progress ${index + 1}`,
          radius: radius,
          center: center,
          avoidLabelOverlap: (series.avoidLabelOverlap as boolean) ?? false,
          data: processedData,
          itemStyle: {
            borderRadius: 10,
            borderColor: themeColors.background,
            borderWidth: 2,
            ...seriesItemStyleObj,
          },
          label: {
            show: true,
            position: 'center',
            fontSize: 14,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            color: themeColors.text,
            formatter: '{a}\n{d}%',
            ...seriesLabelObj,
          },
          labelLine: {
            show: false,
            ...seriesLabelLineObj,
          },
          emphasis: {
            scale: true,
            scaleSize: 5,
            ...seriesEmphasisObj,
          },
        }
      })
      .filter(s => s !== null)

    // Extract union types to intermediate variables
    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const xAxisObj = Array.isArray(input.xAxis) ? input.xAxis[0] || {} : input.xAxis || {}
    const yAxisObj = Array.isArray(input.yAxis) ? input.yAxis[0] || {} : input.yAxis || {}
    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: 4,
      gridHeight: 4,
      gridX: 0,
      gridY: 0,
      tooltipType: 'ringProgressLight',
      series: series,
      title: {
        text: 'Ring Progress Chart',
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
        ...xAxisObj,
      },
      yAxis: {
        show: false,
        ...yAxisObj,
      },
      legend: {
        show: false,
        ...legendObj,
      },
      dataZoom: [],
      toolbox: {
        show: true,
        orient: 'horizontal' as const,
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
      ...input,
      ...chartOptions,
    } as unknown as ExtendedEChartsOption
  }
}
