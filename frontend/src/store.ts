import { create } from 'zustand'
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'

export interface TaskNode extends Node {
  data: {
    label: string
  }
}

interface NodeStore {
  nodes: TaskNode[]
  edges: Edge[]
  nodeCounter: number
  addNode: (position: { x: number; y: number }) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  nodes: [],
  edges: [],
  nodeCounter: 0,
  
  addNode: (position) => {
    const counter = get().nodeCounter + 1
    const newNode: TaskNode = {
      id: `node-${counter}`,
      type: 'default',
      position,
      data: {
        label: `Task ${counter}`
      }
    }
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      nodeCounter: counter
    }))
  },
  
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }))
  },
  
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }))
  },
  
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(connection, state.edges)
    }))
  }
})) 