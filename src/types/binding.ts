export enum BindingType {
  TOGGLE_COLUMN = 'toggleColumn',
  FILTER_TABLE = 'filterTable',
  SORT_TABLE = 'sortTable',
}

export type BindingConfig = {
  id: string;
};

export type ComponentBinding = {
  id: string;
  sourceId: string;
  targetId: string;
  type: BindingType;
  config: BindingConfig;
};

export type BindingsState = ComponentBinding[];
