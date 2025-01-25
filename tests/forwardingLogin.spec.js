const { test, expect } = require('@playwright/test');

test.describe('Rejestracja użytkownika', () => {
  test('Użytkownik po rejestracji jest przekierowany do formularza logowania', async ({
    page,
  }) => {
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    await page.goto('http://localhost:3000/user/register');

    await page.fill('input#username', 'TestUser');
    await page.fill('input#email', uniqueEmail);
    await page.fill('input#password', 'password123');
    await page.fill('input#confirmPassword', 'password123');

    await page.click('button[type="submit"]');

    await page.waitForLoadState('load');
    await page.waitForURL('http://localhost:3000/user/login', {
      timeout: 10000,
    });
    expect(page.url()).toBe('http://localhost:3000/user/login');
  });
});
