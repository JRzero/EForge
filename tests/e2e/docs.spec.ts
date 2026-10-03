import {expect, test} from '@playwright/test';

test('docs catalog is searchable and examples remain interactive', async ({page}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {name: 'Enterprise component catalog'}),
  ).toBeVisible();
  await expect(page.getByText('@eforge/ui', {exact: true}).first()).toBeVisible();

  const search = page.getByRole('textbox', {name: 'Search component catalog'});
  await search.fill('DataTable');

  await expect(page.getByRole('heading', {name: 'DataTable'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Button'})).toHaveCount(0);

  await search.fill('');
  const exampleSearch = page.getByRole('textbox', {name: 'Search example users'}).first();
  await exampleSearch.fill('Nora');

  await expect(page.getByText('Nora Patel').first()).toBeVisible();
  await expect(page.getByText('Alice Chen').first()).toHaveCount(0);

  const organization = page.getByRole('textbox', {name: 'Organization name'}).first();
  await organization.fill('EForge Docs');
  await expect(organization).toHaveValue('EForge Docs');

  await expect(page.getByText('Delete action hidden without permission').first()).toBeVisible();
});
