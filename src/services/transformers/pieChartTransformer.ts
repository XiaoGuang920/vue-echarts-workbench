import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { PieSeriesOption } from 'echarts'

/**
 * Pie Chart JSON Transformer
 */
export class PieChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    const series =
      input.series
        .map((series: PieSeriesOption, index: number) => {
          if (!series.data || series.data?.length == 0) return

          const processedData =
            series.data
              .map((dataItem, pieIndex) => {
                if (
                  typeof dataItem === 'object' &&
                  dataItem !== null &&
                  !Array.isArray(dataItem) &&
                  !(dataItem instanceof Date)
                ) {
                  const barDataItem = dataItem

                  const seriesColor =
                    barDataItem.itemStyle?.color || chartColors[pieIndex % chartColors.length]

                  return {
                    ...barDataItem,
                    name: barDataItem.name || `Bar ${pieIndex + 1}`,
                    value: barDataItem.value ?? 0,
                    itemStyle: {
                      ...(barDataItem.itemStyle || {}),
                      color: barDataItem.itemStyle?.color || seriesColor,
                    },
                  }
                }

                if (typeof dataItem === 'number') {
                  const seriesColor =
                    series.itemStyle?.color || chartColors[pieIndex % chartColors.length]

                  return {
                    name: `Bar ${pieIndex + 1}`,
                    value: dataItem,
                    itemStyle: {
                      color: seriesColor,
                    },
                  }
                }

                if (Array.isArray(dataItem) && dataItem.length >= 2) {
                  const seriesColor =
                    series.itemStyle?.color || chartColors[pieIndex % chartColors.length]

                  return {
                    name: typeof dataItem[0] === 'string' ? dataItem[0] : `Bar ${pieIndex + 1}`,
                    value: typeof dataItem[1] === 'number' ? dataItem[1] : 0,
                    itemStyle: {
                      color: seriesColor,
                    },
                  }
                }

                const seriesColor =
                  series.itemStyle?.color || chartColors[pieIndex % chartColors.length]

                return {
                  name: `Pie ${pieIndex + 1}`,
                  value: 0,
                  itemStyle: {
                    color: seriesColor,
                  },
                }
              })
              .filter(Boolean) || []

          return {
            ...series,
            name: series.name || `Pie ${index + 1}`,
            type: series.type || 'pie',
            radis: series.radius || ['40%', '70%'],
            center: series.center || ['50%', '50%'],
            data: processedData,
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'top',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            emphasis: {
              ...(series.emphasis || {}),
              itemStyle: {
                ...(series.emphasis?.itemStyle || {}),
                shadowBlur: series.emphasis?.itemStyle?.shadowBlur || 10,
                shadowOffsetX: series.emphasis?.itemStyle?.shadowOffsetX || 0,
                shadowColor: series.emphasis?.itemStyle?.shadowColor || `${themeColors.text}80`,
              },
            },
          }
        })
        .filter(Boolean) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'pieLlight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Pie Chart',
        left: input.title?.left || 'center',
        top: input.title?.top || 10,
        textStyle: {
          ...(input.title?.textStyle || {}),
          fontFamily: input.title?.textStyle?.fontFamily || 'Arial, sans-serif',
          fontSize: input.title?.textStyle?.fontSize || 16,
          fontWeight: input.title?.textStyle?.fontWeight || 'bold',
          color: input.title?.textStyle?.color || themeColors.text,
        },
      },
      legend: {
        ...(input.legend || {}),
        show: input.legend?.show ?? true,
        left: input.legend?.left || 'center',
        bottom: input.legend?.bottom || 5,
        textStyle: {
          ...(input.legend?.textStyle || {}),
          fontFamily: input.legend?.textStyle?.fontFamily || 'Arial, sans-serif',
          color: input.legend?.textStyle?.color || themeColors.text,
          fontSize: input.legend?.textStyle?.fontSize || 12,
          fontWeight: input.legend?.textStyle?.fontWeight || 'normal',
        },
      },
      toolbox: {
        ...(input.toolbox || {}),
        show: input.toolbox?.show ?? true,
        orient: input.toolbox?.orient || 'horizontal',
        left: input.toolbox?.left || 'right',
        top: input.toolbox?.top || 'top',
        feature: {
          ...(input.toolbox?.feature || {}),
          saveAsImage: {
            ...(input.toolbox?.feature?.saveAsImage || {}),
            show: input.toolbox?.feature?.saveAsImage?.show ?? true,
            title: input.toolbox?.feature?.saveAsImage?.title || '下載圖片',
            name: input.toolbox?.feature?.saveAsImage?.name || 'chart-image',
            backgroundColor:
              input.toolbox?.feature?.saveAsImage?.backgroundColor || themeColors.background,
          },
        },
      },
    }

    return {
      ...input,
      ...chartOptions,
    }
  }
}
