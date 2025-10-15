<template>
  <DatePicker
    ref="datePickerRef"
    v-model="localValue"
    :placeholder="getPlaceholder()"
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
  modelValue: Date | null
  filter: filterOption
  index: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
}>()

const localValue = ref<Date | null>(props.modelValue)
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

watch(
  () => props.modelValue,
  newValue => {
    localValue.value = newValue
  }
)

function handleUpdate() {
  emit('update:modelValue', localValue.value)
}

function getPlaceholder(): string {
  if (!props.filter.placeholder) {
    return '請選擇日期'
  }

  if (typeof props.filter.placeholder === 'object') {
    return '請選擇日期'
  }

  return props.filter.placeholder
}

defineExpose({
  closeMenu: () => datePickerRef.value?.closeMenu(),
})
</script>
