import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  SELECT_TRIGGER_SIZE,
} from '@/constants/variant';

export type ButtonVariant =
  (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

export type SelectTriggerSize =
  (typeof SELECT_TRIGGER_SIZE)[keyof typeof SELECT_TRIGGER_SIZE];
