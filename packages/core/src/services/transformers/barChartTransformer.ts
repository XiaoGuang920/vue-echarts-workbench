import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'
import type { BarSeriesOption, XAXisComponentOption, YAXisComponentOption } from 'echarts'

type CategoryAxisOption = XAXisComponentOption & { data?: (string | number)[] }
type ValueAxisOption = YAXisComponentOption & { interval?: number }

/**
 * Bar Chart JSON Transformer
 */
export class BarChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()

    const inputSeries = (
      Array.isArray(input.series) ? input.series : input.series ? [input.series] : []
    ) as BarSeriesOption[]
    const inputTitle = Array.isArray(input.title) ? input.title[0] : input.title
    const inputXAxis = Array.isArray(input.xAxis) ? input.xAxis[0] : input.xAxis
    const inputYAxis = Array.isArray(input.yAxis) ? input.yAxis[0] : input.yAxis
    const inputLegend = Array.isArray(input.legend) ? input.legend[0] : input.legend
    const inputGrid = Array.isArray(input.grid) ? input.grid[0] : input.grid
    const inputToolbox = Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox

    const series = inputSeries
      .map((series: BarSeriesOption, index: number) => {
        if (!series.data || series.data?.length == 0) return

        const processedData =
          series.data
            .map((dataItem, barIndex) => {
              if (
                typeof dataItem === 'object' &&
                dataItem !== null &&
                !Array.isArray(dataItem) &&
                !(dataItem instanceof Date)
              ) {
                const barDataItem = dataItem

                const seriesColor =
                  barDataItem.itemStyle?.color || chartColors[barIndex % chartColors.length]

                return {
                  ...barDataItem,
                  name: barDataItem.name || `Bar ${barIndex + 1}`,
                  value: barDataItem.value ?? 0,
                  itemStyle: {
                    ...(barDataItem.itemStyle || {}),
                    color: barDataItem.itemStyle?.color || seriesColor,
                  },
                }
              }

              if (typeof dataItem === 'number') {
                const seriesColor =
                  series.itemStyle?.color || chartColors[barIndex % chartColors.length]

                return {
                  name: `Bar ${barIndex + 1}`,
                  value: dataItem,
                  itemStyle: {
                    color: seriesColor,
                  },
                }
              }

              if (Array.isArray(dataItem) && dataItem.length >= 2) {
                const seriesColor =
                  series.itemStyle?.color || chartColors[barIndex % chartColors.length]

                return {
                  name: typeof dataItem[0] === 'string' ? dataItem[0] : `Bar ${barIndex + 1}`,
                  value: typeof dataItem[1] === 'number' ? dataItem[1] : 0,
                  itemStyle: {
                    color: seriesColor,
                  },
                }
              }

              const seriesColor =
                series.itemStyle?.color || chartColors[barIndex % chartColors.length]

              return {
                name: `Bar ${barIndex + 1}`,
                value: 0,
                itemStyle: {
                  color: seriesColor,
                },
              }
            })
            .filter(Boolean) || []

        return {
          ...series,
          name: series.name || `Bar ${index + 1}`,
          type: series.type || 'bar',
          data: processedData,
          label: {
            ...(series.label || {}),
            show: series.label?.show ?? true,
            position: series.label?.position || 'top',
            color: series.label?.color || themeColors.text,
            fontSize: series.label?.fontSize || 10,
            fontWeight: series.label?.fontWeight || 'normal',
          },
          barWidth: series.barWidth || 'auto',
        }
      })
      .filter(Boolean) as BarSeriesOption[]

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'barLight',
      series: series,
      title: {
        ...(inputTitle || {}),
        text: inputTitle?.text || 'Bar Chart',
        left: inputTitle?.left || 'center',
        top: inputTitle?.top || 10,
        textStyle: {
          ...(inputTitle?.textStyle || {}),
          fontFamily: inputTitle?.textStyle?.fontFamily || 'Arial, sans-serif',
          fontSize: inputTitle?.textStyle?.fontSize || 16,
          fontWeight: inputTitle?.textStyle?.fontWeight || 'bold',
          color: inputTitle?.textStyle?.color || themeColors.text,
        },
      },
      xAxis: {
        ...(inputXAxis || {}),
        type: inputXAxis?.type || 'category',
        data: (inputXAxis as CategoryAxisOption)?.data || [],
        name: inputXAxis?.name || '',
        nameTextStyle: {
          ...(inputXAxis?.nameTextStyle || {}),
          fontFamily: inputXAxis?.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: inputXAxis?.nameTextStyle?.color || themeColors.text,
          fontSize: inputXAxis?.nameTextStyle?.fontSize || 12,
          fontWeight: inputXAxis?.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(inputXAxis?.axisLabel || {}),
          fontFamily: inputXAxis?.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: inputXAxis?.axisLabel?.color || themeColors.text,
          fontSize: inputXAxis?.axisLabel?.fontSize || 12,
          fontWeight: inputXAxis?.axisLabel?.fontWeight || 'normal',
          rotate: inputXAxis?.axisLabel?.rotate || 0,
        },
      },
      yAxis: {
        ...(inputYAxis || {}),
        type: inputYAxis?.type || 'value',
        name: inputYAxis?.name || '',
        nameTextStyle: {
          ...(inputYAxis?.nameTextStyle || {}),
          fontFamily: inputYAxis?.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: inputYAxis?.nameTextStyle?.color || themeColors.text,
          fontSize: inputYAxis?.nameTextStyle?.fontSize || 12,
          fontWeight: inputYAxis?.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(inputYAxis?.axisLabel || {}),
          fontFamily: inputYAxis?.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: inputYAxis?.axisLabel?.color || themeColors.text,
          fontSize: inputYAxis?.axisLabel?.fontSize || 12,
          fontWeight: inputYAxis?.axisLabel?.fontWeight || 'normal',
        },
        min: inputYAxis?.min,
        max: inputYAxis?.max,
        interval: (inputYAxis as ValueAxisOption)?.interval,
      },
      legend: {
        ...(inputLegend || {}),
        show: inputLegend?.show ?? true,
        left: inputLegend?.left || 'center',
        bottom: inputLegend?.bottom || 5,
        textStyle: {
          ...(inputLegend?.textStyle || {}),
          fontFamily: inputLegend?.textStyle?.fontFamily || 'Arial, sans-serif',
          color: inputLegend?.textStyle?.color || themeColors.text,
          fontSize: inputLegend?.textStyle?.fontSize || 12,
          fontWeight: inputLegend?.textStyle?.fontWeight || 'normal',
        },
      },
      dataZoom: input.dataZoom || [],
      grid: {
        ...(inputGrid || {}),
        left: inputGrid?.left || '8%',
        right: inputGrid?.right || '10%',
        top: inputGrid?.top || '20%',
        bottom: inputGrid?.bottom || '15%',
        containLabel: inputGrid?.containLabel ?? true,
      },
      toolbox: {
        ...(inputToolbox || {}),
        show: inputToolbox?.show ?? true,
        orient: inputToolbox?.orient || 'horizontal',
        left: inputToolbox?.left || 'right',
        top: inputToolbox?.top || 'top',
        feature: {
          ...(inputToolbox?.feature || {}),
          saveAsImage: {
            ...(inputToolbox?.feature?.saveAsImage || {}),
            show: inputToolbox?.feature?.saveAsImage?.show ?? true,
            title: inputToolbox?.feature?.saveAsImage?.title || '下載圖片',
            name: inputToolbox?.feature?.saveAsImage?.name || 'chart-image',
            backgroundColor:
              inputToolbox?.feature?.saveAsImage?.backgroundColor || themeColors.background,
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
