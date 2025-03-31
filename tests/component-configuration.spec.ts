import { expect } from '@playwright/test';
import { test } from './fixtures/base.fixture';
import { Page } from '@playwright/test';
import { AppPage } from './fixtures/base.fixture';
import { dragComponentToCanvas } from './utils/component';

async function addComponent(
  page: Page,
  appPage: AppPage,
  componentType: string
) {
  await appPage.goto();

  const canvas = page.locator('#canvas-drop-area');
  await expect(canvas).toBeVisible();

  await dragComponentToCanvas(page, componentType, canvas);
  await page.waitForTimeout(1000);

  const component = canvas
    .locator('[data-testid^="draggable-component-"]')
    .first();
  const configPanel = page.locator('[data-testid="config-panel"]');
  await expect(configPanel).toBeVisible();
  await expect(
    configPanel.locator(`text=Editing ${componentType} component`)
  ).toBeVisible();

  return { component, configPanel };
}

test.describe('Component Configuration Tests', () => {
  test('Button component configuration - verify properties update correctly', async ({
    appPage,
    page,
  }) => {
    const { component, configPanel } = await addComponent(
      page,
      appPage,
      'button'
    );

    const buttonTextField = configPanel.locator('#button-text');
    await buttonTextField.fill('Updated Button Text');
    await page.waitForTimeout(500);

    const buttonComponent = component.locator('.inline-flex');
    const hasUpdatedText =
      (await buttonComponent
        .filter({ hasText: 'Updated Button Text' })
        .count()) > 0;
    expect(hasUpdatedText).toBeTruthy();

    await configPanel.locator('text=Styles').click();

    const variantSelect = configPanel
      .locator('text=Variant')
      .locator('xpath=..')
      .locator('button');
    await variantSelect.click();
    await page.locator('text=destructive').click();
    await page.waitForTimeout(500);

    await expect(component.locator('button').first()).toHaveClass(
      /destructive/
    );

    const sizeSelect = configPanel
      .locator('text=Size')
      .locator('xpath=..')
      .locator('button');
    await sizeSelect.click();
    await page.locator('text=sm').click();
    await page.waitForTimeout(500);

    await expect(component.locator('button').first()).toHaveClass(/sm/);
  });

  test('Input component configuration - verify properties update correctly', async ({
    appPage,
    page,
  }) => {
    const { component, configPanel } = await addComponent(
      page,
      appPage,
      'input'
    );

    const labelField = configPanel.locator('#input-label');
    await labelField.fill('Updated Label');
    await page.waitForTimeout(500);

    const hasUpdatedLabel =
      (await component.filter({ hasText: 'Updated Label' }).count()) > 0;
    expect(hasUpdatedLabel).toBeTruthy();

    const placeholderField = configPanel.locator('#input-placeholder');
    await placeholderField.fill('Updated placeholder text');
    await page.waitForTimeout(500);

    await expect(component.locator('input').first()).toHaveAttribute(
      'placeholder',
      'Updated placeholder text'
    );

    const typeSelect = configPanel
      .locator('text=Input Type')
      .locator('xpath=..')
      .locator('button');
    await typeSelect.click();
    await page.locator('text=Number').click();
    await page.waitForTimeout(500);

    await expect(component.locator('input').first()).toHaveAttribute(
      'type',
      'number'
    );
  });

  test('Select component configuration - verify options can be added/edited/deleted', async ({
    appPage,
    page,
  }) => {
    const { component, configPanel } = await addComponent(
      page,
      appPage,
      'select'
    );

    const labelField = configPanel.locator('#select-label');
    await labelField.fill('Updated Select Label');
    await page.waitForTimeout(500);

    const hasUpdatedLabel =
      (await component.filter({ hasText: 'Updated Select Label' }).count()) > 0;
    expect(hasUpdatedLabel).toBeTruthy();

    const placeholderField = configPanel.locator('#select-placeholder');
    await placeholderField.fill('Choose an option...');
    await page.waitForTimeout(500);

    const newOptionField = configPanel.locator(
      'input[placeholder="Add new option"]'
    );
    await newOptionField.fill('New Option');
    const addButton = configPanel.locator('#add-option');
    await addButton.click();
    await page.waitForTimeout(500);

    const firstOptionField = configPanel
      .locator('.flex.items-center.gap-2 input')
      .first();
    await firstOptionField.fill('Edited Option');
    await page.waitForTimeout(500);

    const deleteButton = configPanel
      .locator('.flex.items-center.gap-2 button')
      .first();
    await deleteButton.click();
    await page.waitForTimeout(500);

    await component.locator('[role="combobox"]').first().click();

    const dropdownContent = page.locator('[role="listbox"]');
    await expect(dropdownContent).toBeVisible();

    const hasOption =
      (await page
        .getByRole('option', { name: 'New Option' })
        .or(page.getByRole('option', { name: 'Edited Option' }))
        .count()) > 0;
    expect(hasOption).toBeTruthy();
  });

  test('Checkbox component configuration - verify label updates are reflected', async ({
    appPage,
    page,
  }) => {
    const { component, configPanel } = await addComponent(
      page,
      appPage,
      'checkbox'
    );

    const labelField = configPanel.locator('#checkbox-label');
    await labelField.fill('Updated Checkbox Label');
    await page.waitForTimeout(500);

    const hasUpdatedLabel =
      (await component.filter({ hasText: 'Updated Checkbox Label' }).count()) >
      0;
    expect(hasUpdatedLabel).toBeTruthy();

    await component.locator('[role="checkbox"]').first().click();
    await page.waitForTimeout(500);
  });

  test('Card component configuration - verify content updates are reflected', async ({
    appPage,
    page,
  }) => {
    const { component, configPanel } = await addComponent(
      page,
      appPage,
      'card'
    );

    const titleField = configPanel.locator('#card-title');
    await titleField.fill('Updated Card Title');
    await page.waitForTimeout(500);

    const hasUpdatedTitle =
      (await component.filter({ hasText: 'Updated Card Title' }).count()) > 0;
    expect(hasUpdatedTitle).toBeTruthy();

    const descriptionField = configPanel.locator('#card-description');
    await descriptionField.fill('Updated card description');
    await page.waitForTimeout(500);

    const hasUpdatedDescription =
      (await component
        .filter({ hasText: 'Updated card description' })
        .count()) > 0;
    expect(hasUpdatedDescription).toBeTruthy();

    const contentField = configPanel.locator('#card-content');
    await contentField.fill('Updated card content text');
    await page.waitForTimeout(500);

    const hasUpdatedContent =
      (await component
        .filter({ hasText: 'Updated card content text' })
        .count()) > 0;
    expect(hasUpdatedContent).toBeTruthy();
  });
});
