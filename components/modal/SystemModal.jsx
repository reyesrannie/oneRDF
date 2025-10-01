import { Box, Dialog, Stack, useMediaQuery } from "@mui/material";
import React from "react";
import { setSystem } from "../../services/server/slice/modalSlice";
import systemImage from "../../assets/svg/system.svg";

import "react-tabs/style/react-tabs.css";

import "../styles/Modal.scss";
import { useDispatch, useSelector } from "react-redux";
import System from "../custom/System";

const SystemModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.system);

  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setSystem(false));
      }}
    >
      <Box minWidth={isTablet ? 500 : 300} minHeight={500} padding={2}>
        <Stack display="flex" alignItems="center" gap={1}>
          <img
            src={systemImage}
            alt="systemImage"
            draggable="false"
            className="system-modal-image"
          />
        </Stack>
        <System />
      </Box>
    </Dialog>
  );
};

export default SystemModal;
