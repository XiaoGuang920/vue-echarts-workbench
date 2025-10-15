<template>
  <div ref="selectTitleRef" class="select-title" @click="toggleDropdown">
    <span>{{ displayLabel }}</span>
    <FontAwesomeIcon :icon="faChevronDown" />
  </div>
  <Transition name="fade" mode="out-in">
    <Teleport to="body">
      <div v-if="isActive" class="select-options" :style="dropdownStyle">
        <label v-for="option in filter.options" :key="option.value">
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
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import type { filterOption } from '../../types/filters'

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

const selectTitleRef = ref<HTMLElement | null>(null)

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

function toggleDropdown() {
  emit('toggle', props.index)
}

function isChecked(value: string | number): boolean {
  return props.modelValue.includes(value)
}

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