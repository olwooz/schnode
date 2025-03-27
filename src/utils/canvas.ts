import { GRID_SIZE } from '@/constants/canvas';

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
