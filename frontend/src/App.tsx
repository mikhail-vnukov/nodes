import React, { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useNodeStore } from './store'

function FlowCanvas() {
  const { 
    nodes, 
    edges, 
    addNode, 
    onNodesChange, 
    onEdgesChange, 
    onConnect 
  } = useNodeStore()
  
  const { screenToFlowPosition } = useReactFlow()

  const onPaneClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })
      addNode(position)
    },
    [screenToFlowPosition, addNode]
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
            Click anywhere on the canvas to add a new task node
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