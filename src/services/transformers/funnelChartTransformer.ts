import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { FunnelSeriesOption } from 'echarts'

/**
 * Funnel Chart JSON Transformer
 */
export class FunnelChartTransformer implements ChartTransformer {
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
        .map((series: FunnelSeriesOption, index: number) => {
          if (!series.data || series.data?.length == 0) return

          const processedData =
            series.data
              ?.map((dataItem, funnelIndex) => {
                if (dataItem == null) return undefined

                if (typeof dataItem === 'object' && !Array.isArray(dataItem)) {
                  const funnelItem = dataItem
                  const seriesColor =
                    series.itemStyle?.color || chartColors[funnelIndex % chartColors.length]

                  return {
                    name: funnelItem.name || `Funnel ${funnelIndex + 1}`,
                    value: funnelItem.value,
                    itemStyle: {
                      color: funnelItem.itemStyle?.color || seriesColor,
                    },
                  }
                } else if (typeof dataItem === 'number') {
                  const seriesColor =
                    series.itemStyle?.color || chartColors[funnelIndex % chartColors.length]

                  return {
                    name: `Funnel ${funnelIndex + 1}`,
                    value: dataItem,
                    itemStyle: {
                      color: seriesColor,
                    },
                  }
                }

                return undefined
              })
              .filter((item): item is NonNullable<typeof item> => item !== undefined)
              .sort((a, b) => {
                const valueA = typeof a.value === 'number' ? a.value : 0
                const valueB = typeof b.value === 'number' ? b.value : 0
                return valueB - valueA
              }) || []

          return {
            ...series,
            name: series.name || `Funnel ${index + 1}`,
            type: series.type || 'funnel',
            left: series.left || '10%',
            top: series.top || 70,
            width: series.width || '80%',
            height: series.height || '75%',
            minSize: series.minSize || '0%',
            maxSize: series.maxSize || '100%',
            orient: series.orient || 'vertical',
            sort: series.sort || 'descending',
            gap: series.gap || 2,
            data: processedData,
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'inside',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
              formatter: series.label?.formatter || '{b}: {c}',
            },
            labelLine: {
              ...(series.labelLine || {}),
              show: series.labelLine?.show ?? false,
            },
            emphasis: {
              ...(series.emphasis || {}),
              itemStyle: {
                ...(series.emphasis?.itemStyle || {}),
                shadowBlur: series.emphasis?.itemStyle?.shadowBlur || 10,
                shadowOffsetX: series.emphasis?.itemStyle?.shadowOffsetX || 0,
                shadowColor: series.emphasis?.itemStyle?.shadowColor || themeColors.shadow,
              },
            },
          }
        })
        .filter(Boolean) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'funnelLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Funnel Chart',
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
