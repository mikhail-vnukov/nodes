import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { Task } from '../types/task';
import { useTaskStore } from '../store/taskStore';

interface TaskDialogProps {
  task: Task;
  onClose: () => void;
}

export const TaskDialog = ({ task, onClose }: TaskDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { summarizeConnectedTasks, decomposeTask } = useTaskStore();

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const summary = await summarizeConnectedTasks(task.id);
      setSummary(summary);
    } catch (error) {
      console.error('Error summarizing tasks:', error);
    }
    setLoading(false);
  };

  const handleDecompose = async () => {
    setLoading(true);
    try {
      await decomposeTask(task.id);
      onClose();
    } catch (error) {
      console.error('Error decomposing task:', error);
    }
    setLoading(false);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {task.description}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Status: {task.status}
        </Typography>
        {summary && (
          <>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Connected Tasks Summary
            </Typography>
            <Typography variant="body2">{summary}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSummarize}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Summarize Connected
        </Button>
        <Button
          onClick={handleDecompose}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Decompose
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}; 