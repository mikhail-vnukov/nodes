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
}); 