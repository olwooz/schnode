import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { DRAG_ITEM_TYPE } from '@/constants/component';
import { DragItem, DropPreview } from '@/lib/types';
import { CanvasComponent } from '@/lib/types';
import { calculatePosition } from '@/utils/canvas';

export default function useDropPreview(
  isPreviewMode: boolean,
  onAddComponent: (component: CanvasComponent) => void
) {
  const [dropPreview, setDropPreview] = useState<DropPreview>({
    isVisible: false,
    previewComponentType: null,
    position: { x: 0, y: 0 },
    isRelocation: false,
  });
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const dropRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [DRAG_ITEM_TYPE.COMPONENT, DRAG_ITEM_TYPE.PLACED_COMPONENT],
      hover: (item: DragItem, monitor) => {
        if (isPreviewMode) return;

        const position = getDropPosition(monitor);
        if (!position) return;

        setDropPreview({
          isVisible: true,
          previewComponentType: item.componentType,
          position,
          isRelocation: false,
          ...(item.id && { id: item.id }),
        });
      },
      drop: (item: DragItem, monitor) => {
        const position = getDropPosition(monitor);
        if (!position) return;

        hideDropPreview();

        if (item.type === DRAG_ITEM_TYPE.COMPONENT) {
          const newComponent: CanvasComponent = {
            id: item.id || uuidv4(),
            type: item.componentType,
            props: {},
            position,
          };

          onAddComponent(newComponent);
        } else {
          return { position };
        }
      },
      collect: (monitor) => {
        const isCurrentlyOver = !!monitor.isOver();

        if (!isCurrentlyOver && dropPreview.isVisible) {
          hideDropPreview();
        }

        return {
          isOver: isCurrentlyOver,
        };
      },
    }),
    [isPreviewMode, dropPreview.isVisible, previewSize]
  );

  function getDropPosition(
    monitor: DropTargetMonitor
  ): { x: number; y: number } | null {
    const offset = monitor.getClientOffset();
    if (!offset) return null;

    const dropTargetElement = document.getElementById('canvas-drop-area');
    const dropTargetRect = dropTargetElement?.getBoundingClientRect();
    if (!dropTargetRect) return null;

    const mouseX = offset.x - dropTargetRect.left;
    const mouseY = offset.y - dropTargetRect.top;

    return calculatePosition(
      mouseX,
      mouseY,
      previewSize.width,
      previewSize.height
    );
  }

  function hideDropPreview() {
    setDropPreview({
      isVisible: false,
      previewComponentType: null,
      position: { x: 0, y: 0 },
      isRelocation: false,
    });
  }

  useEffect(() => {
    if (!dropRef.current) {
      return;
    }

    drop(dropRef.current);
  }, [drop]);

  useEffect(() => {
    if (previewRef.current && dropPreview.isVisible) {
      const { offsetWidth, offsetHeight } = previewRef.current;

      if (
        offsetWidth !== previewSize.width ||
        offsetHeight !== previewSize.height
      ) {
        setPreviewSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }
  }, [
    dropPreview.isVisible,
    dropPreview.previewComponentType,
    previewSize.width,
    previewSize.height,
  ]);

  return { dropRef, previewRef, dropPreview, isOver };
}
