import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { CandlestickSeriesOption } from 'echarts'

/**
 * Candlestick Chart JSON Transformer
 */
export class CandlestickChartTransformer implements ChartTransformer {
  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const statusColors = ColorManager.getStatusColors()
    const themeColors = ColorManager.getThemeColors()

    const series =
      input.series
        .map((series: CandlestickSeriesOption, index: number) => {
          if (series.data?.length == 0) return

          return {
            ...series,
            name: series.name || `Candlestick ${index + 1}`,
            type: series.type || 'candlestick',
            data: series.data,
            itemStyle: {
              ...(series.itemStyle || {}),
              color: series.itemStyle?.color || statusColors.success,
              color0: series.itemStyle?.color0 || statusColors.error,
              borderColor: series.itemStyle?.borderColor || statusColors.success,
              borderColor0: series.itemStyle?.borderColor0 || statusColors.error,
              borderWidth: series.itemStyle?.borderWidth || 1,
            },
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? false,
              position: series.label?.position || 'top',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            emphasis: {
              ...(series.emphasis || {}),
              itemStyle: {
                ...(series.emphasis?.itemStyle || {}),
                color: series.emphasis?.itemStyle?.color || statusColors.success,
                color0: series.emphasis?.itemStyle?.color0 || statusColors.error,
                borderColor: series.emphasis?.itemStyle?.borderColor || statusColors.success,
                borderColor0: series.emphasis?.itemStyle?.borderColor0 || statusColors.error,
                borderWidth: series.emphasis?.itemStyle?.borderWidth || 2,
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
      tooltipType: input.tooltipType || 'candlestickLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Candlestick Chart',
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
          rotate: input.xAxis?.axisLabel?.rotate || 45,
        },
        scale: input.xAxis?.scale || true,
        boundaryGap: input.xAxis?.boundaryGap || true,
        axisLine: {
          ...(input.xAxis?.axisLine || {}),
          onZero: input.xAxis?.axisLine?.onZero || false,
        },
        splitLine: {
          ...(input.xAxis?.splitLine || {}),
          show: input.xAxis?.splitLine?.show ?? false,
        },
        min: input.xAxis?.min || 'dataMin',
        max: input.xAxis?.max || 'dataMax',
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
