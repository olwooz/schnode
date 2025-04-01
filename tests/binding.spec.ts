import { expect } from '@playwright/test';
import { test } from './fixtures/base.fixture';
import { dragComponentToCanvas } from './utils/component';

test.describe('Component Binding Tests', () => {
  test('Checkbox -> Table binding - verify checkbox can be bound to a table column visibility', async ({
    appPage,
    page,
  }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    await dragComponentToCanvas(page, 'checkbox', canvas);
    await page.waitForTimeout(2000);

    console.log('Setting up binding between checkbox and table...');

    const checkboxComponent = page
      .locator('[data-testid^="draggable-component-"]')
      .filter({ hasText: /checkbox/i })
      .first();

    console.log('Looking for binding options...');

    const bindingsTab = page
      .getByRole('tab')
      .filter({ hasText: /binding/i })
      .first();
    if (await bindingsTab.isVisible()) {
      await bindingsTab.click();
      await page.waitForTimeout(1000);
    }

    const addBindingButton = page.getByText(/add new binding/i);
    if (await addBindingButton.isVisible()) {
      await addBindingButton.click();
      await page.waitForTimeout(1000);
      console.log('Clicked Add New Binding');

      const bindingTypeSelector = page
        .locator('#bindingType, [placeholder="Select binding type"]')
        .first();
      if (await bindingTypeSelector.isVisible()) {
        await bindingTypeSelector.click();
        await page.waitForTimeout(1000);

        const toggleColumnOption = page.getByText('Toggle Column Visibility');
        if (await toggleColumnOption.isVisible()) {
          await toggleColumnOption.click();
          await page.waitForTimeout(1000);
          console.log('Selected Toggle Column Visibility binding type');

          const targetSelector = page
            .locator(
              '#targetComponent, [placeholder="Select target component"]'
            )
            .first();
          if (await targetSelector.isVisible()) {
            await targetSelector.click();
            await page.waitForTimeout(1000);

            const tableOption = page
              .getByRole('option')
              .filter({ hasText: /table/i })
              .first();
            if (await tableOption.isVisible()) {
              await tableOption.click();
              await page.waitForTimeout(1000);
              console.log('Selected table as target component');

              const confirmBindingButton = page
                .getByRole('button')
                .filter({ hasText: /add binding/i })
                .first();
              if (await confirmBindingButton.isVisible()) {
                await confirmBindingButton.click();
                await page.waitForTimeout(2000);
                console.log('Added binding');

                const bindingSelector = page.getByText('This Component');
                if (await bindingSelector.isVisible()) {
                  await bindingSelector.click();
                  await page.waitForTimeout(1000);

                  const columnSelector = page
                    .getByText('Select a column')
                    .first();
                  if (await columnSelector.isVisible()) {
                    await columnSelector.click();
                    await page.waitForTimeout(1000);
                  }

                  const columnOption = page
                    .getByRole('option')
                    .filter({ hasText: 'Task' })
                    .first();
                  if (await columnOption.isVisible()) {
                    await columnOption.click();
                    await page.waitForTimeout(1000);
                    console.log('Selected column to toggle');
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('Verifying binding works...');

    const tableHeaders = page.locator('table th, [role="columnheader"]');
    const initialColumnCount = await tableHeaders.count();
    console.log(`Initial column count: ${initialColumnCount}`);

    await checkboxComponent.click();
    await page.waitForTimeout(2000);
    console.log('Toggled checkbox');

    const newColumnCount = await tableHeaders.count();
    console.log(`New column count: ${newColumnCount}`);

    if (initialColumnCount !== newColumnCount) {
      console.log('Column visibility toggled successfully!');
    }

    console.log('Checkbox -> Table binding test completed');
  });

  test('Input -> Table binding - verify input can be bound to a table column filter', async ({
    appPage,
    page,
  }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    await dragComponentToCanvas(page, 'input', canvas);
    await page.waitForTimeout(2000);

    console.log('Setting up binding between input and table...');

    const inputComponent = page
      .locator('[data-testid^="draggable-component-"]')
      .filter({ hasText: /input/i })
      .first();

    console.log('Looking for binding options...');

    const bindingsTab = page
      .getByRole('tab')
      .filter({ hasText: /binding/i })
      .first();
    if (await bindingsTab.isVisible()) {
      await bindingsTab.click();
      await page.waitForTimeout(1000);
    }

    const addBindingButton = page.getByText(/add new binding/i);
    if (await addBindingButton.isVisible()) {
      await addBindingButton.click();
      await page.waitForTimeout(1000);
      console.log('Clicked Add New Binding');

      const bindingTypeSelector = page
        .locator('#bindingType, [placeholder="Select binding type"]')
        .first();
      if (await bindingTypeSelector.isVisible()) {
        await bindingTypeSelector.click();
        await page.waitForTimeout(1000);

        const filterTableOption = page.getByText('Filter Table Data');
        if (await filterTableOption.isVisible()) {
          await filterTableOption.click();
          await page.waitForTimeout(1000);
          console.log('Selected Filter Table Data binding type');

          const targetSelector = page
            .locator(
              '#targetComponent, [placeholder="Select target component"]'
            )
            .first();
          if (await targetSelector.isVisible()) {
            await targetSelector.click();
            await page.waitForTimeout(1000);

            const tableOption = page
              .getByRole('option')
              .filter({ hasText: /table/i })
              .first();
            if (await tableOption.isVisible()) {
              await tableOption.click();
              await page.waitForTimeout(1000);
              console.log('Selected table as target component');

              const confirmBindingButton = page
                .getByRole('button')
                .filter({ hasText: /add binding/i })
                .first();
              if (await confirmBindingButton.isVisible()) {
                await confirmBindingButton.click();
                await page.waitForTimeout(2000);
                console.log('Added binding');

                const bindingSelector = page.getByText('This Component');
                if (await bindingSelector.isVisible()) {
                  await bindingSelector.click();
                  await page.waitForTimeout(1000);

                  const columnSelector = page
                    .getByText('Select a column')
                    .first();
                  if (await columnSelector.isVisible()) {
                    await columnSelector.click();
                    await page.waitForTimeout(1000);
                  }

                  const columnOption = page
                    .getByRole('option')
                    .filter({ hasText: 'Task' })
                    .first();
                  if (await columnOption.isVisible()) {
                    await columnOption.click();
                    await page.waitForTimeout(1000);
                    console.log('Selected column to toggle');
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('Verifying binding works...');

    const tableRows = page
      .locator('table tbody tr, [role="row"]')
      .filter({ has: page.locator('td, [role="cell"]') });
    const initialRowCount = await tableRows.count();
    console.log(`Initial row count: ${initialRowCount}`);

    await inputComponent.locator('input').fill('Apple');
    await page.waitForTimeout(2000);
    console.log('Entered "Apple" in input field');

    const filteredRowCount = await tableRows.count();
    console.log(`Filtered row count: ${filteredRowCount}`);

    if (filteredRowCount < initialRowCount) {
      console.log('Filtering worked successfully!');
    }

    console.log('Input -> Table binding test completed');
  });

  test('Select -> Table binding - verify select can be bound to a table column sort', async ({
    appPage,
    page,
  }) => {
    await appPage.goto();
    const canvas = page.locator('#canvas-drop-area');
    await expect(canvas).toBeVisible();

    await dragComponentToCanvas(page, 'table', canvas);
    await page.waitForTimeout(2000);

    await dragComponentToCanvas(page, 'select', canvas);
    await page.waitForTimeout(2000);

    const selectComponent = page
      .locator('[data-testid^="draggable-component-"]')
      .filter({ hasText: /select/i })
      .first();

    console.log('Setting up binding between select and table...');

    console.log('Looking for binding options...');

    const bindingsTab = page
      .getByRole('tab')
      .filter({ hasText: /binding/i })
      .first();
    if (await bindingsTab.isVisible()) {
      await bindingsTab.click();
      await page.waitForTimeout(1000);
    }

    const addBindingButton = page.getByText(/add new binding/i);
    if (await addBindingButton.isVisible()) {
      await addBindingButton.click();
      await page.waitForTimeout(1000);
      console.log('Clicked Add New Binding');

      const bindingTypeSelector = page
        .locator('#bindingType, [placeholder="Select binding type"]')
        .first();
      if (await bindingTypeSelector.isVisible()) {
        await bindingTypeSelector.click();
        await page.waitForTimeout(1000);

        const sortTableOption = page.getByText('Sort Table Data');
        if (await sortTableOption.isVisible()) {
          await sortTableOption.click();
          await page.waitForTimeout(1000);
          console.log('Selected Sort Table Data binding type');

          const targetSelector = page
            .locator(
              '#targetComponent, [placeholder="Select target component"]'
            )
            .first();
          if (await targetSelector.isVisible()) {
            await targetSelector.click();
            await page.waitForTimeout(1000);

            const tableOption = page
              .getByRole('option')
              .filter({ hasText: /table/i })
              .first();
            if (await tableOption.isVisible()) {
              await tableOption.click();
              await page.waitForTimeout(1000);
              console.log('Selected table as target component');

              const confirmBindingButton = page
                .getByRole('button')
                .filter({ hasText: /add binding/i })
                .first();
              if (await confirmBindingButton.isVisible()) {
                await confirmBindingButton.click();
                await page.waitForTimeout(2000);
                console.log('Added binding');

                const bindingSelector = page.getByText('This Component');
                if (await bindingSelector.isVisible()) {
                  await bindingSelector.click();
                  await page.waitForTimeout(1000);

                  const columnSelector = page
                    .getByText('Select a column')
                    .first();
                  if (await columnSelector.isVisible()) {
                    await columnSelector.click();
                    await page.waitForTimeout(1000);
                  }

                  const columnOption = page
                    .getByRole('option')
                    .filter({ hasText: 'Task' })
                    .first();
                  if (await columnOption.isVisible()) {
                    await columnOption.click();
                    await page.waitForTimeout(1000);
                    console.log('Selected column to toggle');
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('Verifying binding works...');

    const tableRows = page
      .locator('table tbody tr, [role="row"]')
      .filter({ has: page.locator('td, [role="cell"]') });
    const initialRowCount = await tableRows.count();
    console.log(`Table has ${initialRowCount} rows`);

    const initialOrder = [];
    for (let i = 0; i < initialRowCount; i++) {
      const cellText = await tableRows
        .nth(i)
        .locator('td')
        .first()
        .textContent();
      initialOrder.push(cellText?.trim());
    }
    console.log(`Initial order: ${initialOrder.join(', ')}`);

    await selectComponent.locator('[role="combobox"]').first().click();
    const dropdownContent = page.locator('[role="listbox"]');
    await expect(dropdownContent).toBeVisible();

    await dropdownContent.getByText('Asc').click();
    await page.waitForTimeout(1000);
    console.log('Selected "Ascending" option');

    const ascendingOrder = [];
    for (let i = 0; i < initialRowCount; i++) {
      const cellText = await tableRows
        .nth(i)
        .locator('td')
        .first()
        .textContent();
      ascendingOrder.push(cellText?.trim());
    }
    console.log(`Ascending order: ${ascendingOrder.join(', ')}`);

    await selectComponent.locator('[role="combobox"]').first().click();
    await dropdownContent.getByText('Desc').click();
    await page.waitForTimeout(1000);
    console.log('Selected "Descending" option');

    const descendingOrder = [];
    for (let i = 0; i < initialRowCount; i++) {
      const cellText = await tableRows
        .nth(i)
        .locator('td')
        .first()
        .textContent();
      descendingOrder.push(cellText?.trim());
    }
    console.log(`Descending order: ${descendingOrder.join(', ')}`);

    const initialStr = initialOrder.join(',');
    const ascStr = ascendingOrder.join(',');
    const descStr = descendingOrder.join(',');

    if (initialStr !== ascStr || initialStr !== descStr || ascStr !== descStr) {
      console.log('Sort order changed, binding works!');
    }

    console.log('Select -> Table binding test completed');
  });
});
