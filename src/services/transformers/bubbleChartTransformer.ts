import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { ScatterSeriesOption } from 'echarts'

/**
 * Bubble Chart JSON Transformer
 */
export class BubbleChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    let minSize: number | null = null
    let maxSize: number | null = null

    const series =
      input.series
        .map((series: ScatterSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          const seriesColor = series.itemStyle?.color || chartColors[index % chartColors.length]

          if (Array.isArray(series.data)) {
            const bubbleSizes: number[] = []

            series.data.forEach(item => {
              if (Array.isArray(item)) {
                // 數據格式：[x, y, size] 或 [x, y]
                const size = item[2]
                if (typeof size === 'number') {
                  bubbleSizes.push(size)
                }
              } else if (typeof item === 'object' && item !== null) {
                // 數據格式：{value: [x, y, size], name: string} 或類似格式
                const dataObj = item

                if (typeof dataObj === 'object' && 'value' in dataObj) {
                  const value = dataObj.value
                  if (Array.isArray(value) && typeof value[2] === 'number') {
                    bubbleSizes.push(value[2])
                  }
                }
              }
            })

            if (bubbleSizes.length > 0) {
              const currentMin = Math.min(...bubbleSizes)
              const currentMax = Math.max(...bubbleSizes)

              minSize = minSize === null ? currentMin : Math.min(minSize, currentMin)
              maxSize = maxSize === null ? currentMax : Math.max(maxSize, currentMax)
            }
          }

          return {
            ...series,
            name: series.name || `Bubble ${index + 1}`,
            type: series.type || 'scatter',
            data: series.data,
            itemStyle: {
              ...(series.itemStyle || {}),
              color: seriesColor,
              opacity: series.itemStyle?.opacity || 0.7,
            },
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? false,
              position: series.label?.position || 'top',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            emphasis: {
              ...(series.emphasis || {}),
              itemStyle: {
                ...(series.emphasis?.itemStyle || {}),
                borderColor: series.emphasis?.itemStyle?.borderColor || themeColors.background,
                borderWidth: series.emphasis?.itemStyle?.borderWidth || 2,
                opacity: series.emphasis?.itemStyle?.opacity || 1,
              },
            },
          }
        })
        .filter(
          (series: ScatterSeriesOption): series is NonNullable<typeof series> =>
            series !== undefined
        ) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'bubbleLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Bubble Chart',
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
      },
      visualMap: {
        ...(input.visualMap || {}),
        type: input.visualMap?.type || 'continuous',
        min: input.visualMap?.min || minSize,
        max: input.visualMap?.max || maxSize,
        show: input.visualMap?.show ?? false,
        dimension: input.visualMap?.dimension || 2,
        inRange: {
          ...(input.visualMap?.inRange || {}),
          symbolSize: input.visualMap?.inRange?.symbolSize || [5, 50],
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
