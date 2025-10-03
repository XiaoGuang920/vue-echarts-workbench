import { ColorManager } from '@/utils/colorManager'

import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { GeoJsonData, GeoJsonFeature } from '@/types/geojson'
import type { MapDataItem } from '@/types/map'
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

    const series =
      input.series.map((series: MapSeriesOption) => {
        const nameProperty = 'COUNTYNAME'

        const seriesData = series.data as MapDataItem[]
        const completeData = this.createCompleteDataSet(seriesData, geoJsonData)

        return {
          ...series,
          type: series.type || 'map',
          map: mapName,
          roam: series.roam ?? true,
          zoom: series.zoom || 4.8,
          center: series.center || [121, 24],
          aspectScale: series.aspectScale || 0.75,
          layoutCenter: series.layoutCenter || ['55%', '45%'],
          layoutSize: series.layoutSize || '80%',
          nameProperty: nameProperty,
          data: completeData,
          label: {
            ...(series.label || {}),
            show: series.label?.show ?? true,
            color: series.label?.color || '#333',
            backgroundColor: series.label?.backgroundColor || 'transparent',
            fontSize: series.label?.fontSize || 10,
            fontWeight: series.label?.fontWeight || 'bold',
            formatter: series.label?.formatter || '{b}',
          },
          itemStyle: {
            ...(series.itemStyle || {}),
            areaColor: series.itemStyle?.areaColor || mapGradientColors[0],
            borderColor: series.itemStyle?.borderColor || themeColors.axis,
            borderWidth: series.itemStyle?.borderWidth || 1,
          },
          emphasis: {
            ...(series.emphasis || {}),
            label: {
              ...(series.emphasis?.label || {}),
              show: series.emphasis?.label?.show ?? true,
              color: series.emphasis?.label?.color || themeColors.text,
              fontSize: series.emphasis?.label?.fontSize || 12,
              fontWeight: series.emphasis?.label?.fontWeight || 'bold',
              formatter: series.emphasis?.label?.formatter || '{b}',
            },
            itemStyle: {
              ...(series.emphasis?.itemStyle || {}),
              areaColor: series.emphasis?.itemStyle?.areaColor || mapGradientColors[2],
              borderColor: series.emphasis?.itemStyle?.borderColor || themeColors.text,
              borderWidth: series.emphasis?.itemStyle?.borderWidth || 1,
            },
          },
        }
      }) || []

    const { minValue, maxValue } = this.calculateDataRange(series)

    const chartOptions = {
      gridWidth: input.gridWidth || 4,
      gridHeight: input.gridHeight || 4,
      gridX: input.gridX || 0,
      gridY: input.gridY || 0,
      tooltipType: input.tooltipType || 'mapLight',
      symbolSizeType: input.symbolSizeType || 'sqrt',
      series: series,
      title: {
        ...(input.title || {}),
        text: input.title?.text || '台灣地圖',
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
      },
      visualMap: {
        ...(input.visualMap || {}),
        min: input.visualMap?.min ?? minValue,
        max: input.visualMap?.max ?? maxValue,
        left: input.visualMap?.left || 20,
        bottom: input.visualMap?.bottom || 20,
        text: input.visualMap?.text || ['高', '低'],
        calculable: input.visualMap?.calculable ?? true,
        inRange: {
          color: input.visualMap?.inRange?.color || mapGradientColors,
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

      _geoJsonData: geoJsonData,
      _mapName: mapName,
    }
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
      const baseUrl = import.meta.env.BASE_URL
      const url = baseUrl ? `${baseUrl}geo/${mapName}.geo.json` : `geo/${mapName}.geo.json`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch GeoJSON for map: ${mapName}`)
      }

      const geoJson = await response.json()
      this.geoJsonCache.set(mapName, geoJson)

      return geoJson
    } catch (error) {
      console.error(error)
      throw error
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
