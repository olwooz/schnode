import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanvasComponent } from '@/lib/types';

type CheckboxPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function CheckboxProperty({
  selectedComponent,
  handlePropChange,
}: CheckboxPropertyProps) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='checkbox-label'>Label Text</Label>
        <Input
          id='checkbox-label'
          value={selectedComponent.props.label as string}
          onChange={(e) => handlePropChange('label', e.target.value)}
        />
      </div>
    </div>
  );
}
