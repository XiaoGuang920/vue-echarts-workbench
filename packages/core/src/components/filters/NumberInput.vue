<template>
  <input type="number" :placeholder="getPlaceholder()" :value="modelValue" @input="handleInput" />
  <span v-if="filter.unit">{{ filter.unit }}</span>
</template>

<script setup lang="ts">
import type { filterOption } from '../../types/filters'

interface Props {
  modelValue: number
  filter: filterOption
  index: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

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
  emit('update:modelValue', Number(target.value))
}
</script>

<style scoped>
span {
  background: transparent;
}
</style>
