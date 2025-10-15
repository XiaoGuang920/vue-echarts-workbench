<template>
  <DatePicker
    ref="startPickerRef"
    v-model="localValue.start"
    :placeholder="getPlaceholderStart()"
    :format="'yyyy-MM-dd HH:mm:ss'"
    :enable-time-picker="true"
    locale="zh-TW"
    :teleport="true"
    :z-index="10000"
    @update:model-value="handleUpdate"
  />
  <span>~</span>
  <DatePicker
    ref="endPickerRef"
    v-model="localValue.end"
    :placeholder="getPlaceholderEnd()"
    :format="'yyyy-MM-dd HH:mm:ss'"
    :enable-time-picker="true"
    locale="zh-TW"
    :teleport="true"
    :z-index="10000"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import type { filterOption } from '../../types/filters'

interface Props {
  modelValue: { start: Date | null; end: Date | null }
  filter: filterOption
  index: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: Date | null; end: Date | null }): void
  (e: 'quick-select', value: string): void
}>()

const localValue = ref<{ start: Date | null; end: Date | null }>(props.modelValue)
const startPickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
const endPickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

watch(
  () => props.modelValue,
  newValue => {
    localValue.value = newValue
  },
  { deep: true }
)

function handleUpdate() {
  emit('update:modelValue', localValue.value)
}

function getPlaceholderStart(): string {
  if (!props.filter.placeholder) {
    return '開始日期'
  }

  if (typeof props.filter.placeholder === 'object') {
    return props.filter.placeholder.start || '開始日期'
  }

  return props.filter.placeholder
}

function getPlaceholderEnd(): string {
  if (!props.filter.placeholder) {
    return '結束日期'
  }

  if (typeof props.filter.placeholder === 'object') {
    return props.filter.placeholder.end || '結束日期'
  }

  return props.filter.placeholder
}

defineExpose({
  closeMenus: () => {
    startPickerRef.value?.closeMenu()
    endPickerRef.value?.closeMenu()
  },
})
</script>

<style scoped>
.date-range-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

span {
  background: transparent;
}

.date-range-wrapper > span {
  color: #6b7280;
}
</style>
