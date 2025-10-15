import { ColorManager } from '../../utils/colorManager'

import type { ChartTransformer } from '../types'
import type { ExtendedEChartsOption } from '../../types/echarts'
import type { GeoJsonData, GeoJsonFeature } from '../../types/geojson'
import type { MapDataItem } from '../../types/map'
import type { MapSeriesOption } from 'echarts'

/**
 * Map Chart JSON Transformer
 */
export class MapChartTransformer implements ChartTransformer {
  /**
   * GeoJSON 快取
   */
  private geoJsonCache = new Map<string, GeoJsonData>()

  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換後的圖表配置
   */
  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const mapName = 'taiwan'
    const geoJsonData = await this.fetchGeoJson(mapName)

    const themeColors = ColorManager.getThemeColors()
    const mapGradientColors = ColorManager.getMapGradientColors()

    const defaultLabelStyle = {
      show: true,
      color: '#333',
      backgroundColor: 'transparent',
      fontSize: 10,
      fontWeight: 'bold' as const,
      formatter: '{b}',
    }

    const defaultItemStyle = {
      areaColor: mapGradientColors[0],
      borderColor: themeColors.axis,
      borderWidth: 1,
    }

    const defaultEmphasisLabelStyle = {
      show: true,
      color: themeColors.text,
      fontSize: 12,
      fontWeight: 'bold' as const,
      formatter: '{b}',
    }

    const defaultEmphasisItemStyle = {
      areaColor: mapGradientColors[2],
      borderColor: themeColors.text,
      borderWidth: 1,
    }

    const inputSeries = Array.isArray(input.series)
      ? input.series
      : input.series
        ? [input.series]
        : []

    const series =
      inputSeries.map(series => {
        const mapSeries = series as MapSeriesOption
        const nameProperty = 'COUNTYNAME'

        const seriesData = mapSeries.data as MapDataItem[]
        const completeData = this.createCompleteDataSet(seriesData, geoJsonData)

        const emphasisObj = (mapSeries.emphasis || {}) as Record<string, unknown>
        const emphasisLabel = (emphasisObj.label || {}) as Record<string, unknown>
        const emphasisItemStyle = (emphasisObj.itemStyle || {}) as Record<string, unknown>
        const itemStyleObj = (mapSeries.itemStyle || {}) as Record<string, unknown>

        return {
          ...mapSeries,
          type: (mapSeries.type || 'map') as 'map',
          map: mapName,
          roam: mapSeries.roam ?? true,
          zoom: mapSeries.zoom || 4.8,
          center: mapSeries.center || [121, 24],
          aspectScale: mapSeries.aspectScale || 0.75,
          layoutCenter: mapSeries.layoutCenter || ['55%', '45%'],
          layoutSize: mapSeries.layoutSize || '80%',
          nameProperty: nameProperty,
          data: completeData,
          label: {
            ...defaultLabelStyle,
            ...(mapSeries.label || {}),
          },
          itemStyle: {
            ...defaultItemStyle,
            ...itemStyleObj,
          },
          emphasis: {
            ...emphasisObj,
            label: {
              ...defaultEmphasisLabelStyle,
              ...emphasisLabel,
            },
            itemStyle: {
              ...defaultEmphasisItemStyle,
              ...emphasisItemStyle,
            },
          },
        } as MapSeriesOption
      }) || []

    const { minValue, maxValue } = this.calculateDataRange(series as MapSeriesOption[])

    const titleObj = (Array.isArray(input.title) ? input.title[0] : input.title || {}) as Record<
      string,
      unknown
    >
    const titleTextStyleObj = (titleObj.textStyle || {}) as Record<string, unknown>
    const legendObj = (
      Array.isArray(input.legend) ? input.legend[0] : input.legend || {}
    ) as Record<string, unknown>
    const visualMapObj = (
      Array.isArray(input.visualMap) ? input.visualMap[0] : input.visualMap || {}
    ) as Record<string, unknown>
    const visualMapInRangeObj = (visualMapObj.inRange || {}) as Record<string, unknown>
    const toolboxObj = (
      Array.isArray(input.toolbox) ? input.toolbox[0] : input.toolbox || {}
    ) as Record<string, unknown>
    const toolboxFeatureObj = (toolboxObj.feature || {}) as Record<string, unknown>
    const saveAsImageObj = (toolboxFeatureObj.saveAsImage || {}) as Record<string, unknown>

