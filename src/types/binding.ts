export enum BindingType {
  TOGGLE_COLUMN = 'toggleColumn',
  FILTER_TABLE = 'filterTable',
  SORT_TABLE = 'sortTable',
  ADD_TABLE_ROW = 'addTableRow',
  UPDATE_TABLE_ROW = 'updateTableRow',
  DELETE_TABLE_ROW = 'deleteTableRow',
}

export type BindingConfig = {
  id: string;
  fieldMappings?: Record<string, string>; // Maps card input/select IDs to table column names
};

export type ComponentBinding = {
  id: string;
  sourceId: string;
  targetId: string;
  type: BindingType;
  config: BindingConfig;
};

export type BindingsState = ComponentBinding[];
