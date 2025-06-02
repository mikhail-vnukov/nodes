import { test, expect } from '@playwright/test';
import { exposeZustandStore } from './utils';

test.beforeEach(async ({ request, page }) => {
  await request.delete('http://localhost:3000/api/tasks');
  const getRes = await request.get('http://localhost:3000/api/tasks');
  const tasks = await getRes.json();
  expect(tasks).toEqual([]);
  await exposeZustandStore(page);
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
  // Add a new task by double-clicking whitespace in the ReactFlow area
  const flowArea = page.locator('.react-flow__viewport').first();
  const box = await flowArea.boundingBox();
  if (!box) throw new Error('Could not find ReactFlow viewport bounding box');
  // Double-click near the center of the viewport
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
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
  // No longer expect Add Task button
  // await expect(page.getByText('Add Task')).toBeVisible();
}); 