<template>
  <div class="container">
    <div class="popup-model" :class="{ active: showFilterPopup }" @click="toggleFilterPopup">
      <div class="popup-content shadow-lg" @click.stop>
        <div
          v-if="filterConfigs.length == 0"
          class="flex h-[50vh] flex-col items-center justify-center gap-2 p-4 text-xl font-bold text-[#374151]"
        >
          <FontAwesomeIcon :icon="faFaceFrown" class="mb-2 text-6xl" />沒有任何篩選項
        </div>
        <div v-else class="popup-body" @scroll="handleScroll">
          <div class="scroll-container">
            <div class="grid h-full gap-4 sm:grid-cols-2">
              <div v-for="(filter, index) in filterConfigs" :key="index" class="input-group">
                <div class="input-title">{{ filter.label }}</div>
                <div class="input-content">
                  <template v-if="filter.type == 'text'">
                    <input
                      class="text-input"
                      type="text"
                      :placeholder="getPlaceholderStart(filter.placeholder)"
                      v-model="textValues[index]"
                    />
                  </template>

                  <template v-else-if="filter.type == 'date'">
                    <DatePicker
                      :ref="(el: InstanceType<typeof DatePicker>) => setDatePickerRef(el, index)"
                      :placeholder="getPlaceholderStart(filter.placeholder)"
                      v-model="dateValues[index]"
                      :format="'yyyy-MM-dd HH:mm:ss'"
                      :enable-time-picker="true"
                      locale="zh-TW"
                      :teleport="true"
                      :z-index="10000"
                    />
                  </template>

                  <template v-else-if="filter.type == 'dateRange'">
                    <DatePicker
                      :ref="
                        (el: InstanceType<typeof DatePicker>) =>
                          setDatePickerRef(el, index, 'start')
                      "
                      :placeholder="getPlaceholderStart(filter.placeholder)"
                      v-model="dateRangeValues[index].start"
                      :format="'yyyy-MM-dd HH:mm:ss'"
                      :enable-time-picker="true"
                      locale="zh-TW"
                      :teleport="true"
                      :z-index="10000"
                    />
                    <span>~</span>
                    <DatePicker
                      :ref="
                        (el: InstanceType<typeof DatePicker>) => setDatePickerRef(el, index, 'end')
                      "
                      :placeholder="getPlaceholderEnd(filter.placeholder)"
                      v-model="dateRangeValues[index].end"
                      :format="'yyyy-MM-dd HH:mm:ss'"
                      :enable-time-picker="true"
                      locale="zh-TW"
                      :teleport="true"
                      :z-index="10000"
                    />
                  </template>

                  <template v-else-if="filter.type == 'number'">
                    <input
                      type="number"
                      :placeholder="getPlaceholderStart(filter.placeholder)"
                      v-model="numberValues[index]"
                    />
                    <span>{{ filter.unit }}</span>
                  </template>

                  <template v-else-if="filter.type == 'numberRange'">
                    <input
                      type="number"
                      :placeholder="getPlaceholderStart(filter.placeholder)"
                      v-model="numberRangeValues[index].start"
                    />
                    <span>{{ filter.unit }}</span>
                    <span>~</span>
                    <input
                      type="number"
                      :placeholder="getPlaceholderEnd(filter.placeholder)"
                      v-model="numberRangeValues[index].end"
                    />
                    <span>{{ filter.unit }}</span>
                  </template>

                  <template v-else-if="filter.type == 'singleSelect'">
                    <div
                      class="select-title"
                      :ref="el => setSelectRef(el as HTMLElement, index)"
                      @click="toggleSelect(index)"
                    >
                      <span>{{
                        getSingleSelectLabel(filter, singleSelectValues[index]) ||
                        filter.placeholder
                      }}</span>
                      <FontAwesomeIcon :icon="faChevronDown" />
                    </div>
                    <Transition name="fade" mode="out-in">
                      <Teleport to="body">
                        <div
                          v-if="selectActives[index]"
                          class="select-options"
                          :style="getDropdownStyle(index)"
                        >
                          <label v-for="option in filter.options" :key="option.value">
                            <input
                              type="radio"
                              :value="option.value"
                              v-model="singleSelectValues[index]"
                            />
                            <span>{{ option.label }}</span>
                          </label>
                        </div>
                      </Teleport>
                    </Transition>
                  </template>

                  <template v-else-if="filter.type == 'multiSelect'">
                    <div
                      class="select-title"
                      :ref="el => setSelectRef(el as HTMLElement, index)"
                      @click="toggleSelect(index)"
                    >
                      <span>{{
                        getMultiSelectLabel(filter, multiSelectValues[index]) || filter.placeholder
                      }}</span>
                      <FontAwesomeIcon :icon="faChevronDown" />
                    </div>
                    <Transition name="fade" mode="out-in">
                      <Teleport to="body">
                        <div
                          v-if="selectActives[index]"
                          class="select-options"
                          :style="getDropdownStyle(index)"
                        >
                          <label v-for="option in filter.options" :key="option.value">
                            <input
                              type="checkbox"
                              :value="option.value"
                              v-model="multiSelectValues[index]"
                            />
                            <span>{{ option.label }}</span>
                          </label>
                        </div>
                      </Teleport>
                    </Transition>
                  </template>
                </div>
                <div class="quick-select">
                  <button
                    v-for="select in filter.quickSelect"
                    :key="select.label"
                    @click="handleQuickSelect(index, select.value)"
                  >
                    {{ select.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button
            class="flex w-[8rem] items-center justify-center rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
            @click="toggleFilterPopup"
          >
            <FontAwesomeIcon :icon="faXmark" class="mr-1" />關閉
          </button>
          <div class="flex gap-4">
            <button
              class="flex w-[8rem] items-center justify-center rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              @click="initFilters()"
            >
              <FontAwesomeIcon :icon="faRepeat" class="mr-1" />重置
            </button>

            <button
              class="flex w-[8rem] items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              @click="applyFilter()"
            >
              <FontAwesomeIcon :icon="faMagnifyingGlass" class="mr-1" />套用
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="chart-settings popup-model"
      :class="{ active: showChartSettingsPopup }"
      @click="toggleChartSettingsPopup"
    >
      <div class="popup-content flex h-full flex-col" @click.stop>
        <div class="align-center flex justify-between border-b border-[#e5e7eb] bg-[#f9fafb] p-4">
          <span class="text-base font-bold text-[#44444e]">JSON 編輯器</span>
          <button class="text-[#44444e]" @click="toggleChartSettingsPopup">
            <FontAwesomeIcon :icon="faXmark" />
          </button>
        </div>
        <div class="relative min-h-0 flex-1">
          <div
            ref="lineNumbersRef"
            class="absolute left-0 top-0 h-full overflow-hidden bg-gray-100 text-right text-base text-gray-500"
          >
            <div v-for="lineNumber in lineCount" :key="lineNumber" class="px-2">
              {{ lineNumber }}
            </div>
          </div>

          <textarea
            ref="textareaRef"
            class="ml-14 h-full w-full resize-none bg-transparent p-0 text-base text-[#37353E] outline-none"
            placeholder="在此編輯 ECharts 配置..."
            v-model="editorJson"
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
        <div
          class="grid flex-shrink-0 grid-flow-row gap-4 border-t border-[#e5e7eb] bg-[#f9fafb] p-4"
        >
          <div class="flex h-10 w-full gap-4">
            <input
              class="w-4/5 rounded border border-gray-300 px-3 py-2"
              type="text"
              placeholder="請輸入 API"
              v-model="chartConfigsEndpoint"
            />
            <button
              class="flex h-10 w-1/5 items-center justify-center gap-2 rounded-md bg-[#59AC77] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3A6F43]"
              @click="fetchTestEndpoint"
            >
              <FontAwesomeIcon :icon="faRocket" />測試
            </button>
          </div>
          <div class="flex h-10 w-full gap-4">
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#456882] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234C6A]"
              @click="fetchSampleData"
            >
              <FontAwesomeIcon :icon="faCloudArrowDown" />載入範例
            </button>
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#456882] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234C6A]"
              @click="downloadJson"
            >
              <FontAwesomeIcon :icon="faDownload" />下載 JSON
            </button>
          </div>
          <div class="flex h-10 w-full gap-4">
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
              @click="resetJson"
            >
              <FontAwesomeIcon :icon="faRetweet" />重製
            </button>
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#456882] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234C6A]"
              @click="applyJson"
            >
              <FontAwesomeIcon :icon="faFloppyDisk" />套用
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="relative flex items-center gap-2 rounded-full bg-[#DDDDDD] px-8 py-4 text-base text-[#44444e] shadow-lg"
    >
      <span class="w-fit flex-shrink-0 font-bold">
        <FontAwesomeIcon :icon="faFilter" class="text-[#456882]" />
        篩選項
      </span>

      <div class="filter-tag-container">
        <div v-for="(tag, index) in filterTags" class="filter-tag" :key="index">
          <div class="filter-tag-hole"></div>
          <span class="filter-tag-text">{{ tag }}</span>
        </div>
      </div>

      <button class="text-base text-[#456882]" @click="toggleFilterPopup">
        <FontAwesomeIcon :icon="faGear" />
      </button>
    </div>

    <div ref="chartGridRef" class="chart-grid mt-6">
      <div v-if="dragState.isDragging" class="drag-preview-box" :style="getDragPreviewStyles()">
        <FontAwesomeIcon :icon="faArrowDownUpAcrossLine" />拖曳到這
      </div>

      <div
        v-for="(chart, index) in chartConfigs"
        :key="index"
        :style="getGridStyles(chart)"
        class="relative overflow-hidden rounded-lg bg-white shadow-lg"
      >
        <button
          class="absolute left-2 top-2 z-10 cursor-move text-lg text-[#456882]"
          @mousedown="startDrag($event, index)"
          @touchStart="startDrag($event, index)"
        >
          <FontAwesomeIcon :icon="faBraille" />
        </button>

        <DynamicChart :key="index" :chart-json="chart" />
      </div>
    </div>

    <button class="chart-options-btn" @click="toggleChartSettingsPopup">
      <FontAwesomeIcon :icon="faScrewdriverWrench" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted, computed } from 'vue'
import {
  faFilter,
  faGear,
  faXmark,
  faChevronDown,
  faRepeat,
  faMagnifyingGlass,
  faScrewdriverWrench,
  faCircleExclamation,
  faCloudArrowDown,
  faRocket,
  faDownload,
  faRetweet,
  faFloppyDisk,
  faFaceFrown,
  faBraille,
  faArrowDownUpAcrossLine,
} from '@fortawesome/free-solid-svg-icons'
import DatePicker from '@vuepic/vue-datepicker'
import DynamicChart from '@/components/DynamicChart.vue'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { filterOption } from '@/types/filters'

const filterConfigs = ref<filterOption[]>([])
const chartConfigs = ref<ExtendedEChartsOption[]>([])

const showFilterPopup = ref(false)
const showChartSettingsPopup = ref(false)

const textValues = ref<{ [key: number]: string }>({})
const numberValues = ref<{ [key: number]: number }>({})
const dateValues = ref<{ [key: number]: Date | null }>({})
const dateRangeValues = ref<{ [key: number]: { start: Date | null; end: Date | null } }>({})
const numberRangeValues = ref<{ [key: number]: { start: number; end: number } }>({})
const singleSelectValues = ref<{ [key: number]: string }>({})
const multiSelectValues = ref<{ [key: number]: string[] }>({})

const filterTags = ref<{ [key: number]: string }>({})

const datePickerRefs = ref<{ [key: string]: InstanceType<typeof DatePicker> | null }>({})

const selectRefs = ref<{ [key: number]: HTMLElement }>({})
const selectActives = ref<{ [key: number]: boolean }>({})
const dropdownPositions = ref<{ [key: number]: { top: number; left: number; width: number } }>({})

const chartGridRef = ref<HTMLDivElement>()
const itemBaseSize = ref(180)

const editorJson = ref('')
const jsonErrorMsg = ref('')

const textareaRef = ref<HTMLTextAreaElement>()
const lineNumbersRef = ref<HTMLDivElement>()

const chartConfigsEndpoint = ref('')

const dragState = ref({
  isDragging: false,
  activeIndex: -1,
  startX: 0,
  startY: 0,
  startGridX: 0,
  startGridY: 0,
  currentX: 0,
  currentY: 0,
  previewGridX: 0,
  previewGridY: 0,
})

const lineCount = computed(() => {
  if (!editorJson.value) return 1
  return Math.max(1, editorJson.value.split('\n').length)
})

function startDrag(event: MouseEvent | TouchEvent, chartIndex: number) {
  event.preventDefault()
  event.stopPropagation()

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const chart = chartConfigs.value[chartIndex]

  dragState.value = {
    isDragging: true,
    activeIndex: chartIndex,
    startX: clientX,
    startY: clientY,
    startGridX: chart.gridX || 1,
    startGridY: chart.gridY || 1,
    currentX: clientX,
    currentY: clientY,
    previewGridX: chart.gridX || 1,
    previewGridY: chart.gridY || 1,
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', handleDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)

  document.body.style.cursor = 'grabbing'
  document.body.style.userSelect = 'none'
}

function handleDrag(event: MouseEvent | TouchEvent) {
  if (!dragState.value.isDragging) return

  event.preventDefault()

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  dragState.value.currentX = clientX
  dragState.value.currentY = clientY

  // 計算網格位置變化
  const deltaX = clientX - dragState.value.startX
  const deltaY = clientY - dragState.value.startY

  // 根據移動距離計算新的網格位置
  const gridStepX = Math.round(deltaX / (itemBaseSize.value + 24)) // 24 是 gap
  const gridStepY = Math.round(deltaY / (itemBaseSize.value + 24))

  const newGridX = Math.max(1, dragState.value.startGridX + gridStepX)
  const newGridY = Math.max(1, dragState.value.startGridY + gridStepY)

  // 更新預覽位置
  dragState.value.previewGridX = newGridX
  dragState.value.previewGridY = newGridY
}

function stopDrag() {
  if (!dragState.value.isDragging) return

  const chart = chartConfigs.value[dragState.value.activeIndex]

  if (chart) {
    const finalX = dragState.value.previewGridX
    const finalY = dragState.value.previewGridY
    if (isValidPosition(dragState.value.activeIndex, finalX, finalY)) {
      chart.gridX = finalX
      chart.gridY = finalY
    }
  }

  const updateJson = {
    filters: filterConfigs.value,
    charts: chartConfigs.value,
  }
  editorJson.value = JSON.stringify(updateJson, null, 2)
  jsonErrorMsg.value = ''

  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)

  document.body.style.cursor = ''
  document.body.style.userSelect = ''

  dragState.value = {
    isDragging: false,
    activeIndex: -1,
    startX: 0,
    startY: 0,
    startGridX: 0,
    startGridY: 0,
    currentX: 0,
    currentY: 0,
    previewGridX: 0,
    previewGridY: 0,
  }
}

function isValidPosition(chartIndex: number, x: number, y: number): boolean {
  const chart = chartConfigs.value[chartIndex]
  if (!chart) return false

  const width = chart.gridWidth || 4
  const height = chart.gridHeight || 4

  return !chartConfigs.value.some((otherChart, index) => {
    if (index === chartIndex) return false

    const chart1 = {
      x1: x,
      y1: y,
      x2: x + width,
      y2: y + height,
    }

    const chart2 = {
      x1: otherChart.gridX || 1,
      y1: otherChart.gridY || 1,
      x2: (otherChart.gridX || 1) + (otherChart.gridWidth || 4),
      y2: (otherChart.gridY || 1) + (otherChart.gridHeight || 4),
    }

    return !(
      chart1.x2 <= chart2.x1 ||
      chart1.x1 >= chart2.x2 ||
      chart1.y2 <= chart2.y1 ||
      chart1.y1 >= chart2.y2
    )
  })
}

function getDragPreviewStyles() {
  if (!dragState.value.isDragging) return {}

  const chart = chartConfigs.value[dragState.value.activeIndex]
  if (!chart) return {}

  const x = dragState.value.previewGridX
  const y = dragState.value.previewGridY
  const width = chart.gridWidth || 4
  const height = chart.gridHeight || 4

  const endX = x + width
  const endY = y + height

  return {
    gridColumn: `${x} / ${endX}`,
    gridRow: `${y} / ${endY}`,
    minHeight: `${height * itemBaseSize.value}px`,
  }
}

function toggleFilterPopup() {
  closeAllSelects()

  showFilterPopup.value = !showFilterPopup.value
}

function toggleChartSettingsPopup() {
  showChartSettingsPopup.value = !showChartSettingsPopup.value
}

function setSelectRef(el: HTMLElement | null, index: number) {
  if (el) {
    selectRefs.value[index] = el

    if (selectActives.value[index] === undefined) {
      selectActives.value[index] = false
    }
  }
}

function setDatePickerRef(
  el: InstanceType<typeof DatePicker> | null,
  index: number,
  type?: 'start' | 'end'
) {
  if (el) {
    if (type) {
      datePickerRefs.value[`${index}-${type}`] = el
    } else {
      datePickerRefs.value[index] = el
    }
  }
}

function closeAllSelects() {
  Object.keys(selectActives.value).forEach((key: string) => {
    const keyAsNumber = parseInt(key, 10)
    selectActives.value[keyAsNumber] = false
  })
}

function toggleSelect(index: number) {
  const filter = filterConfigs.value[index]
  if (filter.type === 'singleSelect' || filter.type === 'multiSelect') {
    selectActives.value[index] = !selectActives.value[index]

    if (selectActives.value[index]) {
      nextTick(() => {
        updateDropdownPosition(index)
      })
    }
  }
}

function updateDropdownPosition(index: number) {
  const selectElement = selectRefs.value[index]
  if (selectElement) {
    const rect = selectElement.getBoundingClientRect()
    dropdownPositions.value[index] = {
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
    }
  }
}

function getDropdownStyle(index: number) {
  const position = dropdownPositions.value[index]
  if (!position) return {}

  return {
    position: 'fixed' as const,
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: `${position.width}px`,
    zIndex: 10000,
  }
}

/**
 * 處理快速選擇按鈕點擊事件
 * @param filterIndex 篩選項索引
 * @param quickSelectValue 快速選擇的值
 */
function handleQuickSelect(filterIndex: number, quickSelectValue: string | number[]) {
  const filter = filterConfigs.value[filterIndex]

  if (!filter) return

  switch (filter.type) {
    case 'dateRange':
      handleDateRangeQuickSelect(filterIndex, quickSelectValue as string)
      break

    case 'numberRange':
      if (Array.isArray(quickSelectValue) && quickSelectValue.length === 2) {
        handleNumberRangeQuickSelect(filterIndex, quickSelectValue as [number, number])
      } else {
        console.warn(
          `Invalid quick select value for numberRange: expected [number, number], got:`,
          quickSelectValue
        )
      }
      break

    default:
      console.warn(`Quick select not supported for filter type: ${filter.type}`)
  }
}

/**
 * 處理日期範圍的快速選擇
 * @param filterIndex 篩選項索引
 * @param value 快速選擇值（如 'last_7_days', 'last_30_days'）
 */
function handleDateRangeQuickSelect(filterIndex: number, value: string) {
  const now = new Date()
  let startDate: Date
  let endDate = new Date(now)

  switch (value) {
    case 'last_7_days':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break

    case 'last_30_days':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 30)
      break

    case 'last_90_days':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 90)
      break

    case 'this_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break

    case 'last_month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      break

    case 'this_year':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
      break

    case 'last_year':
      startDate = new Date(now.getFullYear() - 1, 0, 1)
      endDate = new Date(now.getFullYear() - 1, 11, 31)
      break

    default:
      console.warn(`Unknown quick select value: ${value}`)
      return
  }

  dateRangeValues.value[filterIndex] = {
    start: startDate,
    end: endDate,
  }

  // 關閉相關的 DatePicker
  const startPickerKey = `${filterIndex}-start`
  const endPickerKey = `${filterIndex}-end`
  datePickerRefs.value[startPickerKey]?.closeMenu()
  datePickerRefs.value[endPickerKey]?.closeMenu()
}

