import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ButtonVariant, ButtonSize } from '@/types/shadcn-component';
import { CanvasComponent } from '@/types/dnd';
import { BUTTON_SIZE, BUTTON_VARIANT } from '@/constants/button';

type ButtonStyleProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function ButtonStyle({
  selectedComponent,
  handlePropChange,
}: ButtonStyleProps) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Variant</Label>
        <Select
          value={
            (selectedComponent.props.variant as ButtonVariant) || 'default'
          }
          onValueChange={(value: ButtonVariant) =>
            handlePropChange('variant', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select variant' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BUTTON_VARIANT).map((variant) => (
              <SelectItem key={variant} value={variant}>
                {variant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label>Size</Label>
        <Select
          value={(selectedComponent.props.size as ButtonSize) || 'default'}
          onValueChange={(value: ButtonSize) => handlePropChange('size', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select size' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BUTTON_SIZE).map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
