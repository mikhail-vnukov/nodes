import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getDriver } from '../../config/neo4j';
import {
  createTask,
  getTasks,
  createRelationship,
  getTaskGraph,
  summarizeConnectedTasks,
  decomposeTask,
} from '../taskController';

vi.mock('../../config/neo4j', () => ({
  getDriver: vi.fn(),
}));

describe('taskController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  const mockJson = vi.fn();
  const mockStatus = vi.fn().mockReturnThis();
  const mockSession = {
    executeRead: vi.fn(),
    executeWrite: vi.fn(),
    close: vi.fn(),
  };

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
    vi.clearAllMocks();
    vi.mocked(getDriver).mockReturnValue({
      session: () => mockSession,
    } as any);
  });

  describe('createTask', () => {
    it('creates a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
      };
      mockReq.body = taskData;

      vi.mocked(mockSession.executeWrite).mockResolvedValueOnce({ records: [] });

      await createTask(mockReq as Request, mockRes as Response);

      expect(mockSession.executeWrite).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          ...taskData,
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });
  });

  describe('getTasks', () => {
    it('returns all tasks', async () => {
      const mockTasks = [
        {
          properties: {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            status: 'TODO',
          },
        },
      ];

      vi.mocked(mockSession.executeRead).mockResolvedValueOnce({
        records: mockTasks.map(task => ({
          get: (key: string) => task,
        })),
      });

      await getTasks(mockReq as Request, mockRes as Response);

      expect(mockSession.executeRead).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            title: 'Task 1',
          }),
        ])
      );
    });
  });

  describe('getTaskGraph', () => {
    it('returns nodes and edges', async () => {
      const mockGraphData = {
        records: [
          {
            get: (key: string) => {
              if (key === 't') {
                return {
                  properties: {
                    id: '1',
                    title: 'Task 1',
                  },
                };
              }
              return [];
            },
          },
        ],
      };

      vi.mocked(mockSession.executeRead).mockResolvedValueOnce(mockGraphData);

      await getTaskGraph(mockReq as Request, mockRes as Response);

      expect(mockSession.executeRead).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        nodes: expect.arrayContaining([
          expect.objectContaining({
            task: expect.objectContaining({ id: '1' }),
            position: expect.any(Object),
          }),
        ]),
        edges: expect.any(Array),
      });
    });
  });

  describe('summarizeConnectedTasks', () => {
    it('returns summary of connected tasks', async () => {
      mockReq.params = { taskId: '1' };
      const mockConnectedTasks = {
        records: [
          {
            get: () => [
              { properties: { id: '1', title: 'Task 1' } },
              { properties: { id: '2', title: 'Task 2' } },
            ],
          },
        ],
      };

      vi.mocked(mockSession.executeRead).mockResolvedValueOnce(mockConnectedTasks);

      await summarizeConnectedTasks(mockReq as Request, mockRes as Response);

      expect(mockSession.executeRead).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: expect.any(String),
          tasks: expect.arrayContaining([
            expect.objectContaining({ id: expect.any(String) }),
          ]),
        })
      );
    });
  });
}); 