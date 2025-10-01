import {
  Box,
  Dialog,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const Progress = () => {
  const progressDialog = useSelector((state) => state.sync.progressDialog);
  const progressPercent = useSelector((state) => state.sync.progressPercent);
  return (
    <Dialog open={progressDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography color="#000000">Syncing...</Typography>
        <Typography color="#000000">{`${Math.round(progressPercent)}%`}</Typography>
      </DialogTitle>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" value={progressPercent} />
      </Box>
    </Dialog>
  );
};

export default Progress;
