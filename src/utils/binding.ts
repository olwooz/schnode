import {
  BindingType,
  BindingConfig,
  ToggleColumnConfig,
  FilterTableConfig,
  SortTableConfig,
} from '@/types/binding';

export function isToggleColumnConfig(
  config: BindingConfig
): config is ToggleColumnConfig {
  return 'accessorKey' in config && 'defaultVisible' in config;
}

export function isFilterTableConfig(
  config: BindingConfig
): config is FilterTableConfig {
  return 'id' in config;
}

export function isSortTableConfig(
  config: BindingConfig
): config is SortTableConfig {
  return 'id' in config;
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
        id: '',
      };
    case BindingType.SORT_TABLE:
      return {
        id: '',
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
    default:
      return [];
  }
}

export function getCompatibleTargetComponents(type: BindingType): string[] {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
    case BindingType.FILTER_TABLE:
    case BindingType.SORT_TABLE:
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
      return isFilterTableConfig(config) && Boolean(config.id);
    case BindingType.SORT_TABLE:
      return isSortTableConfig(config) && Boolean(config.id);
    default:
      return false;
  }
}
