import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VARIANTS } from '@/constants/variant';
import {
  UpdateComponentProps,
  useComponentActions,
} from '@/hooks/useComponentActions';
import { CanvasComponent } from '@/types/dnd';
import { isEmptyObject } from '@/utils/object';

type StyleConfigProps = {
  selectedComponent: CanvasComponent;
  handleUpdateItemProp?: ({ id, key, value }: UpdateComponentProps) => void;
};

export default function StyleConfig({
  selectedComponent,
  handleUpdateItemProp,
}: StyleConfigProps) {
  const { handleUpdateComponent } = useComponentActions();
  const variant = VARIANTS[selectedComponent.type].variant;
  const size = VARIANTS[selectedComponent.type].size;

  if (isEmptyObject(variant) && isEmptyObject(size)) {
    return (
      <div className='rounded-md border p-4 text-center text-sm text-neutral-500'>
        No style variants available for this component
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {!isEmptyObject(variant) && (
        <div className='space-y-2'>
          <Label>Variant</Label>
          <Select
            value={selectedComponent.props.variant || 'default'}
            onValueChange={(value) =>
              (handleUpdateItemProp
                ? handleUpdateItemProp
                : handleUpdateComponent)({
                id: selectedComponent.id,
                key: 'variant',
                value,
              })
            }
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

      {!isEmptyObject(size) && (
        <div className='space-y-2'>
          <Label>Size</Label>
          <Select
            value={selectedComponent.props.size || 'default'}
            onValueChange={(value) =>
              (handleUpdateItemProp
                ? handleUpdateItemProp
                : handleUpdateComponent)({
                id: selectedComponent.id,
                key: 'size',
                value,
              })
            }
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
