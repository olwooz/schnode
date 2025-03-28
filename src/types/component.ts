import { HTMLInputTypeAttribute } from 'react';

import {
  ButtonVariant,
  ButtonSize,
  SelectTriggerSize,
} from '@/types/shadcn-component';
import { CanvasComponent } from '@/types/dnd';

export type ButtonProps = {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type InputProps = {
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
};

export type SelectProps = {
  label: string;
  placeholder: string;
  options: string[];
  size?: SelectTriggerSize;
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
};
