export enum BindingType {
  TOGGLE_COLUMN = 'toggleColumn',
  FILTER_TABLE = 'filterTable',
  SORT_TABLE = 'sortTable',
  TABLE_ACTION = 'tableAction',
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
