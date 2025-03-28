import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { DRAG_ITEM_TYPE, COMPONENT_TYPE } from '@/constants/component-types';
import { DragItem, DropPreview } from '@/types/dnd';
import { CanvasComponent } from '@/types/dnd';
import { calculatePosition } from '@/utils/canvas';
import { DEFAULT_PROPS } from '@/constants/component';
import { useComponentActions } from '@/hooks/useComponentActions';

export function useDropPreview(isPreviewMode: boolean) {
  const { handleAddComponent } = useComponentActions();
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
          isRelocation: item.type === DRAG_ITEM_TYPE.PLACED_COMPONENT,
          ...(item.id && { id: item.id }),
        });
      },
      drop: (item: DragItem, monitor) => {
        const position = getDropPosition(monitor);
        if (!position) return;

        hideDropPreview();

        if (item.type !== DRAG_ITEM_TYPE.COMPONENT) {
          return { position };
        }

        const newComponent: CanvasComponent = {
          id: item.id || uuidv4(),
          type: item.componentType,
          props: {
            ...(item.componentType === COMPONENT_TYPE.TABLE &&
              DEFAULT_PROPS.table),
          },
          position,
        };

        handleAddComponent(newComponent);
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
    if (!previewRef.current || !dropPreview.isVisible) {
      return;
    }

    const { offsetWidth, offsetHeight } = previewRef.current;

    if (
      offsetWidth === previewSize.width &&
      offsetHeight === previewSize.height
    ) {
      return;
    }

    setPreviewSize({
      width: offsetWidth,
      height: offsetHeight,
    });
  }, [
    dropPreview.isVisible,
    dropPreview.previewComponentType,
    previewSize.width,
    previewSize.height,
  ]);

  return { dropRef, previewRef, dropPreview, isOver };
}
