import { HTMLInputTypeAttribute } from 'react';

import { CanvasComponent } from '@/types/dnd';
import {
  ButtonVariant,
  ButtonSize,
  SelectTriggerSize,
} from '@/types/shadcn-component';

export type ButtonProps = {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type InputProps = {
  id: string;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type SelectProps = {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  size?: SelectTriggerSize;
  value?: string;
  onChange?: (value: string) => void;
};

export type CardProps = {
  title: string;
  description?: string;
  content: string;
  contentItems?: string;
  actionButtons?: string;
};

export type TableProps = {
  title: string;
  columns?: string;
  data?: string;
  apiEndpoint?: string;
  pageSize?: string;
  showPagination?: string;
};

export type CheckboxProps = {
  label: string;
};

export type ContentItem = {
  id: string;
  type: 'input' | 'select';
  props: Record<string, string>;
};

export type ComponentProps = {
  button: ButtonProps;
  input: InputProps;
  select: SelectProps;
  card: CardProps;
  table: TableProps;
  checkbox: CheckboxProps;
};

export type PropertyComponentProps = {
  selectedComponent: CanvasComponent;
};

export type ComponentRendererProps = {
  props?: Partial<ComponentProps[keyof ComponentProps]>;
  componentId?: string;
};
