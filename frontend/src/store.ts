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
  addNode: (position: { x: number; y: number }, startEditing?: boolean) => void
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
  
  addNode: (position, startEditing = false) => {
    const counter = get().nodeCounter + 1
    const nodeId = `node-${counter}`
    
    // Center the node at the cursor position
    // Based on CSS: min-width 120px, padding 12px each side, min-height ~40px + padding 12px each side
    // Total approximate dimensions: 144px width (120 + 24), 64px height (40 + 24)
    const centeredPosition = {
      x: position.x - 60, // Half of approximate width (120px + padding)
      y: position.y - 32  // Half of approximate height (64px total)
    }
    
    const newNode: TaskNode = {
      id: nodeId,
      type: 'taskNode',
      position: centeredPosition,
      data: {
        label: `Task ${counter}`,
        isEditing: startEditing
      }
    }
    
    set((state) => {
      const newState = {
        nodes: [
          // Set all existing nodes to not editing
          ...state.nodes.map((node) => ({
            ...node,
            data: { ...node.data, isEditing: false }
          })),
          // Add the new node
          newNode
        ],
        nodeCounter: counter,
        editingNodeId: startEditing ? nodeId : null
      }
      return newState
    })
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