import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { BarSeriesOption } from 'echarts'

/**
 * Bar Chart JSON Transformer
 */
export class BarChartTransformer implements ChartTransformer {
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
        .map((series: BarSeriesOption, index: number) => {
          if (!series.data || series.data?.length == 0) return

          const processedData =
            series.data
              .map((dataItem, barIndex) => {
                if (
                  typeof dataItem === 'object' &&
                  dataItem !== null &&
                  !Array.isArray(dataItem) &&
                  !(dataItem instanceof Date)
                ) {
                  const barDataItem = dataItem

                  const seriesColor =
                    barDataItem.itemStyle?.color || chartColors[barIndex % chartColors.length]

                  return {
                    ...barDataItem,
                    name: barDataItem.name || `Bar ${barIndex + 1}`,
                    value: barDataItem.value ?? 0,
                    itemStyle: {
                      ...(barDataItem.itemStyle || {}),
                      color: barDataItem.itemStyle?.color || seriesColor,
                    },
                  }
                }

                if (typeof dataItem === 'number') {
                  const seriesColor =
                    series.itemStyle?.color || chartColors[barIndex % chartColors.length]

                  return {
                    name: `Bar ${barIndex + 1}`,
                    value: dataItem,
                    itemStyle: {
                      color: seriesColor,
                    },
                  }
                }

                if (Array.isArray(dataItem) && dataItem.length >= 2) {
                  const seriesColor =
                    series.itemStyle?.color || chartColors[barIndex % chartColors.length]

                  return {
                    name: typeof dataItem[0] === 'string' ? dataItem[0] : `Bar ${barIndex + 1}`,
                    value: typeof dataItem[1] === 'number' ? dataItem[1] : 0,
                    itemStyle: {
                      color: seriesColor,
                    },
                  }
                }

                const seriesColor =
                  series.itemStyle?.color || chartColors[barIndex % chartColors.length]

                return {
                  name: `Bar ${barIndex + 1}`,
                  value: 0,
                  itemStyle: {
                    color: seriesColor,
                  },
                }
              })
              .filter(Boolean) || []

          return {
            ...series,
            name: series.name || `Bar ${index + 1}`,
            type: series.type || 'bar',
            data: processedData,
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'top',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            barWidth: series.barWidth || 'auto',
          }
        })
        .filter(Boolean) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'barLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Bar Chart',
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
      xAxis: {
        ...(input.xAxis || {}),
        type: input.xAxis?.type || 'category',
        data: input.xAxis?.data || [],
        name: input.xAxis?.name || '',
        nameTextStyle: {
          ...(input.xAxis?.nameTextStyle || {}),
          fontFamily: input.xAxis?.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: input.xAxis?.nameTextStyle?.color || themeColors.text,
          fontSize: input.xAxis?.nameTextStyle?.fontSize || 12,
          fontWeight: input.xAxis?.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(input.xAxis?.axisLabel || {}),
          fontFamily: input.xAxis?.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: input.xAxis?.axisLabel?.color || themeColors.text,
          fontSize: input.xAxis?.axisLabel?.fontSize || 12,
          fontWeight: input.xAxis?.axisLabel?.fontWeight || 'normal',
          rotate: input.xAxis?.axisLabel?.rotate || 0,
        },
      },
      yAxis: {
        ...(input.yAxis || {}),
        type: input.yAxis?.type || 'value',
        name: input.yAxis?.name || '',
        nameTextStyle: {
          ...(input.yAxis?.nameTextStyle || {}),
          fontFamily: input.yAxis?.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: input.yAxis?.nameTextStyle?.color || themeColors.text,
          fontSize: input.yAxis?.nameTextStyle?.fontSize || 12,
          fontWeight: input.yAxis?.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(input.yAxis?.axisLabel || {}),
          fontFamily: input.yAxis?.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: input.yAxis?.axisLabel?.color || themeColors.text,
          fontSize: input.yAxis?.axisLabel?.fontSize || 12,
          fontWeight: input.yAxis?.axisLabel?.fontWeight || 'normal',
        },
        min: input.yAxis?.min,
        max: input.yAxis?.max,
        interval: input.yAxis?.interval,
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
      dataZoom: input.dataZoom || [],
      grid: {
        ...(input.grid || {}),
        left: input.grid?.left || '8%',
        right: input.grid?.right || '10%',
        top: input.grid?.top || '20%',
        bottom: input.grid?.bottom || '15%',
        containLabel: input.grid?.containLabel ?? true,
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
