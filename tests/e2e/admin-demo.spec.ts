import {expect, test} from '@playwright/test';

test('admin reference app covers core enterprise interactions', async ({page}) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', {name: 'Dashboard'})).toBeVisible();
  await expect(page.getByText('Active users')).toBeVisible();

  await page.getByRole('button', {name: 'Users'}).click();
  await expect(page.getByRole('heading', {name: 'Users'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'New user'})).toBeVisible();
  await expect(page.getByText('Alice Chen')).toBeVisible();

  const search = page.getByRole('textbox', {name: 'Search users'});
  await search.fill('Nora');
  await expect(page.getByText('Nora Patel')).toBeVisible();
  await expect(page.getByText('Alice Chen')).toHaveCount(0);

  await search.fill('does-not-exist');
  await expect(page.getByText('No users match this search')).toBeVisible();

  await page.getByRole('button', {name: 'Settings'}).click();
  await expect(page.getByRole('heading', {name: 'Settings'})).toBeVisible();
  const organization = page.getByRole('textbox', {name: 'Organization name'});
  await expect(organization).toHaveValue('EForge Labs');
  await organization.fill('EForge Enterprise');
  await expect(organization).toHaveValue('EForge Enterprise');

  expect(consoleErrors).toEqual([]);
});

test('admin reference app remains usable on a narrow viewport', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.getByRole('navigation', {name: 'Primary navigation'})).toBeVisible();
  await page.getByRole('button', {name: 'Users'}).click();
  await expect(page.getByRole('heading', {name: 'Users'})).toBeVisible();
});
