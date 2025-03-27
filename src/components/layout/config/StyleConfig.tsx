import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CanvasComponent } from '@/types/dnd';
import { VARIANTS } from '@/constants/variant';
import { isEmptyObject } from '@/utils/object';

type StyleConfigProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function StyleConfig({
  selectedComponent,
  handlePropChange,
}: StyleConfigProps) {
  const variant = VARIANTS[selectedComponent.type].variant;
  const size = VARIANTS[selectedComponent.type].size;

  if (isEmptyObject(variant) && isEmptyObject(size)) {
    return (
      <div className='rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500'>
        No style variants available for this component
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {variant && (
        <div className='space-y-2'>
          <Label>Variant</Label>
          <Select
            value={selectedComponent.props.variant || 'default'}
            onValueChange={(value) => handlePropChange('variant', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select variant' />
            </SelectTrigger>
            <SelectContent>
              {Object.values(variant).map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {size && (
        <div className='space-y-2'>
          <Label>Size</Label>
          <Select
            value={selectedComponent.props.size || 'default'}
            onValueChange={(value) => handlePropChange('size', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select size' />
            </SelectTrigger>
            <SelectContent>
              {Object.values(size).map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
