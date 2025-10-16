<template>
  <div ref="selectTitleRef" class="select-title" @click="toggleDropdown">
    <span>{{ displayLabel }}</span>
    <FontAwesomeIcon :icon="faChevronDown" />
  </div>
  <Transition name="fade" mode="out-in">
    <Teleport to="body">
      <div v-if="isActive" class="select-options" :style="dropdownStyle">
        <label class="select-options__label" v-for="option in filter.options" :key="option.value">
          <input
            type="checkbox"
            :value="option.value"
            :checked="isChecked(option.value)"
            @change="handleSelect(option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </Teleport>
  </Transition>
</template>

<script setup lang="ts">
import type { filterOption } from '../../types/filters'

import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface Props {
  modelValue: (string | number)[]
  filter: filterOption
  index: number
  isActive: boolean
  dropdownStyle: Record<string, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[]): void
  (e: 'toggle', index: number): void
}>()

// 下拉選單標題html元素(用於定位下拉選單位置)
const selectTitleRef = ref<HTMLElement | null>(null)

/**
 * 顯示標籤文字
 */
const displayLabel = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0 || !props.filter.options) {
    return props.filter.placeholder || '請選擇'
  }

  return props.modelValue
    .map(value => {
      const selectedOption = props.filter.options!.find(option => option.value === value)
      return selectedOption ? selectedOption.label : value
    })
    .filter(Boolean)
    .join(', ')
})

/**
 * 切換下拉選單顯示狀態
 */
function toggleDropdown() {
  emit('toggle', props.index)
}

/**
 * 判斷選項是否被選取
 */
function isChecked(value: string | number): boolean {
  return props.modelValue.includes(value)
}

/**
 * 處理選項選取
 */
function handleSelect(value: string | number) {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)

  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }

  emit('update:modelValue', newValue)
}

defineExpose({
  selectTitleRef,
})
</script>

<style scoped>
span {
  padding: 0;
  background: transparent;
}
</style>
