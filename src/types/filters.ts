export type filterType =
  | 'date'
  | 'dateRange'
  | 'singleSelect'
  | 'multiSelect'
  | 'number'
  | 'numberRange'
  | 'text'

export interface filterOption {
  label: string
  type: filterType
  apiParam: string | { start: string; end: string }
  default:
    | string
    | string[]
    | number
    | { start: number; end: number }
    | { start: string; end: string }
  unit: string
  quickSelect?: { label: string; value: number[] | string }[]
  placeholder?: string | { start: string; end: string }
  options?: { label: string; value: string | number }[]
}
