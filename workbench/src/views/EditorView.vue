<template>
  <div class="container flex gap-8">
    <div class="popup-model" :class="{ active: showPopup }" @click="togglePopup">
      <div class="popup-content shadow-lg" @click.stop>
        <div class="popup-body">
          <div class="scroll-container">
            <div class="grid grid-cols-3 gap-4">
              <button
                v-for="(option, chartName) in chartOptions"
                :key="chartName"
                class="flex aspect-square flex-col items-center justify-center rounded bg-gray-200 p-4 text-base font-semibold text-gray-800 hover:bg-gray-300"
                @click="loadChartOption(chartName)"
              >
                <FontAwesomeIcon :icon="faCompassDrafting" class="mb-8 text-5xl" />
                {{ chartName }}
              </button>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button
            class="flex w-full items-center justify-center rounded bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
            @click="togglePopup"
          >
            <FontAwesomeIcon :icon="faXmark" class="mr-1" />關閉
          </button>
        </div>
      </div>
    </div>

    <div class="editor-child">
      <DynamicChart v-if="chartConfig" :key="activeChart" :chart-json="chartConfig" />
    </div>
    <div class="editor-child">
      <div
        ref="lineNumbersRef"
        class="absolute left-0 top-0 h-full overflow-hidden bg-gray-100 text-right text-base text-gray-500"
      >
        <div v-for="lineNumber in lineCount" :key="lineNumber" class="px-2">{{ lineNumber }}</div>
      </div>

      <textarea
        ref="textareaRef"
        class="ml-12 h-full w-full resize-none bg-transparent p-0 text-base text-[#37353E] outline-none"
        placeholder="在此編輯 ECharts 配置..."
        v-model="editorJson"
        @input="handleJsonChange"
        @scroll="handleTextareaScroll"
        spellcheck="false"
      ></textarea>
      <template v-if="jsonErrorMsg">
        <div
          class="absolute bottom-0 left-0 flex w-full items-center gap-2 bg-red-200 p-2 text-base text-red-400"
        >
          <FontAwesomeIcon :icon="faCircleExclamation" />
          {{ jsonErrorMsg }}
        </div>
      </template>
    </div>

    <button class="chart-options-btn" @click="togglePopup">
      <FontAwesomeIcon :icon="faChartSimple" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { DynamicChart } from '@core/index'
import {
  faCompassDrafting,
  faXmark,
  faChartSimple,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'

const showPopup = ref(false)
const activeChart = ref('Line Chart')

const chartOptions: Record<string, string> = {
  'Line Chart': 'line-chart.json',
  'Line Sections Chart': 'line-sections-chart.json',
  'Bar Chart': 'bar-chart.json',
  'Pie Chart': 'pie-chart.json',
  'Scatter Chart': 'scatter-chart.json',
  'Horizontal Bar Chart': 'horizontal-bar-chart.json',
  'Radar Chart': 'radar-chart.json',
  'Stacked Bar Chart': 'stacked-bar-chart.json',
  'Horizontal Stacked Bar Chart': 'horizontal-stacked-bar-chart.json',
  'Mix Line Bar Chart': 'mix-line-bar-chart.json',
  'Bubble Chart': 'bubble-chart.json',
  'Heatmap Chart': 'heatmap-chart.json',
  'Funnel Chart': 'funnel-chart.json',
  'Gauge Chart': 'gauge-chart.json',
  'Map Chart': 'map-chart.json',
  'Tree Chart': 'tree-chart.json',
  'Candlestick Chart': 'candlestick-chart.json',
  'Sunburst Chart': 'sunburst-chart.json',
  'Graph Chart': 'graph-chart.json',
  'Sankey Chart': 'sankey-chart.json',
  'Treemap Chart': 'treemap-chart.json',
  'Liquid Fill Chart': 'liquid-fill-chart.json',
  'Polar Bar Chart': 'polar-bar-chart.json',
  'Ring Progress Chart': 'ring-progress-chart.json',
  'Theme River Chart': 'theme-river-chart.json',
  'Parallel Chart': 'parallel-chart.json',
  'Boxplot Chart': 'boxplot-chart.json',
}
const editorJson = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartConfig = ref<any>(null)
const jsonErrorMsg = ref('')

const textareaRef = ref<HTMLTextAreaElement>()
const lineNumbersRef = ref<HTMLDivElement>()

const lineCount = computed(() => {
  if (!editorJson.value) return 1
  return Math.max(1, editorJson.value.split('\n').length)
})

function handleTextareaScroll() {
  if (textareaRef.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

function togglePopup() {
  showPopup.value = !showPopup.value
}

function handleJsonChange() {
  try {
    const parsed = JSON.parse(editorJson.value)
    chartConfig.value = parsed

    jsonErrorMsg.value = ''
  } catch (error) {
    console.error('Invalid JSON format:', error)
    jsonErrorMsg.value = `Invalid JSON format: ${(error as Error).message}`
  }
}

async function loadChartOption(chartName: string) {
  activeChart.value = chartName

  const chartJsonFile = chartOptions[activeChart.value] ?? undefined

  if (chartJsonFile === undefined) {
    return
  }

  try {
    const baseUrl = import.meta.env.BASE_URL
    const url = baseUrl ? `${baseUrl}data/charts/${chartJsonFile}` : `data/charts/${chartJsonFile}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    chartConfig.value = data
    editorJson.value = JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('Error fetching chart settings:', error)
  }

  showPopup.value = false
}

onMounted(() => {
  loadChartOption(activeChart.value)
})
</script>

<style scoped>
.editor-child {
  position: relative;
  width: 50%;
  flex: 1;
  background-color: #f0f0f030;
  border-radius: 10px;
  overflow: hidden;
  box-shadow:
    rgba(0, 0, 0, 0.16) 0px 3px 6px,
    rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.chart-options-btn {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  color: white;
  background-color: #708993;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.chart-options-btn:hover {
  background-color: #4a6572;
}
</style>
