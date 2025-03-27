import { COMPONENT_TYPE } from '@/constants/component';

export const BUTTON_VARIANT = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  LINK: 'link',
} as const;

export const BUTTON_SIZE = {
  DEFAULT: 'default',
  SM: 'sm',
  LG: 'lg',
  ICON: 'icon',
} as const;

export const SELECT_TRIGGER_SIZE = {
  SM: 'sm',
  DEFAULT: 'default',
} as const;

export const SELECT_DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3'];

export const VARIANTS = {
  [COMPONENT_TYPE.BUTTON]: {
    variant: BUTTON_VARIANT,
    size: BUTTON_SIZE,
  },
  [COMPONENT_TYPE.SELECT]: {
    size: SELECT_TRIGGER_SIZE,
  },
} as const;
