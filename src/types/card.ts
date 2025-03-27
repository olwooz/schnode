import { ButtonProps } from '@/types/component';

export type ContentItem = {
  id: string;
  type: 'input' | 'select';
  props: Record<string, string>;
};

export type ActionButton = ButtonProps & {
  id: string;
};

export type EditorItem = ContentItem | ActionButton;
