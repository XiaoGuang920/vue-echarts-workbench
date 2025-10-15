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
    const baseUrl = import.meta.env.BASE_URL
    const url = baseUrl ? `${baseUrl}data/pages/demo-charts.json` : `data/pages/demo-charts.json`

    const response = await fetch(url)
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
