'use client';

import { memo } from 'react';

import { COMPONENT_RENDERERS } from '@/constants/component';
import { ComponentProps } from '@/types/component';
import { ComponentType } from '@/types/dnd';

type RendererProps = {
  type: ComponentType;
  props?: Partial<ComponentProps[keyof ComponentProps]>;
  componentId?: string;
};

function ComponentRenderer({ type, props, componentId }: RendererProps) {
  const Renderer = COMPONENT_RENDERERS[type];

  if (!Renderer) {
    return <div>Unknown component type: {type}</div>;
  }

  return <Renderer props={props} componentId={componentId} />;
}

export default memo(ComponentRenderer);
