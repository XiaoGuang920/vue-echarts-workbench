import { ColorManager } from '@/utils/colorManager'
import type { ChartTransformer } from '@/services/types'
import type { LiquidFillChartOption, LiquidFillSeriesOption } from '@/types/liquidFill'

/**
 * Liquid Fill Chart JSON Transformer
 */
export class LiquidFillChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: LiquidFillChartOption): Promise<LiquidFillChartOption> {
    const themeColors = ColorManager.getThemeColors()
    const chartColors = ColorManager.getChartSeriesColors()

    if (!input.series || input.series.length === 0) {
      if (input.data && input.data.length > 0) {
        input.series = [
          {
            type: 'liquidFill',
            data: input.data,
          },
        ]
      }
    }

    const series =
      input.series
        ?.map((series: LiquidFillSeriesOption) => {
          if (!series.data || (Array.isArray(series.data) && series.data.length === 0))
            return undefined

          const dataLength = Array.isArray(series.data) ? series.data.length : 0

          const color =
            series.color ||
            (() => {
              const returnColors = []
              for (let i = 0; i < dataLength; i++) {
                returnColors.push(chartColors[i % chartColors.length])
              }
              return returnColors
            })()

          const transformedSeries: LiquidFillSeriesOption = {
            type: 'liquidFill',
            name: series.name,
            data: series.data,
            color: color,
            radius: series.radius || '80%',
            center: series.center || ['50%', '50%'],
            shape: series.shape || 'circle',
            amplitude: series.amplitude || 20,
            waveLength: series.waveLength || '80%',
            waveAnimation: series.waveAnimation ?? true,
            outline: {
              show: series.outline?.show ?? true,
              borderDistance: series.outline?.borderDistance ?? 3,
              itemStyle: {
                borderWidth: series.outline?.itemStyle?.borderWidth ?? 5,
                borderColor: series.outline?.itemStyle?.borderColor || themeColors.background,
                shadowBlur: series.outline?.itemStyle?.shadowBlur || 10,
                shadowColor: series.outline?.itemStyle?.shadowColor || themeColors.axis,
              },
            },
            backgroundStyle: {
              color: series.backgroundStyle?.color || themeColors.background,
              borderColor: series.backgroundStyle?.borderColor,
              borderWidth: series.backgroundStyle?.borderWidth,
              shadowBlur: series.backgroundStyle?.shadowBlur,
              shadowColor: series.backgroundStyle?.shadowColor,
            },
            itemStyle: {
              opacity: series.itemStyle?.opacity ?? 0.8,
              shadowBlur: series.itemStyle?.shadowBlur ?? 20,
              shadowColor: series.itemStyle?.shadowColor || 'rgba(0, 0, 0, 0.25)',
              ...series.itemStyle,
            },
            label: {
              show: series.label?.show ?? true,
              fontFamily: series.label?.fontFamily || 'sans-serif',
              fontSize: series.label?.fontSize || 20,
              color: series.label?.color || themeColors.text,
              insideColor: series.label?.insideColor || 'gray',
              formatter: series.label?.formatter || '{c}%',
              position: series.label?.position || 'inside',
              fontWeight: series.label?.fontWeight || 'normal',
              ...series.label,
            },
            emphasis: {
              itemStyle: {
                opacity: series.emphasis?.itemStyle?.opacity ?? 1,
                borderColor: series.emphasis?.itemStyle?.borderColor || themeColors.background,
                borderWidth: series.emphasis?.itemStyle?.borderWidth ?? 2,
                ...series.emphasis?.itemStyle,
              },
              ...series.emphasis,
            },
          }

          return transformedSeries
        })
        .filter(
          (series: LiquidFillSeriesOption | undefined): series is LiquidFillSeriesOption =>
            series !== undefined
        ) || []

    return {
      ...input,
      series: series,
      title: {
        text: input.title?.text || 'Liquid Fill Chart',
        left: input.title?.left || 'center',
        top: input.title?.top ?? 20,
        textStyle: {
          fontFamily: input.title?.textStyle?.fontFamily || 'sans-serif',
          fontSize: input.title?.textStyle?.fontSize || 18,
          fontWeight: input.title?.textStyle?.fontWeight || 'bold',
          color: input.title?.textStyle?.color || themeColors.text,
          ...input.title?.textStyle,
        },
        ...input.title,
      },
      xAxis: {
        show: input.xAxis?.show ?? false,
        ...input.xAxis,
      },
      yAxis: {
        show: input.yAxis?.show ?? false,
        ...input.yAxis,
      },
      legend: {
        show: input.legend?.show ?? false,
        left: input.legend?.left || 'center',
        bottom: input.legend?.bottom ?? 5,
        textStyle: {
          fontFamily: input.legend?.textStyle?.fontFamily || 'sans-serif',
          color: input.legend?.textStyle?.color || themeColors.text,
          fontSize: input.legend?.textStyle?.fontSize || 12,
          fontWeight: input.legend?.textStyle?.fontWeight || 'normal',
          ...input.legend?.textStyle,
        },
        ...input.legend,
      },
      toolbox: {
        show: input.toolbox?.show ?? true,
        orient: input.toolbox?.orient || 'horizontal',
        right: input.toolbox?.right ?? 0,
        top: input.toolbox?.top ?? 0,
        feature: {
          saveAsImage: {
            show: input.toolbox?.feature?.saveAsImage?.show ?? true,
            title: input.toolbox?.feature?.saveAsImage?.title || '儲存圖片',
            type: input.toolbox?.feature?.saveAsImage?.type || 'png',
            backgroundColor: input.toolbox?.feature?.saveAsImage?.backgroundColor || 'white',
            ...input.toolbox?.feature?.saveAsImage,
          },
          ...input.toolbox?.feature,
        },
        ...input.toolbox,
      },
    }
  }
}
