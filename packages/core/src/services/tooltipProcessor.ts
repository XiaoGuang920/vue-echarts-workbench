import type { ExtendedEChartsOption } from '../types/echarts'
import type { TooltipFormatter } from './types'

import {
  DefaultTooltipFormatter,
  LineChartTooltipFormatter,
  BarChartTooltipFormatter,
  PieChartTooltipFormatter,
  ScatterChartTooltipFormatter,
  HorizontalBarChartTooltipFormatter,
  RadarChartTooltipFormatter,
  StackedBarChartTooltipFormatter,
  MixLineBarChartTooltipFormatter,
  BubbleChartTooltipFormatter,
  HeatmapChartTooltipFormatter,
  FunnelChartTooltipFormatter,
  MapChartTooltipFormatter,
  CandlestickChartTooltipFormatter,
  SunburstChartTooltipFormatter,
  TreemapChartTooltipFormatter,
  ThemeRiverChartTooltipFormatter,
  BoxplotChartTooltipFormatter,
} from './processors'

/**
 * Tooltip Processor
 */
export class TooltipProcessor {
  private formatters: Map<string, TooltipFormatter> = new Map()

  constructor() {
    this.register('default', new DefaultTooltipFormatter())
    this.register('line', new LineChartTooltipFormatter())
    this.register('lineSections', new LineChartTooltipFormatter())
    this.register('bar', new BarChartTooltipFormatter())
    this.register('pie', new PieChartTooltipFormatter())
    this.register('scatter', new ScatterChartTooltipFormatter())
    this.register('horizontalBar', new HorizontalBarChartTooltipFormatter())
    this.register('radar', new RadarChartTooltipFormatter())
    this.register('stackedBar', new StackedBarChartTooltipFormatter())
    this.register('horizontalStackedBar', new StackedBarChartTooltipFormatter())
    this.register('mixLineBar', new MixLineBarChartTooltipFormatter())
    this.register('bubble', new BubbleChartTooltipFormatter())
    this.register('heatmap', new HeatmapChartTooltipFormatter())
    this.register('funnel', new FunnelChartTooltipFormatter())
    this.register('map', new MapChartTooltipFormatter())
    this.register('candlestick', new CandlestickChartTooltipFormatter())
    this.register('sunburst', new SunburstChartTooltipFormatter())
    this.register('treemap', new TreemapChartTooltipFormatter())
    this.register('themeRiver', new ThemeRiverChartTooltipFormatter())
    this.register('boxplot', new BoxplotChartTooltipFormatter())
  }

  /**
   * 註冊 Tooltip 格式器
   */
  register(type: string, formatter: TooltipFormatter) {
    this.formatters.set(type, formatter)
  }

  /**
   * 處理圖表 Tooltip 配置
   * @param options 圖表配置
   * @returns 處理後的圖表配置
   */
  process(options: ExtendedEChartsOption): ExtendedEChartsOption {
    if (!options.tooltipType) return options

    const isDark = options.tooltipType.endsWith('Dark')
    const type = options.chartType || options.tooltipType.replace(/(Light|Dark|Detail)$/, '')

    const formatter = this.formatters.get(type)
    if (!formatter) {
      console.warn(`No formatter found for tooltip type: ${type}`)
      return options
    }

    const isDetailMode = options.tooltipType.includes('Detail')

    const tooltipFormatter =
      isDetailMode && formatter.detailFormat
        ? formatter.detailFormat(isDark, options)
        : formatter.format(isDark, options)

    // 提取 tooltip 物件，處理 union 型別
    const tooltipObj = (
      Array.isArray(options.tooltip) ? options.tooltip[0] : options.tooltip || {}
    ) as Record<string, unknown>

    const tooltipOptions = {
      trigger: isDetailMode ? 'axis' : (tooltipObj.trigger as string) || 'item',
      backgroundColor: (tooltipObj.backgroundColor as string) || 'transparent',
      borderWidth: (tooltipObj.borderWidth as number) || 0,
      shadowBlur: (tooltipObj.shadowBlur as number) || 0,
      padding: (tooltipObj.padding as number) || 0,
      extraCssText: (tooltipObj.extraCssText as string) || 'box-shadow: none; border: none;',
    }

    return {
      ...options,
      tooltip: {
        ...tooltipOptions,
        formatter: tooltipFormatter as unknown,
      },
    } as ExtendedEChartsOption
  }

  /**
   * 取得支援的 Tooltip 類型
   */
  getSupportedTypes(): string[] {
    return Array.from(this.formatters.keys())
  }

  /**
   * 檢查是否支援指定的 Tooltip 類型
   */
  isSupported(type: string): boolean {
    return this.formatters.has(type)
  }
}
