<template>
  <div class="chart-dashboard">
    <FilterPanel
      ref="filterPanelRef"
      :filter-configs="filterConfigs"
      :show-popup="showFilterPopup"
      @toggle-popup="togglePopup"
      @apply="handleFilterApply"
    />

    <div ref="chartGridRef" class="chart-dashboard__grid">
      <div
        v-for="(chart, index) in chartConfigs"
        :key="index"
        :style="getGridStyles(chart)"
        class="chart-dashboard__item"
      >
        <DynamicChart :key="index" :chart-json="chart" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import FilterPanel from './FilterPanel.vue'
import DynamicChart from './DynamicChart.vue'
import type { FilterValues } from '../types/filters'
import type { ExtendedEChartsOption } from '../types/echarts'
import type { filterOption } from '../types/filters'

interface Props {
  configUrl?: string
  config?: {
    filters?: filterOption[]
    charts?: ExtendedEChartsOption[]
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'filter-change', filters: FilterValues): void
  (e: 'charts-loaded', charts: ExtendedEChartsOption[]): void
  (e: 'error', error: Error): void
}>()

// 篩選項設定
const filterConfigs = ref<filterOption[]>([])
const chartConfigs = ref<ExtendedEChartsOption[]>([])
const showFilterPopup = ref(false)
const chartGridRef = ref<HTMLElement | null>(null)
const filterPanelRef = ref<InstanceType<typeof FilterPanel> | null>(null)

// 單一圖表基準尺寸
const itemBaseSize = ref(180)

/**
 * 切換篩選面板顯示狀態
 */
function togglePopup() {
  if (showFilterPopup.value === true && filterPanelRef.value) {
    filterPanelRef.value.closeAllSelects()

    setTimeout(() => {
      showFilterPopup.value = false
    }, 10)
  } else {
    showFilterPopup.value = true
  }
}

/**
 * 函式節流
 * @param func  要節流的函式
 * @param limit 節流時間限制
 */
function throttle(func: () => void, limit: number): () => void {
  let inThrottle: boolean
  return function () {
    if (!inThrottle) {
      func()
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 更新單一圖表基準尺寸
 */
function updateItemSize() {
  if (!chartGridRef.value) return

  const containerWidth = chartGridRef.value.clientWidth

  if (containerWidth < 768) {
    itemBaseSize.value = 80
  } else if (containerWidth < 1024) {
    itemBaseSize.value = 80
  } else if (containerWidth < 1280) {
    itemBaseSize.value = 120
  } else if (containerWidth < 1536) {
    itemBaseSize.value = 160
  } else {
    itemBaseSize.value = 160
  }
}

/**
 * 節流更新圖表尺寸
 */
const throttledUpdateSize = throttle(updateItemSize, 100)

/**
 * 獲取圖表網格樣式
 * @param chart 圖表配置
 */
function getGridStyles(chart: ExtendedEChartsOption | Record<string, unknown>) {
  const x = (chart.gridX as number) || 1
  const y = (chart.gridY as number) || 1
  const width = (chart.gridWidth as number) || 4
  const height = (chart.gridHeight as number) || 4

  const endX = x + width
  const endY = y + height

  return {
    gridColumn: `${x} / ${endX}`,
    gridRow: `${y} / ${endY}`,
    minHeight: `${height * itemBaseSize.value}px`,
  }
}

/**
 * 處理篩選條件應用
 * @param values 篩選條件值
 */
function handleFilterApply(values: FilterValues) {
  togglePopup()
  emit('filter-change', values)
}

/**
 * 載入配置
 */
async function loadConfig() {
  try {
    if (props.config) {
      filterConfigs.value = props.config.filters || []
      chartConfigs.value = (props.config.charts || []) as ExtendedEChartsOption[]
      emit('charts-loaded', chartConfigs.value as ExtendedEChartsOption[])
    } else if (props.configUrl) {
      const response = await fetch(props.configUrl)
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`)
      }

      const data = await response.json()
      filterConfigs.value = data.filters || []
      chartConfigs.value = (data.charts || []) as ExtendedEChartsOption[]
      emit('charts-loaded', chartConfigs.value as ExtendedEChartsOption[])
    }
  } catch (error) {
    console.error('Error loading config:', error)
    emit('error', error as Error)
  }
}

onMounted(() => {
  loadConfig()
  updateItemSize()
  window.addEventListener('resize', throttledUpdateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', throttledUpdateSize)
})

defineExpose({
  loadConfig,
  togglePopup,
  chartGridRef,
})
</script>

<style scoped>
.chart-dashboard {
  width: 100%;
  height: 100%;
}

.chart-dashboard__grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 200px);
  gap: 1rem;
}

.chart-dashboard__item {
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
