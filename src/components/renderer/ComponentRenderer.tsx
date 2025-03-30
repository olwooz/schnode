'use client';

import { COMPONENT_RENDERERS } from '@/constants/component';
import { ComponentType } from '@/types/dnd';
import { ComponentProps } from '@/types/component';

type RendererProps = {
  type: ComponentType;
  props?: Partial<ComponentProps[keyof ComponentProps]>;
  componentId?: string;
};

export default function ComponentRenderer({
  type,
  props,
  componentId,
}: RendererProps) {
  const Renderer = COMPONENT_RENDERERS[type];

  if (!Renderer) {
    return <div>Unknown component type: {type}</div>;
  }

  return <Renderer props={props} componentId={componentId} />;
}
