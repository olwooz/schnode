import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanvasComponent } from '@/types/dnd';
import { useLocalFormState } from '@/hooks/useLocalFormState';

type ButtonPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function ButtonProperty({
  selectedComponent,
  handlePropChange,
}: ButtonPropertyProps) {
  const buttonText = useLocalFormState(
    selectedComponent.props.children ?? '',
    (value) => handlePropChange('children', value)
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
