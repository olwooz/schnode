import { BUTTON_VARIANT, BUTTON_SIZE } from '@/constants/button';

export type ButtonVariant =
  (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];
