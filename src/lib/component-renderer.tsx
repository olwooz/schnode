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
import { COMPONENT_TYPE, DEFAULT_PROPS } from '@/constants/component';
import { Label } from '@/components/ui/label';
import { ActionButton } from '@/types/card';
import {
  ButtonProps,
  InputProps,
  SelectProps,
  CardProps,
  TableProps,
  CheckboxProps,
  ContentItem,
  ComponentProps,
} from '@/types/component';

function ButtonRenderer({ props }: { props?: Partial<ButtonProps> }) {
  const buttonProps = { ...DEFAULT_PROPS.button, ...props } as ButtonProps;
  return (
    <Button variant={buttonProps.variant} size={buttonProps.size}>
      {buttonProps.children}
    </Button>
  );
}

function InputRenderer({ props }: { props?: Partial<InputProps> }) {
  const inputProps = { ...DEFAULT_PROPS.input, ...props } as InputProps;
  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label>{inputProps.label}</Label>
      <Input placeholder={inputProps.placeholder} type={inputProps.type} />
    </div>
  );
}

function SelectRenderer({ props }: { props?: Partial<SelectProps> }) {
  const selectProps = { ...DEFAULT_PROPS.select, ...props } as SelectProps;
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

function CardRenderer({ props }: { props?: Partial<CardProps> }) {
  const cardProps = { ...DEFAULT_PROPS.card, ...props } as CardProps;

  const contentItems = cardProps.contentItems
    ? JSON.parse(cardProps.contentItems)
    : [];

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
                    <InputRenderer props={item.props} />
                  ) : (
                    <SelectRenderer props={item.props} />
                  )}
                </div>
              ))}
            </div>
          )}

          {actionButtons.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {actionButtons.map((button: ActionButton) => (
                <ButtonRenderer key={button.id} props={button} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TableRenderer({ props }: { props?: Partial<TableProps> }) {
  const tableProps = { ...DEFAULT_PROPS.table, ...props } as TableProps;
  return (
    <div className='rounded-md border p-4'>
      <h3 className='mb-2 font-medium'>{tableProps.title}</h3>
      <p className='text-sm text-gray-500'>Table component placeholder</p>
    </div>
  );
}

function CheckboxRenderer({ props }: { props?: Partial<CheckboxProps> }) {
  const checkboxProps = {
    ...DEFAULT_PROPS.checkbox,
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

type ComponentRendererProps = {
  type: ComponentType;
  props?: Partial<ComponentProps[keyof ComponentProps]>;
};

export function ComponentRenderer({ type, props }: ComponentRendererProps) {
  switch (type) {
    case COMPONENT_TYPE.BUTTON:
      return <ButtonRenderer props={props as Partial<ButtonProps>} />;

    case COMPONENT_TYPE.INPUT:
      return <InputRenderer props={props as Partial<InputProps>} />;

    case COMPONENT_TYPE.SELECT:
      return <SelectRenderer props={props as Partial<SelectProps>} />;

    case COMPONENT_TYPE.CARD:
      return <CardRenderer props={props as Partial<CardProps>} />;

    case COMPONENT_TYPE.TABLE:
      return <TableRenderer props={props as Partial<TableProps>} />;

    case COMPONENT_TYPE.CHECKBOX:
      return <CheckboxRenderer props={props as Partial<CheckboxProps>} />;

    default:
      return <div>Unknown component type: {type}</div>;
  }
}
