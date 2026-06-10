import { expect, test } from '@playwright/test';
const BASE_URL = 'https://hrmapp.soanitech.com/';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Password12#';
async function loginAsAdmin(page: any) {
  await page.goto(BASE_URL);
  await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);

  // Close welcome popup/modal if it appears
  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
}

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('button', { name: 'Employees' }).click();
    await expect(page).toHaveURL(/employee/);
  });

  //Test 1: Add a new employee (positive case) 
  test('Admin can add a new employee successfully', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await expect(page).toHaveURL(/employees\/add-employee/);
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Employee 1');
    await page.getByRole('textbox', { name: 'Email' }).fill('emp1@gmail.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('User Created succesfully..')).toBeVisible();
  });

  //Test 2: Duplicate email protection (negative case)
  test('System prevents adding an employee with a duplicate email', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await expect(page).toHaveURL(/employees\/add-employee/);
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Employee 2');
    await page.getByRole('textbox', { name: 'Email' }).fill('emp1@gmail.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('The email has already been taken')).toBeVisible();
  });

  // ── Test 3: Empty form validation (negative case) ──
  test('System shows validation errors when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await expect(page).toHaveURL(/employees\/add-employee/);

    // Leave both fields empty and submit
    await page.getByRole('textbox', { name: 'Full Name' }).fill('');
    await page.getByRole('textbox', { name: 'Email' }).fill('');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Both required field errors should appear
    await expect(page.getByText('Full Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  // ── Test 4: Filter employees by department ──
  test('Admin can filter the employee list by department', async ({ page }) => {
    // Select the HR department from the dropdown
    await page.getByRole('combobox', { name: 'Department' }).click();
    await page.getByRole('option', { name: 'HR' }).click();

    // Dropdown should now show HR as the selected value
    await expect(page.getByRole('combobox', { name: 'HR' })).toBeVisible();
  });

});