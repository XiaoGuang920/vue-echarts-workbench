<template>
  <input
    type="number"
    :placeholder="getPlaceholderStart()"
    :value="modelValue.start"
    @input="handleStartInput"
  />
  <span v-if="filter.unit">{{ filter.unit }}</span>
  <span>~</span>
  <input
    type="number"
    :placeholder="getPlaceholderEnd()"
    :value="modelValue.end"
    @input="handleEndInput"
  />
  <span v-if="filter.unit">{{ filter.unit }}</span>
</template>

<script setup lang="ts">
import type { filterOption } from '../../types/filters'

interface Props {
  modelValue: { start: number; end: number }
  filter: filterOption
  index: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: number; end: number }): void
  (e: 'quick-select', value: [number, number]): void
}>()

function getPlaceholderStart(): string {
  if (!props.filter.placeholder) {
    return '最小值'
  }

  if (typeof props.filter.placeholder === 'object') {
    return props.filter.placeholder.start || '最小值'
  }

  return props.filter.placeholder
}

function getPlaceholderEnd(): string {
  if (!props.filter.placeholder) {
    return '最大值'
  }

  if (typeof props.filter.placeholder === 'object') {
    return props.filter.placeholder.end || '最大值'
  }

  return props.filter.placeholder
}

function handleStartInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', {
    ...props.modelValue,
    start: Number(target.value),
  })
}

function handleEndInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', {
    ...props.modelValue,
    end: Number(target.value),
  })
}
</script>

<style scoped>
span {
  background: transparent;
}
</style>
