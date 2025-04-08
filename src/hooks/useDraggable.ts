import { useEffect, useRef } from 'react';

import { useDrag, DragSourceMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ComponentType } from '@/types/dnd';

type DragItemBase = {
  type: string;
  componentType?: ComponentType;
  id?: string;
};

type UseDraggableOptions<T extends DragItemBase> = {
  type: string;
  item: () => T;
  canDrag?: () => boolean;
  onDragEnd?: (item: T, monitor: DragSourceMonitor<T, unknown>) => void;
  isPreviewMode?: boolean;
};

export function useDraggable<T extends DragItemBase>({
  type,
  item,
  canDrag,
  onDragEnd,
  isPreviewMode,
}: UseDraggableOptions<T>) {
  const draggableRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !isPreviewMode && (!canDrag || canDrag()),
    end: (item, monitor) => {
      if (!onDragEnd) {
        return;
      }

      onDragEnd(item, monitor);
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    if (!draggableRef.current || isPreviewMode) {
      return;
    }

    drag(draggableRef.current);
  }, [drag, isPreviewMode]);

  return {
    draggableRef,
    isDragging,
  };
}
