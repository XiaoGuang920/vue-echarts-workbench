import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { BoxplotSeriesOption, ScatterSeriesOption } from 'echarts'

/**
 * Boxplot Chart JSON Transformer
 */
export class BoxplotChartTransformer implements ChartTransformer {
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
        ?.map((series: BoxplotSeriesOption | ScatterSeriesOption, index: number) => {
          if (!series.data || (Array.isArray(series.data) && series.data.length === 0))
            return undefined

          if (series.type === 'boxplot') {
            return {
              ...series,
              type: 'boxplot' as const,
              name: series.name || `Boxplot ${index + 1}`,
              data: series.data,
              boxWidth: (series as BoxplotSeriesOption).boxWidth || ['7%', '50%'],
              itemStyle: {
                color: chartColors[index % chartColors.length],
                borderColor: themeColors.axis,
                borderWidth: 2,
                ...(series.itemStyle || {}),
              },
              emphasis: {
                itemStyle: {
                  borderColor: themeColors.text,
                  borderWidth: 3,
                  shadowBlur: 10,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2,
                  shadowColor: themeColors.shadow,
                  ...(series.emphasis?.itemStyle || {}),
                },
                ...(series.emphasis || {}),
              },
            } as BoxplotSeriesOption
          }

          if (series.type === 'scatter') {
            return {
              ...series,
              type: 'scatter' as const,
              name: series.name || `Outliers ${index + 1}`,
              data: series.data,
              symbolSize: (series as ScatterSeriesOption).symbolSize || 8,
              itemStyle: {
                color: chartColors[index % chartColors.length],
                borderColor: themeColors.grid,
                borderWidth: 2,
                ...(series.itemStyle || {}),
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 15,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2,
                  shadowColor: themeColors.shadow,
                  ...(series.emphasis?.itemStyle || {}),
                },
                ...(series.emphasis || {}),
              },
            } as ScatterSeriesOption
          }

          return undefined
        })
        .filter(
          (
            series: BoxplotSeriesOption | ScatterSeriesOption | undefined
          ): series is BoxplotSeriesOption | ScatterSeriesOption => series !== undefined
        ) || []

    return {
      ...input,
      series: series,
      title: {
        text: 'Boxplot Chart',
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
      xAxis: {
        type: 'category',
        data: [],
        name: '',
        boundaryGap: true,
        nameTextStyle: {
          fontFamily: 'sans-serif',
          fontSize: 14,
          color: themeColors.text,
          ...(input.xAxis?.nameTextStyle || {}),
        },
        axisLabel: {
          fontFamily: 'sans-serif',
          fontSize: 12,
          color: themeColors.text,
          rotate: 0,
          ...(input.xAxis?.axisLabel || {}),
        },
        axisLine: {
          lineStyle: {
            color: themeColors.axis,
            ...(input.xAxis?.axisLine?.lineStyle || {}),
          },
          ...(input.xAxis?.axisLine || {}),
        },
        axisTick: {
          lineStyle: {
            color: themeColors.axis,
            ...(input.xAxis?.axisTick?.lineStyle || {}),
          },
          ...(input.xAxis?.axisTick || {}),
        },
        ...(input.xAxis || {}),
      },
      yAxis: {
        type: 'value',
        name: '',
        nameTextStyle: {
          fontFamily: 'sans-serif',
          fontSize: 14,
          color: themeColors.text,
          ...(input.yAxis?.nameTextStyle || {}),
        },
        axisLabel: {
          fontFamily: 'sans-serif',
          fontSize: 12,
          color: themeColors.text,
          ...(input.yAxis?.axisLabel || {}),
        },
        axisLine: {
          lineStyle: {
            color: themeColors.axis,
            ...(input.yAxis?.axisLine?.lineStyle || {}),
          },
          ...(input.yAxis?.axisLine || {}),
        },
        axisTick: {
          lineStyle: {
            color: themeColors.axis,
            ...(input.yAxis?.axisTick?.lineStyle || {}),
          },
          ...(input.yAxis?.axisTick || {}),
        },
        splitLine: {
          lineStyle: {
            color: themeColors.grid,
            type: 'dashed',
            ...(input.yAxis?.splitLine?.lineStyle || {}),
          },
          ...(input.yAxis?.splitLine || {}),
        },
        ...(input.yAxis || {}),
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
        ...(input.tooltip || {}),
      },
      legend: {
        show: true,
        left: 'center',
        bottom: 5,
        textStyle: {
          fontFamily: 'sans-serif',
          fontSize: 13,
          color: themeColors.text,
          ...(input.legend?.textStyle || {}),
        },
        ...(input.legend || {}),
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '15%',
        containLabel: true,
        ...(input.grid || {}),
      },
      dataZoom: input.dataZoom || [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 0,
          end: 100,
        },
      ],
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
      backgroundColor: input.backgroundColor || themeColors.background,
    }
  }
}
