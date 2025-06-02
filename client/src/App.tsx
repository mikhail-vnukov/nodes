import { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TaskNode } from './components/TaskNode';
import { TaskDialog } from './components/TaskDialog';
import { TaskToolbar } from './components/TaskToolbar';
import { useTaskStore } from './store/taskStore';
import { Task } from './types/task';

const nodeTypes = {
  task: TaskNode
};

function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const {
    nodes,
    edges,
    addTask,
    updateNodes,
    updateEdges,
    fetchTasks,
    createRelationship
  } = useTaskStore();

  // Expose the store for E2E debugging
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__zustandStore = useTaskStore;
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, updateNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateEdges(applyEdgeChanges(changes, edges));
    },
    [edges, updateEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      updateEdges(addEdge(connection, edges));
      if (connection.source && connection.target) {
        createRelationship({
          sourceId: connection.source,
          targetId: connection.target,
          type: 'RELATED_TO'
        });
      }
    },
    [edges, updateEdges, createRelationship]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    const task = (node.data as Task);
    setSelectedTask(task);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <TaskToolbar onAddTask={addTask} onRefresh={fetchTasks} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default App; 