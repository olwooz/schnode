import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps, SelectProps } from '@/types/component';

export default function SelectRenderer({ props }: ComponentRendererProps) {
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
