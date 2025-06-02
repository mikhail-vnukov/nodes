import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Task } from "../types/task";

interface AddTaskDialogProps {
  open: boolean;
  title: string;
  description: string;
  status: Task["status"];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onStatusChange: (status: Task["status"]) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddTaskDialog = ({
  open,
  title,
  description,
  status,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onClose,
  onSubmit,
}: AddTaskDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Status"
          fullWidth
          value={status}
          onChange={(e) => onStatusChange(e.target.value as Task["status"])}
        >
          <MenuItem value="TODO">To Do</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
