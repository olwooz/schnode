import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Checkbox } from '@/components/ui/checkbox';
import { DEFAULT_PROPS } from '@/constants/component';
import { CheckboxProps, ComponentRendererProps } from '@/types/component';
import { bindingsAtom } from '@/atoms/binding';
import { BindingType } from '@/types/binding';
import { isToggleColumnConfig } from '@/utils/binding';

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

  const columnToggleBinding = componentId
    ? bindings.find(
        (binding) =>
          binding.sourceId === componentId &&
          binding.type === BindingType.TOGGLE_COLUMN
      )
    : null;

  useEffect(() => {
    if (!columnToggleBinding) {
      setIsChecked(true);
      setCurrentBindingId(null);
      return;
    }

    if (currentBindingId !== columnToggleBinding.id) {
      if (isToggleColumnConfig(columnToggleBinding.config)) {
        setIsChecked(true);
        setCurrentBindingId(columnToggleBinding.id);
      }
    }
  }, [columnToggleBinding, currentBindingId]);

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);

    if (!columnToggleBinding) {
      return;
    }

    const event = new CustomEvent('toggleColumn', {
      detail: {
        id: isToggleColumnConfig(columnToggleBinding.config)
          ? columnToggleBinding.config.id
          : '',
        isVisible: checked,
        targetId: columnToggleBinding.targetId,
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id='checkbox'
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
      />
      <label htmlFor='checkbox' className='text-sm font-medium'>
        {checkboxProps.label}
      </label>
    </div>
  );
}
