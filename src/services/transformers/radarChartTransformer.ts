import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { RadarSeriesOption } from 'echarts'

/**
 * Radar Chart JSON Transformer
 */
export class RadarChartTransformer implements ChartTransformer {
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
        .map((series: RadarSeriesOption, index: number) => {
          if (series.data?.length == 0) return

          const seriesData = series.data?.map((dataItem, dataIndex) => {
            const defaultSeriesColor = chartColors[dataIndex % chartColors.length]

            if (typeof dataItem === 'object' && dataItem !== null && !Array.isArray(dataItem)) {
              const radarDataItem = dataItem as NonNullable<RadarSeriesOption['data']>[number]

              if (typeof radarDataItem === 'object' && 'value' in radarDataItem) {
                return {
                  ...radarDataItem,
                  name: radarDataItem.name || `Radar ${dataIndex + 1}`,
                  value: Array.isArray(radarDataItem.value) ? radarDataItem.value : [],
                  itemStyle: {
                    ...(radarDataItem.itemStyle || {}),
                    color: radarDataItem.itemStyle?.color || defaultSeriesColor,
                  },
                  lineStyle: {
                    ...(radarDataItem.lineStyle || {}),
                    color: radarDataItem.lineStyle?.color || defaultSeriesColor,
                  },
                  areaStyle: {
                    ...(radarDataItem.areaStyle || {}),
                    color: radarDataItem.areaStyle?.color || `${defaultSeriesColor}33`,
                  },
                  label: {
                    ...(radarDataItem.label || {}),
                    show: radarDataItem.label?.show ?? true,
                    position: radarDataItem.label?.position || 'top',
                    color: radarDataItem.label?.color || themeColors.text,
                    fontSize: radarDataItem.label?.fontSize || 10,
                    fontWeight: radarDataItem.label?.fontWeight || 'normal',
                  },
                  symbol: radarDataItem.symbol || 'circle',
                  symbolSize: radarDataItem.symbolSize || 6,
                }
              }
            }

            if (Array.isArray(dataItem)) {
              return {
                name: `Radar Data ${dataIndex + 1}`,
                value: dataItem,
                itemStyle: {
                  color: defaultSeriesColor,
                },
                lineStyle: {
                  color: defaultSeriesColor,
                },
                areaStyle: {
                  color: `${defaultSeriesColor}33`,
                },
                label: {
                  show: true,
                  position: 'top',
                  color: themeColors.text,
                  fontSize: 10,
                  fontWeight: 'normal',
                },
                symbol: 'circle',
                symbolSize: 6,
              }
            }

            return {
              name: `Radar Data ${dataIndex + 1}`,
              value: [],
            }
          })

          return {
            ...series,
            name: series.name || `Radar ${index + 1}`,
            type: series.type || 'radar',
            data: seriesData,
          }
        })
        .filter(Boolean) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'radarLight',
      radar: {
        ...(input.radar || {}),
        center: input.radar?.center || ['50%', '50%'],
        radius: input.radar?.radius || '65%',
        indicator: input.radar?.indicator || [],
        shape: input.radar?.shape || 'polygon',
        splitNumber: input.radar?.splitNumber || 5,
        axisName: {
          ...(input.radar?.axisName || {}),
          color: input.radar?.axisName?.color || themeColors.text,
          fontSize: input.radar?.axisName?.fontSize || 12,
          fontWeight: input.radar?.axisName?.fontWeight || 'normal',
        },
        splitLine: {
          ...(input.radar?.splitLine || {}),
          lineStyle: {
            ...(input.radar?.splitLine?.lineStyle || {}),
            color: input.radar?.splitLine?.lineStyle?.color || themeColors.axis,
            width: input.radar?.splitLine?.lineStyle?.width || 1,
            type: input.radar?.splitLine?.lineStyle?.type || 'solid',
          },
        },
        splitArea: {
          ...(input.radar?.splitArea || {}),
          show: input.radar?.splitArea?.show ?? false,
        },
        axisLine: {
          ...(input.radar?.axisLine || {}),
          lineStyle: {
            ...(input.radar?.axisLine?.lineStyle || {}),
            color: input.radar?.axisLine?.lineStyle?.color || themeColors.axis,
            width: input.radar?.axisLine?.lineStyle?.width || 1,
            type: input.radar?.axisLine?.lineStyle?.type || 'solid',
          },
        },
      },
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Radar Chart',
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
