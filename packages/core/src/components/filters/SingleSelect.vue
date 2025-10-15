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
            type="radio"
            :value="option.value"
            :checked="modelValue === option.value"
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
  modelValue: string | number
  filter: filterOption
  index: number
  isActive: boolean
  dropdownStyle: Record<string, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'toggle', index: number): void
}>()

const selectTitleRef = ref<HTMLElement | null>(null)

const displayLabel = computed(() => {
  if (!props.modelValue) {
    return props.filter.placeholder || '請選擇'
  }

  const option = props.filter.options?.find(opt => opt.value === props.modelValue)
  return option?.label || props.filter.placeholder || '請選擇'
})

function toggleDropdown() {
  emit('toggle', props.index)
}

function handleSelect(value: string | number) {
  emit('update:modelValue', value)
  emit('toggle', props.index)
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
