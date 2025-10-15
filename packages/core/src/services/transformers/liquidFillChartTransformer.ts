import { ColorManager } from '../../utils/colorManager'
import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Liquid Fill Chart JSON Transformer
 */
export class LiquidFillChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    // 正規化 series
    let inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    // 如果 series 為空但有 data，建立預設 series
    if (inputSeries.length === 0) {
      const inputData = input.data as unknown[]
      if (inputData && Array.isArray(inputData) && inputData.length > 0) {
        inputSeries = [
          {
            type: 'liquidFill',
            data: inputData,
          } as unknown as Record<string, unknown>,
        ]
      }
    }

    const series =
      inputSeries
        .map((s: unknown) => {
          const series = s as Record<string, unknown>
          if (!series.data || (Array.isArray(series.data) && series.data.length === 0))
            return undefined

          const dataLength = Array.isArray(series.data) ? series.data.length : 0

          const outlineObj = (series.outline || {}) as Record<string, unknown>
          const outlineItemStyleObj = (outlineObj.itemStyle || {}) as Record<string, unknown>
          const backgroundStyleObj = (series.backgroundStyle || {}) as Record<string, unknown>
          const itemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
          const labelObj = (series.label || {}) as Record<string, unknown>
          const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
          const emphasisItemStyleObj = (emphasisObj.itemStyle || {}) as Record<string, unknown>

          const color =
            series.color ||
            (() => {
              const returnColors = []
              for (let i = 0; i < dataLength; i++) {
                returnColors.push(chartColors[i % chartColors.length])
              }
              return returnColors
            })()

          const transformedSeries = {
            type: 'liquidFill',
            name: series.name as string,
            data: series.data as number[],
            color: color as string[],
            radius: (series.radius as string | number) || '80%',
            center: (series.center as [string | number, string | number]) || ['50%', '50%'],
            shape: (series.shape as string) || 'circle',
            amplitude: (series.amplitude as string | number) || 20,
            waveLength: (series.waveLength as string | number) || '80%',
            waveAnimation: (series.waveAnimation as boolean) ?? true,
            outline: {
              show: (outlineObj.show as boolean) ?? true,
              borderDistance: (outlineObj.borderDistance as number) ?? 3,
              itemStyle: {
                borderWidth: (outlineItemStyleObj.borderWidth as number) ?? 5,
                borderColor: (outlineItemStyleObj.borderColor as string) || themeColors.background,
                shadowBlur: (outlineItemStyleObj.shadowBlur as number) || 10,
                shadowColor: (outlineItemStyleObj.shadowColor as string) || themeColors.axis,
              },
            },
            backgroundStyle: {
              color: (backgroundStyleObj.color as string) || themeColors.background,
              borderColor: backgroundStyleObj.borderColor as string,
              borderWidth: backgroundStyleObj.borderWidth as number,
              shadowBlur: backgroundStyleObj.shadowBlur as number,
              shadowColor: backgroundStyleObj.shadowColor as string,
            },
            itemStyle: {
              opacity: (itemStyleObj.opacity as number) ?? 0.8,
              shadowBlur: (itemStyleObj.shadowBlur as number) ?? 20,
              shadowColor: (itemStyleObj.shadowColor as string) || 'rgba(0, 0, 0, 0.25)',
              ...itemStyleObj,
            },
            label: {
              show: (labelObj.show as boolean) ?? true,
              fontFamily: (labelObj.fontFamily as string) || 'sans-serif',
              fontSize: (labelObj.fontSize as number) || 20,
              color: (labelObj.color as string) || themeColors.text,
              insideColor: (labelObj.insideColor as string) || 'gray',
              formatter: (labelObj.formatter as string) || '{c}%',
              position: (labelObj.position as string) || 'inside',
              fontWeight: (labelObj.fontWeight as string) || 'normal',
              ...labelObj,
            },
            emphasis: {
              itemStyle: {
                opacity: (emphasisItemStyleObj.opacity as number) ?? 1,
                borderColor: (emphasisItemStyleObj.borderColor as string) || themeColors.background,
                borderWidth: (emphasisItemStyleObj.borderWidth as number) ?? 2,
                ...emphasisItemStyleObj,
              },
              ...emphasisObj,
            },
          }

          return transformedSeries
        })
        .filter((s: unknown): s is NonNullable<typeof s> => s != null) || []

    const titleObj = (Array.isArray(input.title) ? input.title[0] : input.title || {}) as Record<
      string,
      unknown
    >
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const xAxisObj = (Array.isArray(input.xAxis) ? input.xAxis[0] : input.xAxis || {}) as Record<
      string,
      unknown
    >

    const yAxisObj = (Array.isArray(input.yAxis) ? input.yAxis[0] : input.yAxis || {}) as Record<
      string,
      unknown
    >

    const legendObj = (
      Array.isArray(input.legend) ? input.legend[0] : input.legend || {}
    ) as Record<string, unknown>
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = (
      Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox || {}
    ) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    return {
      ...input,
      series: series as unknown,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Liquid Fill Chart',
        left: (titleObj.left as string) || 'center',
        top: (titleObj.top as number) ?? 20,
        textStyle: {
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || 'sans-serif',
          fontSize: (titleTextStyleObj.fontSize as number) || 18,
          fontWeight: (titleTextStyleObj.fontWeight as string) || 'bold',
          color: (titleTextStyleObj.color as string) || themeColors.text,
        },
      },
      xAxis: {
        ...xAxisObj,
        show: (xAxisObj.show as boolean) ?? false,
      },
      yAxis: {
        ...yAxisObj,
        show: (yAxisObj.show as boolean) ?? false,
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? false,
        left: (legendObj.left as string) || 'center',
        bottom: (legendObj.bottom as number) ?? 5,
        textStyle: {
          ...legendTextStyleObj,
          fontFamily: (legendTextStyleObj.fontFamily as string) || 'sans-serif',
          color: (legendTextStyleObj.color as string) || themeColors.text,
          fontSize: (legendTextStyleObj.fontSize as number) || 12,
          fontWeight: (legendTextStyleObj.fontWeight as string) || 'normal',
        },
      },
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        right: (toolboxObj.right as number) ?? 0,
        top: (toolboxObj.top as number) ?? 0,
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...saveAsImageObj,
            show: (saveAsImageObj.show as boolean) ?? true,
            title: (saveAsImageObj.title as string) || '儲存圖片',
            type: (saveAsImageObj.type as string) || 'png',
            backgroundColor: (saveAsImageObj.backgroundColor as string) || 'white',
          },
        },
      },
    } as ExtendedEChartsOption
  }
}
