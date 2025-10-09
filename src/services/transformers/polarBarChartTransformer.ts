import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { BarSeriesOption } from 'echarts'

/**
 * Polar Bar Chart JSON Transformer
 */
export class PolarBarChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    let dataLength = 0

    const series =
      input.series
        .map((series: BarSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          dataLength = series.data.length

          return {
            name: `Polar Bar ${index + 1}`,
            type: 'bar',
            data: [],
            angleAxisIndex: 0,
            radiusAxisIndex: 0,
            coordinateSystem: 'polar',
            itemStyle: {
              color: chartColors[index % chartColors.length],
              borderColor: themeColors.background,
              borderWidth: 1,
              opacity: 0.8,
              ...(series.itemStyle || {}),
            },
            label: {
              show: false,
              position: 'middle',
              color: themeColors.text,
              fontSize: 12,
              fontWeight: 'normal',
              ...(series.label || {}),
            },
            emphasis: {
              itemStyle: {
                borderColor: themeColors.background,
                borderWidth: 2,
                opacity: 1,
                ...(series.emphasis?.itemStyle || {}),
              },
              ...(series.emphasis || {}),
            },
            ...series,
          }
        })
        .filter(
          (series: BarSeriesOption): series is NonNullable<typeof series> => series !== undefined
        ) || []

    let categories = input.angleAxis?.data || undefined
    if (!categories && dataLength > 0) {
      categories = Array.from({ length: dataLength }, (_, idx) => `類別${idx + 1}`)
    }

    const chartOptions = {
      gridWidth: 4,
      gridHeight: 4,
      gridX: 0,
      gridY: 0,
      tooltipType: 'polarBarLight',
      series: series,
      polar: {
        center: ['50%', '50%'],
        radius: '60%',
        ...(input.polar || {}),
      },
      angleAxis: {
        type: 'category',
        data: categories,
        startAngle: 90,
        axisLabel: {
          fontSize: 12,
          color: themeColors.text,
          ...(input.angleAxis?.axisLabel || {}),
        },
        ...(input.angleAxis || {}),
      },
      radiusAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          fontSize: 12,
          color: themeColors.text,
          ...(input.radiusAxis?.axisLabel || {}),
        },
        ...(input.radiusAxis || {}),
      },
      title: {
        text: 'Polar Bar Chart',
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
