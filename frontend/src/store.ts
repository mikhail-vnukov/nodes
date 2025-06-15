import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
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
  addNodeFromConnector: (sourceNodeId: string, handleType: 'source' | 'target') => void
  updateNodeText: (nodeId: string, newText: string) => void
  startEditingNode: (nodeId: string) => void
  stopEditingNode: () => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
}

// localStorage helpers
const STORAGE_KEY = 'nodes-app-state'

const saveToLocalStorage = (nodes: TaskNode[], nodeCounter: number) => {
  try {
    const dataToSave = {
      nodes: nodes.map(node => ({
        ...node,
        data: { ...node.data, isEditing: false } // Don't persist editing state
      })),
      nodeCounter
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

const loadFromLocalStorage = (): { nodes: TaskNode[], nodeCounter: number } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        nodes: parsed.nodes || [],
        nodeCounter: parsed.nodeCounter || 0
      }
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
  }
  return { nodes: [], nodeCounter: 0 }
}

// Load initial state from localStorage
const initialState = loadFromLocalStorage()

export const useNodeStore = create<NodeStore>()(
  subscribeWithSelector((set, get) => ({
    nodes: initialState.nodes,
    edges: [],
    nodeCounter: initialState.nodeCounter,
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

    addNodeFromConnector: (sourceNodeId, handleType) => {
      const sourceNode = get().nodes.find(node => node.id === sourceNodeId)
      if (!sourceNode) return

      const counter = get().nodeCounter + 1
      const newNodeId = `node-${counter}`
      
      // Calculate position for the new node based on handle type
      const offsetDistance = 150 // Distance between nodes
      let newPosition: { x: number; y: number }
      
      if (handleType === 'source') {
        // Create node below the source node
        newPosition = {
          x: sourceNode.position.x,
          y: sourceNode.position.y + offsetDistance
        }
      } else {
        // Create node above the target node  
        newPosition = {
          x: sourceNode.position.x,
          y: sourceNode.position.y - offsetDistance
        }
      }
      
      const newNode: TaskNode = {
        id: newNodeId,
        type: 'taskNode',
        position: newPosition,
        data: {
          label: `Task ${counter}`,
          isEditing: true // Start in edit mode for new connector-created nodes
        }
      }

      // Create the connection between nodes
      let newEdge: Edge
      if (handleType === 'source') {
        // Connect source node's bottom to new node's top
        newEdge = {
          id: `edge-${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          sourceHandle: null,
          targetHandle: null
        }
      } else {
        // Connect new node's bottom to target node's top
        newEdge = {
          id: `edge-${newNodeId}-${sourceNodeId}`,
          source: newNodeId,
          target: sourceNodeId,
          sourceHandle: null,
          targetHandle: null
        }
      }
      
      set((state) => ({
        nodes: [
          // Set all existing nodes to not editing
          ...state.nodes.map((node) => ({
            ...node,
            data: { ...node.data, isEditing: false }
          })),
          // Add the new node
          newNode
        ],
        edges: [...state.edges, newEdge],
        nodeCounter: counter,
        editingNodeId: newNodeId
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
)

// Subscribe to state changes and save to localStorage
useNodeStore.subscribe(
  (state) => ({ nodes: state.nodes, nodeCounter: state.nodeCounter }),
  (state) => saveToLocalStorage(state.nodes, state.nodeCounter),
  {
    equalityFn: (a, b) => 
      a.nodeCounter === b.nodeCounter && 
      JSON.stringify(a.nodes) === JSON.stringify(b.nodes)
  }
) 