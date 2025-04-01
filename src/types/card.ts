import { TABLE_ACTION } from '@/constants/binding-event';
import { ButtonProps } from '@/types/component';

export type ContentItem = {
  id: string;
  type: 'input' | 'select';
  props: Record<string, string>;
};

export type ActionButton = ButtonProps & {
  id: string;
  action: (typeof TABLE_ACTION)[keyof typeof TABLE_ACTION];
};

export type EditorItem = ContentItem | ActionButton;
