export interface GeoJsonProperties {
  COUNTYNAME?: string
  NAME?: string
  name?: string
  COUNTYID?: string
  COUNTYCODE?: string
  COUNTYENG?: string
  [key: string]: unknown
}

export interface GeoJsonFeature {
  type: 'Feature'
  properties: GeoJsonProperties
  geometry: {
    type: string
    coordinates: unknown[]
  }
}

export interface GeoJsonData {
  type: 'FeatureCollection'
  features: GeoJsonFeature[]
}
