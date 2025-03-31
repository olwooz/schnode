import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps, InputProps } from '@/types/component';
import { bindingsAtom } from '@/atoms/binding';
import { BindingType } from '@/types/binding';

export default function InputRenderer({
  props,
  componentId,
}: ComponentRendererProps) {
  const inputProps = { ...DEFAULT_PROPS.input, ...props } as InputProps;
  const bindings = useAtomValue(bindingsAtom);
  const [inputValue, setInputValue] = useState('');
  const [currentBindingId, setCurrentBindingId] = useState<string | null>(null);

  const tableFilterBinding = componentId
    ? bindings.find(
        (binding) =>
          binding.sourceId === componentId &&
          binding.type === BindingType.FILTER_TABLE
      )
    : null;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);

    if (!tableFilterBinding) {
      return;
    }

    const event = new CustomEvent('filterTable', {
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
      <Label>{inputProps.label}</Label>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={inputProps.placeholder}
        type={inputProps.type}
      />
    </div>
  );
}
