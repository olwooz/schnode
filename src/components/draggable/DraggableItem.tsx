'use client';

import { useEffect } from 'react';

import { useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { isPreviewModeAtom } from '@/atoms/mode';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { useDraggable } from '@/hooks/useDraggable';
import { ComponentType } from '@/types/dnd';

type DraggableItemProps = {
  type: ComponentType;
  title: string;
  description: string;
  closePanel: () => void;
};

export function DraggableItem({
  type,
  title,
  description,
  closePanel,
}: DraggableItemProps) {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const { draggableRef, isDragging } = useDraggable({
    type: DRAG_ITEM_TYPE.COMPONENT,
    item: () => ({
      type: DRAG_ITEM_TYPE.COMPONENT,
      componentType: type,
      id: uuidv4(),
    }),
    isPreviewMode,
  });

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    closePanel();
  }, [isDragging, closePanel]);

  return (
    <div className='relative group'>
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        {!isPreviewMode && <GlowEffect mode='colorShift' scale={0.95} />}
      </div>
      <div
        ref={draggableRef}
        className={`
        relative
        ${
          isPreviewMode
            ? 'cursor-not-allowed'
            : 'cursor-grab active:cursor-grabbing'
        } 
        rounded-md 
        border 
        bg-neutral-50
        dark:bg-neutral-900
        p-2 md:p-3
        shadow-sm 
        hover:shadow 
        touch-manipulation
        transition-all
        active:scale-95
        select-none
      `}
        data-testid={`draggable-${type}`}
      >
        <h3 className='font-medium text-sm md:text-base'>{title}</h3>
        <p className='text-xs text-neutral-500 line-clamp-2'>{description}</p>
      </div>
    </div>
  );
}
