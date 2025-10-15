import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'
import type { BoxplotSeriesOption, ScatterSeriesOption, XAXisComponentOption } from 'echarts'

// Type guard for category axis
type CategoryAxisOption = XAXisComponentOption & {
  data?: (string | number)[]
  boundaryGap?: boolean | [string | number, string | number]
}

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

    // Type guards for component options
    const inputSeries = (
      Array.isArray(input.series) ? input.series : input.series ? [input.series] : []
    ) as (BoxplotSeriesOption | ScatterSeriesOption)[]
    const inputTitle = Array.isArray(input.title) ? input.title[0] : input.title
    const inputXAxis = Array.isArray(input.xAxis) ? input.xAxis[0] : input.xAxis
    const inputYAxis = Array.isArray(input.yAxis) ? input.yAxis[0] : input.yAxis
    const inputLegend = Array.isArray(input.legend) ? input.legend[0] : input.legend
    const inputGrid = Array.isArray(input.grid) ? input.grid[0] : input.grid
    const inputToolbox = Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox
    const inputTooltip = Array.isArray(input.tooltip) ? input.tooltip[0] : input.tooltip

    const series =
      inputSeries
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
        ...(inputTitle || {}),
        text: inputTitle?.text || 'Boxplot Chart',
        left: inputTitle?.left || 'center',
        top: inputTitle?.top || 20,
        textStyle: {
          ...(inputTitle?.textStyle || {}),
          fontFamily: inputTitle?.textStyle?.fontFamily || 'sans-serif',
          fontSize: inputTitle?.textStyle?.fontSize || 18,
          fontWeight: inputTitle?.textStyle?.fontWeight || 'bold',
          color: inputTitle?.textStyle?.color || themeColors.text,
        },
      },
      xAxis: {
        ...(inputXAxis || {}),
        type: inputXAxis?.type || 'category',
        data: (inputXAxis as CategoryAxisOption)?.data || [],
        name: inputXAxis?.name || '',
        boundaryGap: (inputXAxis as CategoryAxisOption)?.boundaryGap ?? true,
        nameTextStyle: {
          ...(inputXAxis?.nameTextStyle || {}),
          fontFamily: inputXAxis?.nameTextStyle?.fontFamily || 'sans-serif',
          fontSize: inputXAxis?.nameTextStyle?.fontSize || 14,
          color: inputXAxis?.nameTextStyle?.color || themeColors.text,
        },
        axisLabel: {
          ...(inputXAxis?.axisLabel || {}),
          fontFamily: inputXAxis?.axisLabel?.fontFamily || 'sans-serif',
          fontSize: inputXAxis?.axisLabel?.fontSize || 12,
          color: inputXAxis?.axisLabel?.color || themeColors.text,
          rotate: inputXAxis?.axisLabel?.rotate || 0,
        },
        axisLine: {
          ...(inputXAxis?.axisLine || {}),
          lineStyle: {
            ...(inputXAxis?.axisLine?.lineStyle || {}),
            color: inputXAxis?.axisLine?.lineStyle?.color || themeColors.axis,
          },
        },
        axisTick: {
          ...(inputXAxis?.axisTick || {}),
          lineStyle: {
            ...(inputXAxis?.axisTick?.lineStyle || {}),
            color: inputXAxis?.axisTick?.lineStyle?.color || themeColors.axis,
          },
        },
      },
      yAxis: {
        ...(inputYAxis || {}),
        type: inputYAxis?.type || 'value',
        name: inputYAxis?.name || '',
        nameTextStyle: {
          ...(inputYAxis?.nameTextStyle || {}),
          fontFamily: inputYAxis?.nameTextStyle?.fontFamily || 'sans-serif',
          fontSize: inputYAxis?.nameTextStyle?.fontSize || 14,
          color: inputYAxis?.nameTextStyle?.color || themeColors.text,
        },
        axisLabel: {
          ...(inputYAxis?.axisLabel || {}),
          fontFamily: inputYAxis?.axisLabel?.fontFamily || 'sans-serif',
          fontSize: inputYAxis?.axisLabel?.fontSize || 12,
          color: inputYAxis?.axisLabel?.color || themeColors.text,
        },
        axisLine: {
          ...(inputYAxis?.axisLine || {}),
          lineStyle: {
            ...(inputYAxis?.axisLine?.lineStyle || {}),
            color: inputYAxis?.axisLine?.lineStyle?.color || themeColors.axis,
          },
        },
        axisTick: {
          ...(inputYAxis?.axisTick || {}),
          lineStyle: {
            ...(inputYAxis?.axisTick?.lineStyle || {}),
            color: inputYAxis?.axisTick?.lineStyle?.color || themeColors.axis,
          },
        },
        splitLine: {
          ...(inputYAxis?.splitLine || {}),
          lineStyle: {
            color: themeColors.grid,
            type: 'dashed' as const,
            ...(inputYAxis?.splitLine?.lineStyle || {}),
          },
        },
      },
      tooltip: {
        ...(inputTooltip || {}),
        trigger: inputTooltip?.trigger || 'item',
        axisPointer: {
          ...(inputTooltip?.axisPointer || {}),
          type: inputTooltip?.axisPointer?.type || 'shadow',
        },
      },
      legend: {
        ...(inputLegend || {}),
        show: inputLegend?.show ?? true,
        left: inputLegend?.left || 'center',
        bottom: inputLegend?.bottom || 5,
        textStyle: {
          ...(inputLegend?.textStyle || {}),
          fontFamily: inputLegend?.textStyle?.fontFamily || 'sans-serif',
          fontSize: inputLegend?.textStyle?.fontSize || 13,
          color: inputLegend?.textStyle?.color || themeColors.text,
        },
      },
      grid: {
        ...(inputGrid || {}),
        left: inputGrid?.left || '10%',
        right: inputGrid?.right || '10%',
        top: inputGrid?.top || '20%',
        bottom: inputGrid?.bottom || '15%',
        containLabel: inputGrid?.containLabel ?? true,
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
        ...(inputToolbox || {}),
        show: inputToolbox?.show ?? true,
        orient: inputToolbox?.orient || 'horizontal',
        right: inputToolbox?.right ?? 0,
        top: inputToolbox?.top ?? 0,
        feature: {
          ...(inputToolbox?.feature || {}),
          saveAsImage: {
            show: true,
            title: '儲存圖片',
            type: 'png' as const,
            backgroundColor: 'white',
            ...(inputToolbox?.feature?.saveAsImage || {}),
          },
        },
      },
      backgroundColor: input.backgroundColor || themeColors.background,
    }
  }
}
