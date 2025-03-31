import { expect } from '@playwright/test';
import { test } from './fixtures/base.fixture';
import { Page, Locator } from '@playwright/test';

test.describe('Drag and Drop Tests', () => {
  test('Drag multiple components to canvas - verify all components appear on canvas', async ({
    appPage,
    page,
  }) => {
    await appPage.goto();

    const canvas = appPage.getCanvasArea();
    await expect(canvas).toBeVisible();

    expect(
      await canvas.locator('[data-testid^="draggable-component-"]').count()
    ).toBe(0);

    await dragComponentToCanvas(page, 'button', canvas);

    await page.waitForTimeout(1000);

    const components = canvas.locator('[data-testid^="draggable-component-"]');
    await expect(components).toBeVisible();
    expect(await components.count()).toBe(1);

    await dragComponentToCanvas(page, 'input', canvas);

    await page.waitForTimeout(1000);

    expect(
      await canvas.locator('[data-testid^="draggable-component-"]').count()
    ).toBe(2);

    await dragComponentToCanvas(page, 'checkbox', canvas);

    await page.waitForTimeout(1000);

    expect(
      await canvas.locator('[data-testid^="draggable-component-"]').count()
    ).toBe(3);
  });

  test('Component relocation test - verify a placed component can be moved to a new position', async ({
    appPage,
    page,
  }) => {
    await appPage.goto();

    const canvas = appPage.getCanvasArea();
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'button', canvas);

    await page.waitForTimeout(1000);

    const component = canvas
      .locator('[data-testid^="draggable-component-"]')
      .first();
    await expect(component).toBeVisible();

    const initialBoundingBox = await component.boundingBox();
    if (!initialBoundingBox) {
      throw new Error('Could not get component bounding box');
    }

    await page.mouse.move(
      initialBoundingBox.x + initialBoundingBox.width / 2,
      initialBoundingBox.y + initialBoundingBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(400, 400);
    await page.mouse.up();

    await page.waitForTimeout(1000);

    const newBoundingBox = await component.boundingBox();
    if (!newBoundingBox) {
      throw new Error('Could not get updated component bounding box');
    }

    expect(newBoundingBox.x).not.toEqual(initialBoundingBox.x);
    expect(newBoundingBox.y).not.toEqual(initialBoundingBox.y);
  });
});

async function dragComponentToCanvas(
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
