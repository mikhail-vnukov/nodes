export interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

export interface TaskRelationship {
  sourceId: string;
  targetId: string;
  type: "DEPENDS_ON" | "RELATED_TO" | "SUBTASK_OF";
  weight?: number;
}

export interface TaskNode {
  task: Task;
  position: { x: number; y: number };
}

export interface TaskGraph {
  nodes: TaskNode[];
  edges: TaskRelationship[];
}
