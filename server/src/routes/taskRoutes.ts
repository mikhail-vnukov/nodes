import { Router } from 'express';
import {
  createTask,
  getTasks,
  createRelationship,
  getTaskGraph,
  summarizeConnectedTasks,
  decomposeTask
} from '../controllers/taskController';

const router = Router();

// Task CRUD
router.post('/tasks', createTask);
router.get('/tasks', getTasks);

// Graph operations
router.post('/relationships', createRelationship);
router.get('/graph', getTaskGraph);

// AI operations
router.get('/tasks/:taskId/summarize', summarizeConnectedTasks);
router.post('/tasks/:taskId/decompose', decomposeTask);

export default router; 