import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanvasComponent } from '@/types/dnd';

type ButtonPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function ButtonProperty({
  selectedComponent,
  handlePropChange,
}: ButtonPropertyProps) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='button-text'>Button Text</Label>
        <Input
          id='button-text'
          value={selectedComponent.props.children as string}
          onChange={(e) => handlePropChange('children', e.target.value)}
        />
      </div>
    </div>
  );
}
