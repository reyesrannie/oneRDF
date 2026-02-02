import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import {
  resetModal,
  setSystem,
} from "../../../services/server/slice/modalSlice";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import "react-tabs/style/react-tabs.css";

import "../../styles/Modal.scss";
import { useDispatch, useSelector } from "react-redux";
import System from "../../custom/System";

const SystemModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.system);
  const theme = useTheme();
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setSystem(false));
      }}
      slotProps={{
        paper: {
          sx: {
            border: `2px solid ${theme.palette.primary.main}`,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme?.palette?.primary?.main,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Systems
          </Typography>

          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            onClick={() => {
              dispatch(resetModal());
            }}
          >
            <ClearOutlinedIcon
              fontSize="small"
              sx={{
                color: "#ffffff",
              }}
            />
          </IconButton>
        </DialogTitle>
      </Box>
      <DialogContent>
        <Box minWidth={isTablet ? 400 : 300} padding={2}>
          <System />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SystemModal;
