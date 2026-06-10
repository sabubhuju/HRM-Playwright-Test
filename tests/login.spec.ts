import { expect, test } from '@playwright/test';
const BASE_URL = 'https://hrmapp.soanitech.com/';
const VALID_EMAIL = 'admin@example.com';
const VALID_PASSWORD = 'Password12#';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  //Test 1: Valid login (positive case) 
  test('User can log in with valid credentials', async ({ page }) => {
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.getByRole('checkbox', { name: 'Remember Me' }).check();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);
    const closeButton = page.getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  });

  //Test 2: Wrong credentials (negative case)
  test('User cannot log in with invalid credentials', async ({ page }) => {
    await page.locator('input[name="email"]').fill('wrongemail@example.com');
    await page.locator('input[name="password"]').fill('wrongpassword');

    await page.getByRole('button', { name: 'Login' }).click();

    // Should show an error message instead of redirecting
    await expect(page.getByText('Incorrect credentials')).toBeVisible();
  });

  // ── Test 3: Empty fields (negative case) ──
  test('User cannot log in with empty email and password', async ({ page }) => {
    // Leave both fields empty and try to submit
    await page.locator('input[name="email"]').fill('');
    await page.locator('input[name="password"]').fill('');

    await page.getByRole('button', { name: 'Login' }).click();

    // Both validation messages should appear
    await expect(page.getByText('The email field is required')).toBeVisible();
    await expect(page.getByText('The password field is required')).toBeVisible();
  });

});