import type { ExtendedEChartsOption } from '@/types/echarts'
import { ColorManager } from '@/utils/colorManager'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

/**
 * Tooltip 處理器
 */
export class TooltipProcessor {
  /**
   * 圖表配置
   */
  private chartOptions: ExtendedEChartsOption | null = null
  /**
   * X 軸單位
   */
  private xAxisUnit: string = ''
  /**
   * Y 軸單位
   */
  private yAxisUnit: string = ''

  /**
   * 處理圖表 Tooltip 配置
   * @param options 圖表配置
   * @returns 處理後的圖表配置
   */
  process(options: ExtendedEChartsOption): ExtendedEChartsOption {
    if (!options.tooltipType) return options

    this.chartOptions = options

    const tooltipFormatter = this.getTooltipFormatter(options.tooltipType)

    const tooltipOptions = {
      trigger: options.tooltip?.trigger || 'item',
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

  /**
   * 根據類型取得 Tooltip 配置
   * @param tooltipType Tooltip 類型
   * @returns Tooltip 配置函數
   */
  private getTooltipFormatter(tooltipType: string): (params: CallbackDataParams) => string | null {
    switch (tooltipType) {
      case 'lineLight':
        return this.getLineConfig(false)
      case 'lineDark':
        return this.getLineConfig(true)
      case 'lineSectionsLight':
        return this.getLineConfig(false)
      case 'lineSectionsDark':
        return this.getLineConfig(true)
      case 'barLight':
        return this.getBarConfig(false)
      case 'barDark':
        return this.getBarConfig(true)
      case 'pieLight':
        return this.getPieConfig(false)
      case 'pieDark':
        return this.getPieConfig(true)
      case 'scatterLight':
        return this.getScatterConfig(false)
      case 'scatterDark':
        return this.getScatterConfig(true)
      case 'horizontalBarLight':
        return this.getHorizontalBarConfig(false)
      case 'horizontalBarDark':
        return this.getHorizontalBarConfig(true)
      case 'radarLight':
        return this.getRadarConfig(false)
      case 'radarDark':
        return this.getRadarConfig(true)
      case 'stackedBarLight':
        return this.getStackedBarConfig(false)
      case 'stackedBarDark':
        return this.getStackedBarConfig(true)
      case 'mixLineBarLight':
        return this.getMixLineBarConfig(false)
      case 'mixLineBarDark':
        return this.getMixLineBarConfig(true)
      case 'bubbleLight':
        return this.getBubbleConfig(false)
      case 'bubbleDark':
        return this.getBubbleConfig(true)
      case 'heatmapLight':
        return this.getHeatmapConfig(false)
      case 'heatmapDark':
        return this.getHeatmapConfig(true)
      case 'funnelLight':
        return this.getFunnelConfig(false)
      case 'funnelDark':
        return this.getFunnelConfig(true)
      case 'mapLight':
        return this.getMapConfig(false)
      case 'mapDark':
        return this.getMapConfig(true)
      default:
        return this.getDefaultConfig()
    }
  }

  /**
   * 取得 X 軸單位
   * @returns X 軸單位
   */
  private getXAxisUnit(): void {
    this.xAxisUnit = this.chartOptions?.xAxis?.name || ''
  }

  /**
   * 取得 Y 軸單位
   * @returns Y 軸單位
   */
  private getYAxisUnit(): void {
    this.yAxisUnit = this.chartOptions?.yAxis?.name || ''
  }

  /**
   * 折線圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getLineConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getYAxisUnit()

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const unit = this.yAxisUnit

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="font-weight: bold; margin-bottom: 5px; color: ${tooltipColors.darkText}">${name}</div>
          <div style="display: flex; align-items: center;">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            <span style="font-size: 14px; color: ${tooltipColors.lightText};">
              <span style="font-weight: bold;">${seriesName}</span>：${value} ${unit}
            </span>
          </div>
        </div>
      `
    }
  }

  /**
   * 柱狀圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getBarConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getYAxisUnit()

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const unit = this.yAxisUnit

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="display: flex; align-items: center; font-weight: bold; margin-bottom: 5px; color: ${tooltipColors.darkText}">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            ${name}
          </div>
          <div style="display: flex; align-items: center;">
            <span style="font-size: 14px; color: ${tooltipColors.lightText};">
              <span style="font-weight: bold;">${seriesName}</span>：${value} ${unit}
            </span>
          </div>
        </div>
      `
    }
  }

  /**
   * 圓餅圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getPieConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getYAxisUnit()

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="font-weight: bold; margin-bottom: 5px; color: ${tooltipColors.darkText}">${name}</div>
          <div style="display: flex; align-items: center;">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            <span style="font-size: 14px; color: ${tooltipColors.lightText};">
              ${value}
            </span>
          </div>
        </div>
      `
    }
  }

  /**
   * 散點圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getScatterConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getYAxisUnit()

    return (params: CallbackDataParams) => {
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const unit = this.yAxisUnit

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="display: flex; align-items: center;">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            <span style="font-size: 14px; color: ${tooltipColors.lightText};">
              <span style="font-weight: bold;">${seriesName}</span>：${value} ${unit}
            </span>
          </div>
        </div>
      `
    }
  }

  /**
   * 橫向柱狀圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getHorizontalBarConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getXAxisUnit()

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const unit = this.xAxisUnit

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="font-weight: bold; margin-bottom: 5px; color: ${tooltipColors.darkText}">${name}</div>
          <div style="display: flex; align-items: center;">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            <span style="font-size: 14px; color: ${tooltipColors.lightText};">
              <span style="font-weight: bold;">${seriesName}</span>：${value} ${unit}
            </span>
          </div>
        </div>
      `
    }
  }

  /**
   * 雷達圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getRadarConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getYAxisUnit()

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const color = params.color || '#000'

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      const radarOption = this.chartOptions?.radar
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
          name: indicator.name || `座標 ${index + 1}`,
          value: dataValues[index] !== undefined ? dataValues[index].toLocaleString() : '無資料',
          max: indicator.max || 100,
        })
      )

      const dataRows = radarData
        .map(
          (item: { name: string; value: string; max: number }) => `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 3px 0;
              padding: 2px 0;
            ">
              <span style="
                color: ${tooltipColors.lightText};
                font-size: 12px;
                min-width: 60px;
              ">
                ${item.name}
              </span>
              <span style="
                color: ${tooltipColors.darkText};
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
              ">
                ${item.value}
              </span>
            </div>
          `
        )
        .join('')

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="display: flex; align-items: center; font-weight: bold; margin-bottom: 5px; color: ${tooltipColors.darkText}">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            ${name}
          </div>
          <div>
            ${dataRows}
          </div>
        </div>
      `
    }
  }

  /**
   * 堆疊柱狀圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getStackedBarConfig(isDark: boolean): (params: CallbackDataParams) => string {
    this.getYAxisUnit()

    return (params: CallbackDataParams) => {
      const name = params.name || '未知'
      const value =
        params.value === 0 || params.value === null || params.value === undefined
          ? '無資料'
          : params.value.toLocaleString()
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''
      const unit = this.yAxisUnit

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      return `
        <div style="
          background: ${tooltipColors.background};
          border: 1px solid ${tooltipColors.border};
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        ">
          <div style="font-weight: bold; margin-bottom: 5px; color: ${tooltipColors.darkText}">
            ${name}
          </div>
          <div style="display: flex; align-items: center;">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              text-align: center;
              background-color: ${color};
            "></div>
            <span style="font-size: 14px; color: ${tooltipColors.lightText};">
              <span style="font-weight: bold;">${seriesName}</span>：${value} ${unit}
            </span>
          </div>
        </div>
      `
    }
  }

  /**
   * 混合折線柱狀圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getMixLineBarConfig(isDark: boolean): (params: CallbackDataParams) => string {
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
      const typeDisplay = seriesType === 'line' ? '折線' : seriesType === 'bar' ? '柱狀' : '未知'

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
            <span style="
              font-size: 10px;
              font-weight: normal;
              color: ${color};
              background: ${color}15;
              border: 1px solid ${color}40;
              padding: 2px 6px;
              border-radius: 10px;
            ">${typeDisplay}</span>
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
   * 氣泡圖主題
   * @param isDark 是否為深色主題
   * @returns Tooltip 配置函數
   */
  private getBubbleConfig(isDark: boolean): (params: CallbackDataParams) => string {
    return (params: CallbackDataParams) => {
      const color = params.color || '#000'
      const seriesName = params.seriesName || ''

      const tooltipColors = ColorManager.getTooltipColors(isDark)

      // 處理氣泡圖的三維數據：[x, y, size]
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

      const xAxisName = this.chartOptions?.xAxis?.name || 'X 軸'
      const yAxisName = Array.isArray(this.chartOptions?.yAxis)
        ? this.chartOptions?.yAxis[0]?.name || 'Y 軸'
        : this.chartOptions?.yAxis?.name || 'Y 軸'

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
   * @returns Tooltip 配置函數
   */
  private getHeatmapConfig(isDark: boolean): (params: CallbackDataParams) => string {
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
        const xAxisData = this.chartOptions?.xAxis?.data as string[]
        const yAxisData = this.chartOptions?.yAxis?.data as string[]

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

          const xAxisData = this.chartOptions?.xAxis?.data as string[]
          const yAxisData = this.chartOptions?.yAxis?.data as string[]

          xLabel = xAxisData?.[xIndex] || `X${xIndex}`
          yLabel = yAxisData?.[yIndex] || `Y${yIndex}`
          value =
            dataValue !== undefined && dataValue !== null ? dataValue.toLocaleString() : '無資料'
        }
      }

      const xAxisName = this.chartOptions?.xAxis?.name || 'X 軸'
      const yAxisName = this.chartOptions?.yAxis?.name || 'Y 軸'

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
   * @returns Tooltip 配置函數
   */
  private getFunnelConfig(isDark: boolean): (params: CallbackDataParams) => string {
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
  private getMapConfig(isDark: boolean): (params: CallbackDataParams) => string {
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

      const unit = this.chartOptions?.series?.[0]?.name || ''

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
