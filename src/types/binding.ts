export enum BindingType {
  TOGGLE_COLUMN = 'toggleColumn',
  FILTER_TABLE = 'filterTable',
  SORT_TABLE = 'sortTable',
  VIEW_TABLE_ROW = 'viewTableRow',
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

export interface ViewTableRowConfig {
  displayFields: string[];
  allowEdit: boolean;
  allowDelete: boolean;
}

export type BindingConfig =
  | ToggleColumnConfig
  | FilterTableConfig
  | SortTableConfig
  | ViewTableRowConfig;

export interface ComponentBinding {
  id: string;
  sourceId: string;
  targetId: string;
  type: BindingType;
  config: BindingConfig;
}

export type BindingsState = ComponentBinding[];
