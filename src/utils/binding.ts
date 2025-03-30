import {
  BindingType,
  BindingConfig,
  ToggleColumnConfig,
  FilterTableConfig,
  SortTableConfig,
  ViewTableRowConfig,
} from '@/types/binding';

export function isToggleColumnConfig(
  config: BindingConfig
): config is ToggleColumnConfig {
  return 'accessorKey' in config && 'defaultVisible' in config;
}

export function isFilterTableConfig(
  config: BindingConfig
): config is FilterTableConfig {
  return (
    'columnId' in config && 'filterType' in config && 'caseSensitive' in config
  );
}

export function isSortTableConfig(
  config: BindingConfig
): config is SortTableConfig {
  return 'columnId' in config && 'direction' in config;
}

export function isViewTableRowConfig(
  config: BindingConfig
): config is ViewTableRowConfig {
  return (
    'displayFields' in config &&
    'allowEdit' in config &&
    'allowDelete' in config
  );
}

export function createDefaultBindingConfig(type: BindingType): BindingConfig {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
      return {
        accessorKey: '',
        defaultVisible: true,
      };
    case BindingType.FILTER_TABLE:
      return {
        columnId: '',
        filterType: 'contains' as const,
        caseSensitive: false,
      };
    case BindingType.SORT_TABLE:
      return {
        columnId: '',
        direction: 'asc' as const,
      };
    case BindingType.VIEW_TABLE_ROW:
      return {
        displayFields: [],
        allowEdit: true,
        allowDelete: true,
      };
  }
}

export function getCompatibleSourceComponents(type: BindingType): string[] {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
      return ['checkbox'];
    case BindingType.FILTER_TABLE:
      return ['input'];
    case BindingType.SORT_TABLE:
      return ['select'];
    case BindingType.VIEW_TABLE_ROW:
      return ['card'];
    default:
      return [];
  }
}

export function getCompatibleTargetComponents(type: BindingType): string[] {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
    case BindingType.FILTER_TABLE:
    case BindingType.SORT_TABLE:
    case BindingType.VIEW_TABLE_ROW:
      return ['table'];
    default:
      return [];
  }
}

export function validateBindingConfig(
  type: BindingType,
  config: BindingConfig
): boolean {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
      return isToggleColumnConfig(config) && Boolean(config.accessorKey);
    case BindingType.FILTER_TABLE:
      return isFilterTableConfig(config) && Boolean(config.columnId);
    case BindingType.SORT_TABLE:
      return isSortTableConfig(config) && Boolean(config.columnId);
    case BindingType.VIEW_TABLE_ROW:
      return isViewTableRowConfig(config) && config.displayFields.length > 0;
    default:
      return false;
  }
}
