import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { SankeySeriesOption } from 'echarts'

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

    const series =
      input.series
        ?.map((series: SankeySeriesOption, index: number) => {
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

                  return {
                    ...node,
                    name: (node.name as string) || `Node ${dataIndex + 1}`,
                    itemStyle: {
                      ...(typeof node.itemStyle === 'object' && node.itemStyle !== null
                        ? node.itemStyle
                        : {}),
                      color: existingNodeColor || chartColors[dataIndex % chartColors.length],
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

                  return {
                    ...linkObj,
                    source: linkObj.source || '',
                    target: linkObj.target || '',
                    value: (linkObj.value as number) || 1,
                  }
                }

                return undefined
              })
              .filter((link): link is NonNullable<typeof link> => link !== undefined) || []

          return {
            ...series,
            name: series.name || `Graph ${index + 1}`,
            type: series.type || 'graph',
            data: processedData,
            links: processedLinks,
            emphasis: {
              ...(series.emphasis || {}),
              focus: series.emphasis?.focus || 'adjacency',
            },
            nodeWidth: series.nodeWidth || 25,
            nodeGap: series.nodeGap || 10,
            layoutIterations: series.layoutIterations || 32,
            orient: series.orient || 'horizontal',
            left: series.left || '5%',
            right: series.right || '10%',
            top: series.top || '10%',
            bottom: series.bottom || '10%',
            label: {
              ...(series.label || {}),
              show: series.label?.show ?? true,
              position: series.label?.position || 'right',
              color: series.label?.color || themeColors.text,
              fontSize: series.label?.fontSize || 12,
              fontWeight: series.label?.fontWeight || 'normal',
            },
            lineStyle: {
              ...(series.lineStyle || {}),
              color: series.lineStyle?.color || '#888',
              width: series.lineStyle?.width || 1,
              curveness: series.lineStyle?.curveness || 0,
            },
          }
        })
        .filter(
          (series: SankeySeriesOption): series is NonNullable<typeof series> => series !== undefined
        ) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'sankeyLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Sankey Chart',
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
