import { expect, test } from '@playwright/test';

const BASE_URL = 'https://hrmapp.soanitech.com/';

test.describe('Checklist Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    //log in as HR
    await page.locator('input[name="email"]').fill('sabubhuju0613++@gmail.com');
    await page.locator('input[name="password"]').fill('Password12#');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);

    const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
  });

  test('Admin can add new checklists',async({page})=>{
    await page.getByRole('button', { name: 'Checklists' }).click();
    await expect(page).toHaveURL(/checklists/);

    await expect(page.getByRole('button', { name: 'Add Checklist' })).toBeVisible();
    await page.getByRole('button', { name: 'Add Checklist' }).click();
    await expect(page.getByText('Add New Checklist')).toBeVisible();

    await page.getByRole('textbox', { name: 'Checklist Name' }).fill('New');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Checklist created successfully!')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('New')).toBeVisible();
  });

  test('Checklist can be deleted',async({page})=>{
    await page.getByRole('button', { name: 'Checklists' }).click();
    await expect(page).toHaveURL(/checklists/);

    
  });

  test('Assigning the test case to users',async({page})=>{
    await page.getByRole('button', { name: 'Employees'}).click();
    await expect(page).toHaveURL(/employee/);

    const employeeRow = page.getByRole('row', { name: /Jivraj Ghimire/i });
    await employeeRow.getByRole('button').nth(1).click(); // second button in that row
    await expect(page.getByText('Onboarding Checklist')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Onboarding Checklist' }).click();
    await expect(page).toHaveURL(/onboarding-checklist$/);

    const assignChecklist = async (index: number) => {
    await page.getByRole('button', { name: '+ Assign Checklist' }).click();
    await expect(page.getByText('Assign checklist from the list below')).toBeVisible();

    await page.getByRole('button', { name: 'Assign' }).nth(index).click();
    await expect(page.getByText('Checklist added succesfully')).toBeVisible();
  };

  await assignChecklist(0);
  await assignChecklist(1);

  });

  test('Unassign the checklist previously assigned to user',async({page})=>{
    await page.getByRole('button', { name: 'Employees'}).click();
    await expect(page).toHaveURL(/employee/);

    const employeeRow = page.getByRole('row', { name: /Jivraj Ghimire/i });
    await employeeRow.getByRole('button').nth(1).click(); // second button in that row
    await expect(page.getByText('Onboarding Checklist')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Onboarding Checklist' }).click();
    await expect(page).toHaveURL(/onboarding-checklist$/);

    await page.getByText('x Unassign').nth(0).click();
    await expect(page.getByText('Checklist removed succesfully')).toBeVisible();

  });



});