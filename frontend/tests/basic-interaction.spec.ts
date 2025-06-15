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
  })

  test('should add a node when clicking on empty area', async ({ page }) => {
    // Wait for the canvas to be ready
    await page.waitForSelector('[data-testid="rf__wrapper"]')
    
    // Click on an empty area of the canvas
    const canvas = page.getByTestId('rf__wrapper')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Check that a node with "Task 1" appears
    await expect(page.getByText('Task 1')).toBeVisible()
    
    // Verify the node is actually a ReactFlow node
    await expect(page.locator('.react-flow__node-default').filter({ hasText: 'Task 1' })).toBeVisible()
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
    await expect(page.locator('.react-flow__node-default')).toHaveCount(3)
  })

  test('should add nodes at different positions', async ({ page }) => {
    // Wait for the canvas to be ready
    await page.waitForSelector('[data-testid="rf__wrapper"]')
    
    const canvas = page.getByTestId('rf__wrapper')
    
    // Click at specific positions and verify nodes appear
    await canvas.click({ position: { x: 100, y: 100 } })
    const firstNode = page.locator('.react-flow__node-default').filter({ hasText: 'Task 1' })
    await expect(firstNode).toBeVisible()
    
    await canvas.click({ position: { x: 500, y: 300 } })
    const secondNode = page.locator('.react-flow__node-default').filter({ hasText: 'Task 2' })
    await expect(secondNode).toBeVisible()
    
    // Verify both nodes exist and are in different positions
    await expect(page.locator('.react-flow__node-default')).toHaveCount(2)
    
    // Check that the nodes are not overlapping by verifying their positions are different
    const firstBox = await firstNode.boundingBox()
    const secondBox = await secondNode.boundingBox()
    
    expect(firstBox).not.toBeNull()
    expect(secondBox).not.toBeNull()
    
    // Nodes should be in different positions
    expect(firstBox!.x).not.toBe(secondBox!.x)
    expect(firstBox!.y).not.toBe(secondBox!.y)
  })
}) 