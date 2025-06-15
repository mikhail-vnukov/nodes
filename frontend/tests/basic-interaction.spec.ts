import { test, expect } from '@playwright/test'

test.describe('Node Canvas App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the canvas', async ({ page }) => {
    // Wait for the ReactFlow canvas to be visible
    await expect(page.getByTestId('rf__wrapper')).toBeVisible()
    
    // Check that the instruction panel is visible
    await expect(page.getByText('Click anywhere on the canvas to add a new task node')).toBeVisible()
    await expect(page.getByText('Double-click any node to edit its text')).toBeVisible()
  })

  test('should add a node when clicking on empty area', async ({ page }) => {
    // Wait for the canvas to be ready
    await page.waitForSelector('[data-testid="rf__wrapper"]')
    
    // Click on an empty area of the canvas
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Check that a node with "Task 1" appears
    await expect(page.getByText('Task 1')).toBeVisible()
    
    // Verify the node is actually a custom TaskNode
    await expect(page.getByTestId('task-node')).toBeVisible()
    await expect(page.getByTestId('task-node-label')).toHaveText('Task 1')
  })

  test('should add multiple nodes when clicking multiple times', async ({ page }) => {
    // Wait for the canvas to be ready
    await page.waitForSelector('[data-testid="rf__wrapper"]')
    
    const canvas = page.getByTestId('rf__wrapper')
    
    // Click first position
    await canvas.click({ position: { x: 200, y: 150 } })
    await expect(page.getByText('Task 1')).toBeVisible()
    
    // Click second position
    await canvas.click({ position: { x: 400, y: 300 } })
    await expect(page.getByText('Task 2')).toBeVisible()
    
    // Click third position
    await canvas.click({ position: { x: 300, y: 400 } })
    await expect(page.getByText('Task 3')).toBeVisible()
    
    // Verify all nodes are present
    await expect(page.getByTestId('task-node')).toHaveCount(3)
  })

  test('should add nodes at different positions', async ({ page }) => {
    // Wait for the canvas to be ready
    await page.waitForSelector('[data-testid="rf__wrapper"]')
    
    const canvas = page.getByTestId('rf__wrapper')
    
    // Click at specific positions and verify nodes appear
    await canvas.click({ position: { x: 100, y: 100 } })
    const firstNode = page.getByTestId('task-node').filter({ hasText: 'Task 1' })
    await expect(firstNode).toBeVisible()
    
    await canvas.click({ position: { x: 500, y: 300 } })
    const secondNode = page.getByTestId('task-node').filter({ hasText: 'Task 2' })
    await expect(secondNode).toBeVisible()
    
    // Verify both nodes exist and are in different positions
    await expect(page.getByTestId('task-node')).toHaveCount(2)
    
    // Check that the nodes are not overlapping by verifying their positions are different
    const firstBox = await firstNode.boundingBox()
    const secondBox = await secondNode.boundingBox()
    
    expect(firstBox).not.toBeNull()
    expect(secondBox).not.toBeNull()
    
    // Nodes should be in different positions
    expect(firstBox!.x).not.toBe(secondBox!.x)
    expect(firstBox!.y).not.toBe(secondBox!.y)
  })

  test('should enter edit mode when double-clicking a node', async ({ page }) => {
    // Add a node first
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Wait for the node to appear
    const taskNode = page.getByTestId('task-node').first()
    await expect(taskNode).toBeVisible()
    
    // Double-click the node to enter edit mode
    await taskNode.dblclick()
    
    // Check that edit mode is active
    await expect(page.getByTestId('task-node-input')).toBeVisible()
    await expect(page.getByTestId('task-node-input')).toHaveValue('Task 1')
    await expect(page.getByTestId('task-node-label')).not.toBeVisible()
  })

  test('should save changes when pressing Enter during editing', async ({ page }) => {
    // Add a node and enter edit mode
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    const taskNode = page.getByTestId('task-node').first()
    await taskNode.dblclick()
    
    // Edit the text
    const input = page.getByTestId('task-node-input')
    await input.clear()
    await input.fill('My Custom Task')
    await input.press('Enter')
    
    // Check that the changes are saved
    await expect(page.getByTestId('task-node-input')).not.toBeVisible()
    await expect(page.getByTestId('task-node-label')).toBeVisible()
    await expect(page.getByTestId('task-node-label')).toHaveText('My Custom Task')
  })

  test('should cancel changes when pressing Escape during editing', async ({ page }) => {
    // Add a node and enter edit mode
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    const taskNode = page.getByTestId('task-node').first()
    await taskNode.dblclick()
    
    // Edit the text but then cancel
    const input = page.getByTestId('task-node-input')
    await input.clear()
    await input.fill('This should be cancelled')
    await input.press('Escape')
    
    // Check that the original text is preserved
    await expect(page.getByTestId('task-node-input')).not.toBeVisible()
    await expect(page.getByTestId('task-node-label')).toBeVisible()
    await expect(page.getByTestId('task-node-label')).toHaveText('Task 1')
  })

  test('should save changes when clicking outside during editing', async ({ page }) => {
    // Add a node and enter edit mode
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    const taskNode = page.getByTestId('task-node').first()
    await taskNode.dblclick()
    
    // Edit the text
    const input = page.getByTestId('task-node-input')
    await input.clear()
    await input.fill('Saved by blur')
    
    // Click outside to trigger blur/save
    await canvas.click({ position: { x: 500, y: 400 } })
    
    // Check that the changes are saved
    await expect(page.getByTestId('task-node-label').first()).toHaveText('Saved by blur')
  })

  test('should handle empty text by reverting to default', async ({ page }) => {
    // Add a node and enter edit mode
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    const taskNode = page.getByTestId('task-node').first()
    await taskNode.dblclick()
    
    // Clear the text completely
    const input = page.getByTestId('task-node-input')
    await input.clear()
    await input.press('Enter')
    
    // Check that it reverts to the default task name
    await expect(page.getByTestId('task-node-label')).toHaveText('Task 1')
  })

  test('should show editing hint on hover', async ({ page }) => {
    // Add a node
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    const taskNode = page.getByTestId('task-node').first()
    await expect(taskNode).toBeVisible()
    
    // Hover over the node to see the hint
    await taskNode.hover()
    await expect(page.getByText('Double-click to edit')).toBeVisible()
  })
}) 