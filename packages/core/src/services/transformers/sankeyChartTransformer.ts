import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

/**
 * Sankey Chart JSON Transformer
 */
export class SankeyChartTransformer implements ChartTransformer {
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
      .map((s: unknown, index: number) => {
        const series = s as Record<string, unknown>
        const seriesData = series.data as unknown[] | undefined

        if (!seriesData || seriesData.length === 0) return null

        const processedData =
          seriesData
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

                const nodeItemStyleObj =
                  typeof node.itemStyle === 'object' && node.itemStyle !== null
                    ? (node.itemStyle as Record<string, unknown>)
                    : {}

                return {
                  ...node,
                  name: (node.name as string) || `Node ${dataIndex + 1}`,
                  itemStyle: {
                    ...nodeItemStyleObj,
                    color: existingNodeColor || chartColors[dataIndex % chartColors.length],
                  },
                }
              }

              return undefined
            })
            .filter((node: unknown): node is NonNullable<typeof node> => node !== undefined) || []

        const seriesLinks = series.links as unknown[] | undefined
        const processedLinks =
          seriesLinks
            ?.map((link: unknown) => {
              if (link === null || link === undefined) return undefined

              if (typeof link === 'object') {
                const linkObj = link as Record<string, unknown>

                return {
                  ...linkObj,
                  source: linkObj.source || '',
                  target: linkObj.target || '',
                  value: (linkObj.value as number) || 1,
                }
              }

              return undefined
            })
            .filter((link: unknown): link is NonNullable<typeof link> => link !== undefined) || []

        const seriesEmphasisObj = (series.emphasis || {}) as Record<string, unknown>
        const seriesLabelObj = (series.label || {}) as Record<string, unknown>
        const seriesLineStyleObj = (series.lineStyle || {}) as Record<string, unknown>

        return {
          ...series,
          name: (series.name as string) || `Sankey ${index + 1}`,
          type: (series.type as string) || 'sankey',
          data: processedData,
          links: processedLinks,
          emphasis: {
            ...seriesEmphasisObj,
            focus: (seriesEmphasisObj.focus as string) || 'adjacency',
          },
          nodeWidth: (series.nodeWidth as number) || 25,
          nodeGap: (series.nodeGap as number) || 10,
          layoutIterations: (series.layoutIterations as number) || 32,
          orient: (series.orient as string) || 'horizontal',
          left: (series.left as string | number) || '5%',
          right: (series.right as string | number) || '10%',
          top: (series.top as string | number) || '10%',
          bottom: (series.bottom as string | number) || '10%',
          label: {
            ...seriesLabelObj,
            show: (seriesLabelObj.show as boolean) ?? true,
            position: (seriesLabelObj.position as string) || 'right',
            color: (seriesLabelObj.color as string) || themeColors.text,
            fontSize: (seriesLabelObj.fontSize as number) || 12,
            fontWeight: (seriesLabelObj.fontWeight as string | number) || 'normal',
          },
          lineStyle: {
            ...seriesLineStyleObj,
            color: (seriesLineStyleObj.color as string) || '#888',
            width: (seriesLineStyleObj.width as number) || 1,
            curveness: (seriesLineStyleObj.curveness as number) || 0,
          },
        }
      })
      .filter(s => s !== null)

    // Extract union types to intermediate variables
    const titleObj = Array.isArray(input.title) ? input.title[0] || {} : input.title || {}
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>

    const legendObj = Array.isArray(input.legend) ? input.legend[0] || {} : input.legend || {}
    const legendTextStyleObj = (legendObj.textStyle || {}) as Record<string, unknown>

    const toolboxObj = Array.isArray(input.toolbox) ? input.toolbox[0] || {} : input.toolbox || {}
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>
    const restoreObj = (toolboxFeatureObj.restore || {}) as Record<string, unknown>

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'sankeyLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Sankey Chart',
        left: (titleObj.left as string | number) || 'center',
        top: (titleObj.top as string | number) || 10,
        textStyle: {
          ...titleTextStyleObj,
          fontFamily: (titleTextStyleObj.fontFamily as string) || 'Arial, sans-serif',
          fontSize: (titleTextStyleObj.fontSize as number) || 16,
          fontWeight: (titleTextStyleObj.fontWeight as string | number) || 'bold',
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
          fontWeight: (legendTextStyleObj.fontWeight as string | number) || 'normal',
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
            name: (saveAsImageObj.name as string) || 'sankey-chart',
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
