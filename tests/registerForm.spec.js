const { test, expect } = require('@playwright/test');

test.describe('Formularz rejestracji', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/user/register');
  });

  test('Wyświetlenie formularza rejestracji', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Rejestracja');
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Walidacja pustego formularza', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(
      page.locator('p:has-text("Nazwa użytkownika jest wymagana!")')
    ).toBeVisible();
    await expect(
      page.locator('p:has-text("Email jest wymagany!")')
    ).toBeVisible();
    await expect(
      page.locator('p:has-text("Hasło jest wymagane!")')
    ).toBeVisible();
    await expect(
      page.locator('p:has-text("Potwierdzenie hasła jest wymagane!")')
    ).toBeVisible();
  });

  test('Walidacja błędnego adresu email', async ({ page }) => {
    await page.fill('input#email', 'niepoprawnyemail');
    await page.click('button[type="submit"]');
    const validationMessage = await page
      .locator('input#email')
      .evaluate(input => input.validationMessage);
    expect(validationMessage).toContain("'@'");
  });

  test('Walidacja minimalnej długości hasła', async ({ page }) => {
    await page.fill('input#password', '123');
    await page.click('button[type="submit"]');
    await expect(
      page.locator('p:has-text("Hasło musi mieć co najmniej 6 znaków!")')
    ).toBeVisible();
  });

  test('Walidacja niezgodnych haseł', async ({ page }) => {
    await page.fill('input#password', 'haslo123');
    await page.fill('input#confirmPassword', 'innehaslo');
    await page.click('button[type="submit"]');
    await expect(
      page.locator('p:has-text("Hasła muszą być zgodne!")')
    ).toBeVisible();
  });

  test('Poprawny proces rejestracji z wylogowaniem', async ({ page }) => {
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    await page.goto('http://localhost:3000/user/register');

    await page.fill('input#username', 'testuser');
    await page.fill('input#email', uniqueEmail);
    await page.fill('input#password', 'haslo123');
    await page.fill('input#confirmPassword', 'haslo123');

    await page.click('button[type="submit"]');

    await page.waitForURL('http://localhost:3000/user/login', {
      timeout: 10000,
    });
    expect(page.url()).toBe('http://localhost:3000/user/login');
  });

  test('Obsługa błędu rejestracji', async ({ page }) => {
    await page.fill('input#username', 'testuser');
    await page.fill('input#email', 'existinguser@example.com');
    await page.fill('input#password', 'haslo123');
    await page.fill('input#confirmPassword', 'haslo123');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=Rejestracja nie powiodła się. Spróbuj ponownie.')
    ).toBeVisible();
  });
});
