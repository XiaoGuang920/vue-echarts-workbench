import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { TreemapSeriesOption } from 'echarts'

/**
 * Treemap Chart JSON Transformer
 */
export class TreemapChartTransformer implements ChartTransformer {
  /**
   * 計算數據的最大深度
   * @param dataArray 數據陣列
   * @param currentDepth 當前深度
   * @returns 最大深度
   */
  private calculateMaxDepth(
    dataArray: Array<Record<string, unknown>>,
    currentDepth: number = 1
  ): number {
    let maxDepth = currentDepth

    for (const item of dataArray) {
      if (
        typeof item === 'object' &&
        item !== null &&
        'children' in item &&
        Array.isArray(item.children)
      ) {
        const childDepth = this.calculateMaxDepth(
          item.children as Array<Record<string, unknown>>,
          currentDepth + 1
        )
        maxDepth = Math.max(maxDepth, childDepth)
      }
    }

    return maxDepth
  }

  private generateTreemapLevels(
    dataArray: Array<Record<string, unknown>>,
    originalLevels: Array<Record<string, unknown>> | undefined,
    themeColors: ReturnType<typeof ColorManager.getThemeColors>
  ): Array<Record<string, unknown>> {
    const maxDepth = this.calculateMaxDepth(dataArray)
    const levels: Array<Record<string, unknown>> = []

    for (let depth = 0; depth < maxDepth; depth++) {
      const originalLevel = originalLevels?.[depth] || {}
      const originalItemStyle = (originalLevel.itemStyle as Record<string, unknown>) || {}
      const originalUpperLabel = (originalLevel.upperLabel as Record<string, unknown>) || {}
      const originalLabel = (originalLevel.label as Record<string, unknown>) || {}
      const originalEmphasis = (originalLevel.emphasis as Record<string, unknown>) || {}

      levels.push({
        ...originalLevel,
        itemStyle: {
          borderColor:
            originalItemStyle.borderColor ||
            (depth === 0 ? '#000000' : depth === 1 ? '#ffffff' : themeColors.background),
          borderWidth: originalItemStyle.borderWidth ?? Math.max(1, 4 - depth),
          gapWidth: originalItemStyle.gapWidth ?? Math.max(0, 3 - depth),
          opacity: originalItemStyle.opacity ?? Math.max(0.7, 1 - depth * 0.1),
          ...originalItemStyle,
        },
        upperLabel: {
          show: originalUpperLabel.show ?? depth === 0,
          height: originalUpperLabel.height ?? (depth === 0 ? Math.max(20, 35 - depth * 5) : 0),
          fontSize: originalUpperLabel.fontSize ?? (depth === 0 ? Math.max(10, 16 - depth * 2) : 0),
          color: originalUpperLabel.color ?? (depth === 0 ? '#fff' : 'transparent'),
          formatter: originalUpperLabel.formatter || '{b}',
          fontWeight: originalUpperLabel.fontWeight ?? (depth === 0 ? 'bold' : 'normal'),
          position: originalUpperLabel.position ?? (depth === 0 ? 'insideTopLeft' : 'inside'),
          ...originalUpperLabel,
        },
        label: {
          show: originalLabel.show ?? depth > 0,
          fontSize: originalLabel.fontSize ?? (depth > 0 ? Math.max(10, 16 - depth * 2) : 0),
          color:
            originalLabel.color ?? (depth === 0 ? '#fff' : depth === 1 ? '#333' : themeColors.text),
          formatter: originalLabel.formatter || '{b}',
          fontWeight: originalLabel.fontWeight ?? (depth <= 1 ? 'bold' : 'normal'),
          position: originalLabel.position ?? (depth === 1 ? 'inside' : 'insideTopLeft'),
          overflow: originalLabel.overflow ?? (depth > 2 ? 'breakAll' : 'none'),
          ...originalLabel,
        },
        emphasis: {
          itemStyle: {
            borderColor:
              (originalEmphasis.itemStyle as Record<string, unknown>)?.borderColor ??
              (depth === 0 ? '#fff' : '#333333'),
            borderWidth:
              (originalEmphasis.itemStyle as Record<string, unknown>)?.borderWidth ??
              Math.min(3, Math.max(1, 4 - depth) + 1),
            shadowBlur:
              (originalEmphasis.itemStyle as Record<string, unknown>)?.shadowBlur ??
              Math.max(5, 15 - depth * 3),
            shadowColor:
              (originalEmphasis.itemStyle as Record<string, unknown>)?.shadowColor ??
              `rgba(0,0,0,${Math.max(0.1, 0.4 - depth * 0.1)})`,
            ...((originalEmphasis.itemStyle as Record<string, unknown>) || {}),
          },
          label: {
            show: (originalEmphasis.label as Record<string, unknown>)?.show ?? true,
            fontSize:
              (originalEmphasis.label as Record<string, unknown>)?.fontSize ??
              Math.max(10, 16 - depth * 2) + 2,
            fontWeight: (originalEmphasis.label as Record<string, unknown>)?.fontWeight ?? 'bold',
            ...((originalEmphasis.label as Record<string, unknown>) || {}),
          },
          ...originalEmphasis,
        },
      })
    }

    return levels
  }

