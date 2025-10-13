# vue-echarts-workbench

🎨 **Vue ECharts Workbench** - 一個強大的視覺化圖表配置與編輯平台

## 📖 專案簡介

**Vue ECharts Workbench** 是一個基於 Vue 3 和 Apache ECharts 的視覺化圖表開發工具，提供直觀的圖表配置編輯器和即時預覽功能。本專案旨在簡化 ECharts 圖表的開發流程，讓開發者和數據分析師能夠快速建立、編輯和部署專業級的數據視覺化儀表板。

### 🎯 解決的問題

- **配置複雜性**：ECharts 原生配置結構龐大複雜，本工具提供簡化的配置介面，自動補全常用配置項
- **開發效率**：提供即時預覽和所見即所得的編輯體驗，大幅縮短圖表開發時間
- **布局管理**：支援整個儀表板的視覺化布局編輯，無需手寫 CSS 或計算座標
- **系統遷移**：提供配置匯出功能，方便將圖表配置遷移到其他系統或環境

### ✨ 核心特色

- 🎨 **27+ 種圖表類型**：支援長條圖、折線圖、餅圖、散點圖、熱力圖、地圖等豐富圖表
- 📝 **JSON 配置驅動**：使用簡化的 JSON 格式配置，自動轉換為完整 ECharts 配置
- 🔄 **即時預覽**：編輯配置時即時渲染圖表，所見即所得
- 🎯 **智能轉換**：自動處理標題、軸線、圖例、網格、工具列等配置項
- 🌈 **主題自訂**：支援透過環境變數自訂配色方案
- 📱 **響應式設計**：完整支援桌面和行動裝置瀏覽
- 🚀 **輕量化架構**：基於 Vue 3 Composition API 和 TypeScript

---

## 🛠️ 技術架構

- **前端框架**：Vue 3 + TypeScript + Vite
- **圖表引擎**：Apache ECharts 5.6+ / vue-echarts 7.0+
- **狀態管理**：Pinia
- **路由管理**：Vue Router
- **樣式方案**：TailwindCSS + PostCSS
- **測試工具**：Vitest + Vue Test Utils

---

## 📱 功能頁面說明

### 🏠 Demo 頁面 (`/demo`)

**用途**：展示本工具支援的所有圖表類型和效果

- 瀏覽 27+ 種預建圖表範例
- 了解不同圖表類型的視覺化效果
- 作為圖表選型的參考和靈感來源
- 展示工具的完整能力和特色功能

**適用對象**：新用戶、設計師、數據分析師

### ✏️ Editor 頁面 (`/editor`)

**用途**：針對**單一圖表**進行細緻編輯

- JSON 配置編輯器，支援語法高亮和驗證
- 即時渲染圖表預覽
- 圖表配置匯入/匯出功能
- 支援所有 ECharts 原生配置項
- 適合深度自訂單一圖表的樣式和行為

**適用對象**：開發者、圖表設計師

### 🖼️ Previewer 頁面 (`/previewer`)

**用途**：針對**整張儀表板（Dashboard）**進行布局編輯

- 視覺化拖曳調整圖表位置和大小
- 多圖表組合預覽
- 整體布局配置管理
- 網格系統和對齊輔助
- 支援儀表板級別的主題設定

**適用對象**：儀表板設計師、專案經理

### 🔄 Migration 頁面 (`/migration`)

**用途**：將圖表配置遷移到其他系統

- 連動 `.env` 環境變數配置
- 讀取 `VITE_CHARTS_ENDPOINT` 設定的遷移目標
- 支援批次匯出圖表配置
- 生成可在其他系統使用的標準 ECharts 配置
- 適合多環境部署和系統整合

**適用對象**：DevOps 工程師、系統整合人員

---

## 🚀 快速開始

### 環境需求

- Node.js: `^20.19.0 || >=22.12.0`
- npm / pnpm / yarn

### 安裝

```bash
# 克隆專案
git clone https://github.com/XiaoGuang920/vue-echarts-workbench.git
cd vue-echarts-workbench

# 安裝依賴
npm install
```