/**
 * 處理數值範圍的快速選擇
 * @param filterIndex 篩選項索引
 * @param value 快速選擇值（數值陣列 [start, end]）
 */
function handleNumberRangeQuickSelect(filterIndex: number, value: [number, number]) {
  if (!Array.isArray(value) || value.length !== 2) {
    console.warn(`Invalid quick select value for numberRange: ${value}`)
    return
  }

  numberRangeValues.value[filterIndex] = {
    start: value[0],
    end: value[1],
  }
}

function handleTextareaScroll() {
  if (textareaRef.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

function handleScroll() {
  Object.keys(selectActives.value).forEach((key: string) => {
    const keyAsNumber = parseInt(key, 10)
    selectActives.value[keyAsNumber] = false
  })

  Object.keys(datePickerRefs.value).forEach(key => {
    datePickerRefs.value[key]?.closeMenu()
  })
}

function handleResize() {
  Object.keys(selectActives.value).forEach((key: string) => {
    const keyAsNumber = parseInt(key, 10)
    if (selectActives.value[keyAsNumber]) {
      updateDropdownPosition(keyAsNumber)
    }
  })
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

const throttledHandleResize = throttle(handleResize, 200)

function getPlaceholderStart(
  placeholder: string | { start: string; end: string } | undefined
): string {
  if (!placeholder) return ''

  if (typeof placeholder === 'string') {
    return placeholder
  }
  return placeholder.start
}

function getPlaceholderEnd(
  placeholder: string | { start: string; end: string } | undefined
): string {
  if (!placeholder) return ''

  if (typeof placeholder === 'string') {
    return placeholder
  }
  return placeholder.end
}

function getSingleSelectLabel(filter: filterOption, value: string): string {
  if (!value || !filter.options) return ''

  const selectedOption = filter.options.find(option => option.value === value)
  return selectedOption ? selectedOption.label : value
}

function getMultiSelectLabel(filter: filterOption, values: string[]): string {
  if (!values || !filter.options) return ''

  return values
    .map(value => {
      const selectedOption = filter.options!.find(option => option.value === value)
      return selectedOption ? selectedOption.label : value
    })
    .filter(Boolean)
    .join(', ')
}

function setFilterTags() {
  filterTags.value = {}

  Object.keys(textValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    if (textValues.value[keyAsNumber]) {
      filterTags.value[keyAsNumber] = textValues.value[keyAsNumber]
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })

  Object.keys(numberValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    if (numberValues.value[keyAsNumber] !== undefined && numberValues.value[keyAsNumber] !== null) {
      filterTags.value[keyAsNumber] =
        numberValues.value[keyAsNumber].toString() + filterConfigs.value[keyAsNumber].unit
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })

  Object.keys(dateValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    if (dateValues.value[keyAsNumber]) {
      filterTags.value[keyAsNumber] = dateValues.value[keyAsNumber]!.toLocaleString()
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })

  Object.keys(dateRangeValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const range = dateRangeValues.value[keyAsNumber]
    if (range && range.start && range.end) {
      filterTags.value[keyAsNumber] =
        `${range.start.toLocaleString()} ~ ${range.end.toLocaleString()}`
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })

  Object.keys(numberRangeValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const range = numberRangeValues.value[keyAsNumber]
    if (range && range.start !== undefined && range.end !== undefined) {
      const unit = filterConfigs.value[keyAsNumber].unit
      filterTags.value[keyAsNumber] = `${range.start}${unit} ~ ${range.end}${unit}`
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })

  Object.keys(singleSelectValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    if (singleSelectValues.value[keyAsNumber]) {
      filterTags.value[keyAsNumber] =
        getSingleSelectLabel(filter, singleSelectValues.value[keyAsNumber]) ||
        singleSelectValues.value[keyAsNumber]
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })

  Object.keys(multiSelectValues.value).forEach(key => {
    const keyAsNumber = parseInt(key, 10)
    const filter = filterConfigs.value[keyAsNumber]
    if (multiSelectValues.value[keyAsNumber] && multiSelectValues.value[keyAsNumber].length > 0) {
      filterTags.value[keyAsNumber] =
        getMultiSelectLabel(filter, multiSelectValues.value[keyAsNumber]) ||
        multiSelectValues.value[keyAsNumber].join(', ')
      filterTags.value[keyAsNumber] =
        filterConfigs.value[keyAsNumber].label + ': ' + filterTags.value[keyAsNumber]
    } else {
      delete filterTags.value[keyAsNumber]
    }
  })
}

function initFilters() {
  textValues.value = {}
  numberValues.value = {}
  dateValues.value = {}
  dateRangeValues.value = {}
  numberRangeValues.value = {}
  singleSelectValues.value = {}
  multiSelectValues.value = {}

  filterConfigs.value.forEach((filter: filterOption, index: number) => {
    if (filter.default === undefined || filter.default == null) return

    switch (filter.type) {
      case 'text':
        textValues.value[index] = (filter.default as string) || ''
        break
      case 'number':
        numberValues.value[index] = (filter.default as number) || 0
        break
      case 'date':
        dateValues.value[index] = filter.default ? new Date(filter.default as string) : null
        break
      case 'dateRange':
        if (
          filter.default &&
          typeof filter.default === 'object' &&
          !Array.isArray(filter.default)
        ) {
          const rangeDefault = filter.default as { start: string; end: string }
          dateRangeValues.value[index] = {
            start: new Date(rangeDefault.start),
            end: new Date(rangeDefault.end),
          }
        } else {
          dateRangeValues.value[index] = { start: null, end: null }
        }
        break
      case 'numberRange':
        if (
          filter.default &&
          typeof filter.default === 'object' &&
          !Array.isArray(filter.default)
        ) {
          const rangeDefault = filter.default as { start: number; end: number }
          numberRangeValues.value[index] = {
            start: rangeDefault.start,
            end: rangeDefault.end,
          }
        } else {
          numberRangeValues.value[index] = { start: 0, end: 0 }
        }
        break
      case 'singleSelect':
        singleSelectValues.value[index] = (filter.default as string) || ''
        break
      case 'multiSelect':
        multiSelectValues.value[index] = (filter.default as string[]) || []
        break
    }
  })

  closeAllSelects()
}

function applyFilter() {
  setFilterTags()

  toggleFilterPopup()
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

function getGridStyles(chart: ExtendedEChartsOption) {
  const x = chart.gridX || 1
  const y = chart.gridY || 1
  const width = chart.gridWidth || 4
  const height = chart.gridHeight || 4

  const endX = x + width
  const endY = y + height

  return {
    gridColumn: `${x} / ${endX}`,
    gridRow: `${y} / ${endY}`,
    minHeight: `${height * itemBaseSize.value}px`,
  }
}

const throttledUpdateSize = throttle(updateItemSize, 100)

async function fetchSampleData() {
  try {
    const baseUrl = import.meta.env.BASE_URL
    const url = baseUrl ? `${baseUrl}data/pages/demo-charts.json` : `data/pages/demo-charts.json`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    editorJson.value = JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }
}

async function fetchTestEndpoint() {
  if (!chartConfigsEndpoint.value) return

  try {
    const response = await fetch(chartConfigsEndpoint.value)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    editorJson.value = JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    jsonErrorMsg.value = `Error fetching chart data: ${(error as Error).message}`
  }
}

function downloadJson() {
  if (editorJson.value.trim() === '') return

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(editorJson.value)
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', 'chart-configs.json')
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

function applyJson() {
  filterConfigs.value = []
  chartConfigs.value = []

  initFilters()

  setFilterTags()

  if (editorJson.value.trim() === '') return

  try {
    const parsed = JSON.parse(editorJson.value)

    if (parsed.filters) {
      filterConfigs.value = parsed.filters
    }

    if (parsed.charts) {
      chartConfigs.value = parsed.charts
    }

    initFilters()

    setFilterTags()

    toggleChartSettingsPopup()
  } catch (error) {
    console.error('Invalid JSON format:', error)
    jsonErrorMsg.value = `Invalid JSON format: ${(error as Error).message}`
  }
}

function resetJson() {
  editorJson.value = ''
}

onMounted(async () => {
  updateItemSize()

  window.addEventListener('resize', throttledHandleResize)
  window.addEventListener('resize', throttledUpdateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', throttledHandleResize)
  window.removeEventListener('resize', throttledUpdateSize)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
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

.chart-settings.popup-model {
  justify-content: end;
}

.chart-settings.popup-model .popup-content {
  width: 40vw;
  height: 100vh;
  border-radius: 0.5rem 0 0 0.5rem;
  transform: translateX(80px);
}

.chart-settings.popup-model.active .popup-content {
  transform: translateX(0);
}

.drag-preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  gap: 0.5rem;
  color: #3b82f6;
  border: 2px dashed #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
  position: relative;
  z-index: 999;
  pointer-events: none;
  animation: pulse-border 1s infinite;
}
</style>
