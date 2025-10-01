import type { ChartTransformer, TransformResult } from './types'
import type { ExtendedEChartsOption } from '@/types/echarts'

import { MapChartTransformer } from './transformers'

class ChartTransformService {
  private transformers: Map<string, ChartTransformer> = new Map()

  constructor() {
    this.register('map', new MapChartTransformer())
  }

  register(type: string, transformer: ChartTransformer) {
    this.transformers.set(type, transformer)
  }

  async transform(input: ExtendedEChartsOption): Promise<TransformResult> {
    try {
      if (input.chartType === undefined) {
        throw new Error('Chart type is undefined')
      }

      const transformer = this.transformers.get(input.chartType)

      if (!transformer) {
        return {
          success: false,
          msg: 'No transformer found for the given chart type',
          data: input,
        }
      }

      const result = await transformer.transform(input)

      return {
        success: true,
        msg: '',
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        msg: (error as Error).message,
        data: input,
      }
    }
  }

  transformBatch(input: ExtendedEChartsOption[]): Promise<TransformResult>[] {
    return input.map(chart => this.transform(chart))
  }

  getSupportedTypes(): string[] {
    return Array.from(this.transformers.keys())
  }

  isCoordSupported(type: string): boolean {
    return this.transformers.has(type)
  }
}

export const chartTransformService = new ChartTransformService()
