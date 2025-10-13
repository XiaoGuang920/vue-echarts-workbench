<template>
  <div class="container">
    <div class="popup-model" :class="{ active: showFilterPopup }" @click="togglePopup">
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
            @click="togglePopup"
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

      <button class="text-base text-[#456882]" @click="togglePopup">
        <FontAwesomeIcon :icon="faGear" />
      </button>
    </div>

    <div ref="chartGridRef" class="chart-grid mt-6">
      <div
        v-for="(chart, index) in chartConfigs"
        :key="index"
        :style="getGridStyles(chart)"
        class="overflow-hidden rounded-lg bg-white shadow-lg"
      >
        <DynamicChart :key="index" :chart-json="chart" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue'
import {
  faFilter,
  faGear,
  faXmark,
  faChevronDown,
  faRepeat,
  faMagnifyingGlass,
  faFaceFrown,
} from '@fortawesome/free-solid-svg-icons'
import DatePicker from '@vuepic/vue-datepicker'
import DynamicChart from '@/components/DynamicChart.vue'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { filterOption } from '@/types/filters'

const filterConfigs = ref<filterOption[]>([])
const chartConfigs = ref<ExtendedEChartsOption[]>([])

const showFilterPopup = ref(false)

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

function togglePopup() {
  closeAllSelects()

  showFilterPopup.value = !showFilterPopup.value
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

  togglePopup()
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

onMounted(async () => {
  try {
    const configUrl = import.meta.env.VITE_CHARTS_ENDPOINT
    if (!configUrl) {
      throw new Error('CHARTS_ENDPOINT is not defined in environment variables')
    }

    const response = await fetch(configUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.filters) {
      filterConfigs.value = data.filters

      initFilters()

      setFilterTags()
    }

    updateItemSize()

    chartConfigs.value = data.charts || []
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }

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
</style>
