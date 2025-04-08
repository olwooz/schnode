import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TABLE_ACTION } from '@/constants/binding-event';
import {
  UpdateComponentProps,
  useComponentActions,
} from '@/hooks/useComponentActions';
import { useLocalFormState } from '@/hooks/useLocalFormState';
import { CanvasComponent } from '@/types/dnd';

const TABLE_ACTION_OPTIONS = [
  { value: TABLE_ACTION.ADD, label: 'Add Row' },
  { value: TABLE_ACTION.UPDATE, label: 'Update Row' },
  { value: TABLE_ACTION.DELETE, label: 'Delete Row' },
];

type ButtonPropertyProps = {
  selectedComponent: CanvasComponent;
  handleUpdateItemProp?: ({ id, key, value }: UpdateComponentProps) => void;
};

export default function ButtonProperty({
  selectedComponent,
  handleUpdateItemProp,
}: ButtonPropertyProps) {
  const { handleUpdateComponent } = useComponentActions();
  const updateProp = handleUpdateItemProp || handleUpdateComponent;

  const buttonText = useLocalFormState(
    selectedComponent.props.children ?? '',
    (value) =>
      updateProp({
        id: selectedComponent.id,
        key: 'children',
        value,
      })
  );

  const buttonAction = useLocalFormState(
    selectedComponent.props.action ?? '',
    (value) =>
      updateProp({
        id: selectedComponent.id,
        key: 'action',
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

      <div className='space-y-2'>
        <Label htmlFor='button-action'>Action</Label>
        <Select
          value={buttonAction.value}
          onValueChange={buttonAction.setValue}
        >
          <SelectTrigger id='button-action'>
            <SelectValue placeholder='Select action' />
          </SelectTrigger>
          <SelectContent>
            {TABLE_ACTION_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
