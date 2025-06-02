import { create } from "zustand";
import { Node, Edge } from "reactflow";
import axios from "axios";
import { Task, TaskRelationship } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface TaskState {
  nodes: Node[];
  edges: Edge[];
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (edges: Edge[]) => void;
  fetchTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
    position?: { x: number; y: number },
  ) => Promise<void>;
  createRelationship: (
    relationship: Omit<TaskRelationship, "weight">,
  ) => Promise<void>;
  summarizeConnectedTasks: (taskId: string) => Promise<string>;
  decomposeTask: (taskId: string) => Promise<Task[]>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  nodes: [],
  edges: [],

  updateNodes: (nodes) => set({ nodes }),
  updateEdges: (edges) => set({ edges }),

  fetchTasks: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/graph`);
      const nodes = data.nodes.map(
        (node: { task: Task; position: { x: number; y: number } }) => ({
          id: node.task.id,
          type: "task",
          position: node.position,
          data: node.task,
        }),
      );
      set({ nodes, edges: data.edges });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  addTask: async (task, position) => {
    try {
      const { data } = await axios.post(`${API_URL}/tasks`, task);
      set((state) => ({
        nodes: [
          ...state.nodes,
          {
            id: data.id,
            type: "task",
            position: position || {
              x: Math.random() * 500,
              y: Math.random() * 500,
            },
            data: data,
          },
        ],
      }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  createRelationship: async (relationship) => {
    try {
      await axios.post(`${API_URL}/relationships`, relationship);
    } catch (error) {
      console.error("Error creating relationship:", error);
    }
  },

  summarizeConnectedTasks: async (taskId) => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks/${taskId}/summarize`);
      return data.summary;
    } catch (error) {
      console.error("Error summarizing tasks:", error);
      return "";
    }
  },

  decomposeTask: async (taskId) => {
    try {
      const { data } = await axios.post(`${API_URL}/tasks/${taskId}/decompose`);
      const newNodes = data.map((task: Task) => ({
        id: task.id,
        type: "task",
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: task,
      }));
      set((state) => ({
        nodes: [...state.nodes, ...newNodes],
      }));
      return data;
    } catch (error) {
      console.error("Error decomposing task:", error);
      return [];
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== taskId),
        edges: state.edges.filter(
          (edge) => edge.source !== taskId && edge.target !== taskId,
        ),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));
