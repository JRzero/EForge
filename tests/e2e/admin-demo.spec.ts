import {expect, test} from '@playwright/test';

test('admin reference app covers enterprise list infrastructure', async ({page}) => {
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
  await expect(page.getByRole('cell', {name: 'Alice Chen', exact: true})).toBeVisible();
  await expect(page.getByText('Page 1 of 3')).toBeVisible();

  await page.getByRole('button', {name: 'Next'}).click();
  await expect(page.getByText('Page 2 of 3')).toBeVisible();

  const search = page.getByRole('textbox', {name: 'Search users'});
  await search.fill('Active');
  await expect(page.getByText('Page 1 of 2')).toBeVisible();

  await search.fill('');
  await expect(page.getByText('Page 1 of 3')).toBeVisible();

  const alice = page.getByRole('checkbox', {name: 'Select Alice Chen'});
  await alice.check();
  await expect(page.getByText('1 selected')).toBeVisible();
  await expect(page.getByRole('button', {name: 'Archive 1'})).toBeVisible();
  await page.getByRole('button', {name: 'Clear selection'}).click();
  await expect(page.getByText('1 selected')).toHaveCount(0);

  const nameHeader = page.getByRole('columnheader', {name: /Name/});
  await nameHeader.getByRole('button').click();
  await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

  await page.getByRole('button', {name: 'Columns'}).click();
  const emailVisibility = page.getByRole('checkbox', {name: 'Email'});
  await emailVisibility.uncheck();
  await expect(page.getByRole('columnheader', {name: 'Email'})).toHaveCount(0);

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
  await expect(page.getByRole('group', {name: 'List filters'})).toBeVisible();
});
