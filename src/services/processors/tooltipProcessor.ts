import type { ExtendedEChartsOption } from '@/types/echarts'
import { ColorManager } from '@/utils/colorManager'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

/**
 * Tooltip 處理器
 */
export class TooltipProcessor {
  /**
   * 處理圖表 Tooltip 配置
   * @param options 圖表配置
   * @returns 處理後的圖表配置
   */
  process(options: ExtendedEChartsOption): ExtendedEChartsOption {
    if (!options.tooltipType) return options

    const tooltipFormatter = this.getTooltipFormatter(options.tooltipType, options)

    const isDetailMode = options.tooltipType?.includes('Detail')

    const tooltipOptions = {
      trigger: isDetailMode ? 'axis' : options.tooltip?.trigger || 'item',
      backgroundColor: options.tooltip?.backgroundColor || 'transparent',
      borderWidth: options.tooltip?.borderWidth || 0,
      shadowBlur: options.tooltip?.shadowBlur || 0,
      padding: options.tooltip?.padding || 0,
      extraCssText: options.tooltip?.extraCssText || 'box-shadow: none; border: none;',
    }

    return {
      ...options,
      tooltip: {
        ...tooltipOptions,
        formatter: tooltipFormatter || null,
      },
    }
  }

  //TODO: 需要分檔管理

