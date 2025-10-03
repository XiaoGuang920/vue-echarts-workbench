import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { HeatmapSeriesOption } from 'echarts'

/**
 * Heatmap Chart JSON Transformer
 */
export class HeatmapChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const gradientColors = [ColorManager.getGradientColor(0), ColorManager.getGradientColor(100)]

    let minSize: number = 0
    let maxSize: number = 0

    const series =
      input.series
        .map((series: HeatmapSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          if (Array.isArray(series.data)) {
            const heatmapSizes: number[] = []

            series.data.forEach(item => {
              if (Array.isArray(item)) {
                // 數據格式：[x, y, size] 或 [x, y]
                const size = item[2]
                if (typeof size === 'number') {
                  heatmapSizes.push(size)
                }
              } else if (typeof item === 'object' && item !== null) {
                // 數據格式：{value: [x, y, size], name: string} 或類似格式
                const dataObj = item

                if (typeof dataObj === 'object' && 'value' in dataObj) {
                  const value = dataObj.value
                  if (Array.isArray(value) && typeof value[2] === 'number') {
                    heatmapSizes.push(value[2])
                  }
                }
              }
            })

            if (heatmapSizes.length > 0) {
              const currentMin = Math.min(...heatmapSizes)
              const currentMax = Math.max(...heatmapSizes)

              minSize = minSize === 0 ? currentMin : Math.min(minSize, currentMin)
              maxSize = maxSize === 0 ? currentMax : Math.max(maxSize, currentMax)
            }
          }

          return {
            ...series,
            name: series.name || `Heatmap ${index + 1}`,
            type: series.type || 'heatmap',
            data: series.data,
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? false,
              position: series.label?.position || 'inside',
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
          (series: HeatmapSeriesOption): series is NonNullable<typeof series> =>
            series !== undefined
        ) || []

    console.log(minSize, maxSize)

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'heatmapLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Heatmap Chart',
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
        type: input.yAxis?.type || 'category',
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
        show: input.visualMap?.show ?? true,
        min: input.visualMap?.min || minSize * 0.8,
        max: input.visualMap?.max || maxSize * 1.2,
        left: input.visualMap?.left || 'center',
        bottom: input.visualMap?.bottom || '10%',
        orient: input.visualMap?.orient || 'horizontal',
        text: input.visualMap?.text || ['高', '低'],
        textStyle: {
          ...(input.visualMap?.textStyle || {}),
          fontFamily: input.visualMap?.textStyle?.fontFamily || 'Arial, sans-serif',
          color: input.visualMap?.textStyle?.color || themeColors.text,
          fontSize: input.visualMap?.textStyle?.fontSize || 12,
          fontWeight: input.visualMap?.textStyle?.fontWeight || 'normal',
        },
        inRange: {
          ...(input.visualMap?.inRange || {}),
          color: input.visualMap?.inRange?.color || gradientColors,
        },
      },
      legend: {
        ...(input.legend || {}),
        show: input.legend?.show ?? false,
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
