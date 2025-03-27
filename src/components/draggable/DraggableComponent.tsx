import { CanvasComponent } from '@/types/dnd';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { useDraggable } from '@/hooks/useDraggable';
import ComponentRenderer from '@/components/renderer/ComponentRenderer';

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

  return (
    <div
      ref={draggableRef}
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
