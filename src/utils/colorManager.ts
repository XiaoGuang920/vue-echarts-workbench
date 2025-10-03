/**
 * 顏色配置管理工具
 */
export class ColorManager {
  /**
   * 取得主要顏色調色盤
   */
  static getPrimaryPalette() {
    return {
      primary: import.meta.env.VITE_COLOR_PRIMARY || '#3B82F6',
      light: import.meta.env.VITE_COLOR_PRIMARY_LIGHT || '#60A5FA',
      dark: import.meta.env.VITE_COLOR_PRIMARY_DARK || '#1D4ED8',
      lighter: import.meta.env.VITE_COLOR_PRIMARY_LIGHTER || '#DBEAFE',
      darker: import.meta.env.VITE_COLOR_PRIMARY_DARKER || '#1E3A8A',
    }
  }

  /**
   * 取得次要顏色調色盤
   */
  static getSecondaryPalette() {
    return {
      secondary: import.meta.env.VITE_COLOR_SECONDARY || '#10B981',
      light: import.meta.env.VITE_COLOR_SECONDARY_LIGHT || '#34D399',
      dark: import.meta.env.VITE_COLOR_SECONDARY_DARK || '#059669',
      lighter: import.meta.env.VITE_COLOR_SECONDARY_LIGHTER || '#D1FAE5',
      darker: import.meta.env.VITE_COLOR_SECONDARY_DARKER || '#064E3B',
    }
  }

  /**
   * 取得強調色調色盤
   */
  static getAccentColors() {
    return {
      accent: import.meta.env.VITE_COLOR_ACCENT || '#F59E0B',
      light: import.meta.env.VITE_COLOR_ACCENT_LIGHT || '#FBBF24',
      dark: import.meta.env.VITE_COLOR_ACCENT_DARK || '#D97706',
      lighter: import.meta.env.VITE_COLOR_ACCENT_LIGHTER || '#FEF3C7',
      darker: import.meta.env.VITE_COLOR_ACCENT_DARKER || '#92400E',
    }
  }

  /**
   * 取得圖表系列顏色
   */
  static getChartSeriesColors(): string[] {
    return [
      import.meta.env.VITE_CHART_COLOR_1 || '#3B82F6',
      import.meta.env.VITE_CHART_COLOR_2 || '#10B981',
      import.meta.env.VITE_CHART_COLOR_3 || '#F59E0B',
      import.meta.env.VITE_CHART_COLOR_4 || '#EF4444',
      import.meta.env.VITE_CHART_COLOR_5 || '#8B5CF6',
      import.meta.env.VITE_CHART_COLOR_6 || '#06B6D4',
      import.meta.env.VITE_CHART_COLOR_7 || '#F97316',
      import.meta.env.VITE_CHART_COLOR_8 || '#84CC16',
      import.meta.env.VITE_CHART_COLOR_9 || '#EC4899',
      import.meta.env.VITE_CHART_COLOR_10 || '#6366F1',
    ]
  }

  /**
   * 取得地圖漸層顏色
   */
  static getMapGradientColors(): string[] {
    return [
      import.meta.env.VITE_MAP_COLOR_MIN || '#E0F3F8',
      import.meta.env.VITE_MAP_COLOR_LOW || '#91BFDB',
      import.meta.env.VITE_MAP_COLOR_MID || '#4575B4',
      import.meta.env.VITE_MAP_COLOR_HIGH || '#0868AC',
      import.meta.env.VITE_MAP_COLOR_MAX || '#023858',
    ]
  }

  /**
   * 取得狀態顏色
   */
  static getStatusColors() {
    return {
      success: import.meta.env.VITE_COLOR_SUCCESS || '#10B981',
      warning: import.meta.env.VITE_COLOR_WARNING || '#F59E0B',
      error: import.meta.env.VITE_COLOR_ERROR || '#EF4444',
      info: import.meta.env.VITE_COLOR_INFO || '#3B82F6',
    }
  }

  /**
   * 取得主題顏色
   */
  static getThemeColors(isDark: boolean = false) {
    if (isDark) {
      return {
        background: import.meta.env.VITE_THEME_DARK_BG || '#1F2937',
        text: import.meta.env.VITE_THEME_DARK_TEXT || '#F9FAFB',
        grid: import.meta.env.VITE_THEME_DARK_GRID || '#374151',
        axis: import.meta.env.VITE_THEME_DARK_AXIS || '#6B7280',
        shadow: import.meta.env.VITE_THEME_DARK_SHADOW || 'rgba(0, 0, 0, 0.6)',
      }
    } else {
      return {
        background: import.meta.env.VITE_THEME_LIGHT_BG || '#FFFFFF',
        text: import.meta.env.VITE_THEME_LIGHT_TEXT || '#374151',
        grid: import.meta.env.VITE_THEME_LIGHT_GRID || '#F3F4F6',
        axis: import.meta.env.VITE_THEME_LIGHT_AXIS || '#9CA3AF',
        shadow: import.meta.env.VITE_THEME_LIGHT_SHADOW || 'rgba(0, 0, 0, 0.2)',
      }
    }
  }

  /**
   * 取得 Tooltip 顏色
   */
  static getTooltipColors(isDark: boolean = false) {
    if (isDark) {
      return {
        lightText: import.meta.env.VITE_TOOLTIP_TEXT_DARK_LIGHTER || '#F9FAFB',
        darkText: import.meta.env.VITE_TOOLTIP_TEXT_DARK_DARKER || '#E5E7EB',
        background: import.meta.env.VITE_TOOLTIP_BG_DARK || 'rgba(0, 0, 0, 0.85)',
        border: import.meta.env.VITE_TOOLTIP_BORDER_DARK || '#222831',
      }
    } else {
      return {
        lightText: import.meta.env.VITE_TOOLTIP_TEXT_LIGHT_LIGHTER || '#374151',
        darkText: import.meta.env.VITE_TOOLTIP_TEXT_LIGHT_DARKER || '#333446',
        background: import.meta.env.VITE_TOOLTIP_BG_LIGHT || 'rgba(255, 255, 255, 0.95)',
        border: import.meta.env.VITE_TOOLTIP_BORDER_LIGHT || '#E5E7EB',
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
