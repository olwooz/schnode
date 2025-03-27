'use client';

import { HTMLInputTypeAttribute } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ComponentType } from '@/types/dnd';
import { COMPONENT_TYPE } from '@/constants/component';
import {
  ButtonVariant,
  ButtonSize,
  SelectTriggerSize,
} from '@/types/shadcn-component';
import {
  BUTTON_SIZE,
  SELECT_DEFAULT_OPTIONS,
  SELECT_TRIGGER_SIZE,
} from '@/constants/variant';
import { BUTTON_VARIANT } from '@/constants/variant';
import { Label } from '@/components/ui/label';
import { INPUT_TYPES } from '@/constants/input';

interface ButtonProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

interface InputProps {
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
}

interface SelectProps {
  label: string;
  placeholder: string;
  options: string[];
  size?: SelectTriggerSize;
}

interface CardProps {
  title: string;
  description?: string;
  content: string;
  contentItems?: string;
  actionButtons?: string;
}

interface TableProps {
  title: string;
}

interface CheckboxProps {
  label: string;
}

// Define types for content items and action buttons
type ContentItem = {
  id: string;
  type: 'input' | 'select';
  props: Record<string, string>;
};

type ActionButton = {
  id: string;
  text: string;
  variant: string;
};

type ComponentProps = {
  button: ButtonProps;
  input: InputProps;
  select: SelectProps;
  card: CardProps;
  table: TableProps;
  checkbox: CheckboxProps;
};

const defaultProps: ComponentProps = {
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

type ComponentRendererProps = {
  type: ComponentType;
  props?: Partial<ComponentProps[keyof ComponentProps]>;
};

export function ComponentRenderer({ type, props }: ComponentRendererProps) {
  switch (type) {
    case COMPONENT_TYPE.BUTTON: {
      const buttonProps = { ...defaultProps.button, ...props } as ButtonProps;
      return (
        <Button variant={buttonProps.variant} size={buttonProps.size}>
          {buttonProps.children}
        </Button>
      );
    }

    case COMPONENT_TYPE.INPUT: {
      const inputProps = { ...defaultProps.input, ...props } as InputProps;
      return (
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label>{inputProps.label}</Label>
          <Input placeholder={inputProps.placeholder} type={inputProps.type} />
        </div>
      );
    }

    case COMPONENT_TYPE.SELECT: {
      const selectProps = { ...defaultProps.select, ...props } as SelectProps;
      const options =
        typeof selectProps.options === 'string'
          ? JSON.parse(selectProps.options)
          : selectProps.options;

      return (
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label>{selectProps.label}</Label>
          <Select>
            <SelectTrigger size={selectProps.size}>
              <SelectValue placeholder={selectProps.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option: string) => (
                <SelectItem key={option} value={option.toLowerCase()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    case COMPONENT_TYPE.CARD: {
      const cardProps = { ...defaultProps.card, ...props } as CardProps;

      // Parse content items if available
      const contentItems = cardProps.contentItems
        ? JSON.parse(cardProps.contentItems)
        : [];

      // Parse action buttons if available
      const actionButtons = cardProps.actionButtons
        ? JSON.parse(cardProps.actionButtons)
        : [];

      return (
        <Card>
          <CardHeader>
            <CardTitle>{cardProps.title}</CardTitle>
            {cardProps.description && (
              <div className='text-sm text-muted-foreground mt-1'>
                {cardProps.description}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p>{cardProps.content}</p>

              {contentItems.length > 0 && (
                <div className='space-y-3'>
                  {contentItems.map((item: ContentItem) => (
                    <div key={item.id}>
                      {item.type === 'input' ? (
                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                          <Label>{item.props.label}</Label>
                          <Input
                            placeholder={item.props.placeholder}
                            type={item.props.type || 'text'}
                          />
                        </div>
                      ) : (
                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                          <Label>{item.props.label}</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={item.props.placeholder}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {JSON.parse(item.props.options).map(
                                (option: string) => (
                                  <SelectItem
                                    key={option}
                                    value={option.toLowerCase()}
                                  >
                                    {option}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {actionButtons.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-4'>
                  {actionButtons.map((button: ActionButton) => (
                    <Button
                      key={button.id}
                      variant={button.variant as ButtonVariant}
                    >
                      {button.text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    case COMPONENT_TYPE.TABLE: {
      const tableProps = { ...defaultProps.table, ...props } as TableProps;
      return (
        <div className='rounded-md border p-4'>
          <h3 className='mb-2 font-medium'>{tableProps.title}</h3>
          <p className='text-sm text-gray-500'>Table component placeholder</p>
        </div>
      );
    }

    case COMPONENT_TYPE.CHECKBOX: {
      const checkboxProps = {
        ...defaultProps.checkbox,
        ...props,
      } as CheckboxProps;
      return (
        <div className='flex items-center space-x-2'>
          <Checkbox id='checkbox' />
          <label htmlFor='checkbox' className='text-sm font-medium'>
            {checkboxProps.label}
          </label>
        </div>
      );
    }

    default:
      return <div>Unknown component type: {type}</div>;
  }
}
