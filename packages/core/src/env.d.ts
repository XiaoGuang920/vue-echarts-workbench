/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_PRIMARY_COLOR?: string
  readonly VITE_INFO_COLOR?: string
  readonly VITE_SUCCESS_COLOR?: string
  readonly VITE_WARNING_COLOR?: string
  readonly VITE_DANGER_COLOR?: string
  readonly VITE_DARK_PRIMARY_COLOR?: string
  readonly VITE_DARK_INFO_COLOR?: string
  readonly VITE_DARK_SUCCESS_COLOR?: string
  readonly VITE_DARK_WARNING_COLOR?: string
  readonly VITE_DARK_DANGER_COLOR?: string
  readonly VITE_COLOR_1?: string
  readonly VITE_COLOR_2?: string
  readonly VITE_COLOR_3?: string
  readonly VITE_COLOR_4?: string
  readonly VITE_COLOR_5?: string
  readonly VITE_COLOR_6?: string
  readonly VITE_COLOR_7?: string
  readonly VITE_COLOR_8?: string
  readonly VITE_COLOR_9?: string
  readonly VITE_COLOR_10?: string
  readonly VITE_DARK_COLOR_1?: string
  readonly VITE_DARK_COLOR_2?: string
  readonly VITE_DARK_COLOR_3?: string
  readonly VITE_DARK_COLOR_4?: string
  readonly VITE_DARK_COLOR_5?: string
  readonly VITE_DEFAULT_THEME_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
