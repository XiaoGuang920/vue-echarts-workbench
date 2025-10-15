// 主要組件
export { default as ChartDashboard } from './components/ChartDashboard.vue'
export { default as FilterPanel } from './components/FilterPanel.vue'
export { default as DynamicChart } from './components/DynamicChart.vue'

// Filter 組件
export { default as TextInput } from './components/filters/TextInput.vue'
export { default as NumberInput } from './components/filters/NumberInput.vue'
export { default as DateInput } from './components/filters/DateInput.vue'
export { default as DateRangeInput } from './components/filters/DateRangeInput.vue'
export { default as NumberRangeInput } from './components/filters/NumberRangeInput.vue'
export { default as SingleSelect } from './components/filters/SingleSelect.vue'
export { default as MultiSelect } from './components/filters/MultiSelect.vue'

// 類型定義
export type { filterOption, filterType, FilterValues } from './types/filters'
export type { ExtendedEChartsOption } from './types/echarts'

// 服務
export * from './services/chartTransformService'
export * from './services/tooltipProcessor'

// 工具
export * from './utils/colorManager'

// 樣式
import './styles/index.css'
