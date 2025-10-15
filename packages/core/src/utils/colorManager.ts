/**
 * 顏色配置管理工具
 */
export class ColorManager {
  /**
   * 取得主要顏色調色盤
   */
  static getPrimaryPalette() {
    return {
      primary: '#3B82F6',
      light: '#60A5FA',
      dark: '#1D4ED8',
      lighter: '#DBEAFE',
      darker: '#1E3A8A',
    }
  }

  /**
   * 取得次要顏色調色盤
   */
  static getSecondaryPalette() {
    return {
      secondary: '#10B981',
      light: '#34D399',
      dark: '#059669',
      lighter: '#D1FAE5',
      darker: '#064E3B',
    }
  }

  /**
   * 取得強調色調色盤
   */
  static getAccentColors() {
    return {
      accent: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      lighter: '#FEF3C7',
      darker: '#92400E',
    }
  }

  /**
   * 取得圖表系列顏色
   */
  static getChartSeriesColors(): string[] {
    return [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
      '#F97316',
      '#84CC16',
      '#EC4899',
      '#6366F1',
    ]
  }

  /**
   * 取得地圖漸層顏色
   */
  static getMapGradientColors(): string[] {
    return ['#E0F3F8', '#91BFDB', '#4575B4', '#0868AC', '#023858']
  }

  /**
   * 取得狀態顏色
   */
  static getStatusColors() {
    return {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  }

  /**
   * 取得主題顏色
   */
  static getThemeColors(isDark: boolean = false) {
    if (isDark) {
      return {
        background: '#1F2937',
        text: '#F9FAFB',
        grid: '#374151',
        axis: '#6B7280',
        shadow: 'rgba(0, 0, 0, 0.6)',
      }
    } else {
      return {
        background: '#FFFFFF',
        text: '#374151',
        grid: '#F3F4F6',
        axis: '#9CA3AF',
        shadow: 'rgba(0, 0, 0, 0.2)',
      }
    }
  }

  /**
   * 取得 Tooltip 顏色
   */
  static getTooltipColors(isDark: boolean = false) {
    if (isDark) {
      return {
        lightText: '#F9FAFB',
        darkText: '#E5E7EB',
        background: 'rgba(0, 0, 0, 0.85)',
        border: '#222831',
      }
    } else {
      return {
        lightText: '#374151',
        darkText: '#333446',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '#E5E7EB',
      }
    }
  }

  /**
   * 取得指定索引的圖表顏色
   */
  static getChartColor(index: number): string {
    const colors = this.getChartSeriesColors()
    return colors[index % colors.length]
  }

  /**
   * 取得漸層顏色 (用於地圖 visualMap)
   */
  static getGradientColor(percentage: number): string {
    const colors = this.getMapGradientColors()
    const index = Math.floor(percentage * (colors.length - 1))
    return colors[Math.min(index, colors.length - 1)]
  }
}