    const defaultTitleTextStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: themeColors.text,
    }

    const defaultVisualMapInRange = {
      color: mapGradientColors,
    }

    const defaultSaveAsImage = {
      show: true,
      title: '下載圖片',
      name: 'chart-image',
      backgroundColor: themeColors.background,
    }

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'mapLight',
      symbolSizeType: input.symbolSizeType || 'sqrt',
      series: series,
      title: {
        ...titleObj,
        text: titleObj.text || '台灣地圖',
        left: titleObj.left || 'center',
        top: titleObj.top || 10,
        textStyle: {
          ...defaultTitleTextStyle,
          ...titleTextStyleObj,
        },
      },
      legend: {
        ...legendObj,
        show: legendObj.show ?? false,
      },
      visualMap: {
        ...visualMapObj,
        min: visualMapObj.min ?? minValue,
        max: visualMapObj.max ?? maxValue,
        left: visualMapObj.left || 20,
        bottom: visualMapObj.bottom || 20,
        text: visualMapObj.text || ['高', '低'],
        calculable: visualMapObj.calculable ?? true,
        inRange: {
          ...defaultVisualMapInRange,
          ...visualMapInRangeObj,
        },
      },
      toolbox: {
        ...toolboxObj,
        show: toolboxObj.show ?? true,
        orient: toolboxObj.orient || 'horizontal',
        left: toolboxObj.left || 'right',
        top: toolboxObj.top || 'top',
        feature: {
          ...toolboxFeatureObj,
          saveAsImage: {
            ...defaultSaveAsImage,
            ...saveAsImageObj,
          },
        },
      },
    }

    return {
      ...input,
      ...chartOptions,

      _geoJsonData: geoJsonData,
      _mapName: mapName,
    } as unknown as ExtendedEChartsOption
  }

  /**
   * 取得並快取 GeoJSON 數據
   * @param mapName 地圖名稱
   * @returns GeoJSON 數據
   */
  private async fetchGeoJson(mapName: string): Promise<GeoJsonData> {
    if (this.geoJsonCache.has(mapName)) {
      return this.geoJsonCache.get(mapName) as GeoJsonData
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let geoJsonModule: any

      if (mapName === 'taiwan') {
        geoJsonModule = await import('../../../public/geo/taiwan.geo.json')
      } else {
        throw new Error(`Unsupported map: ${mapName}`)
      }

      const geoJson = geoJsonModule.default || geoJsonModule

      if (!geoJson) {
        throw new Error(`Invalid GeoJSON data for map: ${mapName}`)
      }

      this.geoJsonCache.set(mapName, geoJson)
      return geoJson
    } catch (error) {
      console.error(`Failed to load GeoJSON for map: ${mapName}`, error)
      throw new Error(
        `Failed to load GeoJSON for map: ${mapName}. Please ensure the geo file exists.`
      )
    }
  }

  /**
   * 根據 GeoJSON 數據創建完整的地區數據集(對沒有資料的縣市補0)
   * @param originalData 原始數據
   * @param geoJsonData GeoJSON 數據
   * @returns 完整的地區數據集
   */
  private createCompleteDataSet(
    originalData: MapDataItem[],
    geoJsonData: GeoJsonData
  ): MapDataItem[] {
    if (!geoJsonData.features) return originalData || []

    const allRegions = geoJsonData.features
      .map(
        (feature: GeoJsonFeature) =>
          feature.properties.COUNTYNAME || feature.properties.NAME || feature.properties.name
      )
      .filter((name): name is string => Boolean(name) && typeof name === 'string')

    const dataMap = new Map<string, number>()
    if (originalData) {
      originalData.forEach(item => {
        if (item.name) {
          dataMap.set(item.name, item.value)
        }
      })
    }

    return allRegions.map(regionName => ({
      name: regionName,
      value: dataMap.get(regionName) ?? 0,
    }))
  }

  /**
   * 計算 series 中的數據範圍
   * @param series 圖表系列數據
   * @returns 最小值和最大值
   */
  private calculateDataRange(series: MapSeriesOption[]): { minValue: number; maxValue: number } {
    let allValues: number[] = []

    series.forEach(serie => {
      if (serie.data && Array.isArray(serie.data)) {
        const serieValues = (serie.data as MapDataItem[])
          .map(item => item.value || 0)
          .filter(value => value > 0) // 過濾掉 0 值，因為 0 通常表示無資料

        allValues = allValues.concat(serieValues)
      }
    })

    if (allValues.length === 0) {
      return { minValue: 0, maxValue: 100 }
    }

    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)

    // 為了更好的視覺效果，稍微調整範圍
    const adjustedMin = minValue > 0 ? Math.floor(minValue * 0.9) : 0
    const adjustedMax = Math.ceil(maxValue * 1.1)

    return {
      minValue: adjustedMin,
      maxValue: adjustedMax,
    }
  }

  /**
   * 清除 GeoJSON 快取
   */
  clearCache(): void {
    this.geoJsonCache.clear()
  }
}
