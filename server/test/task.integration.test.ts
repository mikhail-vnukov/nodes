import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';

describe('Task API integration', () => {
  it('should create a new task', async () => {
    const newTask = {
      title: 'Integration Test Task',
      description: 'Created by integration test',
      status: 'TODO',
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        ...newTask,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it('should delete all tasks via /api/test/tasks', async () => {
    // Ensure NODE_ENV is 'test' for this test
    process.env.NODE_ENV = 'test';

    // Create a task
    const newTask = {
      title: 'Task to delete',
      description: 'Should be deleted',
      status: 'TODO',
    };
    await request(app).post('/api/tasks').send(newTask).expect(201);

    // Delete all tasks
    await request(app).delete('/api/test/tasks').expect(204);

    // Ensure all tasks are deleted
    const getRes = await request(app).get('/api/tasks').expect(200);
    expect(getRes.body).toEqual([]);
  });
}); 