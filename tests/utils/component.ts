import { expect, Locator, Page } from '@playwright/test';

export async function dragComponentToCanvas(
  page: Page,
  componentType: string,
  canvasLocator: Locator
) {
  const draggableComponentSelector = `[data-testid="draggable-${componentType}"]`;
  const component = page.locator(draggableComponentSelector);
  await expect(component).toBeVisible();

  const boundingBox = await component.boundingBox();
  if (!boundingBox) {
    throw new Error(`Could not find component: ${componentType}`);
  }

  const canvasBoundingBox = await canvasLocator.boundingBox();
  if (!canvasBoundingBox) {
    throw new Error('Could not get canvas bounding box');
  }

  const centerX = boundingBox.x + boundingBox.width / 2;
  const centerY = boundingBox.y + boundingBox.height / 2;

  const targetX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
  const targetY = canvasBoundingBox.y + canvasBoundingBox.height / 2;

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();

  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const moveX = centerX + (targetX - centerX) * (i / steps);
    const moveY = centerY + (targetY - centerY) * (i / steps);
    await page.mouse.move(moveX, moveY);
    await page.waitForTimeout(50);
  }

  await page.mouse.up();
  await page.waitForTimeout(500);
}
