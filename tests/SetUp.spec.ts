import { expect, test } from '@playwright/test';

const BASE_URL = 'https://hrmapp.soanitech.com/';

test('Setup profile for first login', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.locator('input[name="email"]').fill('sabbubhuju@gmail.com');
  await page.locator('input[name="password"]').fill('Password12#');
  await page.getByRole('checkbox', { name: 'Remember Me' }).check();
  await page.getByRole('button', { name: 'Login' }).click();

  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }

  //set new password for 1st login
  await expect(page).toHaveURL(/welcome\/set-password/);

  await expect(page.getByRole('textbox', { name: 'New Password' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Confirm Password' })).toBeVisible();

  await page.getByRole('textbox', { name: 'New Password' }).fill('Password12#');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password12#');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('New Password Set Succesfully')).toBeVisible();
  await expect(page).toHaveURL(/welcome\/profile-setup/);

  //set personal information
  await page.getByRole('textbox', { name: 'Full Name' }).fill('JJK JJK');
  await page.locator('input[name="dateOfBirth"]').fill('2001-11-02');
  await page.getByRole('textbox', { name: 'Phone' }).fill('9876543212');
  await page.getByRole('radio', { name: 'FEMALE' }).check();
  await page.getByRole('textbox', { name: 'Address' }).fill('Kathmandu');
  await page.getByRole('textbox', { name: 'Emergency Name' }).fill('Hello');
  await page.getByRole('textbox', { name: 'Emergency Contact' }).fill('1111111111');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Personal info saved')).toBeVisible();


});