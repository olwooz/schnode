import { COMPONENT_TYPE, DRAG_ITEM_TYPE } from '@/constants/component-types';

export type ComponentType =
  (typeof COMPONENT_TYPE)[keyof typeof COMPONENT_TYPE];

export type CanvasComponent = {
  id: string;
  type: ComponentType;
  props: Record<string, string>;
  position: {
    x: number;
    y: number;
  };
};

export type ComponentLibraryItem = {
  type: ComponentType;
  title: string;
  description: string;
};

export type DragItemType = (typeof DRAG_ITEM_TYPE)[keyof typeof DRAG_ITEM_TYPE];

export type DragItem = {
  type: DragItemType;
  componentType: ComponentType;
  id: string;
  initialPosition?: { x: number; y: number };
};

export type DropResult = {
  position: {
    x: number;
    y: number;
  };
};

export type DropPreview = {
  isVisible: boolean;
  previewComponentType: ComponentType | null;
  position: { x: number; y: number };
  isRelocation: boolean;
  id?: string;
};
