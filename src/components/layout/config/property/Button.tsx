import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanvasComponent } from '@/types/dnd';
import { useLocalFormState } from '@/hooks/useLocalFormState';
import {
  UpdateComponentProps,
  useComponentActions,
} from '@/hooks/useComponentActions';

type ButtonPropertyProps = {
  selectedComponent: CanvasComponent;
  handleUpdateItemProp?: ({ id, key, value }: UpdateComponentProps) => void;
};

export default function ButtonProperty({
  selectedComponent,
  handleUpdateItemProp,
}: ButtonPropertyProps) {
  const { handleUpdateComponent } = useComponentActions();
  const buttonText = useLocalFormState(
    selectedComponent.props.children ?? '',
    (value) =>
      (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
        id: selectedComponent.id,
        key: 'children',
        value,
      })
  );

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='button-text'>Button Text</Label>
        <Input
          id='button-text'
          value={buttonText.value}
          onChange={(e) => buttonText.setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
