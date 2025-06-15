import React, { useCallback, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useNodeStore } from './store'
import TaskNode from './components/TaskNode'

// Define the node types for ReactFlow
const nodeTypes = {
  taskNode: TaskNode
}

function FlowCanvas() {
  const { 
    nodes, 
    edges, 
    addNode, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    stopEditingNode,
    editingNodeId
  } = useNodeStore()
  
  const { screenToFlowPosition } = useReactFlow()
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickCountRef = useRef<number>(0)
  const lastClickPositionRef = useRef<{ x: number; y: number } | null>(null)

  const onPaneClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      clickCountRef.current += 1
      
      // Capture the position immediately
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })
      lastClickPositionRef.current = position

      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }

      // Set a timeout to determine if this is a single or double click
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // Single click - just stop editing if there's an editing node
          if (editingNodeId) {
            stopEditingNode()
          }
        } else if (clickCountRef.current >= 2 && lastClickPositionRef.current) {
          // Double click - create new node
          addNode(lastClickPositionRef.current, true)
        }
        
        // Reset click count and position
        clickCountRef.current = 0
        lastClickPositionRef.current = null
        clickTimeoutRef.current = null
      }, 250) // 250ms window for double-click detection
    },
    [screenToFlowPosition, addNode, stopEditingNode, editingNodeId]
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        fitView
        data-testid="react-flow-canvas"
      >
        <Panel position="top-left">
          <div style={{
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div>Double-click anywhere on the canvas to add a new task node</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              New nodes start in edit mode. Double-click existing nodes to edit.
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}

export default App 