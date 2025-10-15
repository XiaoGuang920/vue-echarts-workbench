<template>
  <div class="filter-panel">
    <!-- 篩選標籤摘要 -->
    <div class="filter-panel__summary">
      <span class="filter-panel__label">
        <FontAwesomeIcon :icon="faFilter" class="filter-panel__label-icon" />
        篩選項
      </span>

      <div class="filter-tag-container">
        <div v-for="(tag, index) in filterTags" class="filter-tag" :key="index">
          <div class="filter-tag-hole"></div>
          <span class="filter-tag-text">{{ tag }}</span>
        </div>
      </div>

      <button class="filter-panel__settings-btn" @click="emit('toggle-popup')">
        <FontAwesomeIcon :icon="faGear" />
      </button>
    </div>

    <!-- 篩選彈窗 -->
    <div class="popup-model" :class="{ active: showPopup }" @click="emit('toggle-popup')">
      <div class="popup-content" @click.stop>
        <div v-if="filters.length == 0" class="filter-panel__empty-state">
          <FontAwesomeIcon :icon="faFaceFrown" class="filter-panel__empty-icon" />沒有任何篩選項
        </div>
        <div v-else class="popup-body" @scroll="handleScroll">
          <div class="scroll-container">
            <div class="filter-panel__grid">
              <div v-for="(filter, index) in filters" :key="index" class="input-group">
                <div class="input-title">{{ filter.label }}</div>
                <div class="input-content">
                  <template v-if="filter.type == 'text'">
                    <TextInput v-model="textValues[index]" :filter="filter" :index="index" />
                  </template>

                  <template v-else-if="filter.type == 'date'">
                    <DateInput
                      :ref="el => setDatePickerRef(el, index)"
                      v-model="dateValues[index]"
                      :filter="filter"
                      :index="index"
                    />
                  </template>

                  <template v-else-if="filter.type == 'dateRange'">
                    <DateRangeInput
                      :ref="el => setDateRangePickerRef(el, index)"
                      v-model="dateRangeValues[index]"
                      :filter="filter"
                      :index="index"
                      @quick-select="value => handleQuickSelect(index, value)"
                    />
                  </template>

                  <template v-else-if="filter.type == 'number'">
                    <NumberInput v-model="numberValues[index]" :filter="filter" :index="index" />
                  </template>

                  <template v-else-if="filter.type == 'numberRange'">
                    <NumberRangeInput
                      v-model="numberRangeValues[index]"
                      :filter="filter"
                      :index="index"
                      @quick-select="value => handleQuickSelect(index, value)"
                    />
                  </template>

                  <template v-else-if="filter.type == 'singleSelect'">
                    <SingleSelect
                      :ref="el => setSelectRef(el, index)"
                      v-model="singleSelectValues[index]"
                      :filter="filter"
                      :index="index"
                      :is-active="selectActives[index] || false"
                      :dropdown-style="getDropdownStyle(index)"
                      @toggle="toggleSelect(index)"
                    />
                  </template>

                  <template v-else-if="filter.type == 'multiSelect'">
                    <MultiSelect
                      :ref="el => setSelectRef(el, index)"
                      v-model="multiSelectValues[index]"
                      :filter="filter"
                      :index="index"
                      :is-active="selectActives[index] || false"
                      :dropdown-style="getDropdownStyle(index)"
                      @toggle="toggleSelect(index)"
                    />
                  </template>
                </div>
                <div class="quick-select" v-if="filter.quickSelect">
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
          <button class="filter-panel__btn filter-panel__btn--close" @click="emit('toggle-popup')">
            <FontAwesomeIcon :icon="faXmark" class="filter-panel__btn-icon" />關閉
          </button>
          <div class="filter-panel__actions">
            <button class="filter-panel__btn filter-panel__btn--reset" @click="handleReset">
              <FontAwesomeIcon :icon="faRepeat" class="filter-panel__btn-icon" />重置
            </button>

            <button class="filter-panel__btn filter-panel__btn--apply" @click="handleApply">
              <FontAwesomeIcon :icon="faMagnifyingGlass" class="filter-panel__btn-icon" />套用
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFilter,
  faGear,
  faXmark,
  faRepeat,
  faMagnifyingGlass,
  faFaceFrown,
} from '@fortawesome/free-solid-svg-icons'
import type { filterOption, FilterValues } from '../types/filters'
import TextInput from './filters/TextInput.vue'
import DateInput from './filters/DateInput.vue'
import DateRangeInput from './filters/DateRangeInput.vue'
import NumberInput from './filters/NumberInput.vue'
import NumberRangeInput from './filters/NumberRangeInput.vue'
import SingleSelect from './filters/SingleSelect.vue'
import MultiSelect from './filters/MultiSelect.vue'

interface Props {
  filters: filterOption[]
  filterTags: { [key: number]: string }
  showPopup: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'toggle-popup'): void
  (e: 'apply', values: FilterValues): void
  (e: 'reset'): void
}>()

