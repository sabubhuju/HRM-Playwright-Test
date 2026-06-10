import { expect, Page, test } from '@playwright/test';

const BASE_URL = 'https://hrmapp.soanitech.com/';

const TEST_EMAIL = 'sabubhuju0613@gmail.com';
const TEST_PASSWORD = 'Password12#';

async function loginUser(page: Page) {
  await page.goto(BASE_URL);
  await page.locator('input[name="email"]').fill(TEST_EMAIL);
  await page.locator('input[name="password"]').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);

  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
}

async function navigateToProfile(page: Page) {
  const profileBtn = page.getByRole('button', { name: 'Profile Management' });
  await profileBtn.click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await expect(page).toHaveURL(/profile/);
}

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Profile management icon opens dropdown with correct menu items', async ({ page }) => {
    const profileBtn = page.getByRole('button', { name: 'Profile Management' });
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Change Password' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/profile/);
  });

  test('User can update personal information successfully', async ({ page }) => {
    await navigateToProfile(page);

    await expect(page.getByText(/Personal/i)).toBeVisible();

    const editBtn = page.getByRole('button', { name: 'Edit' }).first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    await expect(page).toHaveURL(/profile\/edit\/personal-information/);

    await page.getByRole('textbox', { name: 'Full Name' }).fill('Sabu Bhuju');
    await page.locator('input[name="dateOfBirth"]').fill('2001-11-02');
    await page.getByRole('textbox', { name: 'Phone' }).fill('9832165478');
    await page.getByRole('radio', { name: 'FEMALE' }).check();
    await page.getByRole('textbox', { name: 'Address' }).fill('Bhaktapur');

    await page.getByRole('textbox', { name: 'Emergency Name' }).fill('Emi');
    await page.getByRole('textbox', { name: 'Emergency Contact' }).fill('9875461230');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Personal info saved')).toBeVisible();
  });

  test('User can upload and save employee documents', async ({ page }) => {
    await navigateToProfile(page);

    await expect(page.getByRole('heading', { name: 'Employee Documents' })).toBeVisible();

    const editDocBtn = page.getByRole('button', { name: 'Edit' }).nth(1);
    await expect(editDocBtn).toBeVisible();
    await editDocBtn.click();

    await expect(page).toHaveURL(/profile\/edit\/documents-upload/);

    await page.getByRole('textbox', { name: 'Citizenship No' }).fill('CT-123456789');

    await page.locator('button').nth(3).click();
    await page
      .locator('label')
      .filter({ hasText: 'Upload front citizenship' })
      .setInputFiles('tests/files/icon.jpg');

    await page.locator('button').nth(4).click();
    await page
      .locator('label')
      .filter({ hasText: 'Upload back citizenship' })
      .setInputFiles('tests/files/icon.jpg');

    // ── Certificates ──
    await page
      .locator('label')
      .filter({ hasText: 'Upload certificates' })
      .setInputFiles('tests/files/icon.jpg');

    // ── Bank Details ──
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('NBC BANK');
    await page.getByRole('textbox', { name: 'Branch Name' }).fill('Kathmandu');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Document Uploaded Succesfully')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();
  });

});