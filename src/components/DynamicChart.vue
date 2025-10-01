<template>
  <div class="h-full w-full">
    <template v-if="renderChartJson.chartType == 'dashboardMetric'">
      <div class="relative flex h-full w-full flex-col p-4 text-[#374151]">
        <div class="text-xl font-bold">{{ renderChartJson.label }}</div>
        <div class="flex h-full flex-col items-start justify-center gap-2">
          <span class="text-4xl font-extrabold" :class="{ 'animate-pulse': isAnimating }">
            {{ formattedValue }} {{ renderChartJson.unit }}
          </span>
          <template v-if="renderChartJson.trend">
            <span
              class="inline-flex items-center gap-1 rounded-full py-1 pl-2 pr-3 text-sm font-medium"
              :class="getTrendStyle(renderChartJson.trend)"
            >
              <FontAwesomeIcon v-if="renderChartJson.trend.type === 'up'" :icon="faArrowUp" />
              <FontAwesomeIcon v-else :icon="faArrowDown" />
              {{ renderChartJson.trend.value }} %
            </span>
          </template>
        </div>
        <template v-if="renderChartJson.description">
          <span class="text-sm text-gray-500">{{ renderChartJson.description }}</span>
        </template>
        <div
          v-if="renderChartJson.icon"
          class="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-300 text-2xl text-[#374151]"
        >
          <i class="fa-solid" :class="`fa-${renderChartJson.icon}`"></i>
        </div>
      </div>
    </template>
    <template v-else>
      <Transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex h-full w-full items-center justify-center">
          <span class="loader"></span>
        </div>
        <v-chart v-else class="chart" :option="renderChartJson" autoresize />
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import type {
  EChartsModule,
  ChartOptionsConfig,
  ExtendedEChartsOption,
  DashboardMetricTrend,
} from '@/types/echarts'
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
import { chartTransformService, type TransformResult } from '@/services'

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
  chartJson: ExtendedEChartsOption
}>()

const isLoading = ref(true)
const renderChartJson = ref({} as ExtendedEChartsOption)

const animatedValue = ref(0)
const isAnimating = ref(false)

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
        // @ts-expect-error - echarts-liquidfill 沒有類型定義
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

function getTrendStyle(trend: DashboardMetricTrend) {
  if (trend.type === 'up') {
    return 'text-green-500 border-green-500 bg-green-100'
  } else if (trend.type === 'down') {
    return 'text-red-500 border-red-500 bg-red-100'
  } else {
    return ''
  }
}

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

async function registerMapIfNeeded(options: ExtendedEChartsOption) {
  if (options.chartType === 'map' && options._geoJsonData && options._mapName) {
    try {
      echarts.registerMap(options._mapName, options._geoJsonData)
    } catch (error) {
      console.error('Failed to register map:', error)
      throw error
    }
  }
}

function cleanChartOptions(options: ExtendedEChartsOption): ExtendedEChartsOption {
  const { _geoJsonData, _mapName, ...cleanOptions } = options
  void _geoJsonData
  void _mapName
  return cleanOptions
}

watch(
  () => props.chartJson,
  async (newChartJson: ExtendedEChartsOption) => {
    const mainChartType = newChartJson.chartType

    if (!mainChartType) {
      console.error('chartType is required in chartJson')
      return
    }

    let magicChartTypes: string[] | undefined

    if (newChartJson.toolbox) {
      if (Array.isArray(newChartJson.toolbox)) {
        for (const toolbox of newChartJson.toolbox) {
          const types = toolbox.feature?.magicType?.type
          if (types) {
            magicChartTypes = types
            break
          }
        }
      } else {
        magicChartTypes = newChartJson.toolbox.feature?.magicType?.type
      }
    }

    const chartTypes = [...new Set([mainChartType, ...(magicChartTypes ?? [])])]

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
        if (!transformResult.success) {
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
