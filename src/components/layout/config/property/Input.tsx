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
import { CanvasComponent } from '@/lib/types';

type InputPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function InputProperty({
  selectedComponent,
  handlePropChange,
}: InputPropertyProps) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='input-label'>Label</Label>
        <Input
          id='input-label'
          value={(selectedComponent.props.label as string) || ''}
          onChange={(e) => handlePropChange('label', e.target.value)}
          placeholder='Enter label text'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='input-placeholder'>Placeholder</Label>
        <Input
          id='input-placeholder'
          value={(selectedComponent.props.placeholder as string) || ''}
          onChange={(e) => handlePropChange('placeholder', e.target.value)}
          placeholder='Enter placeholder text'
        />
      </div>

      <div className='space-y-2'>
        <Label>Input Type</Label>
        <Select
          value={(selectedComponent.props.type as string) || INPUT_TYPES.TEXT}
          onValueChange={(value) => handlePropChange('type', value)}
        >
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