### 開發

```bash
# 啟動開發伺服器
npm run dev

# 在瀏覽器開啟 http://localhost:5173
```

### 建置

```bash
# 類型檢查
npm run type-check

# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

### 部署

```bash
# 部署到 GitHub Pages
npm run deploy
```

---

## ⚙️ 環境變數配置

在專案根目錄建立 `.env` 檔案，自訂配置：

```env
# 遷移目標 API Endpoint
VITE_CHARTS_ENDPOINT=https://your-api.example.com/charts

# 主色調
VITE_COLOR_PRIMARY=#3B82F6
VITE_COLOR_PRIMARY_LIGHT=#60A5FA
VITE_COLOR_PRIMARY_DARK=#1D4ED8

# 次要色調
VITE_COLOR_SECONDARY=#10B981
VITE_COLOR_SECONDARY_LIGHT=#34D399
VITE_COLOR_SECONDARY_DARK=#059669

# 強調色調
VITE_COLOR_ACCENT=#F59E0B
VITE_COLOR_ACCENT_LIGHT=#FBBF24
VITE_COLOR_ACCENT_DARK=#D97706

# 圖表配色方案
VITE_CHART_COLOR_1=#3B82F6
VITE_CHART_COLOR_2=#10B981
VITE_CHART_COLOR_3=#F59E0B
VITE_CHART_COLOR_4=#EF4444
VITE_CHART_COLOR_5=#8B5CF6
```

---

## 📚 配置格式說明

本專案使用簡化的 JSON 配置格式，基於 ECharts 官方結構設計。詳細的配置說明請參考：

- [ECharts 官方文檔](https://echarts.apache.org/zh/option.html) - ECharts 配置項手冊

### 必填欄位

所有圖表配置必須包含以下欄位：

- `chartType`: 圖表類型（如 `bar`、`line`、`pie` 等）
- `tooltipType`: 提示框樣式（`Light`、`Dark`、`Detail` 等）
- `series`: 數據系列陣列
- `title.text`: 圖表標題文字
- `xAxis.name`: X 軸名稱（不需要軸的圖表除外）
- `yAxis.name`: Y 軸名稱（不需要軸的圖表除外）

### 配置範例

```json
{
  "chartType": "bar",
  "tooltipType": "Light",
  "title": {
    "text": "月度銷售統計"
  },
  "xAxis": {
    "name": "月份"
  },
  "yAxis": {
    "name": "銷售額（萬元）"
  },
  "series": [
    {
      "type": "bar",
      "name": "產品A",
      "data": [120, 200, 150, 80, 70, 110]
    }
  ]
}
```

---

## 🗂️ 專案結構

```text
vue-echarts-workbench/
├── public/
│   ├── data/
│   │   ├── charts/          # 圖表 JSON 配置範例
│   │   └── pages/           # 頁面配置範例
│   └── geo/                 # 地圖 GeoJSON 數據
├── src/
│   ├── components/          # Vue 元件
│   ├── composables/         # Vue Composables
│   ├── router/              # 路由配置
│   ├── services/            # 服務層
│   │   ├── processors/      # Tooltip 處理器
│   │   └── transformers/    # 圖表配置轉換器
│   ├── stores/              # Pinia 狀態管理
│   ├── types/               # TypeScript 類型定義
│   ├── utils/               # 工具函數
│   └── views/               # 頁面元件
├── AI_GENERATE.md           # AI生成參考文件
└── README.md                # 專案說明文件
```

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 本專案
2. 建立您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

---

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

---

## 🔗 相關連結

- [線上展示](https://XiaoGuang920.github.io/vue-echarts-workbench/)
- [ECharts 官方網站](https://echarts.apache.org/)
- [Vue 3 文檔](https://vuejs.org/)
- [TailwindCSS 文檔](https://tailwindcss.com/)

---

## 📮 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯絡：

- 提交 [GitHub Issue](https://github.com/XiaoGuang920/vue-echarts-workbench/issues)
- Email: <aaron.wang890920@gmail.com>

---

Made with ❤️ using Vue 3 + ECharts
