import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Tree Chart JSON Transformer
 */
export class TreeChartTransformer implements ChartTransformer {
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

        const processedData = this.processTreeData(data, chartColors, themeColors, 0)

        const name = (series.name as string) || `Tree ${index + 1}`
        const type = (series.type as string) || 'tree'
        const top = (series.top as string | number) || '5%'
        const left = (series.left as string | number) || '5%'
        const bottom = (series.bottom as string | number) || '5%'
        const right = (series.right as string | number) || '5%'
        const symbol = (series.symbol as string) || 'circle'
        const symbolSize = (series.symbolSize as number) || 7
        const orient = (series.orient as string) || 'horizontal'
        const layout = (series.layout as string) || 'orthogonal'
        const roam = (series.roam as boolean) ?? false
        const expandAndCollapse = (series.expandAndCollapse as boolean) ?? true
        const initialTreeDepth = (series.initialTreeDepth as number) ?? -1
        const animationDuration = (series.animationDuration as number) || 550
        const animationEasing = (series.animationEasing as string) || 'linear'

        const lineStyleObj = (series.lineStyle || {}) as Record<string, unknown>
        const lineStyleColor = (lineStyleObj.color as string) || themeColors.axis
        const lineStyleWidth = (lineStyleObj.width as number) || 1
        const lineStyleType = (lineStyleObj.type as string) || 'solid'

        const labelObj = (series.label || {}) as Record<string, unknown>
        const labelShow = (labelObj.show as boolean) ?? true
        const labelPosition = (labelObj.position as string) || 'left'
        const labelColor = (labelObj.color as string) || themeColors.text
        const labelFontSize = (labelObj.fontSize as number) || 11
        const labelFontWeight = (labelObj.fontWeight as string) || 'normal'

        const leavesObj = (series.leaves || {}) as Record<string, unknown>
        const leavesLabelObj = (leavesObj.label || {}) as Record<string, unknown>
        const leavesLabelShow = (leavesLabelObj.show as boolean) ?? true
        const leavesLabelPosition = (leavesLabelObj.position as string) || 'right'
        const leavesLabelColor = (leavesLabelObj.color as string) || themeColors.text
        const leavesLabelFontSize = (leavesLabelObj.fontSize as number) || 11
        const leavesLabelFontWeight = (leavesLabelObj.fontWeight as string) || 'normal'

        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisFocus = (emphasisObj.focus as string) || 'descendant'

