<template>
  <div class="container">
    <div class="popup-model" :class="{ active: showFilterPopup }" @click="toggleFilterPopup">
      <div class="popup-content shadow-lg" @click.stop>
        <div class="popup-body" @scroll="handleScroll">
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
        <div
          class="grid flex-shrink-0 grid-flow-row gap-4 border-t border-[#e5e7eb] bg-[#f9fafb] p-4"
        >
          <div class="flex h-10 w-full gap-4">
            <input
              class="w-4/5 rounded border border-gray-300 px-3 py-2"
              type="text"
              placeholder="請輸入 API"
            />
            <button
              class="flex h-10 w-1/5 items-center justify-center gap-2 rounded-md bg-[#59AC77] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3A6F43]"
            >
              <FontAwesomeIcon :icon="faRocket" />測試
            </button>
          </div>
          <div class="flex h-10 w-full gap-4">
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#456882] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234C6A]"
            >
              <FontAwesomeIcon :icon="faCloudArrowDown" />載入範例
            </button>
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#456882] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234C6A]"
            >
              <FontAwesomeIcon :icon="faDownload" />下載 JSON
            </button>
          </div>
          <div class="flex h-10 w-full gap-4">
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
            >
              <FontAwesomeIcon :icon="faRetweet" />重製
            </button>
            <button
              class="flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#456882] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234C6A]"
            >
              <FontAwesomeIcon :icon="faFloppyDisk" />套用
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="relative flex items-center gap-2 rounded-full bg-[#DDDDDD] px-8 py-4 text-base font-bold text-[#44444e] shadow-lg"
    >
      <FontAwesomeIcon :icon="faFilter" class="text-[#456882]" />
      篩選項
      <div class="filter-tag-container">
        <div v-for="(tag, index) in filterTags" class="filter-tag" :key="index">
          <div class="filter-tag-hole"></div>
          <span class="filter-tag-text">{{ tag }}</span>
        </div>
      </div>

      <button
        class="absolute right-6 top-1/2 -translate-y-1/2 text-base text-[#456882]"
        @click="toggleFilterPopup"
      >
        <FontAwesomeIcon :icon="faGear" />
      </button>
    </div>

    <div class="chart-grid mt-6">
      <div
        v-for="(chart, index) in chartConfigs"
        :key="index"
        :style="getGridStyles(chart)"
        class="overflow-hidden rounded-lg bg-white shadow-lg"
      >
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
} from '@fortawesome/free-solid-svg-icons'
import DatePicker from '@vuepic/vue-datepicker'
import DynamicChart from '@/components/DynamicChart.vue'
import type { ExtendedEChartsOption } from '@/types/echarts'
import type { filterOption } from '@/types/filters'

const filterConfigs = ref<filterOption[]>([])
const chartConfigs = ref<ExtendedEChartsOption[]>([])

const showFilterPopup = ref(false)
const showChartSettingsPopup = ref(true)

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

const editorJson = ref('')
const jsonErrorMsg = ref('')

const textareaRef = ref<HTMLTextAreaElement>()
const lineNumbersRef = ref<HTMLDivElement>()

const lineCount = computed(() => {
  if (!editorJson.value) return 1
  return Math.max(1, editorJson.value.split('\n').length)
})

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

function handleTextareaScroll() {
  if (textareaRef.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

function handleJsonChange() {
  try {
    const parsed = JSON.parse(editorJson.value)
    chartConfigs.value = parsed as ExtendedEChartsOption[]

    jsonErrorMsg.value = ''
  } catch (error) {
    console.error('Invalid JSON format:', error)
    jsonErrorMsg.value = `Invalid JSON format: ${(error as Error).message}`
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

  toggleFilterPopup()
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
    minHeight: `${height * 180}px`,
  }
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}/data/pages/demo-charts.json`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.filters) {
      filterConfigs.value = data.filters

      initFilters()

      setFilterTags()
    }

    chartConfigs.value = data.charts || []

    editorJson.value = JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }

  window.addEventListener('resize', throttledHandleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', throttledHandleResize)
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
</style>
