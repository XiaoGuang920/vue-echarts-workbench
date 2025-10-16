import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'

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

    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series = inputSeries
      .map((s: unknown, index: number) => {
        const series = s as Record<string, unknown>
        const data = series.data as Array<Record<string, unknown>> | undefined

        if (!data || data.length === 0) return undefined

        const processedData = this.processTreemapData(data, chartColors, themeColors)

        const levels = series.levels as Array<Record<string, unknown>> | undefined
        const generatedLevels = this.generateTreemapLevels(data, levels, themeColors)

        const name = (series.name as string) || `Treemap ${index + 1}`
        const type = (series.type as string) || 'treemap'
        const width = (series.width as string | number) || '90%'
        const height = (series.height as string | number) || '80%'
        const roam = (series.roam as boolean) ?? false
        const top = (series.top as string | number) || '15%'
        const nodeClick = (series.nodeClick as string) || 'zoomToNode'

        const breadcrumbObj =
          typeof series.breadcrumb === 'object' && series.breadcrumb !== null
            ? (series.breadcrumb as Record<string, unknown>)
            : {}
        const breadcrumbShow = (breadcrumbObj.show as boolean) ?? false
        const breadcrumbItemStyleObj =
          typeof breadcrumbObj.itemStyle === 'object' && breadcrumbObj.itemStyle !== null
            ? (breadcrumbObj.itemStyle as Record<string, unknown>)
            : {}

        const labelObj =
          typeof series.label === 'object' && series.label !== null
            ? (series.label as Record<string, unknown>)
            : {}
        const labelShow = (labelObj.show as boolean) ?? true

        const upperLabelObj =
          typeof series.upperLabel === 'object' && series.upperLabel !== null
            ? (series.upperLabel as Record<string, unknown>)
            : {}
        const upperLabelShow = (upperLabelObj.show as boolean) ?? true

        const itemStyleObj =
          typeof series.itemStyle === 'object' && series.itemStyle !== null
            ? (series.itemStyle as Record<string, unknown>)
            : {}

        const emphasisObj =
          typeof series.emphasis === 'object' && series.emphasis !== null
            ? (series.emphasis as Record<string, unknown>)
            : {}
        const emphasisLabelObj =
          typeof emphasisObj.label === 'object' && emphasisObj.label !== null
            ? (emphasisObj.label as Record<string, unknown>)
            : {}
        const emphasisLabelShow = (emphasisLabelObj.show as boolean) ?? true

        return {
          ...series,
          name,
          type,
          data: processedData,
          levels: levels || generatedLevels,
          width,
          height,
          roam,
          top,
          nodeClick,
          breadcrumb: {
            ...breadcrumbObj,
            show: breadcrumbShow,
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
              ...breadcrumbItemStyleObj,
            },
          },
          label: {
            ...labelObj,
            show: labelShow,
            fontFamily: 'sans-serif',
            fontSize: 12,
            color: '#333',
            formatter: '{b}',
          },
          upperLabel: {
            ...upperLabelObj,
            show: upperLabelShow,
            height: 30,
            fontFamily: 'sans-serif',
            fontSize: 14,
            color: '#fff',
            formatter: '{b}',
            fontWeight: 'bold',
          },
          itemStyle: {
            ...itemStyleObj,
            borderColor: themeColors.background,
          },
          emphasis: {
            ...emphasisObj,
            label: {
              ...emphasisLabelObj,
              show: emphasisLabelShow,
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
      .filter(s => s !== null && s !== undefined)

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
      tooltipType: input.tooltipType || 'treemapLight',
      series: series,
      title: {
        ...titleObj,
        text: (titleObj.text as string) || 'Treemap Chart',
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
            name: (saveAsImageObj.name as string) || 'treemap-chart',
            backgroundColor: (saveAsImageObj.backgroundColor as string) || themeColors.background,
          },
          restore: {
            ...restoreObj,
            show: (restoreObj.show as boolean) ?? true,
            title: (restoreObj.title as string) || '還原',
          },
        },
      },
    }

    return {
      ...input,
      ...chartOptions,
    } as unknown as ExtendedEChartsOption
  }
}
