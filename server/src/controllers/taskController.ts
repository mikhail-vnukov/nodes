import { Request, Response } from 'express';
import { getDriver } from '../config/neo4j';
import { Task, TaskRelationship } from '../types/task';
import { summarizeTasks, decomposeTasks } from '../services/openai';

export const createTask = async (req: Request, res: Response) => {
  const task: Task = {
    ...req.body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const driver = getDriver();
  const session = driver.session();

  try {
    await session.executeWrite(tx =>
      tx.run(
        `
        CREATE (t:Task {
          id: $id,
          title: $title,
          description: $description,
          status: $status,
          createdAt: $createdAt,
          updatedAt: $updatedAt
        })
        RETURN t
        `,
        task
      )
    );
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  } finally {
    await session.close();
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.executeRead(tx =>
      tx.run(`
        MATCH (t:Task)
        RETURN t
      `)
    );

    const tasks = result.records.map(record => record.get('t').properties);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  } finally {
    await session.close();
  }
};

export const createRelationship = async (req: Request, res: Response) => {
  const relationship: TaskRelationship = req.body;
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.executeWrite(tx =>
      tx.run(
        `
        MATCH (source:Task {id: $sourceId})
        MATCH (target:Task {id: $targetId})
        CREATE (source)-[r:${relationship.type} {weight: $weight}]->(target)
        RETURN r
        `,
        relationship
      )
    );
    res.status(201).json(relationship);
  } catch (error) {
    console.error('Error creating relationship:', error);
    res.status(500).json({ error: 'Failed to create relationship' });
  } finally {
    await session.close();
  }
};

export const getTaskGraph = async (_req: Request, res: Response) => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.executeRead(tx =>
      tx.run(`
        MATCH (t:Task)
        OPTIONAL MATCH (t)-[r]->(t2:Task)
        RETURN t, COLLECT(DISTINCT {
          sourceId: t.id,
          targetId: t2.id,
          type: type(r),
          weight: r.weight
        }) as relationships
      `)
    );

    const nodes = result.records.map(record => ({
      task: record.get('t').properties,
      position: { x: 0, y: 0 } // Frontend will handle layout
    }));

    const edges = result.records.flatMap(record =>
      record.get('relationships').filter((r: any) => r.targetId != null)
    );

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Error fetching task graph:', error);
    res.status(500).json({ error: 'Failed to fetch task graph' });
  } finally {
    await session.close();
  }
};

export const summarizeConnectedTasks = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.executeRead(tx =>
      tx.run(
        `
        MATCH (t:Task {id: $taskId})
        MATCH (t)-[*]-(connected:Task)
        RETURN collect(distinct connected) + collect(t) as tasks
        `,
        { taskId }
      )
    );

    const tasks = result.records[0]
      .get('tasks')
      .map((t: any) => t.properties as Task);

    const summary = await summarizeTasks(tasks);
    res.json({ summary, tasks });
  } catch (error) {
    console.error('Error summarizing tasks:', error);
    res.status(500).json({ error: 'Failed to summarize tasks' });
  } finally {
    await session.close();
  }
};

export const decomposeTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.executeRead(tx =>
      tx.run(
        `
        MATCH (t:Task {id: $taskId})
        RETURN t
        `,
        { taskId }
      )
    );

    const task = result.records[0].get('t').properties as Task;
    const subtasks = await decomposeTasks(task);

    // Create subtasks and relationships in Neo4j
    await session.executeWrite(async tx => {
      for (const subtask of subtasks) {
        await tx.run(
          `
          CREATE (t:Task {
            id: $id,
            title: $title,
            description: $description,
            status: $status,
            createdAt: $createdAt,
            updatedAt: $updatedAt,
            parentId: $parentId
          })
          WITH t
          MATCH (parent:Task {id: $parentId})
          CREATE (t)-[:SUBTASK_OF]->(parent)
          `,
          subtask
        );
      }
    });

    res.json(subtasks);
  } catch (error) {
    console.error('Error decomposing task:', error);
    res.status(500).json({ error: 'Failed to decompose task' });
  } finally {
    await session.close();
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.executeWrite(tx =>
      tx.run(
        `
        MATCH (t:Task {id: $taskId})
        DETACH DELETE t
        `,
        { taskId }
      )
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  } finally {
    await session.close();
  }
};

export const deleteAllTasks = async (_req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const driver = getDriver();
  const session = driver.session();
  try {
    await session.executeWrite(tx =>
      tx.run(`MATCH (t:Task) DETACH DELETE t`)
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting all tasks:', error);
    res.status(500).json({ error: 'Failed to delete all tasks' });
  } finally {
    await session.close();
  }
}; 