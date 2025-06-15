import { create } from 'zustand'
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'

export interface TaskNode extends Node {
  data: {
    label: string
    isEditing?: boolean
  }
}

interface NodeStore {
  nodes: TaskNode[]
  edges: Edge[]
  nodeCounter: number
  editingNodeId: string | null
  addNode: (position: { x: number; y: number }) => void
  updateNodeText: (nodeId: string, newText: string) => void
  startEditingNode: (nodeId: string) => void
  stopEditingNode: () => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  nodes: [],
  edges: [],
  nodeCounter: 0,
  editingNodeId: null,
  
  addNode: (position) => {
    const counter = get().nodeCounter + 1
    const newNode: TaskNode = {
      id: `node-${counter}`,
      type: 'taskNode',
      position,
      data: {
        label: `Task ${counter}`,
        isEditing: false
      }
    }
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      nodeCounter: counter
    }))
  },

  updateNodeText: (nodeId, newText) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newText.trim() || `Task ${node.id.split('-')[1]}` } }
          : node
      )
    }))
  },

  startEditingNode: (nodeId) => {
    set((state) => ({
      editingNodeId: nodeId,
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isEditing: true } }
          : { ...node, data: { ...node.data, isEditing: false } }
      )
    }))
  },

  stopEditingNode: () => {
    set((state) => ({
      editingNodeId: null,
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, isEditing: false }
      }))
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