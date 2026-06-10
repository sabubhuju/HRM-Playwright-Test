import { expect, test } from '@playwright/test';

const BASE_URL = 'https://hrmapp.soanitech.com/';
const TEST_EMAIL = 'sabubhuju0613@gmail.com';
const CURRENT_PASSWORD = 'Password12#';

async function goToChangePassword(page:any) {
  await page.goto(BASE_URL);
  await page.locator('input[name="email"]').fill(TEST_EMAIL);
  await page.locator('input[name="password"]').fill(CURRENT_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);

  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }

  // Navigate to Change Password via Profile Management menu
  await page.getByRole('button', { name: 'Profile Management' }).click();
  await page.getByRole('menuitem', { name: 'Change Password' }).click();
  await expect(page).toHaveURL(/profile\/change-password/);
}

test.describe('Change Password', () => {

  test.beforeEach(async ({ page }) => {
    await goToChangePassword(page);
  });

  // ── Test 1: Page loads with all required fields ──
  test('[Positive] Change password page displays all required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Change Your Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Old Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'New Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Confirm Password' })).toBeVisible();
  });

  //Test 2: Successfully change password with valid inputs
  test('[Positive] User can change password with correct old password and valid new password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('Password123#');
    await page.locator('button').nth(3).click();

    await page.getByRole('textbox', { name: 'New Password' }).fill('Password12#');
    await page.locator('button').nth(4).click();

    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password12#');
    await page.locator('button').nth(5).click();

    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify success message (typo "Succesfully" matches the actual app message)
    await expect(page.getByText('Password Changed Succesfully')).toBeVisible();
  });

  // ── Test 3: Wrong old password ──
  test('[Negative] System rejects password change when old password is incorrect', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('WrongPassword99#');
    await page.getByRole('textbox', { name: 'New Password' }).fill('Password123#');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password123#');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Current password is incorrect')).toBeVisible();
  });

  // ── Test 4: New password same as old password ──
  test('[Negative] System rejects password change when new password is same as old password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('Password123#');
    await page.getByRole('textbox', { name: 'New Password' }).fill('Password123#');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password123#');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('The new password field and old password must be different.')).toBeVisible();
  });

  // ── Test 5: New password and confirm password do not match ──
  test('[Negative] System rejects password change when new and confirm password do not match', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('Password12#');
    await page.getByRole('textbox', { name: 'New Password' }).fill('Password123#');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password1234#');  // different

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Passwords must match')).toBeVisible();
  });

  // ── Test 6: Password missing uppercase letter ──
  test('[Negative] System rejects password that has no uppercase letter', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('Password12#');
    await page.getByRole('textbox', { name: 'New Password' }).fill('password123');   // all lowercase
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('password123');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Password must contain at least one uppercase letter')).toBeVisible();
  });

  // ── Test 7: Password missing a number ──
  test('[Negative] System rejects password that contains no numbers', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('Password12#');
    await page.getByRole('textbox', { name: 'New Password' }).fill('PasswordABC');   // no digits
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('PasswordABC');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Password must contain at least one number')).toBeVisible();
  });

  // ── Test 8: Password too short ──
  test('[Negative] System rejects password that is less than 8 characters', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Old Password' }).fill('Password12#');
    await page.getByRole('textbox', { name: 'New Password' }).fill('Pass1');   // only 5 characters
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Pass1');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

});