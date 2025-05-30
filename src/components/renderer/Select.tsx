import { useEffect, useState } from 'react';

import { useAtomValue } from 'jotai';

import { bindingsAtom } from '@/atoms/binding';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BINDING_EVENT } from '@/constants/binding-event';
import { DEFAULT_PROPS } from '@/constants/component';
import { BindingType } from '@/types/binding';
import { ComponentRendererProps, SelectProps } from '@/types/component';

export default function SelectRenderer({
  props,
  componentId,
}: ComponentRendererProps) {
  const selectProps = { ...DEFAULT_PROPS.select, ...props } as SelectProps;

  const bindings = useAtomValue(bindingsAtom);
  const [selectedValue, setSelectedValue] = useState('');
  const [currentBindingId, setCurrentBindingId] = useState<string | null>(null);

  const id = selectProps.id;
  const value = selectProps.value ?? selectedValue;

  const options =
    typeof selectProps.options === 'string'
      ? JSON.parse(selectProps.options)
      : selectProps.options;

  const tableSortBinding = componentId
    ? bindings.find(
        (binding) =>
          binding.sourceId === componentId &&
          binding.type === BindingType.SORT_TABLE
      )
    : null;

  function handleSelectChange(value: string) {
    if (selectProps.onChange) {
      selectProps.onChange(value);
      return;
    }

    setSelectedValue(value);

    if (!tableSortBinding) {
      return;
    }

    const event = new CustomEvent(BINDING_EVENT.SORT_TABLE, {
      detail: {
        id: tableSortBinding.config.id,
        desc: value === 'desc',
        sort: value !== 'none',
        targetId: tableSortBinding.targetId,
      },
      bubbles: true,
    });

    document.dispatchEvent(event);
  }

  useEffect(() => {
    if (!tableSortBinding) {
      if (currentBindingId) {
        setSelectedValue('');
        setCurrentBindingId(null);
      }
      return;
    }

    if (currentBindingId !== tableSortBinding.id) {
      setCurrentBindingId(tableSortBinding.id);
    }
  }, [tableSortBinding, currentBindingId]);

  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor={id}>{selectProps.label}</Label>
      <Select value={value} onValueChange={handleSelectChange}>
        <SelectTrigger id={`${id}-trigger`} size={selectProps.size}>
          <SelectValue id={id} placeholder={selectProps.placeholder} />
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
