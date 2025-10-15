<template>
  <div class="container">
    <ChartDashboard v-if="dashboardConfig" :config="dashboardConfig" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ChartDashboard } from '@core/index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dashboardConfig = ref<any>(null)

onMounted(async () => {
  try {
    const configUrl = import.meta.env.VITE_CHARTS_ENDPOINT
    if (!configUrl) {
      throw new Error('CHARTS_ENDPOINT is not defined in environment variables')
    }

    const response = await fetch(configUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    dashboardConfig.value = data
  } catch (error) {
    console.error('Error fetching chart data:', error)
  }
})
</script>
