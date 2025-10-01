export interface GeoJsonProperties {
  COUNTYNAME?: string
  NAME?: string
  name?: string
  COUNTYID?: string
  COUNTYCODE?: string
  COUNTYENG?: string
  [key: string]: any
}

export interface GeoJsonFeature {
  type: 'Feature'
  properties: GeoJsonProperties
  geometry: {
    type: string
    coordinates: any[]
  }
}

export interface GeoJsonData {
  type: 'FeatureCollection'
  features: GeoJsonFeature[]
}
