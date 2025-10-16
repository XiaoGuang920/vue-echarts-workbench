<template>
  <input
    class="text-input"
    type="text"
    :placeholder="getPlaceholder()"
    :value="modelValue"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
import type { filterOption } from '../../types/filters'

interface Props {
  modelValue: string
  filter: filterOption
  index: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/**
 * 取得 placeholder
 */
function getPlaceholder(): string {
  if (!props.filter.placeholder) {
    return ''
  }

  if (typeof props.filter.placeholder === 'object') {
    return ''
  }

  return props.filter.placeholder
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
