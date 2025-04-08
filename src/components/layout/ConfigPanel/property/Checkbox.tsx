import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useComponentActions } from '@/hooks/useComponentActions';
import { CanvasComponent } from '@/types/dnd';

type CheckboxPropertyProps = {
  selectedComponent: CanvasComponent;
};

export default function CheckboxProperty({
  selectedComponent,
}: CheckboxPropertyProps) {
  const { handleUpdateComponent } = useComponentActions();

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='checkbox-label'>Label Text</Label>
        <Input
          id='checkbox-label'
          value={selectedComponent.props.label ?? ''}
          onChange={(e) =>
            handleUpdateComponent({
              id: selectedComponent.id,
              key: 'label',
              value: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
