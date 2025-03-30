import { test as baseTest, expect, Page } from '@playwright/test';
import { selectors } from '../utils/selectors';

export class AppPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForAppLoad();
    return this;
  }

  async waitForAppLoad() {
    await expect(this.page.locator('.flex.h-screen')).toBeVisible();
    return this;
  }

  async togglePreviewMode() {
    await this.page.locator(selectors.controls.previewToggle).click();
    return this;
  }

  async isInPreviewMode() {
    const modeText = await this.page
      .locator(selectors.canvas.modeIndicator)
      .textContent();
    return modeText?.includes('Preview Mode') || false;
  }

  getCanvasArea() {
    return this.page.locator(selectors.canvas.dropArea);
  }

  getComponentLibrary() {
    return this.page.locator(selectors.componentLibrary.container);
  }

  getConfigPanel() {
    return this.page.locator(selectors.configPanel.container);
  }
}

export const test = baseTest.extend<{ appPage: AppPage }>({
  appPage: async ({ page }, use) => {
    const appPage = new AppPage(page);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(appPage);
  },
});
