# Test info

- Name: user can add and delete a task
- Location: /Users/mikhail/Workspace/nodes/e2e/basic.spec.ts:20:5

# Error details

```
TimeoutError: locator.click: Timeout 5000ms exceeded.
Call log:
  - waiting for getByTestId('task-node-E2E-Task-juq5ed')
    - locator resolved to <div data-testid="task-node-E2E-Task-juq5ed">…</div>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - element is outside of the viewport
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - element is outside of the viewport
    - retrying click action
      - waiting 100ms
    9 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - element is outside of the viewport
    - retrying click action
      - waiting 500ms

    at /Users/mikhail/Workspace/nodes/e2e/basic.spec.ts:44:56
```

# Page snapshot

```yaml
- banner:
  - button
- img
- button "E2E Task juq5ed Created by Playwright E2E test TODO":
  - text: E2E Task juq5ed
  - paragraph: Created by Playwright E2E test
  - text: TODO
- img
- button "zoom in" [disabled]:
  - img
- button "zoom out":
  - img
- button "fit view":
  - img
- button "toggle interactivity":
  - img
- link "React Flow attribution":
  - /url: https://reactflow.dev
  - text: React Flow
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { exposeZustandStore } from './utils';
   3 |
   4 | test.beforeEach(async ({ request, page }) => {
   5 |   await request.delete('http://localhost:3000/api/tasks');
   6 |   const getRes = await request.get('http://localhost:3000/api/tasks');
   7 |   const tasks = await getRes.json();
   8 |   expect(tasks).toEqual([]);
   9 |   await exposeZustandStore(page);
  10 | });
  11 |
  12 | function shortGuid() {
  13 |   return Math.random().toString(36).substring(2, 8);
  14 | }
  15 |
  16 | function getTaskNodeTestId(title) {
  17 |   return `task-node-${title.replace(/\s+/g, '-')}`;
  18 | }
  19 |
  20 | test('user can add and delete a task', async ({ page }) => {
  21 |   const taskTitle = `E2E Task ${shortGuid()}`;
  22 |   await page.goto('/');
  23 |   // Add a new task by double-clicking whitespace in the ReactFlow area
  24 |   const flowArea = page.locator('.react-flow__viewport').first();
  25 |   const box = await flowArea.boundingBox();
  26 |   if (!box) throw new Error('Could not find ReactFlow viewport bounding box');
  27 |   // Double-click near the center of the viewport
  28 |   await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  29 |   await page.getByLabel('Title').fill(taskTitle);
  30 |   await page.getByLabel('Description').fill('Created by Playwright E2E test');
  31 |   await page.getByLabel('Status').click();
  32 |   await page.getByRole('option', { name: /^to do$/i }).click();
  33 |   await page.getByRole('button', { name: 'Create' }).click();
  34 |   await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  35 |   await page.getByTestId('RefreshIcon').click();
  36 |   await expect(page.getByTestId(getTaskNodeTestId(taskTitle))).toBeVisible();
  37 |   // Confirm task exists in store
  38 |   const nodes = await page.evaluate(() => {
  39 |     // @ts-ignore
  40 |     return window.__zustandStore?.getState ? window.__zustandStore.getState().nodes : [];
  41 |   });
  42 |   console.log('Nodes in store:', nodes);
  43 |   // Delete the task
> 44 |   await page.getByTestId(getTaskNodeTestId(taskTitle)).click();
     |                                                        ^ TimeoutError: locator.click: Timeout 5000ms exceeded.
  45 |   await expect(page.getByRole('dialog')).toBeVisible();
  46 |   await page.getByRole('button', { name: 'Delete' }).click();
  47 |   await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  48 |   await page.getByTestId('RefreshIcon').click();
  49 |   await expect(page.getByTestId(getTaskNodeTestId(taskTitle))).toHaveCount(0);
  50 | });
  51 |
  52 | test('homepage loads and displays main UI', async ({ page }) => {
  53 |   await page.goto('/');
  54 |   await expect(page).toHaveTitle(/graph task manager/i);
  55 |   // No longer expect Add Task button
  56 |   // await expect(page.getByText('Add Task')).toBeVisible();
  57 | }); 
```