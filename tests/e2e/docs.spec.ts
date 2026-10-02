import {expect, test} from '@playwright/test';

test('docs catalog is searchable and live examples remain interactive', async ({page}) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', {name: 'EForge Component Catalog'})).toBeVisible();

  const catalogSearch = page.getByRole('textbox', {name: 'Search component catalog'});
  await catalogSearch.fill('workbench');
  await expect(page.getByRole('heading', {name: 'WorkbenchPage'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'DataTable'})).toHaveCount(0);

  await catalogSearch.fill('');
  await expect(page.getByRole('heading', {name: 'DataTable'})).toBeVisible();

  const demoSearch = page.getByRole('textbox', {name: 'Search demo users'});
  await demoSearch.fill('Nora');
  await expect(page.getByText('Nora Patel')).toBeVisible();
  await expect(page.getByText('Alice Chen')).toHaveCount(0);

  await demoSearch.fill('missing-user');
  await expect(page.getByText('No demo users match this search')).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test('docs navigation remains usable on a narrow viewport', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.getByRole('navigation', {name: 'Primary navigation'})).toBeVisible();
  await page.getByRole('link', {name: 'Live examples'}).click();
  await expect(page.getByRole('heading', {name: 'Live examples'})).toBeVisible();
});
