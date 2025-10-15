import { ColorManager } from '../../utils/colorManager'
import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

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

    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || (Array.isArray(seriesData) && seriesData.length === 0)) return undefined

        const processedData = this.processGaugeData(seriesData, chartColors, themeColors)

        const axisLine = (series.axisLine || {}) as Record<string, unknown>
        const axisLineStyle = (axisLine.lineStyle || {}) as Record<string, unknown>

        const axisTick = (series.axisTick || {}) as Record<string, unknown>
        const axisTickLineStyle = (axisTick.lineStyle || {}) as Record<string, unknown>

        const axisLabel = (series.axisLabel || {}) as Record<string, unknown>

        const pointer = (series.pointer || {}) as Record<string, unknown>
        const pointerItemStyle = (pointer.itemStyle || {}) as Record<string, unknown>

        const title = (series.title || {}) as Record<string, unknown>
        const detail = (series.detail || {}) as Record<string, unknown>

        return {
          ...series,
          name: series.name || `Gauge ${index + 1}`,
          type: series.type || 'gauge',
          center: series.center || ['50%', '60%'],
          radius: series.radius || '75%',
          min: series.min ?? 0,
          max: series.max ?? 100,
          startAngle: series.startAngle ?? 225,
          endAngle: series.endAngle ?? -45,
          splitNumber: series.splitNumber ?? 10,
          data: processedData,
          axisLine: {
            ...axisLine,
            lineStyle: {
              ...axisLineStyle,
              width: axisLineStyle.width ?? 30,
              color: axisLineStyle.color || [
                [0.3, chartColors[0]],
                [0.7, chartColors[1]],
                [1, chartColors[2]],
              ],
            },
          },
          axisTick: {
            ...axisTick,
            show: axisTick.show ?? true,
            distance: axisTick.distance ?? -30,
            lineStyle: {
              ...axisTickLineStyle,
              color: axisTickLineStyle.color || themeColors.text,
              width: axisTickLineStyle.width ?? 2,
            },
          },
          axisLabel: {
            ...axisLabel,
            show: axisLabel.show ?? true,
            distance: axisLabel.distance ?? -70,
            color: axisLabel.color || themeColors.text,
            fontSize: axisLabel.fontSize ?? 12,
            fontWeight: axisLabel.fontWeight || 'normal',
          },
          pointer: {
            ...pointer,
            width: pointer.width ?? 6,
            itemStyle: {
              ...pointerItemStyle,
              color: pointerItemStyle.color || chartColors[0],
            },
          },
          title: {
            ...title,
            show: title.show ?? true,
            offsetCenter: title.offsetCenter || [0, '20%'],
            fontSize: title.fontSize ?? 14,
            color: title.color || themeColors.text,
            fontWeight: title.fontWeight || 'bold',
          },
          detail: {
            ...detail,
            show: detail.show ?? true,
            offsetCenter: detail.offsetCenter || [0, '40%'],
            fontSize: detail.fontSize ?? 20,
            color: detail.color || themeColors.text,
            fontWeight: detail.fontWeight || 'bold',
            formatter: detail.formatter || '{value}%',
          },
        }
      })
      .filter((series): series is NonNullable<typeof series> => series !== undefined)

    // 預設配置
    const defaultTitleTextStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: themeColors.text,
    }
    const defaultLegendTextStyle = {
      fontFamily: 'Arial, sans-serif',
      color: themeColors.text,
      fontSize: 12,
      fontWeight: 'normal' as const,
    }
    const defaultSaveAsImage = {
      show: true,
      title: '下載圖片',
      name: 'gauge-chart',
      backgroundColor: themeColors.background,
    }

    // 提取中間變數
    const titleObj = (Array.isArray(input.title) ? input.title[0] : input.title || {}) as Record<
      string,
      unknown
    >
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = (
      Array.isArray(input.legend) ? input.legend[0] : input.legend || {}
    ) as Record<string, unknown>
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = (
      Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox || {}
    ) as Record<string, unknown>
    const toolboxIconStyleObj = (toolboxObj.iconStyle || {}) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>
    const restoreObj = (toolboxFeatureObj.restore || {}) as Record<string, unknown>
    const dataViewObj = (toolboxFeatureObj.dataView || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'gauge-light',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Gauge Chart',
        left: (titleObj.left as string) || 'center',
        top: (titleObj.top as number) || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
        },
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? false,
        left: (legendObj.left as string) || 'center',
        bottom: (legendObj.bottom as number) || 5,
        textStyle: {
          ...defaultLegendTextStyle,
          ...legendTextStyleObj,
        },
      },
      grid: undefined,
      dataZoom: undefined,
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        left: (toolboxObj.left as string) || 'right',
        top: (toolboxObj.top as string) || 'top',
        iconStyle: {
          ...toolboxIconStyleObj,
          borderColor: themeColors.axis,
        },
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...defaultSaveAsImage,
            ...saveAsImageObj,
          },
          restore: {
            ...restoreObj,
            show: (restoreObj.show as boolean) ?? false,
          },
          dataView: {
            ...dataViewObj,
            show: (dataViewObj.show as boolean) ?? false,
          },
        },
      },
      backgroundColor: input.backgroundColor || themeColors.background,
    }

    return {
      ...input,
      ...chartOptions,
    } as unknown as ExtendedEChartsOption
  }

  /**
   * 處理儀表圖數據
   * @param data 原始數據
   * @param chartColors 圖表顏色配置
   * @param themeColors 主題顏色配置
   * @returns 處理後的數據
   */
  private processGaugeData(
    data: unknown[],
    chartColors: string[],
    themeColors: ReturnType<typeof ColorManager.getThemeColors>
  ): unknown[] {
    return data
      .map((dataItem: unknown, gaugeIndex: number) => {
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
      .filter((item: unknown): item is NonNullable<typeof item> => item !== undefined)
  }
}
