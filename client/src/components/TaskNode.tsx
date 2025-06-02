import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { Task } from '../types/task';

const statusColors = {
  TODO: 'default',
  IN_PROGRESS: 'primary',
  DONE: 'success'
} as const;

export const TaskNode = memo(({ data }: NodeProps<Task>) => {
  return (
    <div style={{ background: 'transparent' }} data-testid={`task-node-${data.title.replace(/\s+/g, '-')}`}>
      <Handle type="target" position={Position.Top} />
      <Card sx={{ minWidth: 200, maxWidth: 300 }}>
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {data.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {data.description}
          </Typography>
          <Chip
            label={data.status}
            color={statusColors[data.status]}
            size="small"
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}); 