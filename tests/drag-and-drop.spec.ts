import { expect } from '@playwright/test';
import { test } from './fixtures/base.fixture';
import { dragComponentToCanvas } from './utils/component';

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
