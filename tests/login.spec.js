const { test, expect } = require('@playwright/test');

test.describe('Logowanie użytkownika', () => {
  test('Poprawne logowanie przekierowuje na profil użytkownika', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/user/login');
    await page.fill('input#email', 'dawid.dyl2@wp.pl');
    await page.fill('input#password', 'dawid98D');
    await page.click('button[type="submit"]');

    await page.waitForURL('http://localhost:3000/user/profile', {
      timeout: 10000,
    });
    expect(page.url()).toBe('http://localhost:3000/user/profile');
  });

  test('Niepoprawne logowanie', async ({ page }) => {
    await page.goto('http://localhost:3000/user/login');
    await page.fill('input#email', 'wronguser@example.com');
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    const errorMessage = await page.locator(
      'text=Nieprawidłowe dane logowania. Sprawdź adres e-mail i hasło.'
    );
    await expect(errorMessage).toBeVisible();
  });

  test('Użytkownik niezalogowany nie widzi linku do profilu w sidebarze', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000');

    const profileLink = await page.locator('text=profile');
    await expect(profileLink).toHaveCount(0);
  });
});
