import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { SunburstSeriesOption } from 'echarts'

/**
 * Sunburst Chart JSON Transformer
 */
export class SunburstChartTransformer implements ChartTransformer {
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
        .map((series: SunburstSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          const processedData = this.processSunburstData(series.data, chartColors, 0)

          return {
            ...series,
            name: series.name || `Sunburst ${index + 1}`,
            type: series.type || 'sunburst',
            data: processedData,
            radius: series.radius || [0, '70%'],
            center: series.center || ['50%', '55%'],
            sort: series.sort || null,
            emphasis: {
              ...(series.emphasis || {}),
              focus: series.emphasis?.focus || 'ancestor',
            },
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'top',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 10,
              fontWeight: series.label?.fontWeight || 'normal',
              rotate: series.label?.rotate || 'radial',
            },
            levels: series.levels || [],
          }
        })
        .filter(
          (series: SunburstSeriesOption): series is NonNullable<typeof series> =>
            series !== undefined
        ) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'sunburstLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Sunburst Chart',
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

  /**
   * 遞迴處理旭日圖階層數據
   * @param data 原始數據
   * @param chartColors 圖表顏色配置
   * @param depth 當前深度（用於顏色分配）
   * @returns 處理後的旭日圖數據
   */
  private processSunburstData(
    data: NonNullable<SunburstSeriesOption['data']>,
    chartColors: string[],
    depth: number = 0
  ): NonNullable<SunburstSeriesOption['data']> {
    return data
      .map((dataItem, index) => {
        if (dataItem === null || dataItem === undefined) return undefined

        // 處理物件類型的節點
        if (
          typeof dataItem === 'object' &&
          !Array.isArray(dataItem) &&
          !(dataItem instanceof Date)
        ) {
          const sunburstNode = dataItem as Record<string, unknown>

          const itemStyle = sunburstNode.itemStyle
          const existingColor =
            itemStyle && typeof itemStyle === 'object' && 'color' in itemStyle
              ? (itemStyle as { color?: string }).color
              : undefined

          const nodeColor = existingColor || chartColors[(depth + index) % chartColors.length]

          const label = sunburstNode.label
          const labelShow =
            label && typeof label === 'object' && 'show' in label
              ? (label as { show?: boolean }).show
              : undefined

          const labelColor =
            label && typeof label === 'object' && 'color' in label
              ? (label as { color?: string }).color
              : undefined

          const nodeValue = sunburstNode.value
          const processedValue =
            typeof nodeValue === 'string' ||
            typeof nodeValue === 'number' ||
            nodeValue instanceof Date ||
            Array.isArray(nodeValue)
              ? nodeValue
              : undefined

          const processedNode = {
            ...sunburstNode,
            name: (sunburstNode.name as string) || `Node ${index + 1}`,
            value: processedValue,
            itemStyle: {
              ...(typeof itemStyle === 'object' && itemStyle !== null ? itemStyle : {}),
              color: nodeColor,
              // 根據深度調整透明度
              opacity: Math.max(0.6, 1 - depth * 0.1),
            },
            label: {
              ...(typeof label === 'object' && label !== null ? label : {}),
              show: labelShow ?? true,
              color: labelColor || '#00000070',
              fontSize: Math.max(10, 14 - depth * 2), // 根據深度調整字體大小
            },
          }

          // 遞迴處理子節點
          if (sunburstNode.children && Array.isArray(sunburstNode.children)) {
            const processedChildren = this.processSunburstData(
              sunburstNode.children,
              chartColors,
              depth + 1
            )
            Object.assign(processedNode, { children: processedChildren })
          }

          return processedNode
        }

        // 處理字串類型（簡單節點）
        if (typeof dataItem === 'string') {
          return {
            name: dataItem,
            value: 1, // 預設值
            itemStyle: {
              color: chartColors[(depth + index) % chartColors.length],
              opacity: Math.max(0.6, 1 - depth * 0.1),
            },
            label: {
              fontSize: Math.max(10, 14 - depth * 2),
              color: '#ffffff',
            },
          }
        }

        // 處理數值類型
        if (typeof dataItem === 'number') {
          return {
            name: `Node ${index + 1}`,
            value: dataItem,
            itemStyle: {
              color: chartColors[(depth + index) % chartColors.length],
              opacity: Math.max(0.6, 1 - depth * 0.1),
            },
            label: {
              fontSize: Math.max(10, 14 - depth * 2),
              color: '#ffffff',
            },
          }
        }

        return undefined
      })
      .filter((node): node is NonNullable<typeof node> => node !== undefined)
  }
}
