import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TreeSeriesOption } from 'echarts'

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

    const series =
      input.series
        .map((series: TreeSeriesOption, index: number) => {
          if (!series.data || series.data?.length == 0) return

          const processedData = this.processTreeData(series.data, chartColors, themeColors, 0)

          return {
            ...series,
            name: series.name || `Tree ${index + 1}`,
            type: series.type || 'tree',
            data: processedData,
            top: series.top || '5%',
            left: series.left || '5%',
            bottom: series.bottom || '5%',
            right: series.right || '5%',
            symbol: series.symbol || 'circle',
            symbolSize: series.symbolSize || 7,
            orient: series.orient || 'horizontal',
            layout: series.layout || 'orthogonal',
            roam: series.roam ?? false,
            expandAndCollapse: series.expandAndCollapse ?? true,
            initialTreeDepth: series.initialTreeDepth ?? -1,
            lineStyle: {
              ...(series.lineStyle || {}),
              color: series.lineStyle?.color || themeColors.axis,
              width: series.lineStyle?.width || 1,
              type: series.lineStyle?.type || 'solid',
            },
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'left',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 11,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            leaves: {
              ...(series.leaves || {}),
              label: {
                ...(series.leaves?.label || {}),
                show: series.leaves?.label?.show ?? true,
                position: series.leaves?.label?.position || 'right',
                color: series.leaves?.label?.color || themeColors.text,
                fontSize: series.leaves?.label?.fontSize || 11,
                fontWeight: series.leaves?.label?.fontWeight || 'normal',
              },
            },
            emphasis: {
              ...(series.emphasis || {}),
              focus: series.emphasis?.focus || 'descendant',
            },
            animationDuration: series.animationDuration || 550,
            animationEasing: series.animationEasing || 'linear',
          }
        })
        .filter(Boolean) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'pieLlight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Tree Chart',
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

  /**
   * 遞迴處理樹狀結構數據
   * @param data 原始數據
   * @param chartColors 圖表顏色配置
   * @param themeColors 主題顏色配置
   * @param depth 當前深度（用於顏色分配）
   * @returns 處理後的樹狀數據
   */
  private processTreeData(
    data: NonNullable<TreeSeriesOption['data']>,
    chartColors: string[],
    themeColors: ReturnType<typeof ColorManager.getThemeColors>,
    depth: number = 0
  ): NonNullable<TreeSeriesOption['data']> {
    return data
      .map((dataItem, index) => {
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
      .filter((node): node is NonNullable<typeof node> => node !== undefined)
  }
}
