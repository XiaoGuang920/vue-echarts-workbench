import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { ParallelSeriesOption, ParallelComponentOption } from 'echarts'

/**
 * Parallel Chart JSON Transformer
 */
export class ParallelChartTransformer implements ChartTransformer {
  /**
   * 計算 parallelAxis 的預設配置
   * @param seriesData 系列數據
   * @param existingAxis 現有的 parallelAxis 配置
   * @returns parallelAxis 配置陣列
   */
  private calculateParallelAxis(
    seriesData: unknown[][],
    existingAxis?: ParallelComponentOption['parallelAxisDefault']
  ): ParallelComponentOption['parallelAxisDefault'][] {
    void existingAxis

    if (!seriesData || seriesData.length === 0) {
      return []
    }

    const firstDataItem = seriesData[0]
    if (!Array.isArray(firstDataItem)) {
      return []
    }

    const dimensionCount = firstDataItem.length
    const themeColors = ColorManager.getThemeColors()

    const axisConfigs = []

    for (let i = 0; i < dimensionCount; i++) {
      const values = seriesData
        .map(item => (Array.isArray(item) ? item[i] : null))
        .filter(val => val !== null && val !== undefined)

      const isNumeric = values.every(val => typeof val === 'number')

      if (isNumeric) {
        const numericValues = values as number[]
        const min = Math.min(...numericValues)
        const max = Math.max(...numericValues)
        const range = max - min
        const padding = range * 0.1

        axisConfigs.push({
          dim: i,
          name: `維度 ${i + 1}`,
          type: 'value' as const,
          min: Math.floor(min - padding),
          max: Math.ceil(max + padding),
          nameLocation: 'end' as const,
          nameGap: 20,
          nameTextStyle: {
            color: themeColors.text,
            fontSize: 12,
            fontWeight: 'bold',
          },
          axisLine: {
            lineStyle: {
              color: themeColors.axis,
              width: 1,
            },
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: themeColors.axis,
            },
          },
          axisLabel: {
            color: themeColors.text,
            fontSize: 11,
            formatter: (value: number) => {
              if (Math.abs(value) >= 1000) {
                return (value / 1000).toFixed(1) + 'K'
              }
              return value.toFixed(0)
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: themeColors.grid,
              type: 'dashed' as const,
            },
          },
        })
      } else {
        const uniqueValues = Array.from(new Set(values.map(String)))

        axisConfigs.push({
          dim: i,
          name: `維度 ${i + 1}`,
          type: 'category' as const,
          data: uniqueValues,
          nameLocation: 'end' as const,
          nameGap: 20,
          nameTextStyle: {
            color: themeColors.text,
            fontSize: 12,
            fontWeight: 'bold',
          },
          axisLine: {
            lineStyle: {
              color: themeColors.axis,
              width: 1,
            },
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: themeColors.axis,
            },
          },
          axisLabel: {
            color: themeColors.text,
            fontSize: 11,
            interval: 0,
            rotate: uniqueValues.length > 5 ? 15 : 0,
          },
        })
      }
    }

    return axisConfigs as ParallelComponentOption['parallelAxisDefault'][]
  }

  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    let allSeriesData: unknown[][] = []

    const series =
      input.series
        ?.map((series: ParallelSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          // 收集所有數據用於計算 parallelAxis
          if (Array.isArray(series.data)) {
            allSeriesData = [...allSeriesData, ...(series.data as unknown[][])]
          }

          return {
            ...series,
            name: series.name || `Parallel ${index + 1}`,
            type: 'parallel' as const,
            lineStyle: {
              width: 2,
              opacity: 0.5,
              color: chartColors[index % chartColors.length],
              ...(series.lineStyle || {}),
            },
            emphasis: {
              lineStyle: {
                width: 4,
                opacity: 1,
                ...(series.emphasis?.lineStyle || {}),
              },
              ...(series.emphasis || {}),
            },
            inactiveOpacity: series.inactiveOpacity ?? 0.05,
            activeOpacity: series.activeOpacity ?? 1,
            smooth: series.smooth ?? true,
            animation: series.animation ?? true,
          } as ParallelSeriesOption
        })
        .filter(
          (series: ParallelSeriesOption | undefined): series is ParallelSeriesOption =>
            series !== undefined
        ) || []

    // 計算 parallelAxis
    const parallelAxis =
      input.parallelAxis || this.calculateParallelAxis(allSeriesData, input.parallelAxisDefault)

    return {
      ...input,
      series: series,
      parallel: {
        left: '10%',
        right: '13%',
        top: '15%',
        bottom: '10%',
        parallelAxisDefault: {
          type: 'value' as const,
          nameLocation: 'end' as const,
          nameGap: 20,
          nameTextStyle: {
            color: themeColors.text,
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: themeColors.axis,
            },
          },
          axisTick: {
            lineStyle: {
              color: themeColors.axis,
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: themeColors.text,
          },
        },
        ...(input.parallel || {}),
      } as ParallelComponentOption,
      parallelAxis: parallelAxis,
      title: {
        text: 'Parallel Chart',
        left: 'center',
        top: 20,
        textStyle: {
          fontFamily: 'sans-serif',
          fontSize: 18,
          fontWeight: 'bold',
          color: themeColors.text,
          ...(input.title?.textStyle || {}),
        },
        ...(input.title || {}),
      },
      tooltip: {
        trigger: 'item',
        ...(input.tooltip || {}),
      },
      legend: {
        show: false,
        left: 'center',
        bottom: 5,
        textStyle: {
          fontFamily: 'sans-serif',
          color: themeColors.text,
          fontSize: 12,
          ...(input.legend?.textStyle || {}),
        },
        ...(input.legend || {}),
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        right: 0,
        top: 0,
        feature: {
          saveAsImage: {
            show: true,
            title: '儲存圖片',
            type: 'png',
            backgroundColor: 'white',
            ...(input.toolbox?.feature?.saveAsImage || {}),
          },
          restore: {
            show: true,
            title: '重置',
            ...(input.toolbox?.feature?.restore || {}),
          },
          ...(input.toolbox?.feature || {}),
        },
        ...(input.toolbox || {}),
      },
      backgroundColor: input.backgroundColor || themeColors.background,
    }
  }
}
