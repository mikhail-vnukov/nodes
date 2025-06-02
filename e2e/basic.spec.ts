import { test, expect } from '@playwright/test';
import { exposeZustandStore } from './utils';

test.beforeEach(async ({ request }) => {
  await request.delete('http://localhost:3000/api/test/tasks');
});

function shortGuid() {
  return Math.random().toString(36).substring(2, 8);
}

function getTaskNodeTestId(title) {
  return `task-node-${title.replace(/\s+/g, '-')}`;
}

test('user can add and delete a task', async ({ page }) => {
  const taskTitle = `E2E Task ${shortGuid()}`;
  await page.goto('/');
  await exposeZustandStore(page);
  // Add a new task
  await page.getByText('Add Task').click();
  await page.getByLabel('Title').fill(taskTitle);
  await page.getByLabel('Description').fill('Created by Playwright E2E test');
  await page.getByLabel('Status').click();
  await page.getByRole('option', { name: /^to do$/i }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  await page.getByTestId('RefreshIcon').click();
  await expect(page.getByTestId(getTaskNodeTestId(taskTitle))).toBeVisible();
  // Confirm task exists in store
  const nodes = await page.evaluate(() => {
    // @ts-ignore
    return window.__zustandStore?.getState ? window.__zustandStore.getState().nodes : [];
  });
  console.log('Nodes in store:', nodes);
  // Delete the task
  await page.getByTestId(getTaskNodeTestId(taskTitle)).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  await page.getByTestId('RefreshIcon').click();
  await expect(page.getByTestId(getTaskNodeTestId(taskTitle))).toHaveCount(0);
});

test('homepage loads and displays main UI', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/graph task manager/i);
  await expect(page.getByText('Add Task')).toBeVisible();
}); 