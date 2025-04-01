import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Checkbox } from '@/components/ui/checkbox';
import { DEFAULT_PROPS } from '@/constants/component';
import { CheckboxProps, ComponentRendererProps } from '@/types/component';
import { bindingsAtom } from '@/atoms/binding';
import { BindingType } from '@/types/binding';
import { BINDING_EVENT } from '@/constants/binding-event';

export default function CheckboxRenderer({
  props,
  componentId,
}: ComponentRendererProps) {
  const checkboxProps = {
    ...DEFAULT_PROPS.checkbox,
    ...props,
  } as CheckboxProps;

  const bindings = useAtomValue(bindingsAtom);
  const [isChecked, setIsChecked] = useState(true);
  const [currentBindingId, setCurrentBindingId] = useState<string | null>(null);
  const checkboxId = `checkbox-${componentId}`;

  const columnToggleBinding = componentId
    ? bindings.find(
        (binding) =>
          binding.sourceId === componentId &&
          binding.type === BindingType.TOGGLE_COLUMN
      )
    : null;

  function handleCheckedChange(checked: boolean) {
    setIsChecked(checked);

    if (!columnToggleBinding) {
      return;
    }

    const event = new CustomEvent(BINDING_EVENT.TOGGLE_COLUMN, {
      detail: {
        id: columnToggleBinding.config.id,
        isVisible: checked,
        targetId: columnToggleBinding.targetId,
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  useEffect(() => {
    if (!columnToggleBinding) {
      setIsChecked(true);
      setCurrentBindingId(null);
      return;
    }

    if (currentBindingId !== columnToggleBinding.id) {
      setIsChecked(true);
      setCurrentBindingId(columnToggleBinding.id);
    }
  }, [columnToggleBinding, currentBindingId]);

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id={checkboxId}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
      />
      <label htmlFor={checkboxId} className='text-sm font-medium'>
        {checkboxProps.label}
      </label>
    </div>
  );
}
