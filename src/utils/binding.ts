import { BindingType, BindingConfig } from '@/types/binding';

export function createDefaultBindingConfig(type: BindingType): BindingConfig {
  switch (type) {
    case BindingType.TOGGLE_COLUMN:
    case BindingType.FILTER_TABLE:
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
    case BindingType.FILTER_TABLE:
    case BindingType.SORT_TABLE:
      return Boolean(config.id);
    default:
      return false;
  }
}
