import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { PieSeriesOption } from 'echarts'

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

    const seriesCount = input.series.length
    const { cols, rows } = this.calculateGridLayout(seriesCount)
    const defaultRadius = this.calculateRadius(cols, rows)

    const series =
      input.series
        ?.map((series: PieSeriesOption, index: number) => {
          if (!series.data || (Array.isArray(series.data) && series.data.length === 0))
            return undefined

          const center = series.center || this.calculateCenter(index, cols, rows)
          const radius = series.radius || defaultRadius

          const processedData = Array.isArray(series.data)
            ? series.data.map((item, dataIndex: number) => {
                if (typeof item === 'number') {
                  return {
                    value: item,
                    name: `數據 ${dataIndex + 1}`,
                    itemStyle: {
                      color: chartColors[dataIndex % chartColors.length],
                    },
                  }
                }

                const dataItem = item as Record<string, unknown>
                return {
                  ...dataItem,
                  itemStyle: {
                    color: chartColors[dataIndex % chartColors.length],
                    ...(typeof dataItem.itemStyle === 'object' && dataItem.itemStyle !== null
                      ? dataItem.itemStyle
                      : {}),
                  },
                }
              })
            : series.data

          return {
            ...series,
            type: 'pie' as const,
            name: series.name || `Progress ${index + 1}`,
            radius: radius,
            center: center,
            avoidLabelOverlap: series.avoidLabelOverlap ?? false,
            data: processedData,
            itemStyle: {
              borderRadius: 10,
              borderColor: themeColors.background,
              borderWidth: 2,
              ...(series.itemStyle || {}),
            },
            label: {
              show: true,
              position: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              color: themeColors.text,
              formatter: '{a}\n{d}%',
              ...(series.label || {}),
            },
            labelLine: {
              show: false,
              ...(series.labelLine || {}),
            },
            emphasis: {
              scale: true,
              scaleSize: 5,
              ...(series.emphasis || {}),
            },
          } as PieSeriesOption
        })
        .filter(
          (series: PieSeriesOption | undefined): series is PieSeriesOption => series !== undefined
        ) || []

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
          ...(input.title?.textStyle || {}),
        },
        ...(input.title || {}),
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
            ...(input.toolbox?.feature?.saveAsImage || {}),
          },
          ...(input.toolbox?.feature || {}),
        },
        ...(input.toolbox || {}),
      },
    }

    return {
      ...chartOptions,
      ...input,
    }
  }
}