        return {
          ...series,
          name,
          type,
          data: processedData,
          top,
          left,
          bottom,
          right,
          symbol,
          symbolSize,
          orient,
          layout,
          roam,
          expandAndCollapse,
          initialTreeDepth,
          lineStyle: {
            ...lineStyleObj,
            color: lineStyleColor,
            width: lineStyleWidth,
            type: lineStyleType,
          },
          label: {
            ...labelObj,
            show: labelShow,
            position: labelPosition,
            color: labelColor,
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
          },
          leaves: {
            ...leavesObj,
            label: {
              ...leavesLabelObj,
              show: leavesLabelShow,
              position: leavesLabelPosition,
              color: leavesLabelColor,
              fontSize: leavesLabelFontSize,
              fontWeight: leavesLabelFontWeight,
            },
          },
          emphasis: {
            ...emphasisObj,
            focus: emphasisFocus,
          },
          animationDuration,
          animationEasing,
        }
      })
      .filter(s => s !== null && s !== undefined)

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
      tooltipType: input.tooltipType || 'pieLlight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Tree Chart',
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
        show: (legendObj.show as boolean) ?? true,
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
   * 遞迴處理樹狀結構數據
   * @param data 原始數據
   * @param chartColors 圖表顏色配置
   * @param themeColors 主題顏色配置
   * @param depth 當前深度（用於顏色分配）
   * @returns 處理後的樹狀數據
   */
  private processTreeData(
    data: Array<unknown>,
    chartColors: string[],
    themeColors: ReturnType<typeof ColorManager.getThemeColors>,
    depth: number = 0
  ): Array<Record<string, unknown>> {
    return data
      .map((dataItem: unknown, index: number) => {
        if (dataItem === null || dataItem === undefined) return undefined

        if (
          typeof dataItem === 'object' &&
          !Array.isArray(dataItem) &&
          !(dataItem instanceof Date)
        ) {
          const treeNode = dataItem as Record<string, unknown>

          const itemStyle = treeNode.itemStyle
          const itemStyleColor =
            itemStyle && typeof itemStyle === 'object' && 'color' in itemStyle
              ? (itemStyle as { color?: string }).color
              : undefined

          const nodeColor = itemStyleColor || chartColors[(depth + index) % chartColors.length]

          const label = treeNode.label
          const labelShow =
            label && typeof label === 'object' && 'show' in label
              ? (label as { show?: boolean }).show
              : undefined

          const labelColor =
            label && typeof label === 'object' && 'color' in label
              ? (label as { color?: string }).color
              : undefined

          const nodeValue = treeNode.value
          const processedValue =
            typeof nodeValue === 'string' ||
            typeof nodeValue === 'number' ||
            nodeValue instanceof Date ||
            Array.isArray(nodeValue)
              ? nodeValue
              : undefined

          const processedNode = {
            ...treeNode,
            name: (treeNode.name as string) || `Node ${index + 1}`,
            value: processedValue,
            itemStyle: {
              ...(typeof itemStyle === 'object' && itemStyle !== null ? itemStyle : {}),
              color: nodeColor,
            },
            label: {
              ...(typeof label === 'object' && label !== null ? label : {}),
              show: labelShow ?? true,
              color: labelColor || themeColors.text,
            },
            symbol: (treeNode.symbol as string) || 'circle',
            symbolSize:
              (treeNode.symbolSize as number) || (depth === 0 ? 10 : Math.max(4, 8 - depth)),
            collapsed: (treeNode.collapsed as boolean) ?? false,
          }

          if (treeNode.children && Array.isArray(treeNode.children)) {
            const processedChildren = this.processTreeData(
              treeNode.children,
              chartColors,
              themeColors,
              depth + 1
            )
            Object.assign(processedNode, { children: processedChildren })
          }

          return processedNode
        }

        if (typeof dataItem === 'string') {
          return {
            name: dataItem,
            itemStyle: {
              color: chartColors[(depth + index) % chartColors.length],
            },
            symbolSize: depth === 0 ? 10 : Math.max(4, 8 - depth),
          }
        }

        if (typeof dataItem === 'number') {
          return {
            name: `Node ${index + 1}`,
            value: dataItem,
            itemStyle: {
              color: chartColors[(depth + index) % chartColors.length],
            },
            symbolSize: depth === 0 ? 10 : Math.max(4, 8 - depth),
          }
        }

        // 處理陣列類型 [name, value] 或 [name, value, children]
        if (Array.isArray(dataItem) && dataItem.length >= 1) {
          const nodeData = {
            name: typeof dataItem[0] === 'string' ? dataItem[0] : `Node ${index + 1}`,
            value: typeof dataItem[1] === 'number' ? dataItem[1] : undefined,
            itemStyle: {
              color: chartColors[(depth + index) % chartColors.length],
            },
            symbolSize: depth === 0 ? 10 : Math.max(4, 8 - depth),
          }

          if (dataItem[2] && Array.isArray(dataItem[2])) {
            const processedChildren = this.processTreeData(
              dataItem[2],
              chartColors,
              themeColors,
              depth + 1
            )
            Object.assign(nodeData, { children: processedChildren })
          }

          return nodeData
        }

        return undefined
      })
      .filter((node: unknown): node is Record<string, unknown> => node !== undefined) as Array<
      Record<string, unknown>
    >
  }
}