  /**
   * 遞迴處理 Treemap 階層性數據
   * @param dataArray 數據陣列
   * @param chartColors 圖表顏色陣列
   * @param themeColors 主題顏色
   * @param depth 當前深度
   * @returns 處理後的數據陣列
   */
  private processTreemapData(
    dataArray: Array<Record<string, unknown>>,
    chartColors: string[],
    themeColors: ReturnType<typeof ColorManager.getThemeColors>,
    depth: number = 0
  ): Array<Record<string, unknown>> {
    return dataArray
      .map((dataItem, dataIndex) => {
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

          if (!existingNodeColor) {
            if (depth === 0) {
              existingNodeColor = chartColors[dataIndex % chartColors.length]
            } else {
              const baseColorIndex = Math.floor(dataIndex / 4) % chartColors.length
              const baseColor = chartColors[baseColorIndex]

              const variations = [
                baseColor,
                baseColor + 'CC', // 80% opacity
                baseColor + '99', // 60% opacity
                baseColor + '66', // 40% opacity
              ]
              existingNodeColor = variations[dataIndex % variations.length]
            }
          }

          let processedChildren: Array<Record<string, unknown>> | undefined = undefined
          if ('children' in node && Array.isArray(node.children)) {
            const children = node.children as Array<Record<string, unknown>>
            processedChildren = this.processTreemapData(
              children,
              chartColors,
              themeColors,
              depth + 1
            )
          }

          const dynamicStyles = {
            borderWidth: Math.max(1, 3 - depth),
            fontSize: Math.max(10, 14 - depth * 2),
            fontWeight: depth === 0 ? 'bold' : depth === 1 ? '500' : 'normal',
          }

          return {
            ...node,
            name: (node.name as string) || `Node ${dataIndex + 1}`,
            value: (node.value as number) || 1,
            itemStyle: {
              ...(typeof node.itemStyle === 'object' && node.itemStyle !== null
                ? node.itemStyle
                : {}),
              color: existingNodeColor,
              borderColor: themeColors.background,
              borderWidth: dynamicStyles.borderWidth,
              opacity: Math.max(0.8, 1 - depth * 0.05),
            },
            label: {
              ...(typeof node.label === 'object' && node.label !== null ? node.label : {}),
              show: depth > 0,
              color: depth === 0 ? '#fff' : depth === 1 ? '#333' : themeColors.text,
              fontSize: dynamicStyles.fontSize,
              fontWeight: dynamicStyles.fontWeight,
              formatter: '{b}',
              overflow: depth > 2 ? 'breakAll' : 'none',
            },
            upperLabel:
              depth === 0
                ? {
                    ...(typeof node.upperLabel === 'object' && node.upperLabel !== null
                      ? node.upperLabel
                      : {}),
                    show: true,
                    height: Math.max(20, 35 - depth * 5),
                    fontSize: dynamicStyles.fontSize + 2,
                    color: '#fff',
                    formatter: '{b}',
                    fontWeight: 'bold',
                  }
                : undefined,
            emphasis: {
              ...(typeof node.emphasis === 'object' && node.emphasis !== null ? node.emphasis : {}),
              itemStyle: {
                borderColor: depth === 0 ? '#fff' : '#333333',
                borderWidth: dynamicStyles.borderWidth + 1,
                shadowBlur: Math.max(5, 15 - depth * 3),
                shadowColor: `rgba(0,0,0,${Math.max(0.1, 0.4 - depth * 0.1)})`,
              },
              label: {
                show: true,
                fontSize: dynamicStyles.fontSize + 2,
                fontWeight: 'bold',
              },
            },
            ...(processedChildren && processedChildren.length > 0
              ? { children: processedChildren }
              : {}),
          }
        }

        return undefined
      })
      .filter((node): node is NonNullable<typeof node> => node !== undefined)
  }

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
        ?.map((series: TreemapSeriesOption, index: number) => {
          if (!series.data || series.data?.length === 0) return undefined

          const processedData = this.processTreemapData(
            series.data as Array<Record<string, unknown>>,
            chartColors,
            themeColors
          )

          // 動態生成 levels 配置
          const generatedLevels = this.generateTreemapLevels(
            series.data as Array<Record<string, unknown>>,
            series.levels as Array<Record<string, unknown>> | undefined,
            themeColors
          )
          console.log(generatedLevels)

          return {
            ...series,
            name: series.name || `Treemap ${index + 1}`,
            type: series.type || 'treemap',
            data: processedData,
            levels: series.levels || generatedLevels, // 優先使用原始配置，否則使用動態生成的
            width: series.width || '90%',
            height: series.height || '80%',
            roam: series.roam ?? false,
            top: series.top || '15%',
            nodeClick: series.nodeClick || 'zoomToNode',
            breadcrumb: {
              ...(typeof series.breadcrumb === 'object' && series.breadcrumb !== null
                ? series.breadcrumb
                : {}),
              show: series.breadcrumb?.show ?? false,
              height: 22,
              left: 'center',
              top: 'bottom',
              itemStyle: {
                color: '#1B6EC2',
                borderColor: '#0D4F8C',
                borderWidth: 1,
                shadowBlur: 6,
                shadowColor: 'rgba(0,0,0,0.2)',
                textStyle: {
                  color: '#fff',
                },
                ...(typeof series.breadcrumb?.itemStyle === 'object' &&
                series.breadcrumb?.itemStyle !== null
                  ? series.breadcrumb?.itemStyle
                  : {}),
              },
            },
            label: {
              ...(typeof series.label === 'object' && series.label !== null ? series.label : {}),
              show: series.label?.show ?? true,
              fontFamily: 'sans-serif',
              fontSize: 12,
              color: '#333',
              formatter: '{b}',
            },
            upperLabel: {
              ...(typeof series.upperLabel === 'object' && series.upperLabel !== null
                ? series.upperLabel
                : {}),
              show: series.upperLabel?.show ?? true,
              height: 30,
              fontFamily: 'sans-serif',
              fontSize: 14,
              color: '#fff',
              formatter: '{b}',
              fontWeight: 'bold',
            },
            itemStyle: {
              ...(typeof series.itemStyle === 'object' && series.itemStyle !== null
                ? series.itemStyle
                : {}),
              borderColor: themeColors.background,
            },
            emphasis: {
              ...(typeof series.emphasis === 'object' && series.emphasis !== null
                ? series.emphasis
                : {}),
              label: {
                ...(typeof series.emphasis?.label === 'object' && series.emphasis?.label !== null
                  ? series.emphasis?.label
                  : {}),
                show: series.emphasis?.label?.show ?? true,
              },
              itemStyle: {
                borderColor: '#333333',
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)',
              },
            },
          }
        })
        .filter(
          (series: TreemapSeriesOption): series is NonNullable<typeof series> =>
            series !== undefined
        ) || []

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'treemapLight',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || 'Treemap Chart',
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
            name: input.toolbox?.feature?.saveAsImage?.name || 'treemap-chart',
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
    }

    return {
      ...input,
      ...chartOptions,
    }
  }
}
