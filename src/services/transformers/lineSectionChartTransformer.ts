import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { LineSeriesOption } from 'echarts'

/**
 * Line Section Chart JSON Transformer
 */
export class LineSectionChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const chartColors = ColorManager.getChartSeriesColors()
    const themeColors = ColorManager.getThemeColors()
    const accentColors = ColorManager.getAccentColors()

    const series =
      input.series
        .map((series: LineSeriesOption, index: number) => {
          if (series.data?.length == 0) return

          const seriesColor =
            series.lineStyle?.color ||
            series.itemStyle?.color ||
            chartColors[index % chartColors.length]

          return {
            ...series,
            name: series.name || `Line ${index + 1}`,
            type: series.type || 'line',
            data: series.data,
            lineStyle: {
              ...(series.lineStyle || {}),
              color: seriesColor,
            },
            itemStyle: {
              ...(series.itemStyle || {}),
              color: seriesColor,
            },
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'top',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            smooth: series.smooth ?? true,
            symbol: series.symbol || 'circle',
            symbolSize: series.symbolSize || 6,
            markLine: {
              ...(series.markLine || {}),
            },
            markArea: {
              ...(series.markArea || {}),
              silent: series.markArea?.silent ?? true,
              itemStyle: {
                ...(series.markArea?.itemStyle || {}),
                color: series.markArea?.itemStyle?.color || `${accentColors.accent}30`,
              },
              data: series.markArea?.data || [],
            },
          }
        })
        .filter(Boolean) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'lineSectionsLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Line Sections Chart',
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
      xAxis: {
        ...(input.xAxis || {}),
        type: input.xAxis?.type || 'category',
        data: input.xAxis?.data || [],
        name: input.xAxis?.name || '',
        nameTextStyle: {
          ...(input.xAxis?.nameTextStyle || {}),
          fontFamily: input.xAxis?.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: input.xAxis?.nameTextStyle?.color || themeColors.text,
          fontSize: input.xAxis?.nameTextStyle?.fontSize || 12,
          fontWeight: input.xAxis?.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(input.xAxis?.axisLabel || {}),
          fontFamily: input.xAxis?.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: input.xAxis?.axisLabel?.color || themeColors.text,
          fontSize: input.xAxis?.axisLabel?.fontSize || 12,
          fontWeight: input.xAxis?.axisLabel?.fontWeight || 'normal',
          rotate: input.xAxis?.axisLabel?.rotate || 0,
        },
      },
      yAxis: {
        ...(input.yAxis || {}),
        type: input.yAxis?.type || 'value',
        name: input.yAxis?.name || '',
        nameTextStyle: {
          ...(input.yAxis?.nameTextStyle || {}),
          fontFamily: input.yAxis?.nameTextStyle?.fontFamily || 'Arial, sans-serif',
          color: input.yAxis?.nameTextStyle?.color || themeColors.text,
          fontSize: input.yAxis?.nameTextStyle?.fontSize || 12,
          fontWeight: input.yAxis?.nameTextStyle?.fontWeight || 'normal',
        },
        axisLabel: {
          ...(input.yAxis?.axisLabel || {}),
          fontFamily: input.yAxis?.axisLabel?.fontFamily || 'Arial, sans-serif',
          color: input.yAxis?.axisLabel?.color || themeColors.text,
          fontSize: input.yAxis?.axisLabel?.fontSize || 12,
          fontWeight: input.yAxis?.axisLabel?.fontWeight || 'normal',
        },
        min: input.yAxis?.min,
        max: input.yAxis?.max,
        interval: input.yAxis?.interval,
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
