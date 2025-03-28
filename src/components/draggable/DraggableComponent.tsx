import { useAtomValue } from 'jotai';
import { Trash2 } from 'lucide-react';

import { selectedComponentAtom } from '@/atoms/component';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { CanvasComponent } from '@/types/dnd';
import { useDraggable } from '@/hooks/useDraggable';
import ComponentRenderer from '@/components/renderer/ComponentRenderer';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { Button } from '@/components/ui/button';
import { useComponentActions } from '@/hooks/useComponentActions';

export function DraggableComponent({
  component,
  isPreviewMode,
}: {
  component: CanvasComponent;
  isPreviewMode: boolean;
}) {
  const {
    handleSelectComponent,
    handleRepositionComponent,
    handleDeleteComponent,
  } = useComponentActions();
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const isSelected = component.id === selectedComponent?.id;

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

      handleRepositionComponent(component.id, dropResult.position);
    },
    isPreviewMode,
  } as const);

  function handleSelect() {
    handleSelectComponent(component.id);
  }

  function handleDelete() {
    handleDeleteComponent(component.id);
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
      onClick={handleSelect}
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
