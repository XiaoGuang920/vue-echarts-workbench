# ECharts JSON 配置結構說明

## 📖 前言

本配置格式**基於 Apache ECharts 官方配置結構**設計，完全相容 ECharts 的標準配置語法。

**ECharts 官方文檔參考：**

- 官方網站：<https://echarts.apache.org/>
- 配置項手冊：<https://echarts.apache.org/zh/option.html>
- API 文檔：<https://echarts.apache.org/zh/api.html>

**本系統的擴充與簡化：**

1. **新增欄位**：`chartType`、`tooltipType`、`gridWidth`、`gridHeight`、`gridX`、`gridY` 用於系統內部的圖表類型識別和布局管理
2. **自動處理**：系統會自動補充 ECharts 需要的 `title`、`xAxis`、`yAxis`、`legend`、`grid`、`toolbox` 等完整配置
3. **簡化輸入**：使用者只需提供核心數據（series）和基本資訊（標題、軸名稱），系統會自動生成符合 ECharts 標準的完整配置對象

**AI 使用指引：**

- 可以參考 ECharts 官方文檔中的 `series`、`xAxis`、`yAxis` 等配置項結構
- 所有 ECharts 官方支援的 series 類型（bar、line、pie、scatter 等）都可以使用
- 系統會在 transformer 層將簡化配置轉換為 ECharts 完整配置，因此最終會是標準的 ECharts option 對象

---

> **重要提示：** 所有圖表都必須包含以下必填欄位：`chartType`、`tooltipType`、`series`、`title.text`、`xAxis.name`、`yAxis.name`（餅圖等不需要軸的圖表除外）。系統會自動處理所有布局、樣式、顏色等配置。

## 📋 目錄

