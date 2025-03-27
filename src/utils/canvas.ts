import { GRID_SIZE } from '@/constants/canvas';
import { ComponentType } from '@/types/dnd';
import { CanvasComponent } from '@/types/dnd';

export function snapToGrid(x: number, y: number): { x: number; y: number } {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return { x: snappedX, y: snappedY };
}

export function calculatePosition(
  mouseX: number,
  mouseY: number,
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } {
  const rawX = mouseX - elementWidth / 2;
  const rawY = mouseY - elementHeight / 2;

  return snapToGrid(rawX, rawY);
}

export function createMockComponent(
  type: string,
  props: Record<string, string>
): CanvasComponent {
  return {
    id: props.id || 'mock-id',
    type: type as ComponentType,
    props,
    position: { x: 0, y: 0 },
  };
}

export function parseJsonProp<T>(
  propValue: string | undefined,
  defaultValue: T
): T {
  if (!propValue) return defaultValue;
  try {
    return JSON.parse(propValue) as T;
  } catch {
    return defaultValue;
  }
}
