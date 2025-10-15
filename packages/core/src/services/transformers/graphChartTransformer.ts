import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

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

    // Normalize series to array
    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || seriesData.length === 0) return undefined

        const processedData = seriesData
          .map((dataItem: unknown, dataIndex: number) => {
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
              if (!nodeColor && typeof node.category === 'number') {
                const seriesCategories = series.categories as unknown[] | undefined
                if (seriesCategories) {
                  const categoryIndex = node.category
                  const category = seriesCategories[categoryIndex]
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
          .filter((node: unknown): node is NonNullable<typeof node> => node !== undefined)

        const seriesLinks = series.links as unknown[] | undefined
        const processedLinks =
          seriesLinks
            ?.map((link: unknown) => {
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
            .filter((link: unknown): link is NonNullable<typeof link> => link !== undefined) || []

        const seriesCategories = series.categories as unknown[] | undefined
        const processedCategories = seriesCategories
          ?.map((category: unknown, categoryIndex: number) => {
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
            (category: unknown): category is NonNullable<typeof category> => category !== undefined
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

        // Extract nested objects
        const forceObj = (series.force || {}) as Record<string, unknown>
        const emphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const emphasisItemStyleObj = (emphasisObj.itemStyle || {}) as Record<string, unknown>
        const labelObj = (series.label || {}) as Record<string, unknown>
        const itemStyleObj = (series.itemStyle || {}) as Record<string, unknown>
        const lineStyleObj = (series.lineStyle || {}) as Record<string, unknown>

        return {
          ...series,
          name: (series.name as string) || `Graph ${index + 1}`,
          type: (series.type as string) || 'graph',
          data: processedData,
          links: processedLinks,
          categories: processedCategories,
          layout: (series.layout as string) || 'force',
          roam: (series.roam as boolean) ?? true,
          symbolSize: (series.symbolSize as number) || 50,
          force: {
            ...forceObj,
            repulsion: (forceObj.repulsion as number) || 1000,
            gravity: (forceObj.gravity as number) || 0.1,
            edgeLength: (forceObj.edgeLength as number) || 150,
            layoutAnimation: (forceObj.layoutAnimation as boolean) ?? true,
          },
          emphasis: {
            ...emphasisObj,
            focus: (emphasisObj.focus as string) || 'adjacency',
            itemStyle: {
              ...emphasisItemStyleObj,
              borderColor: themeColors.text,
              borderWidth: 2,
            },
          },
          label: {
            ...labelObj,
            show: (labelObj.show as boolean) ?? true,
            position: (labelObj.position as string) || 'right',
            color: (labelObj.color as string) || themeColors.text,
            fontSize: (labelObj.fontSize as number) || 12,
            fontWeight: (labelObj.fontWeight as string) || 'normal',
          },
          itemStyle: {
            ...itemStyleObj,
            color: (itemStyleObj.color as string) || chartColors[index % chartColors.length],
            borderColor: (itemStyleObj.borderColor as string) || themeColors.background,
            borderWidth: (itemStyleObj.borderWidth as number) || 1,
          },
          lineStyle: {
            ...lineStyleObj,
            color: (lineStyleObj.color as string) || '#888',
            width: (lineStyleObj.width as number) || 1,
            curveness: (lineStyleObj.curveness as number) || 0,
          },
          edgeSymbol: series.edgeSymbol || ['none', 'arrow'],
          edgeSymbolSize: series.edgeSymbolSize || [4, 10],
        }
      })
      .filter((s: unknown): s is NonNullable<typeof s> => s !== undefined)

    // Define default configs
    const defaultTitleTextStyle = {
      fontFamily: 'Arial, sans-serif' as const,
      fontSize: 16 as const,
      fontWeight: 'bold' as const,
    }

    const defaultLegendTextStyle = {
      fontFamily: 'Arial, sans-serif' as const,
      fontSize: 12 as const,
      fontWeight: 'normal' as const,
    }

    const defaultSaveAsImage = {
      show: true as const,
      title: '下載圖片' as const,
      name: 'graph-chart' as const,
    }

    // Extract intermediate variables from union types
    const titleObj = (Array.isArray(input.title) ? input.title[0] : input.title || {}) as Record<
      string,
      unknown
    >
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = (
      Array.isArray(input.legend) ? input.legend[0] : input.legend || {}
    ) as Record<string, unknown>
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = (
      Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox || {}
    ) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>
    const restoreObj = (toolboxFeatureObj.restore || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'graphLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Graph Chart',
        left: titleObj.left || 'center',
        top: titleObj.top || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || defaultTitleTextStyle.fontFamily,
          fontSize: (titleTextStyleObj.fontSize as number) || defaultTitleTextStyle.fontSize,
          fontWeight: (titleTextStyleObj.fontWeight as string) || defaultTitleTextStyle.fontWeight,
          color: (titleTextStyleObj.color as string) || themeColors.text,
        },
      },
      legend: {
        ...legendObj,
        show: (legendObj.show as boolean) ?? true,
        left: legendObj.left || 'center',
        bottom: legendObj.bottom || 5,
        textStyle: {
          ...defaultLegendTextStyle,
          ...legendTextStyleObj,
          fontFamily:
            (legendTextStyleObj.fontFamily as string) || defaultLegendTextStyle.fontFamily,
          color: (legendTextStyleObj.color as string) || themeColors.text,
          fontSize: (legendTextStyleObj.fontSize as number) || defaultLegendTextStyle.fontSize,
          fontWeight:
            (legendTextStyleObj.fontWeight as string) || defaultLegendTextStyle.fontWeight,
        },
      },
      toolbox: {
        ...toolboxObj,
        show: (toolboxObj.show as boolean) ?? true,
        orient: (toolboxObj.orient as string) || 'horizontal',
        left: toolboxObj.left || 'right',
        top: toolboxObj.top || 'top',
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...defaultSaveAsImage,
            ...saveAsImageObj,
            show: (saveAsImageObj.show as boolean) ?? defaultSaveAsImage.show,
            title: (saveAsImageObj.title as string) || defaultSaveAsImage.title,
            name: (saveAsImageObj.name as string) || defaultSaveAsImage.name,
            backgroundColor: (saveAsImageObj.backgroundColor as string) || themeColors.background,
          },
          restore: {
            ...restoreObj,
            show: (restoreObj.show as boolean) ?? true,
            title: (restoreObj.title as string) || '還原',
          },
        },
      },
      backgroundColor: input.backgroundColor || themeColors.background,
    }

    return {
      ...input,
      ...chartOptions,
    } as unknown as ExtendedEChartsOption
  }
}
