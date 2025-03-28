'use client';

import { useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { ComponentType } from '@/types/dnd';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { useDraggable } from '@/hooks/useDraggable';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { isPreviewModeAtom } from '@/atoms/mode';

type DraggableItemProps = {
  type: ComponentType;
  title: string;
  description: string;
};

export function DraggableItem({
  type,
  title,
  description,
}: DraggableItemProps) {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const { draggableRef } = useDraggable({
    type: DRAG_ITEM_TYPE.COMPONENT,
    item: () => ({
      type: DRAG_ITEM_TYPE.COMPONENT,
      componentType: type,
      id: uuidv4(),
    }),
    isPreviewMode,
  });

  return (
    <div className='relative group'>
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <GlowEffect mode='colorShift' scale={0.95} />
      </div>
      <div
        ref={draggableRef}
        className={`
        relative
        ${isPreviewMode ? 'cursor-default' : 'cursor-grab'} 
        rounded-md 
        border 
        bg-neutral-50
        dark:bg-neutral-900
        p-3 
        shadow-sm 
        hover:shadow 
      `}
      >
        <h3 className='font-medium'>{title}</h3>
        <p className='text-xs text-neutral-500'>{description}</p>
      </div>
    </div>
  );
}
