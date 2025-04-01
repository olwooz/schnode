import { BindingType, BindingConfig } from '@/types/binding';

export function createDefaultBindingConfig(type: BindingType): BindingConfig {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
    case BindingType.FILTER_TABLE:
    case BindingType.SORT_TABLE:
      return {
        id: '',
      };
    case BindingType.TABLE_ACTION:
      return {
        id: '',
        fieldMappings: {},
      };
    default:
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
    case BindingType.TABLE_ACTION:
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
    case BindingType.TABLE_ACTION:
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
    case BindingType.TABLE_ACTION:
      return Boolean(config.id) && Boolean(config.fieldMappings);
    default:
      return false;
  }
}
