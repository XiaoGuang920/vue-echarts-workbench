<template>
  <div class="dynamic-chart">
    <template v-if="renderChartJson.chartType == 'dashboardMetric'">
      <div class="dynamic-chart__metric">
        <div class="dynamic-chart__metric-label">{{ renderChartJson.label }}</div>
        <div class="dynamic-chart__metric-content">
          <span
            class="dynamic-chart__metric-value"
            :class="{ 'dynamic-chart__metric-value--animating': isAnimating }"
          >
            {{ formattedValue }} {{ renderChartJson.unit }}
          </span>
          <template v-if="renderChartJson.trend">
            <span class="dynamic-chart__metric-trend" :class="getTrendStyle(renderChartJson.trend)">
              <FontAwesomeIcon v-if="renderChartJson.trend.type === 'up'" :icon="faArrowUp" />
              <FontAwesomeIcon v-else :icon="faArrowDown" />
              {{ renderChartJson.trend.value }} %
            </span>
          </template>
        </div>
        <template v-if="renderChartJson.description">
          <span class="dynamic-chart__metric-description">{{ renderChartJson.description }}</span>
        </template>
        <div v-if="fontawsomeIcon" class="dynamic-chart__metric-icon">
          <FontAwesomeIcon :icon="fontawsomeIcon" />
        </div>
      </div>
    </template>
    <template v-else>
      <Transition name="fade" mode="out-in">
        <div v-if="isLoading" class="dynamic-chart__loading">
          <span class="loader"></span>
        </div>
        <v-chart v-else class="chart" :option="renderChartJson" autoresize />
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  EChartsModule,
  ChartOptionsConfig,
  ExtendedEChartsOption,
  DashboardMetricTrend,
} from '../types/echarts'
import type { TransformResult } from '../services'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

import { ref, watch, nextTick, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  RadarComponent,
  CalendarComponent,
  GeoComponent,
  DataZoomComponent,
  ParallelComponent,
  SingleAxisComponent,
  PolarComponent,
  ToolboxComponent,
  BrushComponent,
  TimelineComponent,
} from 'echarts/components'
import { chartTransformService } from '../services'

use([
  SVGRenderer,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  RadarComponent,
  CalendarComponent,
  GeoComponent,
  DataZoomComponent,
  ParallelComponent,
  SingleAxisComponent,
  PolarComponent,
  ToolboxComponent,
  BrushComponent,
  TimelineComponent,
])

const props = defineProps<{
  chartJson: ExtendedEChartsOption | Record<string, unknown>
}>()

// 是否載入中(用於顯示載入動畫)
const isLoading = ref(true)

// 圖表轉換後的配置(實際用於渲染)
const renderChartJson = ref({} as ExtendedEChartsOption)

// 動畫數值
const animatedValue = ref(0)
const isAnimating = ref(false)

// FontAwesome Icon
const fontawsomeIcon = ref<IconDefinition | null>(null)

