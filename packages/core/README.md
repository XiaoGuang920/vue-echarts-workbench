# Vue ECharts Workbench

一個強大的 Vue 3 組件庫，用於快速構建 ECharts 儀表板和數據可視化應用。

## ✨ 特性

- 🎨 **豐富的圖表類型** - 支持 30+ 種 ECharts 圖表類型
- 🔧 **動態配置** - 通過 JSON 配置快速生成圖表
- 📊 **儀表板布局** - 內建網格拖拽佈局系統
- 🎯 **篩選器系統** - 支持多種篩選器類型（日期、數值、選擇器等）
- 🌐 **地圖支持** - 內建台灣地圖等 GeoJSON 資源
- 💧 **特殊圖表** - 支持水球圖等特殊圖表類型
- 🎭 **主題系統** - 內建多種配色方案
- 📱 **響應式設計** - 自適應不同屏幕尺寸
- 🔌 **易於集成** - 簡單的 API，快速上手

## 📦 安裝

```bash
# npm
npm install vue-echarts-workbench

# pnpm
pnpm add vue-echarts-workbench

# yarn
yarn add vue-echarts-workbench
```

## 🚀 快速開始

### 基本使用

```vue
<template>
  <DynamicChart :chart-json="chartConfig" />
</template>

<script setup>
import { DynamicChart } from 'vue-echarts-workbench'
import 'vue-echarts-workbench/dist/style.css'

const chartConfig = {
  chartType: 'line',
  title: '銷售趨勢',
  xAxis: ['一月', '二月', '三月', '四月', '五月'],
  series: [
    {
      name: '銷售額',
      data: [120, 200, 150, 80, 70]
    }
  ]
}
</script>
```

### 使用儀表板

```vue
<template>
  <ChartDashboard
    :charts="charts"
    :filters="filters"
    @filter-change="handleFilterChange"
  />
</template>

<script setup>
import { ChartDashboard } from 'vue-echarts-workbench'
import 'vue-echarts-workbench/dist/style.css'

const charts = [
  {
    chartType: 'bar',
    title: '月度銷售',
    gridX: 1,
    gridY: 1,
    gridWidth: 6,
    gridHeight: 4,
    xAxis: ['產品A', '產品B', '產品C'],
    series: [{ name: '銷量', data: [100, 200, 150] }]
  }
]

const filters = [
  {
    type: 'dateRange',
    label: '日期範圍',
    placeholder: { start: '開始日期', end: '結束日期' }
  }
]

function handleFilterChange(filterValues) {
  console.log('篩選器變更:', filterValues)
}
</script>
```

## 📖 支持的圖表類型

- 📊 **基礎圖表**: 折線圖、柱狀圖、餅圖、散點圖
- 📈 **統計圖表**: 箱線圖、熱力圖、雷達圖、漏斗圖
- 🗺️ **地圖圖表**: 地理地圖、熱力地圖
- 🌳 **關係圖表**: 樹圖、矩形樹圖、旭日圖、桑基圖
- 📉 **專業圖表**: K線圖、儀表盤、水球圖、平行座標
- 🎯 **組合圖表**: 折線柱狀混合圖

## 🎨 篩選器類型

- `text` - 文字輸入
- `number` - 數值輸入
- `date` - 日期選擇器
- `dateRange` - 日期範圍選擇器
- `numberRange` - 數值範圍
- `singleSelect` - 單選下拉
- `multiSelect` - 多選下拉

## 🔧 API

### DynamicChart Props

| 屬性 | 類型 | 說明 |
|------|------|------|
| `chartJson` | `ExtendedEChartsOption` | 圖表配置對象 |

### ChartDashboard Props

| 屬性 | 類型 | 說明 |
|------|------|------|
| `charts` | `ExtendedEChartsOption[]` | 圖表配置數組 |
| `filters` | `filterOption[]` | 篩選器配置數組 |

### ChartDashboard Events

| 事件 | 參數 | 說明 |
|------|------|------|
| `filter-change` | `filterValues: FilterValues` | 篩選器值變更時觸發 |

## 📚 圖表配置示例

### 折線圖

```javascript
{
  chartType: 'line',
  title: '溫度變化',
  xAxis: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  series: [{
    name: '溫度',
    data: [18, 16, 19, 25, 28, 22],
    smooth: true
  }]
}
```

### 餅圖

```javascript
{
  chartType: 'pie',
  title: '市場佔有率',
  series: [{
    data: [
      { name: '產品A', value: 335 },
      { name: '產品B', value: 234 },
      { name: '產品C', value: 154 }
    ]
  }]
}
```

### 地圖圖表

```javascript
{
  chartType: 'map',
  title: '台灣各地數據',
  mapType: 'taiwan',
  series: [{
    data: [
      { name: '台北市', value: 100 },
      { name: '新北市', value: 200 }
    ]
  }]
}
```

## 🌍 環境變量

```bash
# .env
VITE_GEO_JSON_BASE_URL=https://your-cdn.com/geo/
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 👤 作者

<aaron.wang890920@gmail.com>

## 🔗 相關鏈接

- [ECharts 官方文檔](https://echarts.apache.org/)
- [Vue ECharts](https://github.com/ecomfe/vue-echarts)
- [GitHub Repository](https://github.com/XiaoGuang920/vue-echarts-workbench)