  /**
   * 根據類型取得 Tooltip 配置
   * @param tooltipType Tooltip 類型
   * @returns Tooltip 配置函數
   */
  private getTooltipFormatter(
    tooltipType: string,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string | null {
    switch (tooltipType) {
      case 'lineLight':
        return this.getLineConfig(false, chartOptions)
      case 'lineDark':
        return this.getLineConfig(true, chartOptions)
      case 'lineSectionsLight':
        return this.getLineConfig(false, chartOptions)
      case 'lineSectionsDark':
        return this.getLineConfig(true, chartOptions)
      case 'barLight':
        return this.getBarConfig(false, chartOptions)
      case 'barDark':
        return this.getBarConfig(true, chartOptions)
      case 'pieLight':
        return this.getPieConfig(false, chartOptions)
      case 'pieDark':
        return this.getPieConfig(true, chartOptions)
      case 'scatterLight':
        return this.getScatterConfig(false, chartOptions)
      case 'scatterDark':
        return this.getScatterConfig(true, chartOptions)
      case 'horizontalBarLight':
        return this.getHorizontalBarConfig(false, chartOptions)
      case 'horizontalBarDark':
        return this.getHorizontalBarConfig(true, chartOptions)
      case 'radarLight':
        return this.getRadarConfig(false, chartOptions)
      case 'radarDark':
        return this.getRadarConfig(true, chartOptions)
      case 'stackedBarLight':
        return this.getStackedBarConfig(false, chartOptions)
      case 'stackedBarDark':
        return this.getStackedBarConfig(true, chartOptions)
      case 'stackedBarDetailLight':
        return this.getStackedBarDetailConfig(false, chartOptions)
      case 'stackedBarDetailDark':
        return this.getStackedBarDetailConfig(true, chartOptions)
      case 'mixLineBarLight':
        return this.getMixLineBarConfig(false, chartOptions)
      case 'mixLineBarDark':
        return this.getMixLineBarConfig(true, chartOptions)
      case 'mixLineBarDetailLight':
        return this.getMixLineBarDetailConfig(false, chartOptions)
      case 'mixLineBarDetailDark':
        return this.getMixLineBarDetailConfig(true, chartOptions)
      case 'bubbleLight':
        return this.getBubbleConfig(false, chartOptions)
      case 'bubbleDark':
        return this.getBubbleConfig(true, chartOptions)
      case 'heatmapLight':
        return this.getHeatmapConfig(false, chartOptions)
      case 'heatmapDark':
        return this.getHeatmapConfig(true, chartOptions)
      case 'funnelLight':
        return this.getFunnelConfig(false, chartOptions)
      case 'funnelDark':
        return this.getFunnelConfig(true, chartOptions)
      case 'mapLight':
        return this.getMapConfig(false, chartOptions)
      case 'mapDark':
        return this.getMapConfig(true, chartOptions)
      case 'candlestickLight':
        return this.getCandlestickConfig(false, chartOptions)
      case 'candlestickDark':
        return this.getCandlestickConfig(true, chartOptions)
      case 'sunburstLight':
        return this.getSunburstConfig(false, chartOptions)
      case 'sunburstDark':
        return this.getSunburstConfig(true, chartOptions)
      case 'treemapLight':
        return this.getTreemapConfig(false, chartOptions)
      case 'treemapDark':
        return this.getTreemapConfig(true, chartOptions)
      case 'themeRiverDetailLight':
        return this.getThemeRiverDetailConfig(false, chartOptions)
      case 'themeRiverDetailDark':
        return this.getThemeRiverDetailConfig(true, chartOptions)
      case 'boxplotLight':
        return this.getBoxplotConfig(false, chartOptions)
      case 'boxplotDark':
        return this.getBoxplotConfig(true, chartOptions)
      default:
        return this.getDefaultConfig()
    }
  }

  /**
   * 折線圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getLineConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let seriesName = ''

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 處理多維數據 [x, y] 或 [timestamp, value]
          const lineData = params.value as number[]
          if (lineData.length >= 2) {
            value = lineData[1].toLocaleString()
          } else if (lineData.length === 1) {
            value = lineData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const lineData = dataObj.value as number[]
            value = lineData[lineData.length - 1]?.toLocaleString() || '無資料'
          }
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || ''
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || ''
        : chartOptions?.yAxis?.name || ''

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 240px;
      ">
        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 16px;
                height: 2px;
                border-radius: 1px;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
              ">
                <div style="
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background-color: ${color};
                  position: absolute;
                  right: -2px;
                  top: -1px;
                "></div>
              </div>
              <span style="
                font-size: 14px;
                color: ${tooltipColors.lightText};
                font-weight: bold;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid ${tooltipColors.border};
          padding-top: 8px;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${xAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${name}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 柱狀圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getBarConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let seriesName = ''

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 處理多維數據 [category, value] 或其他格式
          const barData = params.value as number[]
          if (barData.length >= 2) {
            value = barData[1].toLocaleString()
          } else if (barData.length === 1) {
            value = barData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const barData = dataObj.value as number[]
            value = barData[barData.length - 1]?.toLocaleString() || '無資料'
          }
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || ''
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || ''
        : chartOptions?.yAxis?.name || ''

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 220px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 13px;">${name}</span>
        </div>

        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 12px;
                height: 8px;
                border-radius: 2px;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
              "></div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${
            xAxisName
              ? `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 50px;
              ">
                ${xAxisName}:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${name}
              </span>
            </div>
          `
              : ''
          }

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 圓餅圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getPieConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let percent = '0%'
      let seriesName = ''

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 處理多維數據格式
          const pieData = params.value as number[]
          if (pieData.length >= 1) {
            value = pieData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const pieData = dataObj.value as number[]
            value = pieData[0]?.toLocaleString() || '無資料'
          }
        }
      }

      if (params.percent !== undefined) {
        percent = `${params.percent.toFixed(1)}%`
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'percent' in params.data
      ) {
        const dataObj = params.data as { percent: unknown }
        if (typeof dataObj.percent === 'number') {
          percent = `${dataObj.percent.toFixed(1)}%`
        }
      }

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 200px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 13px;">${name}</span>
        </div>

        ${
          seriesName && seriesName !== '圓餅圖'
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
              ">
                <div style="
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background-color: ${tooltipColors.background};
                  position: absolute;
                  top: 2px;
                  left: 2px;
                "></div>
              </div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              數值:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              占比:
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${percent}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 散點圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getScatterConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let value = '無資料'
      let xValue = '無資料'
      let yValue = '無資料'
      let seriesName = ''

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
          yValue = value // 單維數據時，將值作為 Y 值
        } else if (Array.isArray(params.value)) {
          // 處理二維數據 [x, y]
          const scatterData = params.value as number[]
          if (scatterData.length >= 2) {
            xValue = scatterData[0] !== undefined ? scatterData[0].toLocaleString() : '無資料'
            yValue = scatterData[1] !== undefined ? scatterData[1].toLocaleString() : '無資料'
            value = yValue // 主要顯示 Y 值
          } else if (scatterData.length === 1) {
            value = scatterData[0].toLocaleString()
            yValue = value
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
            yValue = value
          } else if (Array.isArray(dataObj.value)) {
            const scatterData = dataObj.value as number[]
            if (scatterData.length >= 2) {
              xValue = scatterData[0] !== undefined ? scatterData[0].toLocaleString() : '無資料'
              yValue = scatterData[1] !== undefined ? scatterData[1].toLocaleString() : '無資料'
              value = yValue
            } else if (scatterData.length === 1) {
              value = scatterData[0].toLocaleString()
              yValue = value
            }
          }
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || ''
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || ''
        : chartOptions?.yAxis?.name || ''

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 220px;
      ">
        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;
                background-color: ${color};
                box-shadow: 0 0 4px ${color}40;
              "></div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${
            xAxisName
              ? `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 50px;
              ">
                ${xAxisName}:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${xValue}
              </span>
            </div>
          `
              : ''
          }

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${yValue}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 橫向柱狀圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getHorizontalBarConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let seriesName = ''

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 處理多維數據 [category, value] 或其他格式
          const barData = params.value as number[]
          if (barData.length >= 2) {
            value = barData[1].toLocaleString()
          } else if (barData.length === 1) {
            value = barData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const barData = dataObj.value as number[]
            value = barData[barData.length - 1]?.toLocaleString() || '無資料'
          }
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || '' // 數值軸
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || ''
        : chartOptions?.yAxis?.name || '' // 分類軸

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 220px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 13px;">${name}</span>
        </div>

        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 8px;
                height: 12px;
                border-radius: 2px;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
              "></div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${
            yAxisName
              ? `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 50px;
              ">
                ${yAxisName}:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${name}
              </span>
            </div>
          `
              : ''
          }

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${xAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 雷達圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getRadarConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'

      if (params.name) {
        name = params.name
      }

      const radarOption = chartOptions?.radar
      const indicators = radarOption?.indicator || []

      let dataValues: number[] = []
      if (Array.isArray(params.value)) {
        dataValues = params.value as number[]
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          dataValues = dataObj.value as number[]
        }
      }

      const radarData = indicators.map(
        (indicator: { name?: string; max?: number }, index: number) => ({
          name: indicator.name || `維度 ${index + 1}`,
          value: dataValues[index] !== undefined ? dataValues[index] : 0,
          max: indicator.max || 100,
          displayValue:
            dataValues[index] !== undefined ? dataValues[index].toLocaleString() : '無資料',
        })
      )

      const color = params.color || '#FFFFFF'

      const validValues = dataValues.filter(v => v !== undefined && v !== null)
      const averageValue =
        validValues.length > 0
          ? (validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(1)
          : '0'

      const dataRows = radarData
        .map((item: { name: string; displayValue: string; value: number; max: number }) => {
          const percentage = item.max > 0 ? ((item.value / item.max) * 100).toFixed(0) : '0'
          return `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 3px 0;
              padding: 2px 0;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 60px;
                flex: 1;
              ">
                ${item.name}
              </span>
              <div style="
                display: flex;
                align-items: center;
                margin-left: 8px;
              ">
                <span style="
                  color: ${tooltipColors.darkText};
                  font-size: 12px;
                  font-weight: bold;
                  margin-right: 4px;
                ">
                  ${item.displayValue}
                </span>
                <span style="
                  color: ${tooltipColors.lightText};
                  font-size: 10px;
                  opacity: 0.7;
                ">
                  (${percentage}%)
                </span>
              </div>
            </div>
          `
        })
        .join('')

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        max-width: 260px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            border: 2px solid ${color};
            border-radius: 50%;
            margin-right: 8px;
            background-color: transparent;
            position: relative;
          ">
            <div style="
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: ${color};
              position: absolute;
              top: 1px;
              left: 1px;
            "></div>
          </div>
          <span style="font-size: 14px; font-weight: bold;">${name}</span>
        </div>

        <div style="
          padding: 8px 0;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${dataRows}
        </div>

        ${
          validValues.length > 0
            ? `
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 6px;
            border-top: 1px solid ${tooltipColors.border}40;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 10px;
              margin-right: 4px;
            ">
              平均值:
            </span>
            <span style="
              color: ${color};
              font-size: 11px;
              font-weight: bold;
            ">
              ${averageValue}
            </span>
          </div>
        `
            : ''
        }
      </div>
    `
    }
  }

  /**
   * 堆疊柱狀圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getStackedBarConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let seriesName = ''

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 處理多維數據 [category, value] 或其他格式
          const stackedData = params.value as number[]
          if (stackedData.length >= 2) {
            value = stackedData[1].toLocaleString()
          } else if (stackedData.length === 1) {
            value = stackedData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const stackedData = dataObj.value as number[]
            value = stackedData[stackedData.length - 1]?.toLocaleString() || '無資料'
          }
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || ''
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || ''
        : chartOptions?.yAxis?.name || ''

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 220px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 13px;">${name}</span>
        </div>

        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 12px;
                height: 8px;
                border-radius: 2px;
                margin-right: 8px;
                background-color: ${color};
                position: relative;
                border: 1px solid ${color}40;
              ">
                <div style="
                  width: 8px;
                  height: 4px;
                  border-radius: 1px;
                  background-color: ${tooltipColors.background};
                  position: absolute;
                  top: 1px;
                  left: 1px;
                "></div>
              </div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          ${
            xAxisName
              ? `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 50px;
              ">
                ${xAxisName}:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${name}
              </span>
            </div>
          `
              : ''
          }

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName || '數值'}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 堆疊柱狀圖詳細資訊主題 - 顯示同一X軸的所有堆疊系列資訊
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getStackedBarDetailConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams | CallbackDataParams[]) => string {
    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      const categoryName = paramsArray[0]?.name || '未知'

      const yAxisLabel = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || 'Y軸'
        : chartOptions?.yAxis?.name || 'Y軸'

      let totalValue = 0
      const seriesData = paramsArray.map(param => {
        let value = 0
        let displayValue = '無資料'
        const seriesName = param.seriesName || '未知系列'
        const color = param.color || '#000'

        if (param.value !== null && param.value !== undefined) {
          if (typeof param.value === 'number') {
            value = param.value
            displayValue = param.value.toLocaleString()
          } else if (Array.isArray(param.value)) {
            const stackedData = param.value as number[]
            if (stackedData.length >= 2) {
              value = stackedData[1]
              displayValue = stackedData[1].toLocaleString()
            } else if (stackedData.length === 1) {
              value = stackedData[0]
              displayValue = stackedData[0].toLocaleString()
            }
          } else if (
            typeof param.data === 'object' &&
            param.data !== null &&
            'value' in param.data
          ) {
            const dataObj = param.data as { value: unknown }
            if (typeof dataObj.value === 'number') {
              value = dataObj.value
              displayValue = dataObj.value.toLocaleString()
            } else if (Array.isArray(dataObj.value)) {
              const stackedData = dataObj.value as number[]
              value = stackedData[stackedData.length - 1] || 0
              displayValue = stackedData[stackedData.length - 1]?.toLocaleString() || '無資料'
            }
          }
        }

        totalValue += value

        return {
          seriesName,
          value,
          displayValue,
          color,
          percentage: 0, // 稍後計算
        }
      })

      // 計算每個系列的百分比
      seriesData.forEach(item => {
        item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
      })

      // 按數值排序（從大到小）
      seriesData.sort((a, b) => b.value - a.value)

      // 生成系列資訊的 HTML
      const seriesRows = seriesData
        .map((item, index) => {
          const isLargest = index === 0
          return `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          padding: 6px 8px;
          border-radius: 4px;
          background: ${item.color}08;
          ${isLargest ? `box-shadow: 0 2px 4px ${item.color}20;` : ''}
        ">
          <div style="display: flex; align-items: center; flex: 1;">
            <div style="
              width: 14px;
              height: 10px;
              border-radius: 2px;
              background-color: ${item.color};
              margin-right: 10px;
              position: relative;
            ">
              <div style="
                width: 10px;
                height: 6px;
                border-radius: 1px;
                background-color: ${tooltipColors.background};
                position: absolute;
                top: 1px;
                left: 1px;
              "></div>
            </div>
            <div style="flex: 1;">
              <div style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
                margin-bottom: 2px;
              ">
                ${item.seriesName}
                ${isLargest ? '<span style="color: ' + item.color + '; font-size: 10px;">⭐</span>' : ''}
              </div>
             
            </div>
          </div>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 14px;
            font-weight: bold;
            margin-left: 12px;
          ">
            ${item.displayValue} 
            
            <div style="
              font-size: 10px;
              color: ${tooltipColors.lightText};
              opacity: 0.7;
            ">
              (${item.percentage.toFixed(1)}%)
            </div>
          </span>
        </div>
      `
        })
        .join('')

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 220px;
        max-width: 300px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 6px;
        ">
          <span style="font-size: 14px;">${categoryName}</span>
        </div>

        <div style="
          max-height: 280px;
          overflow-y: auto;
          margin: 8px 0;
        ">
          ${seriesRows}
        </div>

        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border}40;
          background: ${tooltipColors.border}10;
          padding: 6px 8px;
          border-radius: 4px;
          margin-top: 6px;
        ">
          <span style="
            color: ${tooltipColors.lightText};
            font-size: 11px;
            font-weight: 500;
          ">
            ${yAxisLabel} 總計:
          </span>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 14px;
            font-weight: bold;
          ">
            ${totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    `
    }
  }

  /**
   * 混合折線柱狀圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getMixLineBarConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const seriesType = params.seriesType || 'unknown'

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const iconStyle =
        seriesType === 'line'
          ? `
          width: 12px;
          height: 2px;
          border-radius: 1px;
          margin-right: 8px;
          background-color: ${color};
        `
          : `
          width: 10px;
          height: 10px;
          border-radius: 2px;
          margin-right: 8px;
          background-color: ${color};
        `

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          min-width: 180px;
        ">
          <div style="
            font-weight: bold;
            margin-bottom: 8px;
            color: ${tooltipColors.darkText};
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span>${name}</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; flex: 1;">
              <div style="${iconStyle}"></div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>

            <div style="text-align: right; margin-left: 12px;">
              <div style="
                font-size: 14px;
                font-weight: bold;
                color: ${tooltipColors.darkText};
              ">
                ${value}
              </div>
            </div>
          </div>
        </div>
      `
    }
  }

  /**
   * 混合折線柱狀圖詳細資訊主題 - 顯示同一X軸的所有系列資訊
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getMixLineBarDetailConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams | CallbackDataParams[]) => string {
    void chartOptions

    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      const xAxisName = paramsArray[0]?.name || '未知'

      const seriesData = paramsArray.map(param => {
        let value = '無資料'
        const seriesName = param.seriesName || '未知系列'
        const seriesType = param.seriesType || 'unknown'
        const color = param.color || '#000'

        if (param.value !== null && param.value !== undefined) {
          if (typeof param.value === 'number') {
            value = param.value.toLocaleString()
          } else if (Array.isArray(param.value)) {
            const mixData = param.value as number[]
            if (mixData.length >= 2) {
              value = mixData[1].toLocaleString()
            } else if (mixData.length === 1) {
              value = mixData[0].toLocaleString()
            }
          } else if (
            typeof param.data === 'object' &&
            param.data !== null &&
            'value' in param.data
          ) {
            const dataObj = param.data as { value: unknown }
            if (typeof dataObj.value === 'number') {
              value = dataObj.value.toLocaleString()
            } else if (Array.isArray(dataObj.value)) {
              const mixData = dataObj.value as number[]
              value = mixData[mixData.length - 1]?.toLocaleString() || '無資料'
            }
          }
        }

        return {
          seriesName,
          seriesType,
          value,
          color,
        }
      })

      const lineData = seriesData.filter(item => item.seriesType === 'line')
      const barData = seriesData.filter(item => item.seriesType === 'bar')
      const otherData = seriesData.filter(item => !['line', 'bar'].includes(item.seriesType))

      const renderSeriesGroup = (
        title: string,
        data: typeof seriesData,
        iconType: 'line' | 'bar' | 'other'
      ) => {
        if (data.length === 0) return ''

        const getIcon = (color: string, type: 'line' | 'bar' | 'other') => {
          switch (type) {
            case 'line':
              return `
              <div style="
                width: 16px;
                height: 2px;
                border-radius: 1px;
                background-color: ${color};
                position: relative;
                margin-right: 8px;
              ">
                <div style="
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background-color: ${color};
                  position: absolute;
                  right: -2px;
                  top: -1px;
                "></div>
              </div>
            `
            case 'bar':
              return `
              <div style="
                width: 12px;
                height: 8px;
                border-radius: 2px;
                background-color: ${color};
                margin-right: 8px;
              "></div>
            `
            default:
              return `
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: ${color};
                margin-right: 8px;
              "></div>
            `
          }
        }

        const seriesRows = data
          .map(
            item => `
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          padding: 4px 6px;
          border-radius: 4px;
          background: ${item.color}08;
        ">
          <div style="display: flex; align-items: center; flex: 1;">
            ${getIcon(item.color as string, iconType)}
            <span style="
              font-size: 12px;
              color: ${tooltipColors.lightText};
              font-weight: 500;
            ">
              ${item.seriesName}
            </span>
          </div>
          <span style="
            color: ${tooltipColors.darkText};
            font-size: 13px;
            font-weight: bold;
            margin-left: 12px;
          ">
            ${item.value}
          </span>
        </div>
      `
          )
          .join('')

        return `
        <div style="margin-top: 8px;">
          ${seriesRows}
        </div>
      `
      }

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        max-width: 280px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 6px;
        ">
          <span style="font-size: 14px;">${xAxisName}</span>
        </div>

        <div style="
          max-height: 300px;
          overflow-y: auto;
        ">
          ${renderSeriesGroup('', lineData, 'line')}
          ${renderSeriesGroup('', barData, 'bar')}
          ${otherData.length > 0 ? renderSeriesGroup('', otherData, 'other') : ''}
        </div>
      </div>
    `
    }
  }

  /**
   * 氣泡圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getBubbleConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let xValue = '無資料'
      let yValue = '無資料'

      if (Array.isArray(params.value)) {
        // 數據格式：[x, y, size]
        const bubbleData = params.value as number[]
        xValue = bubbleData[0] !== undefined ? bubbleData[0].toLocaleString() : '無資料'
        yValue = bubbleData[1] !== undefined ? bubbleData[1].toLocaleString() : '無資料'
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        // 數據格式：{value: [x, y, size], name: string}
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const bubbleData = dataObj.value as number[]
          xValue = bubbleData[0] !== undefined ? bubbleData[0].toLocaleString() : '無資料'
          yValue = bubbleData[1] !== undefined ? bubbleData[1].toLocaleString() : '無資料'
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || 'X 軸'
      const yAxisName = Array.isArray(chartOptions?.yAxis)
        ? chartOptions?.yAxis[0]?.name || 'Y 軸'
        : chartOptions?.yAxis?.name || 'Y 軸'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 180px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
            background-color: ${color};
          "></div>
          <span style="
            color: ${tooltipColors.lightText};
            font-weight: 500;
          ">
            ${seriesName}
          </span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 4px 0 0 0;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${xAxisName}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${xValue}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${yValue}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 熱力圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getHeatmapConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let xLabel = '未知'
      let yLabel = '未知'
      let value = '無資料'

      if (Array.isArray(params.value)) {
        // 數據格式：[xIndex, yIndex, value]
        const heatmapData = params.value as [number, number, number]
        const xIndex = heatmapData[0]
        const yIndex = heatmapData[1]
        const dataValue = heatmapData[2]

        // 從軸配置中獲取標籤
        const xAxisData = chartOptions?.xAxis?.data as string[]
        const yAxisData = chartOptions?.yAxis?.data as string[]

        xLabel = xAxisData?.[xIndex] || `X${xIndex}`
        yLabel = yAxisData?.[yIndex] || `Y${yIndex}`
        value =
          dataValue !== undefined && dataValue !== null ? dataValue.toLocaleString() : '無資料'
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        // 數據格式：{value: [xIndex, yIndex, value], ...}
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const heatmapData = dataObj.value as [number, number, number]
          const xIndex = heatmapData[0]
          const yIndex = heatmapData[1]
          const dataValue = heatmapData[2]

          const xAxisData = chartOptions?.xAxis?.data as string[]
          const yAxisData = chartOptions?.yAxis?.data as string[]

          xLabel = xAxisData?.[xIndex] || `X${xIndex}`
          yLabel = yAxisData?.[yIndex] || `Y${yIndex}`
          value =
            dataValue !== undefined && dataValue !== null ? dataValue.toLocaleString() : '無資料'
        }
      }

      const xAxisName = chartOptions?.xAxis?.name || 'X 軸'
      const yAxisName = chartOptions?.yAxis?.name || 'Y 軸'

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
      ">
        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${xAxisName}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${xLabel}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              ${yAxisName}:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${yLabel}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 4px;
            border-top: 1px solid ${tooltipColors.border}40;
          ">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 6px;
                background-color: ${color};
                border: 1px solid ${tooltipColors.border};
              "></div>
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
              ">
                數值:
              </span>
            </div>
            <span style="
              color: ${color};
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 漏斗圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getFunnelConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      // 處理漏斗圖數據
      let name = '未知'
      let value = '無資料'
      let percent = '0%'

      if (params.name) {
        name = params.name
      }

      // 處理數值
      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          }
        }
      }

      // 計算百分比
      if (params.percent !== undefined) {
        percent = `${params.percent.toFixed(1)}%`
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'percent' in params.data
      ) {
        const dataObj = params.data as { percent: unknown }
        if (typeof dataObj.percent === 'number') {
          percent = `${dataObj.percent.toFixed(1)}%`
        }
      }

      // 獲取顏色
      const color = params.color || '#FFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
      ">
        <div style="margin-bottom: 8px;">
          <div style="display: flex; align-items: center;">
            <div style="
              width: 12px;
              height: 8px;
              margin-right: 8px;
              background: linear-gradient(45deg, ${color}, ${color}80);
              clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
            "></div>
            <span style="
              font-size: 12px;
              color: ${tooltipColors.darkText};
              font-weight: 600;
            ">
              ${name}
            </span>
          </div>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              數值:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              占比:
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${percent}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 地圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getMapConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let regionName = '未知地區'
      let value = '無資料'
      let additionalInfo = ''

      if (params.name) {
        regionName = params.name
      }

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          // 如果是數組格式 [經度, 緯度, 數值] 或 [數值, 其他資訊]
          const mapData = params.value as unknown[]
          if (mapData.length >= 1 && typeof mapData[0] === 'number') {
            value = mapData[0].toLocaleString()
          }
          if (mapData.length >= 2 && typeof mapData[1] === 'string') {
            additionalInfo = mapData[1]
          }
        } else if (typeof params.data === 'object' && params.data !== null) {
          const dataObj = params.data as Record<string, unknown>
          if ('value' in dataObj && typeof dataObj.value === 'number') {
            value = dataObj.value.toLocaleString()
          }
          if ('category' in dataObj && typeof dataObj.category === 'string') {
            additionalInfo = dataObj.category
          }
          if ('description' in dataObj && typeof dataObj.description === 'string') {
            additionalInfo = dataObj.description
          }
        }
      }

      const color = params.color || '#FFFF'

      const unit = chartOptions?.series?.[0]?.name || ''

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        max-width: 220px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 12px; font-weight: bold;">${regionName}</span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 2px;
                margin-right: 6px;
                background-color: ${color};
                border: 1px solid ${tooltipColors.border}40;
              "></div>
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
              ">
                數值:
              </span>
            </div>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>

          ${
            unit
              ? `
            <div style="
              display: flex;
              justify-content: center;
              margin-top: 2px;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
                opacity: 0.8;
              ">
                單位: ${unit}
              </span>
            </div>
          `
              : ''
          }

          ${
            additionalInfo
              ? `
            <div style="
              margin-top: 4px;
              padding-top: 4px;
              border-top: 1px solid ${tooltipColors.border}40;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
                font-style: italic;
              ">
                ${additionalInfo}
              </span>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `
    }
  }

  /**
   * K線圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getCandlestickConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const statusColors = ColorManager.getStatusColors()
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let seriesName = ''
      let openPrice = '無資料'
      let closePrice = '無資料'
      let highPrice = '無資料'
      let lowPrice = '無資料'
      let change = '0'
      let changePercent = '0.00%'

      if (params.name) {
        name = params.name
      }

      if (params.seriesName) {
        seriesName = params.seriesName
      }

      // [index, 開盤, 最高, 最低, 收盤]
      if (Array.isArray(params.value)) {
        const candlestickData = params.value as number[]
        if (candlestickData.length >= 4) {
          const open = candlestickData[1] // 開盤價
          const close = candlestickData[2] // 收盤價
          const high = candlestickData[3] // 最高價
          const low = candlestickData[4] // 最低價

          openPrice = open?.toFixed(2) || '無資料'
          highPrice = high?.toFixed(2) || '無資料'
          lowPrice = low?.toFixed(2) || '無資料'
          closePrice = close?.toFixed(2) || '無資料'

          // 計算漲跌 - 收盤價 vs 開盤價
          if (open && close) {
            const changeValue = close - open
            change = changeValue >= 0 ? `+${changeValue.toFixed(2)}` : changeValue.toFixed(2)
            changePercent =
              changeValue >= 0
                ? `+${((changeValue / open) * 100).toFixed(2)}%`
                : `${((changeValue / open) * 100).toFixed(2)}%`
          }
        }
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const candlestickData = dataObj.value as number[]
          if (candlestickData.length >= 4) {
            const open = candlestickData[1]
            const close = candlestickData[2]
            const high = candlestickData[3]
            const low = candlestickData[4]

            openPrice = open?.toFixed(2) || '無資料'
            highPrice = high?.toFixed(2) || '無資料'
            lowPrice = low?.toFixed(2) || '無資料'
            closePrice = close?.toFixed(2) || '無資料'

            if (open && close) {
              const changeValue = close - open
              change = changeValue >= 0 ? `+${changeValue.toFixed(2)}` : changeValue.toFixed(2)
              changePercent =
                changeValue >= 0
                  ? `+${((changeValue / open) * 100).toFixed(2)}%`
                  : `${((changeValue / open) * 100).toFixed(2)}%`
            }
          }
        }
      }

      const changeValue = parseFloat(change.replace('+', ''))
      const isRise = changeValue >= 0
      const trendColor = isRise ? statusColors.success : statusColors.error
      const trendIcon = isRise ? '▲' : '▼'
      const trendText = isRise ? '上漲' : '下跌'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        max-width: 240px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 13px;">${name}</span>
          <span style="
            font-size: 10px;
            font-weight: normal;
            color: ${trendColor};
            background: ${trendColor}15;
            border: 1px solid ${trendColor}40;
            padding: 2px 6px;
            border-radius: 10px;
          ">${trendText}</span>
        </div>

        ${
          seriesName
            ? `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <div style="
                width: 12px;
                height: 8px;
                border: 1px solid ${trendColor};
                margin-right: 8px;
                background-color: ${trendColor};
                position: relative;
              ">
                <div style="
                  width: 1px;
                  height: 14px;
                  background-color: ${trendColor};
                  position: absolute;
                  left: 50%;
                  top: -2px;
                  transform: translateX(-50%);
                "></div>
              </div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.lightText};
                font-weight: 500;
              ">
                ${seriesName}
              </span>
            </div>
          </div>
        `
            : ''
        }

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 0;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            padding: 4px;
            background: ${trendColor}10;
            border-radius: 4px;
          ">
            <span style="
              color: ${trendColor};
              font-size: 12px;
              font-weight: bold;
              display: flex;
              align-items: center;
            ">
              ${trendIcon} ${change}
            </span>
            <span style="
              color: ${trendColor};
              font-size: 11px;
              font-weight: bold;
            ">
              ${changePercent}
            </span>
          </div>

          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 12px;
            padding-top: 4px;
            border-top: 1px solid ${tooltipColors.border}40;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                開盤:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 11px;
                font-weight: bold;
              ">
                ${openPrice}
              </span>
            </div>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                收盤:
              </span>
              <span style="
                color: ${trendColor};
                font-size: 11px;
                font-weight: bold;
              ">
                ${closePrice}
              </span>
            </div>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                最高:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 11px;
                font-weight: bold;
              ">
                ${highPrice}
              </span>
            </div>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 10px;
              ">
                最低:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 11px;
                font-weight: bold;
              ">
                ${lowPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 旭日圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getSunburstConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let percent = '-'

      if (params.name) {
        name = params.name
      }

      let currentValue = 0

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          currentValue = params.value
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          const sunburstData = params.value as number[]
          if (sunburstData.length >= 1) {
            currentValue = sunburstData[0]
            value = sunburstData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            currentValue = dataObj.value
            value = dataObj.value.toLocaleString()
          } else if (Array.isArray(dataObj.value)) {
            const sunburstData = dataObj.value as number[]
            if (sunburstData.length >= 1) {
              currentValue = sunburstData[0]
              value = sunburstData[0]?.toLocaleString() || '無資料'
            }
          }
        }
      }

      if (currentValue > 0) {
        try {
          const series = chartOptions?.series?.[params.seriesIndex || 0]
          if (series && 'data' in series && Array.isArray(series.data)) {
            const calculateTotalValue = (dataArray: Array<Record<string, unknown>>): number => {
              let total = 0

              for (const item of dataArray) {
                if (typeof item === 'object' && item !== null) {
                  if ('value' in item && typeof item.value === 'number') {
                    total += item.value
                  }

                  if ('children' in item && Array.isArray(item.children)) {
                    total += calculateTotalValue(item.children as Array<Record<string, unknown>>)
                  }
                }
              }

              return total
            }

            const totalValue = calculateTotalValue(series.data as Array<Record<string, unknown>>)

            if (totalValue > 0) {
              const percentValue = (currentValue / totalValue) * 100
              percent = `${percentValue.toFixed(1)}%`
            }
          }
        } catch (error) {
          console.warn('旭日圖占比計算失敗:', error)
          percent = '-'
        }
      } else {
        if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'children' in params.data &&
          Array.isArray(params.data.children)
        ) {
          try {
            const children = params.data.children as Array<Record<string, unknown>>
            let childrenTotal = 0

            for (const child of children) {
              if ('value' in child && typeof child.value === 'number') {
                childrenTotal += child.value
              }
            }

            if (childrenTotal > 0) {
              currentValue = childrenTotal
              value = childrenTotal.toLocaleString()

              const series = chartOptions?.series?.[params.seriesIndex || 0]
              if (series && 'data' in series && Array.isArray(series.data)) {
                const calculateTotalValue = (dataArray: Array<Record<string, unknown>>): number => {
                  let total = 0

                  for (const item of dataArray) {
                    if (typeof item === 'object' && item !== null) {
                      if ('value' in item && typeof item.value === 'number') {
                        total += item.value
                      }

                      if ('children' in item && Array.isArray(item.children)) {
                        total += calculateTotalValue(
                          item.children as Array<Record<string, unknown>>
                        )
                      }
                    }
                  }

                  return total
                }

                const totalValue = calculateTotalValue(
                  series.data as Array<Record<string, unknown>>
                )
                if (totalValue > 0) {
                  const percentValue = (childrenTotal / totalValue) * 100
                  percent = `${percentValue.toFixed(1)}%`
                }
              }
            }
          } catch (error) {
            console.warn('旭日圖子節點占比計算失敗:', error)
            percent = '-'
          }
        }
      }

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        max-width: 260px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            background: conic-gradient(from 0deg, ${color}, ${color}80, ${color});
            position: relative;
            border: 1px solid ${color}40;
          ">
            <div style="
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: ${tooltipColors.background};
              position: absolute;
              top: 2px;
              left: 2px;
            "></div>
          </div>
          <span style="font-size: 13px; font-weight: bold;">${name}</span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
          border-top: 1px solid ${tooltipColors.border};
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              數值:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              占比:
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${percent}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 矩形樹圖主題
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getTreemapConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let name = '未知'
      let value = '無資料'
      let percent = '-'
      let parentInfo = ''

      if (params.name) {
        name = params.name
      }

      let currentValue = 0

      if (params.value !== null && params.value !== undefined) {
        if (typeof params.value === 'number') {
          currentValue = params.value
          value = params.value.toLocaleString()
        } else if (Array.isArray(params.value)) {
          const treemapData = params.value as number[]
          if (treemapData.length >= 1) {
            currentValue = treemapData[0]
            value = treemapData[0].toLocaleString()
          }
        } else if (
          typeof params.data === 'object' &&
          params.data !== null &&
          'value' in params.data
        ) {
          const dataObj = params.data as { value: unknown }
          if (typeof dataObj.value === 'number') {
            currentValue = dataObj.value
            value = dataObj.value.toLocaleString()
          }
        }
      }

      if (currentValue > 0) {
        try {
          const series = chartOptions?.series?.[params.seriesIndex || 0]
          if (series && 'data' in series && Array.isArray(series.data)) {
            const calculateTotalValue = (dataArray: Array<Record<string, unknown>>): number => {
              let total = 0

              for (const item of dataArray) {
                if (typeof item === 'object' && item !== null) {
                  if ('value' in item && typeof item.value === 'number') {
                    total += item.value
                  }

                  if ('children' in item && Array.isArray(item.children)) {
                    total += calculateTotalValue(item.children as Array<Record<string, unknown>>)
                  }
                }
              }

              return total
            }

            const findNodeInfo = (
              dataArray: Array<Record<string, unknown>>,
              targetName: string,
              currentLevel: number = 1,
              parentName: string = ''
            ): { level: number; parent: string; parentValue?: number } => {
              for (const item of dataArray) {
                if (typeof item === 'object' && item !== null) {
                  if ('name' in item && item.name === targetName) {
                    let parentValue: number | undefined = undefined

                    if (currentLevel > 1) {
                      const parentData = dataArray.find(
                        p =>
                          typeof p === 'object' &&
                          p !== null &&
                          'children' in p &&
                          Array.isArray(p.children) &&
                          p.children.some(
                            child =>
                              typeof child === 'object' &&
                              child !== null &&
                              'name' in child &&
                              child.name === targetName
                          )
                      )
                      if (
                        parentData &&
                        'value' in parentData &&
                        typeof parentData.value === 'number'
                      ) {
                        parentValue = parentData.value
                      }
                    }

                    return {
                      level: currentLevel,
                      parent: parentName,
                      parentValue,
                    }
                  }

                  if ('children' in item && Array.isArray(item.children)) {
                    const result = findNodeInfo(
                      item.children as Array<Record<string, unknown>>,
                      targetName,
                      currentLevel + 1,
                      item.name as string
                    )
                    if (result.level > 0) return result
                  }
                }
              }
              return { level: 0, parent: '', parentValue: undefined }
            }

            const totalValue = calculateTotalValue(series.data as Array<Record<string, unknown>>)
            const nodeInfo = findNodeInfo(series.data as Array<Record<string, unknown>>, name)

            if (totalValue > 0) {
              const percentValue = (currentValue / totalValue) * 100
              percent = `${percentValue.toFixed(1)}%`
            }

            if (nodeInfo.parent) {
              parentInfo = nodeInfo.parent

              if (nodeInfo.level === 2 && nodeInfo.parentValue && nodeInfo.parentValue > 0) {
                const parentPercent = ((currentValue / nodeInfo.parentValue) * 100).toFixed(1)
                parentInfo += ` (${parentPercent}%)`
              }
            }
          }
        } catch (error) {
          console.warn('Treemap 層級計算失敗:', error)
          percent = '-'
        }
      }

      const color = params.color || '#FFFFFF'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        max-width: 280px;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 8px;
          color: ${tooltipColors.darkText};
          display: flex;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 6px;
        ">
          <div style="
            width: 14px;
            height: 10px;
            border-radius: 2px;
            margin-right: 8px;
            background: linear-gradient(135deg, ${color}, ${color}80);
            border: 1px solid ${color}60;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 6px;
              border-radius: 1px;
              background-color: ${tooltipColors.background};
              position: absolute;
              top: 1px;
              left: 2px;
            "></div>
          </div>
          <span style="font-size: 14px;">${name}</span>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 8px;
        ">
          ${
            parentInfo
              ? `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 11px;
                min-width: 50px;
              ">
                所屬:
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${parentInfo}
              </span>
            </div>
          `
              : ''
          }

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              數值:
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${value}
            </span>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              min-width: 50px;
            ">
              全體占比:
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
              margin-left: 10px;
            ">
              ${percent}
            </span>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 主題河流圖詳細資訊主題 - 顯示同一時間點的所有主題資訊
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getThemeRiverDetailConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams | CallbackDataParams[]) => string {
    void chartOptions

    return (params: CallbackDataParams | CallbackDataParams[]) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const paramsArray = Array.isArray(params) ? params : [params]

      if (paramsArray.length === 0) return ''

      let dateValue = '未知時間'
      if (paramsArray[0] && Array.isArray(paramsArray[0].value)) {
        const themeRiverData = paramsArray[0].value as [string, number, string]
        dateValue = themeRiverData[0] || '未知時間'
      }

      const seriesData = paramsArray
        .map(param => {
          let themeName = '未知主題'
          let value = 0
          let displayValue = '無資料'
          const color = param.color || '#000'

          if (Array.isArray(param.value)) {
            // Theme River 數據格式：[date, value, name]
            const themeRiverData = param.value as [string, number, string]
            themeName = themeRiverData[2] || '未知主題'
            value = themeRiverData[1] || 0
            displayValue = value.toLocaleString()
          }

          return {
            themeName,
            value,
            displayValue,
            color,
            percentage: 0,
          }
        })
        .filter(item => item.value > 0)

      const totalValue = seriesData.reduce((sum, item) => sum + item.value, 0)

      seriesData.forEach(item => {
        item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
      })

      seriesData.sort((a, b) => b.value - a.value)

      const themeRows = seriesData
        .map((item, index) => {
          const isLargest = index === 0
          const barWidth = totalValue > 0 ? (item.value / totalValue) * 100 : 0

          return `
        <div style="
          margin: 6px 0;
          padding: 8px;
          border-radius: 6px;
          background: ${item.color}08;
          ${isLargest ? `border: 1px solid ${item.color}40; box-shadow: 0 2px 4px ${item.color}20;` : ''}
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          ">
            <div style="display: flex; align-items: center; flex: 1;">
              <div style="
                width: 14px;
                height: 10px;
                border-radius: 2px;
                background-color: ${item.color};
                margin-right: 8px;
                position: relative;
              ">
                <div style="
                  width: 10px;
                  height: 6px;
                  border-radius: 1px;
                  background-color: ${tooltipColors.background};
                  position: absolute;
                  top: 1px;
                  left: 1px;
                "></div>
              </div>
              <span style="
                font-size: 12px;
                color: ${tooltipColors.darkText};
                font-weight: 600;
              ">
                ${item.themeName}
                ${isLargest ? '<span style="color: ' + item.color + '; font-size: 10px; margin-left: 4px;">⭐</span>' : ''}
              </span>
            </div>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 13px;
              font-weight: bold;
              margin-left: 12px;
            ">
              ${item.displayValue}
            </span>
            <span style="
              font-size: 10px;
              color: ${tooltipColors.lightText};
              opacity: 0.7;
              margin-left: 8px;
            ">
              (${item.percentage.toFixed(1)}%)
            </span>
          </div>
          
          <!-- 進度條 -->
          <div style="
            height: 4px;
            background: ${tooltipColors.border}20;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 4px;
          ">
            <div style="
              height: 100%;
              width: ${barWidth}%;
              background: linear-gradient(90deg, ${item.color}, ${item.color}80);
              border-radius: 2px;
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>
      `
        })
        .join('')

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 260px;
      ">
        <!-- 標題區域 -->
        <div style="
          font-weight: bold;
          margin-bottom: 10px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 8px;
        ">
          <div style="display: flex; align-items: center;">
            <div style="
              width: 4px;
              height: 16px;
              background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
              border-radius: 2px;
              margin-right: 8px;
            "></div>
            <span style="font-size: 14px;">${dateValue}</span>
          </div>
        </div>

        <!-- 主題列表 -->
        <div style="
          max-height: 320px;
          overflow-y: auto;
          margin-top: 8px;
        ">
          ${themeRows}
        </div>
      </div>
    `
    }
  }

  /**
   * 箱線圖主題 - 顯示統計資訊
   * @param isDark 是否為深色主題
   * @param chartOptions 圖表配置
   * @returns Tooltip 配置函數
   */
  private getBoxplotConfig(
    isDark: boolean,
    chartOptions: ExtendedEChartsOption
  ): (params: CallbackDataParams) => string {
    void chartOptions

    return (params: CallbackDataParams) => {
      const tooltipColors = ColorManager.getTooltipColors(isDark)

      let categoryName = '未知'
      let min = '無資料'
      let q1 = '無資料'
      let median = '無資料'
      let q3 = '無資料'
      let max = '無資料'
      let iqr = '無資料'
      let range = '無資料'

      if (params.name) {
        categoryName = params.name
      }

      // 箱線圖數據格式：[min, Q1, median, Q3, max] 或 [x, min, Q1, median, Q3, max]
      if (Array.isArray(params.value)) {
        const boxplotData = params.value as number[]

        // 判斷是否包含 x 座標
        const hasXCoord = boxplotData.length === 6
        const offset = hasXCoord ? 1 : 0

        if (boxplotData.length >= 5 + offset) {
          const minValue = boxplotData[0 + offset]
          const q1Value = boxplotData[1 + offset]
          const medianValue = boxplotData[2 + offset]
          const q3Value = boxplotData[3 + offset]
          const maxValue = boxplotData[4 + offset]

          min = minValue?.toFixed(2) || '無資料'
          q1 = q1Value?.toFixed(2) || '無資料'
          median = medianValue?.toFixed(2) || '無資料'
          q3 = q3Value?.toFixed(2) || '無資料'
          max = maxValue?.toFixed(2) || '無資料'

          // 計算四分位距 (IQR = Q3 - Q1)
          if (q3Value !== undefined && q1Value !== undefined) {
            const iqrValue = q3Value - q1Value
            iqr = iqrValue.toFixed(2)
          }

          // 計算全距 (Range = Max - Min)
          if (maxValue !== undefined && minValue !== undefined) {
            const rangeValue = maxValue - minValue
            range = rangeValue.toFixed(2)
          }
        }
      } else if (
        typeof params.data === 'object' &&
        params.data !== null &&
        'value' in params.data
      ) {
        const dataObj = params.data as { value: unknown }
        if (Array.isArray(dataObj.value)) {
          const boxplotData = dataObj.value as number[]
          const hasXCoord = boxplotData.length === 6
          const offset = hasXCoord ? 1 : 0

          if (boxplotData.length >= 5 + offset) {
            const minValue = boxplotData[0 + offset]
            const q1Value = boxplotData[1 + offset]
            const medianValue = boxplotData[2 + offset]
            const q3Value = boxplotData[3 + offset]
            const maxValue = boxplotData[4 + offset]

            min = minValue?.toFixed(2) || '無資料'
            q1 = q1Value?.toFixed(2) || '無資料'
            median = medianValue?.toFixed(2) || '無資料'
            q3 = q3Value?.toFixed(2) || '無資料'
            max = maxValue?.toFixed(2) || '無資料'

            if (q3Value !== undefined && q1Value !== undefined) {
              const iqrValue = q3Value - q1Value
              iqr = iqrValue.toFixed(2)
            }

            if (maxValue !== undefined && minValue !== undefined) {
              const rangeValue = maxValue - minValue
              range = rangeValue.toFixed(2)
            }
          }
        }
      }

      const color = params.color || '#667eea'

      return `
      <div style="
        background: ${tooltipColors.background};
        border: 1px solid ${tooltipColors.border};
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 240px;
        max-width: 300px;
      ">
        <!-- 標題區域 -->
        <div style="
          font-weight: bold;
          margin-bottom: 10px;
          color: ${tooltipColors.darkText};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${tooltipColors.border};
          padding-bottom: 8px;
        ">
          <div style="display: flex; align-items: center;">
            <div style="
              width: 4px;
              height: 16px;
              background: linear-gradient(180deg, ${color} 0%, ${color}80 100%);
              border-radius: 2px;
              margin-right: 8px;
            "></div>
            <span style="font-size: 14px;">${categoryName}</span>
          </div>
        </div>

        <!-- 統計數據 -->
        <div style="
          display: flex;
          flex-direction: column;
          gap: 6px;
        ">
          <!-- 最大值 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${tooltipColors.border}05;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 8px;
                height: 1px;
                background: ${color};
                margin-right: 6px;
              "></span>
              最大值
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${max}
            </span>
          </div>

          <!-- Q3 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${color}08;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
            ">
              第三四分位數 (Q3)
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${q3}
            </span>
          </div>

          <!-- 中位數 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            border-radius: 4px;
            background: ${color}15;
            border: 1px solid ${color}40;
          ">
            <span style="
              color: ${color};
              font-size: 11px;
              font-weight: 600;
            ">
              中位數 (Median)
            </span>
            <span style="
              color: ${color};
              font-size: 13px;
              font-weight: bold;
            ">
              ${median}
            </span>
          </div>

          <!-- Q1 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${color}08;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
            ">
              第一四分位數 (Q1)
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${q1}
            </span>
          </div>

          <!-- 最小值 -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: ${tooltipColors.border}05;
          ">
            <span style="
              color: ${tooltipColors.lightText};
              font-size: 11px;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 8px;
                height: 1px;
                background: ${color};
                margin-right: 6px;
              "></span>
              最小值
            </span>
            <span style="
              color: ${tooltipColors.darkText};
              font-size: 12px;
              font-weight: bold;
            ">
              ${min}
            </span>
          </div>
        </div>

        <!-- 統計指標 -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          border-top: 1px solid ${tooltipColors.border}40;
        ">
          <div style="
            text-align: center;
            padding-top: 6px;
            background: ${tooltipColors.border}05;
            border-radius: 4px;
          ">
            <div style="
              font-size: 9px;
              color: ${tooltipColors.lightText};
              margin-bottom: 2px;
            ">
              四分位距 (IQR)
            </div>
            <div style="
              font-size: 12px;
              font-weight: bold;
              color: ${tooltipColors.darkText};
            ">
              ${iqr}
            </div>
          </div>
          
          <div style="
            text-align: center;
            padding-top: 6px;
            background: ${tooltipColors.border}05;
            border-radius: 4px;
          ">
            <div style="
              font-size: 9px;
              color: ${tooltipColors.lightText};
              margin-bottom: 2px;
            ">
              全距 (Range)
            </div>
            <div style="
              font-size: 12px;
              font-weight: bold;
              color: ${tooltipColors.darkText};
            ">
              ${range}
            </div>
          </div>
        </div>
      </div>
    `
    }
  }

  /**
   * 預設配置
   * @returns Tooltip 配置函數
   */
  private getDefaultConfig(): (params: CallbackDataParams) => null {
    return (params: CallbackDataParams) => {
      void params
      return null
    }
  }
}
