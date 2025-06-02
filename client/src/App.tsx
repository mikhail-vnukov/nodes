import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Controls,
  Background,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { TaskNode } from "./components/TaskNode";
import { TaskDialog } from "./components/TaskDialog";
import { TaskToolbar } from "./components/TaskToolbar";
import { useTaskStore } from "./store/taskStore";
import { Task } from "./types/task";
import { AddTaskDialog } from "./components/AddTaskDialog";

const nodeTypes = {
  task: TaskNode,
};

function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTaskPosition, setNewTaskPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    status: Task["status"];
  }>({ title: "", description: "", status: "TODO" });
  const {
    nodes,
    edges,
    addTask,
    updateNodes,
    updateEdges,
    fetchTasks,
    createRelationship,
  } = useTaskStore();
  const reactFlowInstance = useReactFlow();

  // Expose the store for E2E debugging
  if (typeof window !== "undefined") {
    // @ts-expect-error: Expose zustand store for E2E debugging
    window.__zustandStore = useTaskStore;
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, updateNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateEdges(applyEdgeChanges(changes, edges));
    },
    [edges, updateEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      updateEdges(addEdge(connection, edges));
      if (connection.source && connection.target) {
        createRelationship({
          sourceId: connection.source,
          targetId: connection.target,
          type: "RELATED_TO",
        });
      }
    },
    [edges, updateEdges, createRelationship],
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    const task = node.data as Task;
    setSelectedTask(task);
  };

  const handleFlowDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target !== event.currentTarget) return; // Only trigger on whitespace
      const bounds = event.currentTarget.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      console.debug(
        "Double-click detected, opening AddTaskDialog at position:",
        position,
      );
      setNewTaskPosition(position);
      setAddDialogOpen(true);
    },
    [reactFlowInstance],
  );

  const handleAddTask = async () => {
    if (!newTaskPosition) return;
    await addTask(newTask, newTaskPosition);
    setAddDialogOpen(false);
    setNewTask({ title: "", description: "", status: "TODO" });
    setNewTaskPosition(null);
  };

  useEffect(() => {
    fetchTasks(); // Initial fetch on app load
  }, [fetchTasks]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <TaskToolbar onRefresh={fetchTasks} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        onPaneClick={handleFlowDoubleClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
      {addDialogOpen && (
        <AddTaskDialog
          open={addDialogOpen}
          title={newTask.title}
          description={newTask.description}
          status={newTask.status}
          onTitleChange={(title: string) =>
            setNewTask((t) => ({ ...t, title }))
          }
          onDescriptionChange={(description: string) =>
            setNewTask((t) => ({ ...t, description }))
          }
          onStatusChange={(status: Task["status"]) =>
            setNewTask((t) => ({ ...t, status }))
          }
          onClose={() => setAddDialogOpen(false)}
          onSubmit={handleAddTask}
        />
      )}
      {selectedTask && (
        <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default App;
