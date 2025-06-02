import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Task } from '../types/task';

interface TaskToolbarProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const TaskToolbar = ({ onAddTask, onRefresh }: TaskToolbarProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');

  const handleSubmit = async () => {
    await onAddTask({
      title,
      description,
      status
    });
    setOpen(false);
    setTitle('');
    setDescription('');
    setStatus('TODO');
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Add Task
            </Button>
          </Box>
          <IconButton onClick={onRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 