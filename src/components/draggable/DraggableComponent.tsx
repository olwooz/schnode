import { useAtomValue } from 'jotai';
import { Trash2 } from 'lucide-react';

import { selectedComponentAtom } from '@/atoms/component';
import { isPreviewModeAtom } from '@/atoms/mode';
import { BorderTrail } from '@/components/motion-primitives/border-trail';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import ComponentRenderer from '@/components/renderer/ComponentRenderer';
import { Button } from '@/components/ui/button';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { useBindings } from '@/hooks/useBindings';
import { useComponentActions } from '@/hooks/useComponentActions';
import { useDraggable } from '@/hooks/useDraggable';
import { cn } from '@/lib/utils';
import { CanvasComponent } from '@/types/dnd';

export function DraggableComponent({
  component,
}: {
  component: CanvasComponent;
}) {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const selectedComponent = useAtomValue(selectedComponentAtom);

  const {
    handleSelectComponent,
    handleRepositionComponent,
    handleDeleteComponent,
  } = useComponentActions();
  const { hasBindings } = useBindings();

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

  const hasBoundBindings = hasBindings(component.id, selectedComponent?.id);
  const isSelected = component.id === selectedComponent?.id;
  const responsivePosition = {
    x: component.position.x,
    y: component.position.y,
  };

  function handleSelect() {
    handleSelectComponent(component.id);
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    handleDeleteComponent(component.id);
  }

  return (
    <div
      ref={draggableRef}
      id={`component-${component.id}`}
      className={`
        absolute 
        ${isPreviewMode ? 'cursor-default' : 'cursor-move'} 
        rounded 
        p-1 md:p-2
        transition-opacity
        group
        ${
          !isPreviewMode
            ? 'hover:outline hover:outline-2 hover:outline-blue-300'
            : ''
        }
        ${isDragging ? 'opacity-0' : 'opacity-100'}
        max-w-[calc(100%-1rem)] md:max-w-none
      `}
      style={{
        left: `${responsivePosition.x}px`,
        top: `${responsivePosition.y}px`,
      }}
      onClick={handleSelect}
      data-testid={`draggable-component-${component.id}`}
    >
      <BorderTrail
        className={cn(`${hasBoundBindings ? 'opacity-100' : 'opacity-0'}`)}
        style={{
          boxShadow:
            '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
        }}
      />
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
        <ComponentRenderer
          type={component.type}
          props={component.props}
          componentId={component.id}
        />
      </div>
    </div>
  );
}
