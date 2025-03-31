import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INPUT_TYPES } from '@/constants/input';
import { CanvasComponent } from '@/types/dnd';
import { useLocalFormState } from '@/hooks/useLocalFormState';
import {
  UpdateComponentProps,
  useComponentActions,
} from '@/hooks/useComponentActions';

type InputPropertyProps = {
  selectedComponent: CanvasComponent;
  handleUpdateItemProp?: ({ id, key, value }: UpdateComponentProps) => void;
};

export default function InputProperty({
  selectedComponent,
  handleUpdateItemProp,
}: InputPropertyProps) {
  const { handleUpdateComponent } = useComponentActions();
  const label = useLocalFormState(
    selectedComponent.props.label ?? '',
    (value) =>
      (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
        id: selectedComponent.id,
        key: 'label',
        value,
      })
  );

  const placeholder = useLocalFormState(
    selectedComponent.props.placeholder ?? '',
    (value) =>
      (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
        id: selectedComponent.id,
        key: 'placeholder',
        value,
      })
  );

  const inputType = useLocalFormState(
    selectedComponent.props.type ?? INPUT_TYPES.TEXT,
    (value) =>
      (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
        id: selectedComponent.id,
        key: 'type',
        value,
      })
  );

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='input-label'>Label</Label>
        <Input
          id='input-label'
          value={label.value}
          onChange={(e) => label.setValue(e.target.value)}
          placeholder='Enter label text'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='input-placeholder'>Placeholder</Label>
        <Input
          id='input-placeholder'
          value={placeholder.value}
          onChange={(e) => placeholder.setValue(e.target.value)}
          placeholder='Enter placeholder text'
        />
      </div>

      <div className='space-y-2'>
        <Label>Input Type</Label>
        <Select value={inputType.value} onValueChange={inputType.setValue}>
          <SelectTrigger>
            <SelectValue placeholder='Select input type' />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INPUT_TYPES).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
