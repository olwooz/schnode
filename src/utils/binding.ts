import { BindingType, BindingConfig } from '@/types/binding';

export function createDefaultBindingConfig(type: BindingType): BindingConfig {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
    case BindingType.FILTER_TABLE:
    case BindingType.SORT_TABLE:
      return {
        id: '',
      };
    case BindingType.ADD_TABLE_ROW:
    case BindingType.UPDATE_TABLE_ROW:
    case BindingType.DELETE_TABLE_ROW:
      return {
        id: '',
        fieldMappings: {},
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
    case BindingType.ADD_TABLE_ROW:
    case BindingType.UPDATE_TABLE_ROW:
    case BindingType.DELETE_TABLE_ROW:
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
    case BindingType.ADD_TABLE_ROW:
    case BindingType.UPDATE_TABLE_ROW:
    case BindingType.DELETE_TABLE_ROW:
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
    case BindingType.FILTER_TABLE:
    case BindingType.SORT_TABLE:
      return Boolean(config.id);
    case BindingType.ADD_TABLE_ROW:
    case BindingType.UPDATE_TABLE_ROW:
    case BindingType.DELETE_TABLE_ROW:
      return Boolean(config.id) && Boolean(config.fieldMappings);
    default:
      return false;
  }
}
