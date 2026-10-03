import {expect, test} from '@playwright/test';

test('admin reference app covers application runtime and enterprise list infrastructure', async ({page}) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', {name: 'Dashboard'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Dashboard'})).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('link', {name: 'Users'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Settings'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Audit'})).toHaveCount(0);

  await page.getByRole('link', {name: 'Users'}).click();
  await expect(page).toHaveURL(/\/users$/);
  await expect(page.getByRole('heading', {name: 'Users'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Users'})).toHaveAttribute('aria-current', 'page');
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

  await page.getByRole('cell', {name: 'Alice Chen', exact: true}).click();
  await expect(page).toHaveURL(/\/users\/u1$/);
  await expect(page.getByRole('heading', {name: 'Alice Chen'})).toBeVisible();
  const breadcrumb = page.getByRole('navigation', {name: 'Breadcrumb'});
  await expect(breadcrumb.getByRole('link', {name: 'Users'})).toBeVisible();
  await expect(breadcrumb.getByText('User detail')).toBeVisible();
  await expect(page.getByRole('link', {name: 'Users'}).first()).toHaveAttribute('aria-current', 'page');

  await breadcrumb.getByRole('link', {name: 'Users'}).click();
  await expect(page).toHaveURL(/\/users$/);

  await page.getByRole('link', {name: 'Settings'}).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole('heading', {name: 'Settings'})).toBeVisible();
  const organization = page.getByRole('textbox', {name: 'Organization name'});
  await expect(organization).toHaveValue('EForge Labs');
  await organization.fill('EForge Enterprise');
  await expect(organization).toHaveValue('EForge Enterprise');

  await page.goto('/audit');
  await expect(page.getByRole('heading', {name: 'Access denied'})).toBeVisible();
  await expect(page.getByText('403')).toBeVisible();
  await expect(page.getByText('Protected content')).toHaveCount(0);

  await page.goto('/not-a-real-route');
  await expect(page.getByRole('heading', {name: 'Page not found'})).toBeVisible();
  await expect(page.getByText('404')).toBeVisible();
  await page.getByRole('link', {name: 'Back to home'}).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', {name: 'Dashboard'})).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test('admin reference app remains usable on a narrow viewport', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.getByRole('navigation', {name: 'Primary navigation'})).toBeVisible();
  await page.getByRole('link', {name: 'Users'}).click();
  await expect(page.getByRole('heading', {name: 'Users'})).toBeVisible();
  await expect(page.getByRole('group', {name: 'List filters'})).toBeVisible();
});
