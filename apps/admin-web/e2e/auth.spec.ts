import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to sign in', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Expect to be redirected to the dashboard or a protected route
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('h1')).toHaveText('Welcome, Admin!');
  });

  test('should show an error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Expect to see an error message
    await expect(page.locator('.error-message')).toHaveText('Invalid credentials');
    await expect(page).toHaveURL('http://localhost:3000/auth/signin');
  });

  test('should allow a user to sign out', async ({ page }) => {
    // First, sign in
    await page.goto('http://localhost:3000/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // Then, sign out
    await page.click('button[data-testid="signout-button"]');

    // Expect to be redirected to the sign-in page
    await expect(page).toHaveURL('http://localhost:3000/auth/signin');
    await expect(page.locator('h1')).toHaveText('Sign In');
  });
});

