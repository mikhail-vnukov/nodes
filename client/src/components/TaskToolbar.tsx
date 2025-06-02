import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

interface TaskToolbarProps {
  onRefresh: () => Promise<void>;
}

export const TaskToolbar = ({ onRefresh }: TaskToolbarProps) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
