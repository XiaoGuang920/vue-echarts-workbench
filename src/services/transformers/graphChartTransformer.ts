import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { GraphSeriesOption } from 'echarts'

/**
 * Graph Chart JSON Transformer
 */
export class GraphChartTransformer implements ChartTransformer {
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
        ?.map((series: GraphSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          const processedData =
            series.data
              ?.map((dataItem, dataIndex) => {
                if (dataItem === null || dataItem === undefined) return undefined

                if (typeof dataItem === 'object' && !Array.isArray(dataItem)) {
                  const node = dataItem as Record<string, unknown>

                  const existingItemStyle = node.itemStyle
                  let existingNodeColor: string | undefined = undefined

                  if (
                    existingItemStyle &&
                    typeof existingItemStyle === 'object' &&
                    existingItemStyle !== null &&
                    'color' in existingItemStyle
                  ) {
                    const colorValue = (existingItemStyle as { color?: unknown }).color
                    if (typeof colorValue === 'string') {
                      existingNodeColor = colorValue
                    }
                  }

                  let nodeColor = existingNodeColor
                  if (!nodeColor && typeof node.category === 'number' && series.categories) {
                    const categoryIndex = node.category
                    const category = series.categories[categoryIndex]
                    if (category && typeof category === 'object' && 'itemStyle' in category) {
                      const categoryItemStyle = category.itemStyle
                      if (
                        categoryItemStyle &&
                        typeof categoryItemStyle === 'object' &&
                        'color' in categoryItemStyle
                      ) {
                        const categoryColorValue = (categoryItemStyle as { color?: unknown }).color
                        if (typeof categoryColorValue === 'string') {
                          nodeColor = categoryColorValue
                        }
                      }
                    }
                  }

                  if (!nodeColor) {
                    nodeColor = chartColors[dataIndex % chartColors.length]
                  }

                  return {
                    ...node,
                    id: (node.id as string) || `node-${dataIndex + 1}`,
                    name: (node.name as string) || `Node ${dataIndex + 1}`,
                    category: (node.category as number) || 0,
                    value: (node.value as number) || 1,
                    symbolSize: (node.symbolSize as number) || 30,
                    itemStyle: {
                      ...(typeof node.itemStyle === 'object' && node.itemStyle !== null
                        ? node.itemStyle
                        : {}),
                      color: nodeColor,
                    },
                    label: {
                      ...(typeof node.label === 'object' && node.label !== null ? node.label : {}),
                      show: true,
                      color: themeColors.text,
                    },
                  }
                }

                return undefined
              })
              .filter((node): node is NonNullable<typeof node> => node !== undefined) || []

          const processedLinks =
            series.links
              ?.map(link => {
                if (link === null || link === undefined) return undefined

                if (typeof link === 'object') {
                  const linkObj = link as Record<string, unknown>

                  const existingLineStyle = linkObj.lineStyle
                  let existingColor: string | undefined = undefined

                  if (
                    existingLineStyle &&
                    typeof existingLineStyle === 'object' &&
                    existingLineStyle !== null &&
                    'color' in existingLineStyle
                  ) {
                    const colorValue = (existingLineStyle as { color?: unknown }).color
                    if (typeof colorValue === 'string') {
                      existingColor = colorValue
                    }
                  }

                  return {
                    ...linkObj,
                    source: linkObj.source || '',
                    target: linkObj.target || '',
                    value: (linkObj.value as number) || 1,
                    lineStyle: {
                      ...(typeof linkObj.lineStyle === 'object' && linkObj.lineStyle !== null
                        ? linkObj.lineStyle
                        : {}),
                      color: existingColor || '#00000060',
                      width: 2,
                    },
                  }
                }

                return undefined
              })
              .filter((link): link is NonNullable<typeof link> => link !== undefined) || []

          const processedCategories = series.categories
            ?.map((category, categoryIndex) => {
              if (category === null || category === undefined) return undefined

              if (typeof category === 'object') {
                const categoryObj = category as Record<string, unknown>

                const existingItemStyle = categoryObj.itemStyle
                let existingColor: string | undefined = undefined

                if (
                  existingItemStyle &&
                  typeof existingItemStyle === 'object' &&
                  existingItemStyle !== null &&
                  'color' in existingItemStyle
                ) {
                  const colorValue = (existingItemStyle as { color?: unknown }).color
                  if (typeof colorValue === 'string') {
                    existingColor = colorValue
                  }
                }

                return {
                  ...categoryObj,
                  name: (categoryObj.name as string) || `分類 ${categoryIndex + 1}`,
                  itemStyle: {
                    ...(typeof categoryObj.itemStyle === 'object' && categoryObj.itemStyle !== null
                      ? categoryObj.itemStyle
                      : {}),
                    color: existingColor || chartColors[categoryIndex % chartColors.length],
                  },
                  label: {
                    ...(typeof categoryObj.label === 'object' && categoryObj.label !== null
                      ? categoryObj.label
                      : {}),
                    color: themeColors.text,
                  },
                }
              }

              return undefined
            })
            .filter(
              (category): category is NonNullable<typeof category> => category !== undefined
            ) || [
            {
              name: '預設分類',
              itemStyle: {
                color: chartColors[0],
              },
              label: {
                color: themeColors.text,
              },
            },
          ]

          return {
            ...series,
            name: series.name || `Graph ${index + 1}`,
            type: series.type || 'graph',
            data: processedData,
            links: processedLinks,
            categories: processedCategories,
            layout: series.layout || 'force',
            roam: series.roam ?? true,
            symbolSize: series.symbolSize || 50,
            force: {
              ...(series.force || {}),
              repulsion: series.force?.repulsion || 1000,
              gravity: series.force?.gravity || 0.1,
              edgeLength: series.force?.edgeLength || 150,
              layoutAnimation: series.force?.layoutAnimation ?? true,
            },
            emphasis: {
              ...(series.emphasis || {}),
              focus: series.emphasis?.focus || 'adjacency',
              itemStyle: {
                ...(series.emphasis?.itemStyle || {}),
                borderColor: themeColors.text,
                borderWidth: 2,
              },
            },
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'right',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 12,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            itemStyle: {
              ...(series.itemStyle || {}),
              color: series.itemStyle?.color || chartColors[index % chartColors.length],
              borderColor: series.itemStyle?.borderColor || themeColors.background,
              borderWidth: series.itemStyle?.borderWidth || 1,
            },
            lineStyle: {
              ...(series.lineStyle || {}),
              color: series.lineStyle?.color || '#888',
              width: series.lineStyle?.width || 1,
              curveness: series.lineStyle?.curveness || 0,
            },
            edgeSymbol: series.edgeSymbol || ['none', 'arrow'],
            edgeSymbolSize: series.edgeSymbolSize || [4, 10],
          }
        })
        .filter(
          (series: GraphSeriesOption): series is NonNullable<typeof series> => series !== undefined
        ) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'graphLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Graph Chart',
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
            name: input.toolbox?.feature?.saveAsImage?.name || 'graph-chart',
            backgroundColor:
              input.toolbox?.feature?.saveAsImage?.backgroundColor || themeColors.background,
          },
          restore: {
            ...(input.toolbox?.feature?.restore || {}),
            show: input.toolbox?.feature?.restore?.show ?? true,
            title: input.toolbox?.feature?.restore?.title || '還原',
          },
        },
      },
      backgroundColor: input.backgroundColor || themeColors.background,
    }

    return {
      ...input,
      ...chartOptions,
    }
  }
}
