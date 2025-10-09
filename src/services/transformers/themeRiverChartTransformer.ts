import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { ThemeRiverSeriesOption } from 'echarts'

/**
 * Theme River Chart JSON Transformer
 */
export class ThemeRiverChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    let uniqueNamesCount = 0

    const series =
      input.series
        ?.map((series: ThemeRiverSeriesOption, index: number) => {
          if (!series.data || (Array.isArray(series.data) && series.data.length === 0))
            return undefined

          if (Array.isArray(series.data)) {
            const uniqueNames = new Set<string>()
            series.data.forEach(item => {
              if (Array.isArray(item) && item.length >= 3) {
                uniqueNames.add(String(item[2]))
              }
            })
            uniqueNamesCount = uniqueNames.size
          }

          return {
            type: 'themeRiver' as const,
            name: series.name || `Theme River ${index + 1}`,
            data: series.data,
            label: {
              show: true,
              fontSize: 12,
              fontFamily: 'sans-serif',
              color: themeColors.text,
              ...(series.label || {}),
            },
            itemStyle: {
              ...(series.itemStyle || {}),
            },
            emphasis: {
              ...(series.emphasis || {}),
              itemStyle: {
                shadowBlur: 20,
                shadowColor: themeColors.shadow,
                ...(series.emphasis?.itemStyle || {}),
              },
            },
            ...series,
          } as ThemeRiverSeriesOption
        })
        .filter(
          (series: ThemeRiverSeriesOption | undefined): series is ThemeRiverSeriesOption =>
            series !== undefined
        ) || []

    const defaultColors = chartColors.slice(0, uniqueNamesCount)

    return {
      gridWidth: 4,
      gridHeight: 4,
      gridX: 0,
      gridY: 0,
      color: defaultColors,
      series: series,
      title: {
        text: 'Theme River Chart',
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
      legend: {
        show: true,
        left: 'center',
        bottom: 5,
        textStyle: {
          fontFamily: 'sans-serif',
          color: themeColors.text,
          ...(input.legend?.textStyle || {}),
        },
        ...(input.legend || {}),
      },
      singleAxis: {
        type: 'time',
        axisLabel: {
          color: themeColors.text,
          ...(input.singleAxis?.axisLabel || {}),
        },
        axisLine: {
          lineStyle: {
            color: themeColors.axis,
            ...(input.singleAxis?.axisLine?.lineStyle || {}),
          },
          ...(input.singleAxis?.axisLine || {}),
        },
        ...(input.singleAxis || {}),
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
          ...(input.toolbox?.feature || {}),
        },
        ...(input.toolbox || {}),
      },
      ...input,
    }
  }
}
