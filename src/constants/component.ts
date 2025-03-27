import { ComponentLibraryItem } from '@/types/dnd';

export const COMPONENT_TYPE = {
  BUTTON: 'button',
  CARD: 'card',
  CHECKBOX: 'checkbox',
  INPUT: 'input',
  SELECT: 'select',
  TABLE: 'table',
};

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

export const DRAG_ITEM_TYPE = {
  COMPONENT: 'COMPONENT',
  PLACED_COMPONENT: 'PLACED_COMPONENT',
};
