import { CheckboxProps } from '@/types/component';

import { Checkbox } from '@/components/ui/checkbox';
import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps } from '@/types/component';

export default function CheckboxRenderer({ props }: ComponentRendererProps) {
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