const textValues = ref<{ [key: number]: string }>({})
const numberValues = ref<{ [key: number]: number }>({})
const dateValues = ref<{ [key: number]: Date | null }>({})
const dateRangeValues = ref<{ [key: number]: { start: Date | null; end: Date | null } }>({})
const numberRangeValues = ref<{ [key: number]: { start: number; end: number } }>({})
const singleSelectValues = ref<{ [key: number]: string }>({})
const multiSelectValues = ref<{ [key: number]: string[] }>({})

type DatePickerRef = { closeMenu?: () => void; closeMenus?: () => void }

const datePickerRefs = ref<{ [key: string]: DatePickerRef | null }>({})
const selectRefs = ref<{ [key: number]: HTMLElement }>({})
const selectActives = ref<{ [key: number]: boolean }>({})
const dropdownPositions = ref<{ [key: number]: { top: number; left: number; width: number } }>({})

function setDatePickerRef(el: unknown, index: number) {
  if (el) {
    datePickerRefs.value[index] = el as DatePickerRef
  }
}

function setDateRangePickerRef(el: unknown, index: number) {
  if (el) {
    datePickerRefs.value[`${index}-range`] = el as DatePickerRef
  }
}

function setSelectRef(el: unknown, index: number) {
  const component = el as { selectTitleRef?: HTMLElement | null } | null
  if (component && component.selectTitleRef) {
    selectRefs.value[index] = component.selectTitleRef

    if (selectActives.value[index] === undefined) {
      selectActives.value[index] = false
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
  const filter = props.filters[index]
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

function getDropdownStyle(index: number): Record<string, string> {
  const position = dropdownPositions.value[index]
  if (!position) return {}

  return {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: `${position.width}px`,
    zIndex: '10000',
  }
}

function handleQuickSelect(filterIndex: number, quickSelectValue: string | number[]) {
  const filter = props.filters[filterIndex]

  if (!filter) return

  switch (filter.type) {
    case 'dateRange':
      handleDateRangeQuickSelect(filterIndex, quickSelectValue as string)
      break

    case 'numberRange':
      if (Array.isArray(quickSelectValue) && quickSelectValue.length === 2) {
        handleNumberRangeQuickSelect(filterIndex, quickSelectValue as [number, number])
      }
      break
  }
}

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
      return
  }

  dateRangeValues.value[filterIndex] = {
    start: startDate,
    end: endDate,
  }

  // 關閉 DatePicker
  const rangeRef = datePickerRefs.value[`${filterIndex}-range`]
  if (rangeRef && rangeRef.closeMenus) {
    rangeRef.closeMenus()
  }
}

function handleNumberRangeQuickSelect(filterIndex: number, value: [number, number]) {
  numberRangeValues.value[filterIndex] = {
    start: value[0],
    end: value[1],
  }
}

function handleScroll() {
  closeAllSelects()

  Object.keys(datePickerRefs.value).forEach(key => {
    const ref = datePickerRefs.value[key]
    if (ref && ref.closeMenu) {
      ref.closeMenu()
    }
    if (ref && ref.closeMenus) {
      ref.closeMenus()
    }
  })
}

function initFilters() {
  props.filters.forEach((filter: filterOption, index: number) => {
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

function handleApply() {
  emit('apply', {
    text: textValues.value,
    number: numberValues.value,
    date: dateValues.value,
    dateRange: dateRangeValues.value,
    numberRange: numberRangeValues.value,
    singleSelect: singleSelectValues.value,
    multiSelect: multiSelectValues.value,
  })
}

function handleReset() {
  initFilters()
  emit('reset')
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

watch(
  () => props.filters,
  () => {
    initFilters()
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', throttledHandleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', throttledHandleResize)
})

defineExpose({
  initFilters,
  closeAllSelects,
})
</script>

<style scoped>
/* FilterPanel 主容器 */
.filter-panel {
  width: 100%;
}

/* 篩選摘要區域 */
.filter-panel__summary {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background-color: #dddddd;
  padding: 1rem 2rem;
  font-size: 1rem;
  color: #44444e;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.filter-panel__label {
  width: fit-content;
  flex-shrink: 0;
  font-weight: 700;
}

.filter-panel__label-icon {
  color: #456882;
}

.filter-panel__settings-btn {
  font-size: 1rem;
  color: #456882;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 空狀態 */
.filter-panel__empty-state {
  display: flex;
  height: 50vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
}

.filter-panel__empty-icon {
  margin-bottom: 0.5rem;
  font-size: 3.75rem;
}

/* 篩選器網格 */
.filter-panel__grid {
  display: grid;
  height: 100%;
  gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .filter-panel__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 按鈕樣式 */
.filter-panel__btn {
  display: flex;
  width: 8rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-panel__btn-icon {
  margin-right: 0.25rem;
}

.filter-panel__btn--close {
  background-color: #6b7280;
  color: white;
}

.filter-panel__btn--close:hover {
  background-color: #4b5563;
}

.filter-panel__btn--reset {
  background-color: #60a5fa;
  color: white;
}

.filter-panel__btn--reset:hover {
  background-color: #3b82f6;
}

.filter-panel__btn--apply {
  background-color: #3b82f6;
  color: white;
}

.filter-panel__btn--apply:hover {
  background-color: #2563eb;
}

.filter-panel__actions {
  display: flex;
  gap: 1rem;
}

/* 動畫效果 */
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
