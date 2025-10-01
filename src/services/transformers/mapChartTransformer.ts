import type { ChartTransformer } from '@/services/types'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { GeoJsonData, GeoJsonFeature } from '@/types/geojson'
import type { MapDataItem } from '@/types/map'
import type { MapSeriesOption } from 'echarts'

export class MapChartTransformer implements ChartTransformer {
  private geoJsonCache = new Map<string, unknown>()

  async transform(input: ExtendedEChartsOption): Promise<ExtendedEChartsOption> {
    const mapName = 'taiwan'
    const geoJsonData = await this.fetchGeoJson(mapName)

    const gridWidth = input.gridWidth || 4
    const gridHeight = input.gridHeight || 4
    const gridX = input.gridX || 0
    const gridY = input.gridY || 0

    const symbolSizeType = input.symbolSizeType || 'squrt'

    const series =
      input.series.map((serie: MapSeriesOption) => {
        const nameProperty = 'COUNTYNAME'

        const serieData = serie.data as MapDataItem[]
        const completeData = this.createCompleteDataSet(serieData, geoJsonData)

        return {
          ...serie,
          nameProperty: nameProperty,
          data: completeData,
        }
      }) || []

    return {
      ...input,
      gridWidth: gridWidth,
      gridHeight: gridHeight,
      gridX: gridX,
      gridY: gridY,
      symbolSizeType: symbolSizeType,
      series: series,

      _geoJsonData: geoJsonData,
      _mapName: mapName,
    }
  }

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

  clearCache(): void {
    this.geoJsonCache.clear()
  }
}
