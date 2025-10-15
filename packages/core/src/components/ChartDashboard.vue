<template>
  <div class="chart-dashboard">
    <FilterPanel
      ref="filterPanelRef"
      :filters="filterConfigs"
      :filter-tags="filterTags"
      :show-popup="showFilterPopup"
      @toggle-popup="togglePopup"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
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
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
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

const filterConfigs = ref<filterOption[]>([])
const chartConfigs = ref<ExtendedEChartsOption[]>([])
const showFilterPopup = ref(false)
const filterTags = ref<{ [key: number]: string }>({})
const chartGridRef = ref<HTMLElement | null>(null)
const filterPanelRef = ref<InstanceType<typeof FilterPanel> | null>(null)

const itemBaseSize = ref(180)

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

const throttledUpdateSize = throttle(updateItemSize, 100)

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

function handleFilterApply(values: FilterValues) {
  setFilterTags(values)
  togglePopup()
  emit('filter-change', values)
}

function handleFilterReset() {
  filterTags.value = {}
}

function setFilterTags(values: FilterValues) {
  const tags: { [key: number]: string } = {}

  // Text filters
  Object.keys(values.text).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const value = values.text[keyAsNumber]

    if (value && filter) {
      tags[keyAsNumber] = `${filter.label}: ${value}`
    }
  })

  // Number filters
  Object.keys(values.number).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const value = values.number[keyAsNumber]

    if (value !== undefined && value !== null && filter) {
      const unit = filter.unit || ''
      tags[keyAsNumber] = `${filter.label}: ${value}${unit}`
    }
  })

  // Date filters
  Object.keys(values.date).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const value = values.date[keyAsNumber]

    if (value && filter) {
      const dateStr = formatDate(value)
      tags[keyAsNumber] = `${filter.label}: ${dateStr}`
    }
  })

  // Date range filters
  Object.keys(values.dateRange).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const range = values.dateRange[keyAsNumber]

    if (range && (range.start || range.end) && filter) {
      const startStr = range.start ? formatDate(range.start) : ''
      const endStr = range.end ? formatDate(range.end) : ''
      tags[keyAsNumber] = `${filter.label}: ${startStr} ~ ${endStr}`
    }
  })

  // Number range filters
  Object.keys(values.numberRange).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const range = values.numberRange[keyAsNumber]

    if (range && (range.start !== undefined || range.end !== undefined) && filter) {
      const unit = filter.unit || ''
      tags[keyAsNumber] = `${filter.label}: ${range.start}${unit} ~ ${range.end}${unit}`
    }
  })

  // Single select filters
  Object.keys(values.singleSelect).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const value = values.singleSelect[keyAsNumber]

    if (value && filter && filter.options) {
      const option = filter.options.find(opt => opt.value === value)
      const label = option ? option.label : value
      tags[keyAsNumber] = `${filter.label}: ${label}`
    }
  })

  // Multi select filters
  Object.keys(values.multiSelect).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    const values_ms = values.multiSelect[keyAsNumber]

    if (values_ms && values_ms.length > 0 && filter && filter.options) {
      const labels = values_ms
        .map(value => {
          const option = filter.options!.find(opt => opt.value === value)
          return option ? option.label : value
        })
        .filter(Boolean)
        .join(', ')

      tags[keyAsNumber] = `${filter.label}: ${labels}`
    }
  })

  filterTags.value = tags
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function initializeFilterTags() {
  // 從 filterConfigs 的 default 值初始化 filterTags
  const initialValues: FilterValues = {
    text: {},
    number: {},
    date: {},
    dateRange: {},
    numberRange: {},
    singleSelect: {},
    multiSelect: {},
  }

  filterConfigs.value.forEach((filter, index) => {
    if (filter.default === undefined || filter.default === null) return

    switch (filter.type) {
      case 'text':
        initialValues.text[index] = (filter.default as string) || ''
        break
      case 'number':
        initialValues.number[index] = (filter.default as number) || 0
        break
      case 'date':
        initialValues.date[index] = filter.default ? new Date(filter.default as string) : null
        break
      case 'dateRange':
        if (
          filter.default &&
          typeof filter.default === 'object' &&
          !Array.isArray(filter.default)
        ) {
          const rangeDefault = filter.default as { start: string; end: string }
          initialValues.dateRange[index] = {
            start: new Date(rangeDefault.start),
            end: new Date(rangeDefault.end),
          }
        }
        break
      case 'numberRange':
        if (
          filter.default &&
          typeof filter.default === 'object' &&
          !Array.isArray(filter.default)
        ) {
          const rangeDefault = filter.default as { start: number; end: number }
          initialValues.numberRange[index] = {
            start: rangeDefault.start,
            end: rangeDefault.end,
          }
        }
        break
      case 'singleSelect':
        initialValues.singleSelect[index] = (filter.default as string) || ''
        break
      case 'multiSelect':
        initialValues.multiSelect[index] = (filter.default as string[]) || []
        break
    }
  })

  // 使用初始值設置 filterTags
  setFilterTags(initialValues)
}

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

    if (filterConfigs.value.length > 0) {
      await nextTick()
      initializeFilterTags()
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
/* ChartDashboard 主容器 */
.chart-dashboard {
  width: 100%;
  height: 100%;
}

/* 圖表網格容器 */
.chart-dashboard__grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 200px);
  gap: 1rem;
}

/* 圖表項目 */
.chart-dashboard__item {
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
