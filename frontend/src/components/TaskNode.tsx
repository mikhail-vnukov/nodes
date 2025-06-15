import React, { useState, useEffect, useRef } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { useNodeStore } from '../store'

interface TaskNodeData {
  label: string
  isEditing?: boolean
}

const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({ id, data, selected }) => {
  const { updateNodeText, startEditingNode, stopEditingNode } = useNodeStore()
  const [editText, setEditText] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update local edit text when data changes
  useEffect(() => {
    setEditText(data.label)
  }, [data.label])

  // Focus input when editing starts
  useEffect(() => {
    if (data.isEditing && inputRef.current) {
      // Use setTimeout to ensure the input is fully rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 0)
    }
  }, [data.isEditing])

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    startEditingNode(id)
    setEditText(data.label)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleInputBlur = () => {
    handleSave()
  }

  const handleSave = () => {
    updateNodeText(id, editText)
    stopEditingNode()
  }

  const handleCancel = () => {
    setEditText(data.label)
    stopEditingNode()
  }

  return (
    <div 
      className={`task-node ${selected ? 'selected' : ''}`}
      onDoubleClick={handleDoubleClick}
      data-testid="task-node"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      
      <div className="task-node-content">
        {data.isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="task-node-input"
            data-testid="task-node-input"
          />
        ) : (
          <div 
            className="task-node-label"
            data-testid="task-node-label"
          >
            {data.label}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  )
}

export default TaskNode 