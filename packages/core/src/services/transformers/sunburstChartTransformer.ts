import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

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

    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s: unknown, index: number) => {
        const series = s as Record<string, unknown>
        const data = series.data as Array<unknown> | undefined

        if (!data || data.length === 0) return undefined

        const processedData = this.processSunburstData(data, chartColors, 0)

        const name = (series.name as string) || `Sunburst ${index + 1}`
        const type = (series.type as string) || 'sunburst'
        const radius = (series.radius as [number | string, number | string]) || [0, '70%']
        const center = (series.center as [number | string, number | string]) || ['50%', '55%']
        const sort = series.sort || null
        const levels = (series.levels as Array<unknown>) || []

        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const focus = (emphasisObj.focus as string) || 'ancestor'

        const labelObj = (series.label || {}) as Record<string, unknown>
        const labelShow = (labelObj.show as boolean) ?? true
        const labelPosition = (labelObj.position as string) || 'top'
        const labelColor = (labelObj.color as string) || themeColors.text
        const labelFontSize = (labelObj.fontSize as number) || 10
        const labelFontWeight = (labelObj.fontWeight as string) || 'normal'
        const labelRotate = (labelObj.rotate as string) || 'radial'

        return {
          ...series,
          name,
          type,
          data: processedData,
          radius,
          center,
          sort,
          emphasis: {
            ...emphasisObj,
            focus,
          },
          label: {
            ...labelObj,
            show: labelShow,
            position: labelPosition,
            color: labelColor,
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            rotate: labelRotate,
          },
          levels,
        }
      })
      .filter(s => s !== null)

    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'sunburstLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Sunburst Chart',
        left: (titleObj.left as string | number) || 'center',
        top: (titleObj.top as string | number) || 10,
        textStyle: {
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          fontSize: (titleTextStyleObj.fontSize as number) || 16,
          fontWeight: (titleTextStyleObj.fontWeight as string) || 'bold',
          color: (titleTextStyleObj.color as string) || themeColors.text,
        },
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? false,
        left: (legendObj.left as string | number) || 'center',
        bottom: (legendObj.bottom as string | number) || 5,
        textStyle: {
          ...legendTextStyleObj,
          fontFamily: (legendTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          color: (legendTextStyleObj.color as string) || themeColors.text,
          fontSize: (legendTextStyleObj.fontSize as number) || 12,
          fontWeight: (legendTextStyleObj.fontWeight as string) || 'normal',
        },
      },
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        left: (toolboxObj.left as string | number) || 'right',
        top: (toolboxObj.top as string | number) || 'top',
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...saveAsImageObj,
            show: (saveAsImageObj.show as boolean) ?? true,
            title: (saveAsImageObj.title as string) || '下載圖片',
            name: (saveAsImageObj.name as string) || 'chart-image',
            backgroundColor: (saveAsImageObj.backgroundColor as string) || themeColors.background,
          },
        },
      },
    }

    return {
      ...input,
      ...chartOptions,
    } as unknown as ExtendedEChartsOption
  }

  /**
   * 遞迴處理旭日圖階層數據
   * @param data 原始數據
   * @param chartColors 圖表顏色配置
   * @param depth 當前深度（用於顏色分配）
   * @returns 處理後的旭日圖數據
   */
  private processSunburstData(
    data: Array<unknown>,
    chartColors: string[],
    depth: number = 0
  ): Array<Record<string, unknown>> {
    return data
      .map((dataItem: unknown, index: number) => {
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
      .filter((node: unknown): node is Record<string, unknown> => node !== undefined) as Array<
      Record<string, unknown>
    >
  }
}
