export enum BindingType {
  TOGGLE_COLUMN = 'toggleColumn',
  FILTER_TABLE = 'filterTable',
  SORT_TABLE = 'sortTable',
}

export interface ToggleColumnConfig {
  accessorKey: string;
  defaultVisible: boolean;
}

export interface FilterTableConfig {
  id: string;
}

export interface SortTableConfig {
  id: string;
}

export type BindingConfig =
  | ToggleColumnConfig
  | FilterTableConfig
  | SortTableConfig;

export interface ComponentBinding {
  id: string;
  sourceId: string;
  targetId: string;
  type: BindingType;
  config: BindingConfig;
}

export type BindingsState = ComponentBinding[];