// 圖表類型對應相關設定值
const chartOptions: ChartOptionsConfig = {
  line: {
    use: async () => {
      const { LineChart } = await import('echarts/charts')

      return [LineChart]
    },
  },
  lineSections: {
    use: async () => {
      const { LineChart } = await import('echarts/charts')
      return [LineChart]
    },
  },
  bar: {
    use: async () => {
      const { BarChart } = await import('echarts/charts')
      return [BarChart]
    },
  },
  pie: {
    use: async () => {
      const { PieChart } = await import('echarts/charts')
      return [PieChart]
    },
  },
  scatter: {
    use: async () => {
      const { ScatterChart } = await import('echarts/charts')
      return [ScatterChart]
    },
  },
  horizontalBar: {
    use: async () => {
      const { BarChart } = await import('echarts/charts')
      return [BarChart]
    },
  },
  radar: {
    use: async () => {
      const { RadarChart } = await import('echarts/charts')
      return [RadarChart]
    },
  },
  stackedBar: {
    use: async () => {
      const { BarChart } = await import('echarts/charts')
      return [BarChart]
    },
  },
  mixLineBar: {
    use: async () => {
      const { BarChart } = await import('echarts/charts')
      const { LineChart } = await import('echarts/charts')
      return [BarChart, LineChart]
    },
  },
  bubble: {
    use: async () => {
      const { ScatterChart } = await import('echarts/charts')
      const { EffectScatterChart } = await import('echarts/charts')
      return [ScatterChart, EffectScatterChart]
    },
  },
  heatmap: {
    use: async () => {
      const { HeatmapChart } = await import('echarts/charts')
      return [HeatmapChart]
    },
  },
  funnel: {
    use: async () => {
      const { FunnelChart } = await import('echarts/charts')
      return [FunnelChart]
    },
  },
  gauge: {
    use: async () => {
      const { GaugeChart } = await import('echarts/charts')
      return [GaugeChart]
    },
  },
  map: {
    use: async () => {
      const { MapChart } = await import('echarts/charts')
      return [MapChart]
    },
  },
  tree: {
    use: async () => {
      const { TreeChart } = await import('echarts/charts')
      return [TreeChart]
    },
  },
  candlestick: {
    use: async () => {
      const { CandlestickChart } = await import('echarts/charts')
      return [CandlestickChart]
    },
  },
  sunburst: {
    use: async () => {
      const { SunburstChart } = await import('echarts/charts')
      return [SunburstChart]
    },
  },
  graph: {
    use: async () => {
      const { GraphChart } = await import('echarts/charts')
      return [GraphChart]
    },
  },
  sankey: {
    use: async () => {
      const { SankeyChart } = await import('echarts/charts')
      return [SankeyChart]
    },
  },
  treemap: {
    use: async () => {
      const { TreemapChart } = await import('echarts/charts')
      return [TreemapChart]
    },
  },
  liquidFill: {
    use: async () => {
      try {
        // @ts-expect-error liquid fill don't have type
        await import('echarts-liquidfill')
      } catch (error) {
        console.error('Failed to load liquid fill module:', error)
      }

      return []
    },
  },
  polarBar: {
    use: async () => {
      const { BarChart } = await import('echarts/charts')
      return [BarChart]
    },
  },
  ringProgress: {
    use: async () => {
      const { PieChart } = await import('echarts/charts')
      return [PieChart]
    },
  },
  themeRiver: {
    use: async () => {
      const { ThemeRiverChart } = await import('echarts/charts')
      return [ThemeRiverChart]
    },
  },
  parallel: {
    use: async () => {
      const { ParallelChart } = await import('echarts/charts')
      return [ParallelChart]
    },
  },
  boxplot: {
    use: async () => {
      const { BoxplotChart } = await import('echarts/charts')
      return [BoxplotChart]
    },
  },
}

/**
 * 確保非同步操作至少執行指定時間
 * @param asyncOperation 非同步操作
 * @param minimumTime 最少執行時間 (毫秒)
 * @returns 非同步操作結果
 */
