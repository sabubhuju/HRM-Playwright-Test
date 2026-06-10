import { expect, test } from '@playwright/test';

const BASE_URL = 'https://hrmapp.soanitech.com/';

test.describe('Dashboard UI tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator('input[name="email"]').fill('sabubhuju0613@gmail.com');
    await page.locator('input[name="password"]').fill('Password12#');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);

    const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
  });

  test('Navigation menu contains correct items.',async({page})=>{
    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Employee', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Departments' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checklists' })).toBeVisible();
  });

  test('Clicking on menu navigates to correct page',async({page})=>{
    await page.getByRole('button', { name: 'Employee', exact: true }).click();
    await expect(page).toHaveURL(/employee/);

    await page.getByRole('button', { name: 'Departments' }).click();
    await expect(page).toHaveURL(/departments/);

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.getByText('Logged out successfully')).toBeVisible();
  });

});