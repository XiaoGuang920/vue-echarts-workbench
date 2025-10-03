import { ColorManager } from '@/utils/colorManager'
import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { GaugeSeriesOption } from 'echarts'

/**
 * Gauge Chart JSON Transformer
 */
export class GaugeChartTransformer implements ChartTransformer {
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
        ?.map((series: GaugeSeriesOption, index: number) => {
          if (!series.data || series.data.length === 0) return undefined

          const processedData = this.processGaugeData(series.data, chartColors, themeColors)

          return {
            ...series,
            name: series.name || `Gauge ${index + 1}`,
            type: series.type || 'gauge',
            center: series.center || ['50%', '60%'],
            radius: series.radius || '75%',
            min: series.min || 0,
            max: series.max || 100,
            startAngle: series.startAngle || 225,
            endAngle: series.endAngle || -45,
            splitNumber: series.splitNumber || 10,
            data: processedData,
            axisLine: {
              ...(series.axisLine || {}),
              lineStyle: {
                ...(series.axisLine?.lineStyle || {}),
                width: series.axisLine?.lineStyle?.width || 30,
                color: series.axisLine?.lineStyle?.color || [
                  [0.3, chartColors[0]],
                  [0.7, chartColors[1]],
                  [1, chartColors[2]],
                ],
              },
            },
            axisTick: {
              ...(series.axisTick || {}),
              show: series.axisTick?.show ?? true,
              distance: series.axisTick?.distance || -30,
              lineStyle: {
                ...(series.axisTick?.lineStyle || {}),
                color: series.axisTick?.lineStyle?.color || themeColors.text,
                width: series.axisTick?.lineStyle?.width || 2,
              },
            },
            axisLabel: {
              ...(series.axisLabel || {}),
              show: series.axisLabel?.show ?? true,
              distance: series.axisLabel?.distance || -70,
              color: series.axisLabel?.color || themeColors.text,
              fontSize: series.axisLabel?.fontSize || 12,
              fontWeight: series.axisLabel?.fontWeight || 'normal',
            },
            pointer: {
              ...(series.pointer || {}),
              width: series.pointer?.width || 6,
              itemStyle: {
                ...(series.pointer?.itemStyle || {}),
                color: series.pointer?.itemStyle?.color || chartColors[0],
              },
            },
            title: {
              ...(series.title || {}),
              show: series.title?.show ?? true,
              offsetCenter: series.title?.offsetCenter || [0, '20%'],
              fontSize: series.title?.fontSize || 14,
              color: series.title?.color || themeColors.text,
              fontWeight: series.title?.fontWeight || 'bold',
            },
            detail: {
              ...(series.detail || {}),
              show: series.detail?.show ?? true,
              offsetCenter: series.detail?.offsetCenter || [0, '40%'],
              fontSize: series.detail?.fontSize || 20,
              color: series.detail?.color || themeColors.text,
              fontWeight: series.detail?.fontWeight || 'bold',
              formatter: series.detail?.formatter || '{value}%',
            },
          }
        })
        .filter(
          (serie: GaugeSeriesOption | undefined): serie is NonNullable<typeof serie> =>
            serie !== undefined
        ) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'gauge-light',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Gauge Chart',
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
      grid: undefined,
      dataZoom: undefined,
      toolbox: {
        ...(input.toolbox || {}),
        show: input.toolbox?.show ?? true,
        orient: input.toolbox?.orient || 'horizontal',
        left: input.toolbox?.left || 'right',
        top: input.toolbox?.top || 'top',
        iconStyle: {
          ...(input.toolbox?.iconStyle || {}),
          borderColor: themeColors.axis,
        },
        feature: {
          ...(input.toolbox?.feature || {}),
          saveAsImage: {
            ...(input.toolbox?.feature?.saveAsImage || {}),
            show: input.toolbox?.feature?.saveAsImage?.show ?? true,
            title: input.toolbox?.feature?.saveAsImage?.title || '下載圖片',
            name: input.toolbox?.feature?.saveAsImage?.name || 'gauge-chart',
            backgroundColor:
              input.toolbox?.feature?.saveAsImage?.backgroundColor || themeColors.background,
          },
          restore: {
            ...(input.toolbox?.feature?.restore || {}),
            show: input.toolbox?.feature?.restore?.show ?? false,
          },
          dataView: {
            ...(input.toolbox?.feature?.dataView || {}),
            show: input.toolbox?.feature?.dataView?.show ?? false,
          },
        },
      },
      backgroundColor: input.backgroundColor || themeColors.background,
    }

    return {
      ...input,
      ...chartOptions,
    }
  }

  /**
   * 處理儀表圖數據
   * @param data 原始數據
   * @param chartColors 圖表顏色配置
   * @param themeColors 主題顏色配置
   * @returns 處理後的數據
   */
  private processGaugeData(
    data: NonNullable<GaugeSeriesOption['data']>,
    chartColors: string[],
    themeColors: ReturnType<typeof ColorManager.getThemeColors>
  ): NonNullable<GaugeSeriesOption['data']> {
    return data
      .map((dataItem, gaugeIndex) => {
        if (dataItem == null) return undefined

        if (typeof dataItem === 'object' && !Array.isArray(dataItem)) {
          const gaugeItem = dataItem as Record<string, unknown>

          return {
            name: (gaugeItem.name as string) || `Gauge ${gaugeIndex + 1}`,
            value: (gaugeItem.value as number) || 0,
            title: {
              show: true,
              fontSize: 14,
              color: themeColors.text,
              fontWeight: 'bold' as const,
              offsetCenter: [0, '20%'] as [number | string, number | string],
              ...((gaugeItem.title as object) || {}),
            },
            detail: {
              show: true,
              fontSize: 20,
              color: themeColors.text,
              fontWeight: 'bold' as const,
              offsetCenter: [0, '40%'] as [number | string, number | string],
              formatter: '{value}%',
              ...((gaugeItem.detail as object) || {}),
            },
            itemStyle: {
              color: chartColors[gaugeIndex % chartColors.length],
              ...((gaugeItem.itemStyle as object) || {}),
            },
          }
        } else if (typeof dataItem === 'number') {
          return {
            name: `Gauge ${gaugeIndex + 1}`,
            value: dataItem,
            title: {
              show: true,
              fontSize: 14,
              color: themeColors.text,
              fontWeight: 'bold' as const,
              offsetCenter: [0, '20%'] as [number | string, number | string],
            },
            detail: {
              show: true,
              fontSize: 20,
              color: themeColors.text,
              fontWeight: 'bold' as const,
              offsetCenter: [0, '40%'] as [number | string, number | string],
              formatter: '{value}%',
            },
            itemStyle: {
              color: chartColors[gaugeIndex % chartColors.length],
            },
          }
        }

        return undefined
      })
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
  }
}
