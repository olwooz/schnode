import {
  SELECT_DEFAULT_OPTIONS,
  SELECT_TRIGGER_SIZE,
} from '@/constants/variant';
import { INPUT_TYPES } from '@/constants/input';
import { BUTTON_SIZE, BUTTON_VARIANT } from '@/constants/variant';
import { COMPONENT_TYPE } from '@/constants/component-types';
import {
  ComponentProps,
  ComponentRendererProps,
  PropertyComponentProps,
} from '@/types/component';
import { ComponentLibraryItem, ComponentType } from '@/types/dnd';
import {
  ButtonProperty,
  CardProperty,
  CheckboxProperty,
  InputProperty,
  SelectProperty,
} from '@/components/layout/config/property';
import {
  ButtonRenderer,
  CheckboxRenderer,
  InputRenderer,
  SelectRenderer,
  CardRenderer,
  TableRenderer,
} from '@/components/renderer';

export const COMPONENT_LIBRARY_ITEMS: ComponentLibraryItem[] = [
  {
    type: COMPONENT_TYPE.BUTTON,
    title: 'Button',
    description: 'Displays a button or a component that looks like a button.',
  },
  {
    type: COMPONENT_TYPE.CARD,
    title: 'Card',
    description: 'Displays a card with header, content, and footer.',
  },
  {
    type: COMPONENT_TYPE.CHECKBOX,
    title: 'Checkbox',
    description:
      'A control that allows the user to toggle between checked and not checked.',
  },
  {
    type: COMPONENT_TYPE.INPUT,
    title: 'Input',
    description:
      'Displays a form input field or a component that looks like an input field.',
  },
  {
    type: COMPONENT_TYPE.SELECT,
    title: 'Select',
    description:
      'Displays a list of options for the user to pick from—triggered by a button.',
  },
  {
    type: COMPONENT_TYPE.TABLE,
    title: 'Table',
    description: 'A responsive table component.',
  },
];

export const DEFAULT_PROPS: ComponentProps = {
  button: {
    children: 'Button',
    variant: BUTTON_VARIANT.DEFAULT,
    size: BUTTON_SIZE.DEFAULT,
  },
  input: {
    label: 'Input',
    placeholder: 'Type here...',
    type: INPUT_TYPES.TEXT,
  },
  select: {
    label: 'Select',
    placeholder: 'Select an option',
    options: SELECT_DEFAULT_OPTIONS,
    size: SELECT_TRIGGER_SIZE.DEFAULT,
  },
  card: {
    title: 'Card Title',
    content: 'Card content goes here',
  },
  table: {
    title: 'Data Table',
  },
  checkbox: {
    label: 'Checkbox',
  },
};

export const PROPERTY_COMPONENTS: Record<
  ComponentType,
  React.ComponentType<PropertyComponentProps> | null
> = {
  button: ButtonProperty,
  checkbox: CheckboxProperty,
  input: InputProperty,
  select: SelectProperty,
  card: CardProperty,
  table: null,
} as const;

export const COMPONENT_RENDERERS: {
  [key in ComponentType]: React.ComponentType<ComponentRendererProps>;
} = {
  button: ButtonRenderer,
  checkbox: CheckboxRenderer,
  input: InputRenderer,
  select: SelectRenderer,
  card: CardRenderer,
  table: TableRenderer,
};
