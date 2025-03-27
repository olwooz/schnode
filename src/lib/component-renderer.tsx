'use client';

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
import { ButtonVariant, ButtonSize } from '@/types/shadcn-component';
import { BUTTON_SIZE } from '@/constants/button';
import { BUTTON_VARIANT } from '@/constants/button';
import { HTMLInputTypeAttribute } from 'react';
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
  placeholder: string;
  options: string[];
}

interface CardProps {
  title: string;
  content: string;
}

interface TableProps {
  title: string;
}

interface CheckboxProps {
  label: string;
}

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
    placeholder: 'Select an option',
    options: ['Option 1', 'Option 2', 'Option 3'],
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
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={selectProps.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectProps.options.map((option) => (
              <SelectItem key={option} value={option.toLowerCase()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case COMPONENT_TYPE.CARD: {
      const cardProps = { ...defaultProps.card, ...props } as CardProps;
      return (
        <Card>
          <CardHeader>
            <CardTitle>{cardProps.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{cardProps.content}</p>
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
