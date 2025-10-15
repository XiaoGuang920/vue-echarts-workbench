import type {
  TitleComponentOption,
  ToolboxComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
} from 'echarts'

export interface LiquidFillSeriesOption {
  type: 'liquidFill'
  name?: string
  data?: number[]
  color?: string[]
  radius?: string | number
  center?: [string | number, string | number]
  shape?: string | 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow'
  amplitude?: string | number
  waveLength?: string | number
  waveAnimation?: boolean
  outline?: {
    show?: boolean
    borderDistance?: number
    itemStyle?: {
      borderWidth?: number
      borderColor?: string
      shadowBlur?: number
      shadowColor?: string
    }
  }
  backgroundStyle?: {
    color?: string
    borderColor?: string
    borderWidth?: number
    shadowBlur?: number
    shadowColor?: string
  }
  itemStyle?: {
    opacity?: number
    shadowBlur?: number
    shadowColor?: string
    [key: string]: unknown
  }
  label?: {
    show?: boolean
    fontFamily?: string
    fontSize?: number
    color?: string
    insideColor?: string
    formatter?: string | ((params: unknown) => string)
    position?: string | 'inside' | 'outside' | 'center'
    fontWeight?: string | number
    [key: string]: unknown
  }
  emphasis?: {
    itemStyle?: {
      opacity?: number
      borderColor?: string
      borderWidth?: number
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface LiquidFillChartOption {
  chartType?: string
  gridWidth?: number
  gridHeight?: number
  gridX?: number
  gridY?: number
  tooltipType?: string
  data?: number[]
  series?: LiquidFillSeriesOption[]
  title?: TitleComponentOption
  xAxis?: XAXisComponentOption
  yAxis?: YAXisComponentOption
  legend?: LegendComponentOption
  toolbox?: ToolboxComponentOption
  [key: string]: unknown
}
