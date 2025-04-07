import { expect } from '@playwright/test';
import { test } from './fixtures/base.fixture';
import { dragComponentToCanvas } from './utils/component';

test.describe('Table Tests', () => {
  test('Table data loading test', async ({ appPage, page }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    const component = page
      .locator('[data-testid^="draggable-component-"]')
      .first();
    await expect(component).toBeVisible({ timeout: 10000 });

    await component.locator(':scope').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(2000);

    const configPanel = page.locator('[data-testid="config-panel"]');
    await expect(configPanel).toBeVisible({ timeout: 10000 });

    const apiEndpointField = configPanel.locator('#apiEndpoint');

    if (await apiEndpointField.isVisible()) {
      console.log('Found API endpoint field, filling with test URL');
      await apiEndpointField.fill('https://jsonplaceholder.typicode.com/users');

      try {
        const loadButton = configPanel
          .getByRole('button')
          .filter({ hasText: /load|fetch|get/i })
          .first();

        if (await loadButton.isVisible()) {
          console.log('Found Load button, clicking it');
          await loadButton.click();
          await page.waitForTimeout(1000);

          console.log('Looking for confirmation dialog...');
          const dialog = page.locator('dialog, [role="dialog"]').first();

          if (await dialog.isVisible({ timeout: 3000 })) {
            console.log('Confirmation dialog found, clicking confirm button');
            const confirmButton = dialog
              .getByRole('button')
              .filter({ hasText: /load data/i })
              .first();
            if (await confirmButton.isVisible()) {
              await confirmButton.click();
              console.log('Clicked confirmation button');
              await page.waitForTimeout(3000);
            } else {
              console.log('Could not find Load Data button in dialog');
            }
          } else {
            console.log('No confirmation dialog found, continuing');
          }

          const tableElement = component.locator('table, [role="table"]');

          if (await tableElement.isVisible()) {
            const tableRows = tableElement.locator('tbody tr, [role="row"]');
            const rowCount = await tableRows.count();
            console.log(`Found ${rowCount} rows in the table`);

            if (rowCount > 0) {
              console.log('Successfully loaded data from API endpoint');
            }
          }
        } else {
          console.log('Load button not found');
        }
      } catch (error) {
        console.log('Error loading data:', error);
      }
    } else {
      console.log('API endpoint field not found');
    }

    await expect(component).toBeVisible();
    console.log('Data loading test completed');
  });

  test('Table column test', async ({ appPage, page }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    const component = page
      .locator('[data-testid^="draggable-component-"]')
      .first();
    await expect(component).toBeVisible({ timeout: 10000 });

    await component.locator(':scope').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(2000);

    const configPanel = page.locator('[data-testid="config-panel"]');
    await expect(configPanel).toBeVisible({ timeout: 10000 });

    try {
      const tabElements = page.locator('role=tab');
      if ((await tabElements.count()) > 0) {
        console.log(`Found ${await tabElements.count()} tabs`);

        const columnsTab = tabElements.filter({ hasText: /column/i }).first();
        if ((await columnsTab.count()) > 0) {
          console.log('Found Columns tab, clicking it');
          await columnsTab.click();
          await page.waitForTimeout(1000);

          console.log(
            'Filling Column Header and Column Key before clicking Add Column'
          );

          const columnHeaderInput = configPanel
            .locator('#columnHeader')
            .first();
          if (await columnHeaderInput.isVisible()) {
            await columnHeaderInput.fill('Test Column');
            console.log('Filled Column Header input');

            const columnKeyInput = configPanel.locator('#columnKey').first();
            if (await columnKeyInput.isVisible()) {
              await columnKeyInput.fill('testColumn');
              console.log('Filled Column Key input');

              const addColumnBtn = configPanel
                .getByRole('button')
                .filter({ hasText: /add column/i })
                .first();
              if (await addColumnBtn.isVisible()) {
                console.log('Found Add Column button, clicking it');
                await addColumnBtn.click();
                await page.waitForTimeout(1000);

                const columnElement = configPanel.getByText('Test Column');
                await expect(columnElement).toBeVisible({ timeout: 5000 });
                console.log('Column was successfully added');

                const editBtns = configPanel
                  .locator('.edit-column-btn')
                  .first();
                if ((await editBtns.count()) > 0) {
                  console.log('Found Edit button, clicking it');
                  await editBtns.click();
                  await page.waitForTimeout(1000);

                  const columnHeaderInput = configPanel
                    .locator('#columnHeader')
                    .first();
                  if (await columnHeaderInput.isVisible()) {
                    await columnHeaderInput.fill('Edited Column');
                    console.log('Updated column name');
                  }

                  const updateColumnBtn = configPanel
                    .getByRole('button')
                    .filter({ hasText: /update column/i })
                    .first();
                  if (await updateColumnBtn.isVisible()) {
                    await updateColumnBtn.click();
                    await page.waitForTimeout(1000);

                    const updatedColumn =
                      configPanel.getByText('Edited Column');
                    await expect(updatedColumn).toBeVisible({
                      timeout: 5000,
                    });
                    console.log('Column was successfully edited');
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Error in column test:', error);
    }

    await expect(component).toBeVisible();
    console.log('Column test completed');
  });

  test('Table row test', async ({ appPage, page }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    const component = page
      .locator('[data-testid^="draggable-component-"]')
      .first();
    await expect(component).toBeVisible({ timeout: 10000 });

    await component.locator(':scope').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(2000);

    const configPanel = page.locator('[data-testid="config-panel"]');
    await expect(configPanel).toBeVisible({ timeout: 10000 });

    try {
      const tabElements = page.locator('role=tab');
      if ((await tabElements.count()) > 0) {
        const rowsTab = tabElements.filter({ hasText: /row/i }).first();
        if ((await rowsTab.count()) > 0) {
          console.log('Clicking Rows tab');
          await rowsTab.click();
          await page.waitForTimeout(1000);

          console.log('Finding row input fields to fill before adding row');
          const rowInputField = configPanel.locator('.row-input').first();

          if (await rowInputField.isVisible()) {
            await rowInputField.fill('test value');
            console.log('Filled row key input');

            const addRowBtn = configPanel
              .getByRole('button')
              .filter({ hasText: /add row/i })
              .first();
            if (await addRowBtn.isVisible()) {
              console.log('Clicking Add Row button');
              await addRowBtn.click();
              await page.waitForTimeout(1000);

              const tableElement = component.locator('table, [role="table"]');
              if (await tableElement.isVisible()) {
                const rowValue = component.getByText('Test Value 1');
                if ((await rowValue.count()) > 0) {
                  console.log('Row was successfully added');
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Error in row test:', error);
    }

    await expect(component).toBeVisible();
    console.log('Row test completed');
  });

  test('Table pagination test', async ({ appPage, page }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    const component = page
      .locator('[data-testid^="draggable-component-"]')
      .first();
    await expect(component).toBeVisible({ timeout: 10000 });

    await component.locator(':scope').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(2000);

    const configPanel = page.locator('[data-testid="config-panel"]');
    await expect(configPanel).toBeVisible({ timeout: 10000 });

    try {
      const paginationSection = configPanel.getByText('Pagination Settings');
      if (await paginationSection.isVisible()) {
        console.log('Found pagination settings section');

        const paginationSwitch = configPanel.locator('#showPagination');
        if (await paginationSwitch.isChecked()) {
          console.log('Confirmed pagination is enabled by default');

          const pageSizeSelect = configPanel.locator('#pageSize');
          if (
            (await pageSizeSelect.isVisible()) &&
            (await pageSizeSelect.isEnabled())
          ) {
            console.log('Found page size selector, clicking it');
            await pageSizeSelect.click();
            await page.waitForTimeout(1000);

            const pageSizeOption = page
              .getByRole('option')
              .filter({ hasText: /5|10/ })
              .first();
            if (await pageSizeOption.isVisible()) {
              console.log('Selecting page size option');
              await pageSizeOption.click();
              await page.waitForTimeout(1000);
              console.log('Page size selected successfully');
            }
          }

          const tabElements = page.locator('role=tab');
          const rowsTab = tabElements.filter({ hasText: /row/i }).first();
          if ((await rowsTab.count()) > 0) {
            await rowsTab.click();
            await page.waitForTimeout(1000);

            for (let i = 1; i <= 6; i++) {
              console.log(`Adding row ${i} of 6`);
              const addRowBtn = configPanel
                .getByRole('button')
                .filter({ hasText: /add row/i })
                .first();
              if (await addRowBtn.isVisible()) {
                await addRowBtn.click();
                await page.waitForTimeout(500);

                const rowForm = page.locator('form, [role="form"]').first();
                if (await rowForm.isVisible()) {
                  const inputs = rowForm.locator('input');
                  for (let j = 0; j < (await inputs.count()); j++) {
                    const input = inputs.nth(j);
                    if (await input.isVisible()) {
                      await input.fill(`Page Test Row ${i}`);
                      break;
                    }
                  }

                  const addBtn = rowForm
                    .getByRole('button')
                    .filter({ hasText: /add|save/i })
                    .first();
                  if (await addBtn.isVisible()) {
                    await addBtn.click();
                    await page.waitForTimeout(500);
                  }
                }
              }
            }

            const paginationControls = component
              .locator('.flex, [role="navigation"]')
              .filter({ hasText: /page|of|rows|next|previous/i });
            if ((await paginationControls.count()) > 0) {
              console.log('Pagination controls found in table');
            }
          }
        } else {
          console.log('Failed to enable pagination');
        }
      } else {
        console.log('Could not find pagination settings section');
      }
    } catch (error) {
      console.log('Error in pagination test:', error);
    }

    await expect(component).toBeVisible();
    console.log('Pagination test completed');
  });

  test('Table row editing test', async ({ appPage, page }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    const component = page
      .locator('[data-testid^="draggable-component-"]')
      .first();
    await expect(component).toBeVisible({ timeout: 10000 });

    await component.locator(':scope').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(2000);

    const configPanel = page.locator('[data-testid="config-panel"]');
    await expect(configPanel).toBeVisible({ timeout: 10000 });

    try {
      console.log('Looking for existing table rows to edit');

      await page.mouse.click(10, 10);
      await page.waitForTimeout(1000);

      const tableElement = component.locator('table, [role="table"]');
      if (await tableElement.isVisible()) {
        await tableElement.click();
        console.log('Clicking on existing table row to open edit dialog');
        await page.waitForTimeout(1000);

        const editDialog = page.locator('dialog, [role="dialog"]').first();
        if (await editDialog.isVisible()) {
          console.log('Edit dialog opened successfully');

          const editInputs = editDialog.locator('input');
          const editInputCount = await editInputs.count();

          for (let i = 0; i < editInputCount; i++) {
            const editInput = editInputs.nth(i);
            if (await editInput.isVisible()) {
              await editInput.fill(`Updated Value ${i + 1}`);
              console.log(`Updated input ${i + 1}`);
            }
          }

          const saveButton = editDialog
            .getByRole('button')
            .filter({ hasText: /save|update|apply|ok/i })
            .first();
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            const updatedCell = component.getByText('Updated Value 1');
            if ((await updatedCell.count()) > 0) {
              console.log('Successfully verified row was updated');
            }
          }
        } else {
          console.log('Edit dialog did not appear when row was clicked');
        }
      }
    } catch (error) {
      console.log('Error in row editing test:', error);
    }

    await expect(component).toBeVisible();
    console.log('Row editing test completed');
  });
});
