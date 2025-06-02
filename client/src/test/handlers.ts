import { http, HttpResponse } from "msw";
import { Task } from "../types/task";

const baseUrl = "http://localhost:3000/api";

export const handlers = [
  // Get tasks
  http.get(`${baseUrl}/graph`, () => {
    return HttpResponse.json({
      nodes: [
        {
          task: {
            id: "1",
            title: "Test Task",
            description: "Test Description",
            status: "TODO",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    });
  }),

  // Create task
  http.post(`${baseUrl}/tasks`, async ({ request }) => {
    const task = (await request.json()) as Partial<Task>;
    return HttpResponse.json({
      id: "2",
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  // Create relationship
  http.post(`${baseUrl}/relationships`, async ({ request }) => {
    const relationship = await request.json();
    return HttpResponse.json(relationship);
  }),

  // Summarize tasks
  http.get(`${baseUrl}/tasks/:taskId/summarize`, () => {
    return HttpResponse.json({
      summary: "Test summary of connected tasks",
      tasks: [],
    });
  }),

  // Decompose task
  http.post(`${baseUrl}/tasks/:taskId/decompose`, () => {
    return HttpResponse.json([
      {
        id: "3",
        title: "Subtask 1",
        description: "Test subtask",
        status: "TODO",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: "1",
      },
    ]);
  }),
];
