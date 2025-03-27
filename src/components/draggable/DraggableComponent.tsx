import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ComponentRenderer } from '@/lib/component-renderer';
import { CanvasComponent } from '@/lib/types';
import { DRAG_ITEM_TYPE } from '@/constants/component';

export function DraggableComponent({
  component,
  isSelected,
  isPreviewMode,
  onClick,
  onMove,
}: {
  component: CanvasComponent;
  isSelected: boolean;
  isPreviewMode: boolean;
  onClick: () => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: DRAG_ITEM_TYPE.PLACED_COMPONENT,
    item: () => ({
      id: component.id,
      type: DRAG_ITEM_TYPE.PLACED_COMPONENT,
      componentType: component.type,
      initialPosition: component.position,
    }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !isPreviewMode,
    end: (_, monitor) => {
      const dropResult = monitor.getDropResult<{
        position: { x: number; y: number };
      }>();
      if (dropResult && dropResult.position) {
        onMove(component.id, dropResult.position);
      }
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    if (ref.current && !isPreviewMode) {
      drag(ref.current);
    }
  }, [drag, isPreviewMode]);

  return (
    <div
      ref={ref}
      className={`
        absolute 
        cursor-${isPreviewMode ? 'default' : 'move'} 
        rounded 
        p-2
        transition-opacity
        ${
          isSelected && !isPreviewMode
            ? 'outline outline-2 outline-blue-500'
            : ''
        }
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
      <ComponentRenderer type={component.type} props={component.props} />
    </div>
  );
}
