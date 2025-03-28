import { CanvasComponent } from '@/types/dnd';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { useDraggable } from '@/hooks/useDraggable';
import ComponentRenderer from '@/components/renderer/ComponentRenderer';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DraggableComponent({
  component,
  isSelected,
  isPreviewMode,
  onClick,
  onMove,
  onDelete,
}: {
  component: CanvasComponent;
  isSelected: boolean;
  isPreviewMode: boolean;
  onClick: () => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}) {
  const { draggableRef, isDragging } = useDraggable({
    type: DRAG_ITEM_TYPE.PLACED_COMPONENT,
    item: () => ({
      id: component.id,
      type: DRAG_ITEM_TYPE.PLACED_COMPONENT,
      componentType: component.type,
      initialPosition: component.position,
    }),
    onDragEnd: (_, monitor) => {
      const dropResult = monitor.getDropResult<{
        position: { x: number; y: number };
      }>();

      if (!dropResult || !dropResult.position) {
        return;
      }

      onMove(component.id, dropResult.position);
    },
    isPreviewMode,
  } as const);

  function handleDelete() {
    onDelete(component.id);
  }

  return (
    <div
      ref={draggableRef}
      className={`
        absolute 
        ${isPreviewMode ? 'cursor-default' : 'cursor-move'} 
        rounded 
        p-2
        transition-opacity
        group
        ${
          !isPreviewMode
            ? 'hover:outline hover:outline-2 hover:outline-blue-300'
            : ''
        }
        ${isDragging ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
      }}
      onClick={onClick}
    >
      {!isPreviewMode && (
        <div className='absolute top-0 right-0 -mt-3 -mr-3 opacity-0 group-hover:opacity-100 z-10'>
          <Button
            variant='destructive'
            size='icon'
            className='h-6 w-6'
            onClick={handleDelete}
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      )}
      {isSelected && (
        <GlowEffect key={component.id} mode='colorShift' scale={0.95} />
      )}
      <div className='relative'>
        <ComponentRenderer type={component.type} props={component.props} />
      </div>
    </div>
  );
}
