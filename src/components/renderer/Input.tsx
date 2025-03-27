import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps, InputProps } from '@/types/component';

export default function InputRenderer({ props }: ComponentRendererProps) {
  const inputProps = { ...DEFAULT_PROPS.input, ...props } as InputProps;
  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label>{inputProps.label}</Label>
      <Input placeholder={inputProps.placeholder} type={inputProps.type} />
    </div>
  );
}