- [基本結構](#基本結構)
- [通用欄位](#通用欄位)
- [圖表類型](#圖表類型)
  - [基礎圖表](#基礎圖表)
  - [堆疊圖表](#堆疊圖表)
  - [複雜圖表](#複雜圖表)
  - [地理圖表](#地理圖表)
  - [階層圖表](#階層圖表)
  - [特殊圖表](#特殊圖表)

---

## 基本結構

所有圖表 JSON 都遵循以下基本結構：

```json
{
  "chartType": "string",      // 圖表類型（必填）
  "tooltipType": "string",    // Tooltip 類型（必填）
  "series": [],               // 系列資料（必填）
  "title": {                  // 標題配置（必填）
    "text": "string"          // 標題文字（必填）
  },
  "xAxis": {                  // X 軸配置（必填，餅圖等除外）
    "name": "string",         // X 軸名稱（必填）
    "data": []                // 分類數據（category 類型需要）
  },
  "yAxis": {                  // Y 軸配置（必填，餅圖等除外）
    "name": "string"          // Y 軸名稱（必填）
  },
  "gridWidth": number,        // 網格寬度（選填，預設4）
  "gridHeight": number,       // 網格高度（選填，預設4）
  "gridX": number,            // X 軸網格位置（選填，預設0）
  "gridY": number             // Y 軸網格位置（選填，預設0）
}
```

### 必填欄位

| 欄位          | 類型   | 說明             | 範例                       |
| ------------- | ------ | ---------------- | -------------------------- |
| `chartType`   | string | 圖表類型識別碼   | `"bar"`, `"line"`, `"pie"` |
| `tooltipType` | string | Tooltip 顯示樣式 | `"barLight"`, `"pieLight"` |
| `series`      | array  | 圖表數據系列     | 見各圖表類型說明           |
| `title.text`  | string | 圖表標題文字     | `"月度銷售趨勢"`           |
| `xAxis.name`  | string | X 軸名稱         | `"月份"`                   |
| `yAxis.name`  | string | Y 軸名稱         | `"銷售額 (萬元)"`          |

### 選填欄位（布局用）

| 欄位            | 類型    | 說明                  | 預設值     |
| --------------- | ------- | --------------------- | ---------- |
| `gridWidth`     | number  | 圖表佔用的網格寬度    | `4`        |
| `gridHeight`    | number  | 圖表佔用的網格高度    | `4`        |
| `gridX`         | number  | 圖表在網格中的 X 位置 | `0`        |
| `gridY`         | number  | 圖表在網格中的 Y 位置 | `0`        |
| `title.left`    | string  | 標題水平位置          | `"center"` |
| `title.top`     | number  | 標題垂直位置          | `10`       |
| `legend.show`   | boolean | 是否顯示圖例          | `true`     |
| `legend.left`   | string  | 圖例水平位置          | `"center"` |
| `legend.bottom` | number  | 圖例底部距離          | `5`        |
| `grid.left`     | string  | 繪圖區左邊距          | `"8%"`     |
| `grid.right`    | string  | 繪圖區右邊距          | `"10%"`    |
| `grid.top`      | string  | 繪圖區上邊距          | `"20%"`    |
| `grid.bottom`   | string  | 繪圖區下邊距          | `"15%"`    |
| `toolbox.show`  | boolean | 是否顯示工具箱        | `true`     |

---

## 通用欄位

### Tooltip 類型對照表

每種圖表都有對應的 Light 和 Dark 兩種 Tooltip 樣式：

| 圖表類型       | Light 模式                  | Dark 模式                  | Detail 模式                                                          |
| -------------- | --------------------------- | -------------------------- | -------------------------------------------------------------------- |
| 折線圖         | `lineLight`                 | `lineDark`                 | -                                                                    |
| 柱狀圖         | `barLight`                  | `barDark`                  | -                                                                    |
| 餅圖           | `pieLight`                  | `pieDark`                  | -                                                                    |
| 散點圖         | `scatterLight`              | `scatterDark`              | -                                                                    |
| 橫向柱狀圖     | `horizontalBarLight`        | `horizontalBarDark`        | -                                                                    |
| 雷達圖         | `radarLight`                | `radarDark`                | -                                                                    |
| 堆疊柱狀圖     | `stackedBarLight`           | `stackedBarDark`           | `stackedBarDetailLight` / `stackedBarDetailDark`                     |
| 橫向堆疊柱狀圖 | `horizontalStackedBarLight` | `horizontalStackedBarDark` | `horizontalStackedBarDetailLight` / `horizontalStackedBarDetailDark` |
| 混合圖         | `mixLineBarLight`           | `mixLineBarDark`           | `mixLineBarDetailLight` / `mixLineBarDetailDark`                     |
| 氣泡圖         | `bubbleLight`               | `bubbleDark`               | -                                                                    |
| 熱力圖         | `heatmapLight`              | `heatmapDark`              | -                                                                    |
| 漏斗圖         | `funnelLight`               | `funnelDark`               | -                                                                    |
| 地圖           | `mapLight`                  | `mapDark`                  | -                                                                    |
| K線圖          | `candlestickLight`          | `candlestickDark`          | -                                                                    |
| 旭日圖         | `sunburstLight`             | `sunburstDark`             | -                                                                    |
| 矩形樹圖       | `treemapLight`              | `treemapDark`              | -                                                                    |
| 主題河流圖     | -                           | -                          | `themeRiverDetailLight` / `themeRiverDetailDark`                     |
| 平行座標圖     | -                           | -                          | `parallelDetailLight` / `parallelDetailDark`                         |
| 箱線圖         | `boxplotLight`              | `boxplotDark`              | -                                                                    |

> **Detail 模式：** 提供更詳細的數據展示，通常用於多系列數據的對比分析。

---

## 圖表類型

## 基礎圖表

### 1. 折線圖 (Line Chart)

**chartType:** `line`  
**tooltipType:** `lineLight` / `lineDark`

#### 必填欄位

```json
{
  "chartType": "line",
  "tooltipType": "lineLight",
  "title": {
    "text": "圖表標題"
  },
  "xAxis": {
    "name": "X軸名稱"
  },
  "yAxis": {
    "name": "Y軸名稱"
  },
  "series": [
    {
      "name": "系列名稱",
      "type": "line",
      "data": [
        { "name": "分類1", "value": 100 },
        { "name": "分類2", "value": 150 }
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                |
| ------ | ------ | ---- | ----------------------------------- |
| `name` | string | ✅   | 系列名稱                            |
| `type` | string | ✅   | 固定為 `"line"`                     |
| `data` | array  | ✅   | 數據陣列，格式：`[{ name, value }]` |

#### 推薦範例

```json
{
  "chartType": "line",
  "tooltipType": "lineLight",
  "title": {
    "text": "月度銷售趨勢"
  },
  "xAxis": {
    "name": "月份"
  },
  "yAxis": {
    "name": "銷售額 (萬元)"
  },
  "series": [
    {
      "name": "銷售額",
      "type": "line",
      "data": [
        { "name": "1月", "value": 120 },
        { "name": "2月", "value": 200 }
      ]
    }
  ]
}
```

---

### 2. 柱狀圖 (Bar Chart)

**chartType:** `bar`  
**tooltipType:** `barLight` / `barDark`

#### 必填欄位

```json
{
  "chartType": "bar",
  "tooltipType": "barLight",
  "title": {
    "text": "圖表標題"
  },
  "xAxis": {
    "name": "X軸名稱"
  },
  "yAxis": {
    "name": "Y軸名稱"
  },
  "series": [
    {
      "name": "系列名稱",
      "type": "bar",
      "data": [
        { "name": "產品A", "value": 65 },
        { "name": "產品B", "value": 48 }
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                            |
| ------ | ------ | ---- | ----------------------------------------------- |
| `name` | string | ✅   | 系列名稱                                        |
| `type` | string | ✅   | 固定為 `"bar"`                                  |
| `data` | array  | ✅   | 數據陣列，格式：`[{ name, value, itemStyle? }]` |

#### 推薦範例

```json
{
  "chartType": "bar",
  "tooltipType": "barLight",
  "title": {
    "text": "產品銷售排行"
  },
  "xAxis": {
    "name": "產品"
  },
  "yAxis": {
    "name": "銷售量 (件)"
  },
  "series": [
    {
      "name": "銷售量",
      "type": "bar",
      "data": [
        { "name": "產品A", "value": 65 },
        { "name": "產品B", "value": 48 }
      ]
    }
  ]
}
```

---

### 3. 橫向柱狀圖 (Horizontal Bar Chart)

**chartType:** `horizontalBar`  
**tooltipType:** `horizontalBarLight` / `horizontalBarDark`

#### 必填欄位

與柱狀圖相同，只是 `chartType` 不同，系統會自動處理軸的轉換。

```json
{
  "chartType": "horizontalBar",
  "tooltipType": "horizontalBarLight",
  "series": [
    {
      "name": "銷售量",
      "type": "bar",
      "data": [
        { "name": "產品A", "value": 65 },
        { "name": "產品B", "value": 48 }
      ]
    }
  ]
}
```

---

### 4. 餅圖 (Pie Chart)

**chartType:** `pie`  
**tooltipType:** `pieLight` / `pieDark`

#### 必填欄位

```json
{
  "chartType": "pie",
  "tooltipType": "pieLight",
  "series": [
    {
      "name": "銷售佔比",
      "type": "pie",
      "data": [
        { "name": "產品A", "value": 285 },
        { "name": "產品B", "value": 135 }
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                |
| ------ | ------ | ---- | ----------------------------------- |
| `name` | string | ✅   | 系列名稱                            |
| `type` | string | ✅   | 固定為 `"pie"`                      |
| `data` | array  | ✅   | 數據陣列，格式：`[{ name, value }]` |

---

### 5. 散點圖 (Scatter Chart)

**chartType:** `scatter`  
**tooltipType:** `scatterLight` / `scatterDark`

#### 必填欄位

```json
{
  "chartType": "scatter",
  "tooltipType": "scatterLight",
  "series": [
    {
      "name": "數據點",
      "type": "scatter",
      "data": [
        [10, 20],
        [15, 25]
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                            |
| ------ | ------ | ---- | ------------------------------- |
| `name` | string | ✅   | 系列名稱                        |
| `type` | string | ✅   | 固定為 `"scatter"`              |
| `data` | array  | ✅   | 數據陣列，格式：`[[x, y], ...]` |

---

### 6. 雷達圖 (Radar Chart)

**chartType:** `radar`  
**tooltipType:** `radarLight` / `radarDark`

#### 必填欄位

```json
{
  "chartType": "radar",
  "tooltipType": "radarLight",
  "radar": {
    "indicator": [
      { "name": "銷售", "max": 100 },
      { "name": "管理", "max": 100 }
    ]
  },
  "series": [
    {
      "name": "預算分配",
      "type": "radar",
      "data": [
        {
          "value": [80, 75],
          "name": "實際開支"
        }
      ]
    }
  ]
}
```

#### Radar 配置

| 欄位        | 類型  | 必填 | 說明                                |
| ----------- | ----- | ---- | ----------------------------------- |
| `indicator` | array | ✅   | 雷達圖指標，格式：`[{ name, max }]` |

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                             |
| ------ | ------ | ---- | ------------------------------------------------ |
| `name` | string | ✅   | 系列名稱                                         |
| `type` | string | ✅   | 固定為 `"radar"`                                 |
| `data` | array  | ✅   | 數據陣列，格式：`[{ value: [n1, n2...], name }]` |

---

## 堆疊圖表

### 7. 堆疊柱狀圖 (Stacked Bar Chart)

**chartType:** `stackedBar`  
**tooltipType:** `stackedBarLight` / `stackedBarDark` / `stackedBarDetailLight` / `stackedBarDetailDark`

#### 必填欄位

```json
{
  "chartType": "stackedBar",
  "tooltipType": "stackedBarDetailLight",
  "xAxis": {
    "type": "category",
    "data": ["Q1", "Q2", "Q3", "Q4"]
  },
  "series": [
    {
      "name": "智慧型產品",
      "type": "bar",
      "stack": "total",
      "data": [65, 70, 75, 80]
    },
    {
      "name": "傳統產品",
      "type": "bar",
      "stack": "total",
      "data": [28, 35, 40, 45]
    }
  ]
}
```

#### XAxis 配置

| 欄位   | 類型   | 必填 | 說明                |
| ------ | ------ | ---- | ------------------- |
| `type` | string | ✅   | 固定為 `"category"` |
| `data` | array  | ✅   | 分類資料陣列        |

#### Series 資料結構

| 欄位    | 類型   | 必填 | 說明                            |
| ------- | ------ | ---- | ------------------------------- |
| `name`  | string | ✅   | 系列名稱                        |
| `type`  | string | ✅   | 固定為 `"bar"`                  |
| `stack` | string | ✅   | 堆疊標識，相同值會堆疊在一起    |
| `data`  | array  | ✅   | 數據陣列，格式：`[n1, n2, ...]` |

> **Detail 模式：** 使用 `stackedBarDetailLight` 或 `stackedBarDetailDark` 可顯示更詳細的堆疊資訊。

---

### 8. 橫向堆疊柱狀圖 (Horizontal Stacked Bar Chart)

**chartType:** `horizontalStackedBar`  
**tooltipType:** `horizontalStackedBarLight` / `horizontalStackedBarDark` / `horizontalStackedBarDetailLight` / `horizontalStackedBarDetailDark`

#### 必填欄位

與堆疊柱狀圖類似，但軸配置相反：

```json
{
  "chartType": "horizontalStackedBar",
  "tooltipType": "horizontalStackedBarDetailLight",
  "yAxis": {
    "type": "category",
    "data": ["Q1", "Q2", "Q3", "Q4"]
  },
  "series": [
    {
      "name": "智慧型產品",
      "type": "bar",
      "stack": "total",
      "data": [65, 70, 75, 80]
    }
  ]
}
```

---

## 複雜圖表

### 9. 混合圖 (Mix Line Bar Chart)

**chartType:** `mixLineBar`  
**tooltipType:** `mixLineBarLight` / `mixLineBarDark` / `mixLineBarDetailLight` / `mixLineBarDetailDark`

#### 必填欄位

```json
{
  "chartType": "mixLineBar",
  "tooltipType": "mixLineBarDetailLight",
  "xAxis": {
    "type": "category",
    "data": ["1月", "2月", "3月"]
  },
  "series": [
    {
      "name": "銷售量",
      "type": "bar",
      "data": [120, 200, 150]
    },
    {
      "name": "成長率",
      "type": "line",
      "yAxisIndex": 1,
      "data": [10, 15, 12]
    }
  ]
}
```

#### Series 資料結構

可混合 `bar` 和 `line` 類型：

| 欄位         | 類型   | 必填 | 說明                    |
| ------------ | ------ | ---- | ----------------------- |
| `name`       | string | ✅   | 系列名稱                |
| `type`       | string | ✅   | `"bar"` 或 `"line"`     |
| `data`       | array  | ✅   | 數據陣列                |
| `yAxisIndex` | number | ⭕   | Y 軸索引（用於雙 Y 軸） |

---

### 10. 氣泡圖 (Bubble Chart)

**chartType:** `bubble`  
**tooltipType:** `bubbleLight` / `bubbleDark`

#### 必填欄位

```json
{
  "chartType": "bubble",
  "tooltipType": "bubbleLight",
  "series": [
    {
      "name": "數據集",
      "type": "scatter",
      "data": [
        [10, 20, 30],
        [15, 25, 40]
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                  |
| ------ | ------ | ---- | ------------------------------------- |
| `name` | string | ✅   | 系列名稱                              |
| `type` | string | ✅   | 固定為 `"scatter"`                    |
| `data` | array  | ✅   | 數據陣列，格式：`[[x, y, size], ...]` |

---

### 11. 熱力圖 (Heatmap Chart)

**chartType:** `heatmap`  
**tooltipType:** `heatmapLight` / `heatmapDark`

#### 必填欄位

```json
{
  "chartType": "heatmap",
  "tooltipType": "heatmapLight",
  "xAxis": {
    "type": "category",
    "data": ["週一", "週二", "週三"]
  },
  "yAxis": {
    "type": "category",
    "data": ["08:00", "09:00", "10:00"]
  },
  "series": [
    {
      "name": "訪問量",
      "type": "heatmap",
      "data": [
        [0, 0, 5],
        [0, 1, 10],
        [1, 0, 15]
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                             |
| ------ | ------ | ---- | ------------------------------------------------ |
| `name` | string | ✅   | 系列名稱                                         |
| `type` | string | ✅   | 固定為 `"heatmap"`                               |
| `data` | array  | ✅   | 數據陣列，格式：`[[xIndex, yIndex, value], ...]` |

---

### 12. 漏斗圖 (Funnel Chart)

**chartType:** `funnel`  
**tooltipType:** `funnelLight` / `funnelDark`

#### 必填欄位

```json
{
  "chartType": "funnel",
  "tooltipType": "funnelLight",
  "series": [
    {
      "name": "轉化漏斗",
      "type": "funnel",
      "data": [
        { "name": "訪問", "value": 1000 },
        { "name": "註冊", "value": 500 },
        { "name": "購買", "value": 100 }
      ]
    }
  ]
}
```

---

### 13. K線圖 (Candlestick Chart)

**chartType:** `candlestick`  
**tooltipType:** `candlestickLight` / `candlestickDark`

#### 必填欄位

```json
{
  "chartType": "candlestick",
  "tooltipType": "candlestickLight",
  "xAxis": {
    "type": "category",
    "data": ["2024-01", "2024-02"]
  },
  "series": [
    {
      "name": "股價",
      "type": "candlestick",
      "data": [
        [20, 34, 10, 38],
        [40, 35, 30, 50]
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                              |
| ------ | ------ | ---- | ------------------------------------------------- |
| `name` | string | ✅   | 系列名稱                                          |
| `type` | string | ✅   | 固定為 `"candlestick"`                            |
| `data` | array  | ✅   | 數據陣列，格式：`[[open, close, low, high], ...]` |

---

### 14. 箱線圖 (Boxplot Chart)

**chartType:** `boxplot`  
**tooltipType:** `boxplotLight` / `boxplotDark`

#### 必填欄位

```json
{
  "chartType": "boxplot",
  "tooltipType": "boxplotLight",
  "xAxis": {
    "type": "category",
    "data": ["產品A", "產品B"]
  },
  "series": [
    {
      "name": "Boxplot",
      "type": "boxplot",
      "data": [
        [10, 25, 50, 75, 90],
        [15, 30, 55, 80, 95]
      ]
    },
    {
      "name": "Outliers",
      "type": "scatter",
      "data": [
        [0, 100],
        [1, 5]
      ]
    }
  ]
}
```

#### Series 資料結構

**Boxplot 系列：**

| 欄位   | 類型   | 必填 | 說明                                      |
| ------ | ------ | ---- | ----------------------------------------- |
| `type` | string | ✅   | 固定為 `"boxplot"`                        |
| `data` | array  | ✅   | 格式：`[[min, Q1, median, Q3, max], ...]` |

**Scatter 系列（異常值）：**

| 欄位   | 類型   | 必填 | 說明                           |
| ------ | ------ | ---- | ------------------------------ |
| `type` | string | ✅   | 固定為 `"scatter"`             |
| `data` | array  | ✅   | 格式：`[[xIndex, value], ...]` |

---

## 地理圖表

### 15. 地圖 (Map Chart)

**chartType:** `map`  
**tooltipType:** `mapLight` / `mapDark`

#### 必填欄位

```json
{
  "chartType": "map",
  "tooltipType": "mapLight",
  "series": [
    {
      "name": "台灣地區數據",
      "type": "map",
      "map": "taiwan",
      "data": [
        { "name": "台北市", "value": 500 },
        { "name": "新北市", "value": 300 }
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                |
| ------ | ------ | ---- | ----------------------------------- |
| `name` | string | ✅   | 系列名稱                            |
| `type` | string | ✅   | 固定為 `"map"`                      |
| `map`  | string | ✅   | 地圖名稱（如 `"taiwan"`）           |
| `data` | array  | ✅   | 數據陣列，格式：`[{ name, value }]` |

---

## 階層圖表

### 16. 旭日圖 (Sunburst Chart)

**chartType:** `sunburst`  
**tooltipType:** `sunburstLight` / `sunburstDark`

#### 必填欄位

```json
{
  "chartType": "sunburst",
  "tooltipType": "sunburstLight",
  "series": [
    {
      "type": "sunburst",
      "data": [
        {
          "name": "根節點",
          "children": [
            {
              "name": "子節點1",
              "value": 10
            }
          ]
        }
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                            |
| ------ | ------ | ---- | ----------------------------------------------- |
| `type` | string | ✅   | 固定為 `"sunburst"`                             |
| `data` | array  | ✅   | 階層數據，格式：`[{ name, value?, children? }]` |

---

### 17. 矩形樹圖 (Treemap Chart)

**chartType:** `treemap`  
**tooltipType:** `treemapLight` / `treemapDark`

#### 必填欄位

```json
{
  "chartType": "treemap",
  "tooltipType": "treemapLight",
  "series": [
    {
      "type": "treemap",
      "data": [
        {
          "name": "節點A",
          "value": 40,
          "children": [{ "name": "節點A1", "value": 15 }]
        }
      ]
    }
  ]
}
```

---

### 18. 主題河流圖 (Theme River Chart)

**chartType:** `themeRiver`  
**tooltipType:** `themeRiverDetailLight` / `themeRiverDetailDark`

#### 必填欄位

```json
{
  "chartType": "themeRiver",
  "tooltipType": "themeRiverDetailLight",
  "series": [
    {
      "type": "themeRiver",
      "data": [
        ["2015/11/08", 10, "DQ"],
        ["2015/11/09", 15, "DQ"],
        ["2015/11/08", 35, "TY"]
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                               |
| ------ | ------ | ---- | ---------------------------------- |
| `type` | string | ✅   | 固定為 `"themeRiver"`              |
| `data` | array  | ✅   | 格式：`[[date, value, name], ...]` |

---

## 特殊圖表

### 19. 平行座標圖 (Parallel Chart)

**chartType:** `parallel`  
**tooltipType:** `parallelDetailLight` / `parallelDetailDark`

#### 必填欄位

```json
{
  "chartType": "parallel",
  "tooltipType": "parallelDetailLight",
  "series": [
    {
      "type": "parallel",
      "data": [
        [1, 55, 9, 56, 0.46],
        [2, 25, 11, 21, 0.65]
      ]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                                           |
| ------ | ------ | ---- | ---------------------------------------------- |
| `type` | string | ✅   | 固定為 `"parallel"`                            |
| `data` | array  | ✅   | 多維數據陣列，格式：`[[d1, d2, d3, ...], ...]` |

> **注意：** 系統會自動根據數據計算 `parallelAxis` 配置。

---

### 20. 環形進度圖 (Ring Progress Chart)

**chartType:** `ringProgress`  
**tooltipType:** `pieLight` / `pieDark`

#### 必填欄位

```json
{
  "chartType": "ringProgress",
  "tooltipType": "pieLight",
  "series": [
    {
      "name": "完成度",
      "type": "pie",
      "data": [
        { "value": 75, "name": "已完成" },
        { "value": 25, "name": "未完成" }
      ]
    }
  ]
}
```

> **注意：** 系統會自動計算多個環形圖的布局位置。

---

### 21. 水球圖 (Liquid Fill Chart)

**chartType:** `liquidFill`  
**tooltipType:** `pieLight` / `pieDark`

#### 必填欄位

```json
{
  "chartType": "liquidFill",
  "tooltipType": "pieLight",
  "series": [
    {
      "type": "liquidFill",
      "data": [0.6, 0.5, 0.4]
    }
  ]
}
```

#### Series 資料結構

| 欄位   | 類型   | 必填 | 說明                      |
| ------ | ------ | ---- | ------------------------- |
| `type` | string | ✅   | 固定為 `"liquidFill"`     |
| `data` | array  | ✅   | 百分比數據陣列，範圍：0-1 |

---

### 22. 極坐標柱狀圖 (Polar Bar Chart)

**chartType:** `polarBar`  
**tooltipType:** `barLight` / `barDark`

#### 必填欄位

```json
{
  "chartType": "polarBar",
  "tooltipType": "barLight",
  "angleAxis": {
    "type": "category",
    "data": ["A", "B", "C"]
  },
  "series": [
    {
      "type": "bar",
      "data": [10, 20, 30],
      "coordinateSystem": "polar"
    }
  ]
}
```

---

### 23. 儀表板 (Gauge Chart)

**chartType:** `gauge`  
**tooltipType:** N/A（通常不使用 tooltip）

#### 必填欄位

```json
{
  "chartType": "gauge",
  "series": [
    {
      "type": "gauge",
      "data": [{ "value": 75, "name": "完成率" }]
    }
  ]
}
```

---

### 24. 桑基圖 (Sankey Chart)

**chartType:** `sankey`  
**tooltipType:** N/A

#### 必填欄位

```json
{
  "chartType": "sankey",
  "series": [
    {
      "type": "sankey",
      "data": [{ "name": "a" }, { "name": "b" }],
      "links": [{ "source": "a", "target": "b", "value": 10 }]
    }
  ]
}
```

---

### 25. 關係圖 (Graph Chart)

**chartType:** `graph`  
**tooltipType:** N/A

#### 必填欄位

```json
{
  "chartType": "graph",
  "series": [
    {
      "type": "graph",
      "data": [
        { "name": "節點1", "value": 10 },
        { "name": "節點2", "value": 20 }
      ],
      "links": [{ "source": "節點1", "target": "節點2" }]
    }
  ]
}
```

---

### 26. 樹狀圖 (Tree Chart)

**chartType:** `tree`  
**tooltipType:** N/A

#### 必填欄位

```json
{
  "chartType": "tree",
  "series": [
    {
      "type": "tree",
      "data": [
        {
          "name": "根節點",
          "children": [{ "name": "子節點1" }]
        }
      ]
    }
  ]
}
```

---

## 📝 使用範例

### 標準範例

所有圖表都必須包含以下必填欄位：

```json
{
  "chartType": "bar",
  "tooltipType": "barLight",
  "title": {
    "text": "產品銷售報表"
  },
  "xAxis": {
    "name": "產品類別"
  },
  "yAxis": {
    "name": "銷售額 (萬元)"
  },
  "series": [
    {
      "name": "銷售額",
      "type": "bar",
      "data": [
        { "name": "產品A", "value": 100 },
        { "name": "產品B", "value": 200 }
      ]
    }
  ]
}
```

系統會自動處理：

- ✅ 顏色配置
- ✅ 軸配置（類型、範圍、標籤樣式）
- ✅ 圖例配置（位置、樣式）
- ✅ 工具箱配置（下載功能）
- ✅ 響應式布局（grid、間距）
- ✅ 主題樣式（字體、顏色）

---

## 🔔 重要說明

### 自動處理機制

系統已內建完整的資料處理邏輯，**不需要手動配置以下項目**：

1. **顏色配置**：ColorManager 會自動分配協調的色彩方案
2. **軸範圍**：系統根據數據自動計算最佳的 min/max 值
3. **字體樣式**：預設使用 Arial 字體，支援深色/淺色主題
4. **布局間距**：grid、legend、toolbox 等都有最佳化的預設位置
5. **響應式設定**：圖表會自動適應容器大小

### TooltipType 選擇規則

- **Light 模式**：用於淺色背景的應用（白色、淺灰等）
- **Dark 模式**：用於深色背景的應用（黑色、深灰等）
- **Detail 模式**：適用於多系列數據，提供詳細的對比資訊（僅部分圖表支援）

### 必填欄位要求

**所有圖表都必須提供以下欄位：**

- `chartType`：圖表類型識別碼（如 `"bar"`, `"line"`, `"pie"`）
- `tooltipType`：Tooltip 顯示模式（如 `"barLight"`, `"lineDark"`）
- `series`：圖表數據系列陣列
- `title.text`：圖表標題文字
- `xAxis.name`：X 軸名稱（不需要 X 軸的圖表除外，如餅圖）
- `yAxis.name`：Y 軸名稱（不需要 Y 軸的圖表除外，如餅圖）

**選填欄位（有預設值）：**

- 布局相關：`gridWidth`, `gridHeight`, `gridX`, `gridY`, `grid.left/right/top/bottom`, `title.left/top`, `legend.left/bottom`
- 樣式相關：字體、顏色、大小等（由 ColorManager 自動處理）
- 互動相關：`dataZoom`, `toolbox` 等（有預設配置）

### 特殊圖表注意事項

1. **Ring Progress（環形進度圖）**：系統會自動計算多個環形圖的布局位置，無需手動設定 `center` 和 `radius`
2. **Parallel（平行座標圖）**：系統會自動根據數據維度計算 `parallelAxis` 配置
3. **Theme River（主題河流圖）**：會自動統計數據中的唯一名稱數量
4. **Stacked Bar（堆疊柱狀圖）**：需要在 series 中設定相同的 `stack` 值來啟用堆疊效果
