import { expect } from '@playwright/test';
import { test } from './fixtures/base.fixture';
import { selectors } from './utils/selectors';

test.describe('Setup Tests', () => {
  test('Basic app loading - core UI elements appear', async ({ appPage }) => {
    await appPage.goto();

    await expect(
      appPage.page.locator(selectors.componentLibrary.id)
    ).toBeVisible();

    await expect(
      appPage.page.locator(selectors.canvas.emptyStateMessage.edit)
    ).toBeVisible();

    await expect(appPage.page.locator(selectors.configPanel.id)).toBeVisible();
  });

  test('Canvas initialization - verify empty canvas state', async ({
    appPage,
  }) => {
    await appPage.goto();

    const canvasArea = appPage.getCanvasArea();
    await expect(canvasArea).toBeVisible();

    await expect(
      canvasArea.locator(selectors.canvas.emptyStateMessage.edit)
    ).toBeVisible();

    expect(
      await canvasArea.locator('[data-testid^="component-"]').count()
    ).toBe(0);
  });

  test('Component library visibility - verify all components are visible in sidebar', async ({
    appPage,
  }) => {
    await appPage.goto();

    await expect(
      appPage.page.locator(selectors.componentLibrary.id)
    ).toBeVisible();

    const componentSelectors = Object.values(selectors.components);

    for (const selector of componentSelectors) {
      await expect(appPage.page.locator(selector).first()).toBeVisible();
    }
  });
});
