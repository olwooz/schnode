import { useEffect, useState } from 'react';

import { useAtomValue } from 'jotai';

import { bindingsAtom } from '@/atoms/binding';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BINDING_EVENT } from '@/constants/binding-event';
import { DEFAULT_PROPS } from '@/constants/component';
import { BindingType } from '@/types/binding';
import { ComponentRendererProps, InputProps } from '@/types/component';

export default function InputRenderer({
  props,
  componentId,
}: ComponentRendererProps) {
  const inputProps = { ...DEFAULT_PROPS.input, ...props } as InputProps;
  const bindings = useAtomValue(bindingsAtom);
  const [inputValue, setInputValue] = useState('');
  const [currentBindingId, setCurrentBindingId] = useState<string | null>(null);

  const id = inputProps.id;
  const value = inputProps.value ?? inputValue;

  const tableFilterBinding = componentId
    ? bindings.find(
        (binding) =>
          binding.sourceId === componentId &&
          binding.type === BindingType.FILTER_TABLE
      )
    : null;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (inputProps.onChange) {
      inputProps.onChange(e);
      return;
    }

    setInputValue(value);

    if (!tableFilterBinding) {
      return;
    }

    const event = new CustomEvent(BINDING_EVENT.FILTER_TABLE, {
      detail: {
        id: tableFilterBinding.config.id,
        filterValue: value,
        targetId: tableFilterBinding.targetId,
      },
      bubbles: true,
    });

    document.dispatchEvent(event);
  }

  useEffect(() => {
    if (!tableFilterBinding) {
      if (currentBindingId) {
        setInputValue('');
        setCurrentBindingId(null);
      }
      return;
    }

    if (currentBindingId !== tableFilterBinding.id) {
      setCurrentBindingId(tableFilterBinding.id);
    }
  }, [tableFilterBinding, currentBindingId]);

  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor={id}>{inputProps.label}</Label>
      <Input
        id={id}
        value={value}
        onChange={handleInputChange}
        placeholder={inputProps.placeholder}
        type={inputProps.type}
      />
    </div>
  );
}
