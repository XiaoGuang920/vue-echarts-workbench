import type { ChartTransformer, TransformResult } from './types'
import type { ExtendedEChartsOption } from '@/types/echarts'

import { TooltipProcessor } from './processors'
import {
  LineChartTransformer,
  LineSectionChartTransformer,
  BarChartTransformer,
  PieChartTransformer,
  ScatterChartTransformer,
  HorizontalBarChartTransformer,
  RadarChartTransformer,
  StackedBarChartTransformer,
  MixLineBarChartTransformer,
  BubbleChartTransformer,
  HeatmapChartTransformer,
  FunnelChartTransformer,
  GaugeChartTransformer,
  MapChartTransformer,
  TreeChartTransformer,
  CandlestickChartTransformer,
  SunburstChartTransformer,
  GraphChartTransformer,
  SankeyChartTransformer,
  TreemapChartTransformer,
  LiquidFillChartTransformer,
  PolarBarChartTransformer,
  RingProgressChartTransformer,
  ThemeRiverChartTransformer,
  ParallelChartTransformer,
  BoxplotChartTransformer,
} from './transformers'

/**
 * Chart Transform Service
 */
class ChartTransformService {
  private transformers: Map<string, ChartTransformer> = new Map()
  private tooltipProcessor = new TooltipProcessor()

  constructor() {
    this.register('line', new LineChartTransformer())
    this.register('lineSections', new LineSectionChartTransformer())
    this.register('bar', new BarChartTransformer())
    this.register('pie', new PieChartTransformer())
    this.register('scatter', new ScatterChartTransformer())
    this.register('horizontalBar', new HorizontalBarChartTransformer())
    this.register('radar', new RadarChartTransformer())
    this.register('stackedBar', new StackedBarChartTransformer())
    this.register('mixLineBar', new MixLineBarChartTransformer())
    this.register('bubble', new BubbleChartTransformer())
    this.register('heatmap', new HeatmapChartTransformer())
    this.register('funnel', new FunnelChartTransformer())
    this.register('gauge', new GaugeChartTransformer())
    this.register('map', new MapChartTransformer())
    this.register('tree', new TreeChartTransformer())
    this.register('candlestick', new CandlestickChartTransformer())
    this.register('sunburst', new SunburstChartTransformer())
    this.register('graph', new GraphChartTransformer())
    this.register('sankey', new SankeyChartTransformer())
    this.register('treemap', new TreemapChartTransformer())
    this.register('liquidFill', new LiquidFillChartTransformer())
    this.register('polarBar', new PolarBarChartTransformer())
    this.register('ringProgress', new RingProgressChartTransformer())
    this.register('themeRiver', new ThemeRiverChartTransformer())
    this.register('parallel', new ParallelChartTransformer())
    this.register('boxplot', new BoxplotChartTransformer())
  }

  /**
   * 註冊圖表轉換器
   */
  register(type: string, transformer: ChartTransformer) {
    this.transformers.set(type, transformer)
  }

  /**
   * 轉換圖表配置
   * @param input 輸入的圖表配置
   * @returns 轉換結果
   */
  async transform(input: ExtendedEChartsOption): Promise<TransformResult> {
    try {
      if (input.chartType === undefined) {
        throw new Error('Chart type is undefined')
      }

      let result = { ...input }

      const transformer = this.transformers.get(input.chartType)
      if (!transformer) {
        return {
          success: false,
          msg: 'No transformer found for the given chart type',
          data: input,
        }
      }

      result = await transformer.transform(input)

      result = this.tooltipProcessor.process(result)

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