async function ensureMinimumLoadingTime<T>(
  asyncOperation: () => Promise<T>,
  minimumTime: number = 1000
): Promise<T> {
  const startTime = Date.now()

  try {
    const result = await asyncOperation()

    const elapsedTime = Date.now() - startTime

    if (elapsedTime < minimumTime) {
      const remainingTime = minimumTime - elapsedTime
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    return result
  } catch (error) {
    const elapsedTime = Date.now() - startTime
    if (elapsedTime < minimumTime) {
      const remainingTime = minimumTime - elapsedTime
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }
    throw error
  }
}

/**
 * 取得趨勢樣式
 * @param trend 趨勢資料
 */
function getTrendStyle(trend: DashboardMetricTrend): string {
  if (trend.type === 'up') {
    return 'dynamic-chart__metric-trend--up'
  } else if (trend.type === 'down') {
    return 'dynamic-chart__metric-trend--down'
  } else {
    return ''
  }
}

/**
 * 控制圖表數值動畫(BaseMetric)
 * @param from     起始值
 * @param to       結束值
 * @param duration 動畫持續時間
 */
function animateNumber(from: number, to: number, duration: number = 2000) {
  return new Promise<void>(resolve => {
    isAnimating.value = true
    animatedValue.value = from
    const startTime = Date.now()
    const difference = to - from

    function updateValue() {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easedProgress = 1 - Math.pow(1 - progress, 3)
      animatedValue.value = Math.floor(from + difference * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      } else {
        animatedValue.value = to
        isAnimating.value = false
        resolve()
      }
    }

    requestAnimationFrame(updateValue)
  })
}

/**
 * 格式化數值顯示(BaseMetric)
 */
const formattedValue = computed(() => {
  const value = animatedValue.value

  const abbreviations = [
    { threshold: 1e12, suffix: 'T' }, // 兆 (Trillion)
    { threshold: 1e9, suffix: 'B' }, // 十億 (Billion)
    { threshold: 1e6, suffix: 'M' }, // 百萬 (Million)
    { threshold: 1e3, suffix: 'K' }, // 千 (Thousand)
  ]

  for (const { threshold, suffix } of abbreviations) {
    if (Math.abs(value) >= threshold) {
      const abbreviated = value / threshold

      if (abbreviated >= 100) {
        return Math.round(abbreviated) + suffix
      } else if (abbreviated >= 10) {
        return parseFloat(abbreviated.toFixed(1)) + suffix
      } else {
        return parseFloat(abbreviated.toFixed(2)) + suffix
      }
    }
  }

  return value.toLocaleString()
})

/**
 * 動態載入 FontAwesome icon
 * @param iconName icon 名稱 (camelCase，例如：'compass-drafting' -> 'faCompassDrafting')
 */
async function loadDynamicIcon(iconName: string): Promise<IconDefinition | null> {
  if (!iconName) {
    return null
  }

  try {
    // 將 kebab-case 轉換為 camelCase (例如: compass-drafting -> CompassDrafting)
    const camelCaseName = iconName
      .split('-')
      .map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('')

    // FontAwesome icon 命名規則: fa + CamelCaseName
    const iconImportName = `fa${camelCaseName}`

    console.log(`Attempting to load icon: ${iconImportName}`)

    // 動態 import FontAwesome icon
    const iconModule = await import('@fortawesome/free-solid-svg-icons')

    // 檢查 icon 是否存在
    if (iconImportName in iconModule) {
      return iconModule[iconImportName as keyof typeof iconModule] as IconDefinition
    } else {
      console.warn(`Icon "${iconImportName}" not found in @fortawesome/free-solid-svg-icons`)
      return null
    }
  } catch (error) {
    console.error(`Failed to load icon "${iconName}":`, error)
    return null
  }
}

/**
 * 將各種格式的 icon 名稱標準化
 * @param iconName 原始 icon 名稱
 * @returns 標準化的 icon 名稱 (kebab-case)
 */
function normalizeIconName(iconName: string): string {
  // 移除 'fa-' 前綴 (如果有)
  let normalized = iconName.replace(/^fa-/, '')

  // 如果是 camelCase，轉換為 kebab-case
  normalized = normalized.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

  return normalized
}

/**
 * 註冊地圖
 */
async function registerMapIfNeeded(options: ExtendedEChartsOption) {
  if (
    options.chartType === 'map' &&
    options._geoJsonData &&
    options._mapName &&
    typeof options._mapName === 'string'
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      echarts.registerMap(options._mapName, options._geoJsonData as any)
    } catch (error) {
      console.error('Failed to register map:', error)
      throw error
    }
  }
}

/**
 * 清理圖表配置，移除不必要的屬性
 */
function cleanChartOptions(options: ExtendedEChartsOption): ExtendedEChartsOption {
  const { _geoJsonData, _mapName, ...cleanOptions } = options
  void _geoJsonData
  void _mapName
  return cleanOptions
}

