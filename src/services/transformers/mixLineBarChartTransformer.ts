import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { BarSeriesOption, LineSeriesOption, YAXisComponentOption } from 'echarts'

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

    const series =
      input.series
        .map((series: BarSeriesOption | LineSeriesOption, index: number) => {
          if (!series.data || series.data?.length == 0) return

          const seriesColor = series.itemStyle?.color || chartColors[index % chartColors.length]

          if (series.type == 'bar') {
            return {
              name: series.name || `Bar ${index + 1}`,
              type: 'bar',
              data: series.data,
              itemStyle: {
                ...(series.itemStyle || {}),
                color: series.itemStyle?.color || seriesColor,
              },
              yAxisIndex: series.yAxisIndex || 0,
              barGap: series.barGap || '30%',
              emphasis: {
                ...(series.emphasis || {}),
                itemStyle: {
                  ...(series.emphasis?.itemStyle || {}),
                  shadowBlur: series.emphasis?.itemStyle?.shadowBlur || 10,
                  shadowColor: series.emphasis?.itemStyle?.shadowColor || `${seriesColor}88`,
                },
              },
            }
          } else if (series.type == 'line') {
            return {
              name: series.name || `Line ${index + 1}`,
              type: 'line',
              data: series.data,
              lineStyle: {
                ...(series.lineStyle || {}),
                color: series.lineStyle?.color || seriesColor,
                width: series.lineStyle?.width || 2,
              },
              itemStyle: {
                ...(series.itemStyle || {}),
                color: series.itemStyle?.color || seriesColor,
                borderColor: series.itemStyle?.borderColor || themeColors.background,
                borderWidth: series.itemStyle?.borderWidth || 2,
              },
              symbol: series.symbol || 'circle',
              symbolSize: series.symbolSize || 6,
              yAxisIndex: series.yAxisIndex || 1,
              smooth: series.smooth ?? true,
              emphasis: {
                ...(series.emphasis || {}),
                itemStyle: {
                  ...(series.emphasis?.itemStyle || {}),
                  borderWidth: series.emphasis?.itemStyle?.borderWidth || 3,
                  shadowBlur: series.emphasis?.itemStyle?.shadowBlur || 10,
                  shadowColor: series.emphasis?.itemStyle?.shadowColor || `${seriesColor}88`,
                },
              },
            }
          }

          return null
        })
        .filter(Boolean) || []

    const yAxis = input.yAxis.map((yAxisItem: YAXisComponentOption, index: number) => {
      return {
        name: yAxisItem.name || (index === 0 ? 'Bar Value' : 'Line Value'),
        type: yAxisItem.type || 'value',
        position: yAxisItem.position || (index === 0 ? 'left' : 'right'),
        nameTextStyle: {
          ...(yAxisItem.nameTextStyle || {}),
          fontFamily: yAxisItem.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: yAxisItem.nameTextStyle?.color || themeColors.text,
          fontSize: yAxisItem.nameTextStyle?.fontSize || 12,
          fontWeight: yAxisItem.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(yAxisItem.axisLabel || {}),
          fontFamily: yAxisItem.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: yAxisItem.axisLabel?.color || themeColors.text,
          fontSize: yAxisItem.axisLabel?.fontSize || 12,
          fontWeight: yAxisItem.axisLabel?.fontWeight || 'normal',
        },
        axisLine: {
          ...(yAxisItem.axisLine || {}),
          lineStyle: {
            ...(yAxisItem.axisLine?.lineStyle || {}),
            color: yAxisItem.axisLine?.lineStyle?.color || themeColors.axis,
          },
        },
      }
    })

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'mixLineBarLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Mix Line Bar Chart',
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
        type: input.xAxis?.type || 'value',
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
      yAxis: yAxis,
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