watch(
  () => props.chartJson,
  async (newChartJson: ExtendedEChartsOption) => {
    if (newChartJson.chartType === 'dashboardMetric' && newChartJson.icon) {
      const iconName = normalizeIconName(newChartJson.icon as string)
      fontawsomeIcon.value = await loadDynamicIcon(iconName)
    } else {
      fontawsomeIcon.value = null
    }

    const mainChartType = newChartJson.chartType

    if (!mainChartType) {
      console.error('chartType is required in chartJson')
      return
    }

    let magicChartTypes: string[] | undefined

    if (newChartJson.toolbox) {
      if (Array.isArray(newChartJson.toolbox)) {
        for (const toolbox of newChartJson.toolbox) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const types = (toolbox as any).feature?.magicType?.type
          if (types) {
            magicChartTypes = types
            break
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        magicChartTypes = (newChartJson.toolbox as any).feature?.magicType?.type
      }
    }

    const uniqueChartTypes = new Set([mainChartType, ...(magicChartTypes ?? [])])
    const chartTypes = Array.from(uniqueChartTypes)

    try {
      await ensureMinimumLoadingTime(async () => {
        const chartSettings = chartTypes
          .map(type => chartOptions[type])
          .filter(setting => setting !== undefined)

        const moduleArrays = await Promise.all(chartSettings.map(setting => setting.use()))

        const allModules = moduleArrays.flat()

        if (allModules && allModules.length > 0) {
          use(allModules as EChartsModule[])
        }

        await nextTick()

        const transformResult: TransformResult = await chartTransformService.transform(newChartJson)
        if (!transformResult.success && newChartJson.chartType !== 'dashboardMetric') {
          console.error('Chart transformation failed:', transformResult.msg)
        }

        await registerMapIfNeeded(transformResult.data)

        renderChartJson.value = cleanChartOptions(transformResult.data)

        if (
          newChartJson.chartType === 'dashboardMetric' &&
          typeof newChartJson.value === 'number'
        ) {
          await animateNumber(0, newChartJson.value, 1500)
        }
      }, 1000) // 最少載入 1 秒
    } catch (error) {
      console.error('Failed to load chart module:', error)

      // 即使發生錯誤，也要確保最小載入時間
      await ensureMinimumLoadingTime(async () => {
        renderChartJson.value = newChartJson
      }, 1000)
    } finally {
      isLoading.value = false
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style scoped>
.dynamic-chart {
  height: 100%;
  width: 100%;
}

.dynamic-chart__metric {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  padding: 1rem;
  color: #374151;
}

.dynamic-chart__metric-label {
  font-size: 1.25rem;
  font-weight: 700;
}

.dynamic-chart__metric-content {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
}

.dynamic-chart__metric-value {
  line-height: 1.2em;
  font-size: 2.25rem;
  font-weight: 800;
}

.dynamic-chart__metric-value--animating {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.dynamic-chart__metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.dynamic-chart__metric-trend--up {
  color: #10b981;
  border: 1px solid #10b981;
  background-color: #d1fae5;
}

.dynamic-chart__metric-trend--down {
  color: #ef4444;
  border: 1px solid #ef4444;
  background-color: #fee2e2;
}

.dynamic-chart__metric-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.dynamic-chart__metric-icon {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  height: 3rem;
  width: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: #d1d5db;
  font-size: 1.5rem;
  color: #374151;
}

.dynamic-chart__loading {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loader {
  position: relative;
  height: 200px;
  width: 200px;
  border-bottom: 3px solid #fea405;
  box-sizing: border-box;
  animation: drawLine 4s linear infinite;
}

.loader:before {
  content: '';
  position: absolute;
  left: calc(100% + 14px);
  bottom: -6px;
  width: 16px;
  height: 100px;
  border-radius: 20px 20px 50px 50px;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(#ff3d00 6px, transparent 0),
    linear-gradient(45deg, rgba(0, 0, 0, 0.02) 49%, white 51%),
    linear-gradient(315deg, rgba(0, 0, 0, 0.02) 49%, white 51%),
    linear-gradient(to bottom, #ffffff 10%, #fea405 10%, #fea405 90%, #ffffff 90%);
  background-size:
    3px 3px,
    8px 8px,
    8px 8px,
    16px 88px;
  background-position:
    center bottom,
    left 88px,
    right 88px,
    left top;
  transform: rotate(25deg);
  animation: pencilRot 4s linear infinite;
}

@keyframes drawLine {
  0%,
  100% {
    width: 0px;
  }
  45%,
  55% {
    width: 200px;
  }
}

@keyframes pencilRot {
  0%,
  45% {
    bottom: -6px;
    left: calc(100% + 14px);
    transform: rotate(25deg);
  }
  55%,
  100% {
    bottom: -12px;
    left: calc(100% + 16px);
    transform: rotate(220deg);
  }
}
</style>
