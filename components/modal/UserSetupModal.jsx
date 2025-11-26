import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSync } from "../../services/server/slice/syncSlice";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { resetModal } from "../../services/server/slice/modalSlice";
import TabPanel from "../custom/TabPanel";
import { useForm } from "react-hook-form";

const UserSetupModal = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const userSetupModal = useSelector((state) => state.sync.userSetupModal);
  const userData = useSelector((state) => state.modal.userData);
  const isTablet = useMediaQuery("(min-width:768px)");

  return (
    <Dialog
      open={userSetupModal}
      slotProps={{
        paper: {
          sx: {
            border: `2px solid ${theme?.palette?.primary?.main}`,
            minWidth: isTablet ? 800 : 350,
          },
        },
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
          USER SETUP
        </Typography>

        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
          onClick={() => {
            dispatch(resetModal());
            dispatch(resetSync());
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
      <DialogContent>
        <Tabs
          value={currentIndex}
          onChange={(_, newValue) => setCurrentIndex(newValue)}
        >
          <Tab label={"sample"} />
          {userData?.user_system?.map((sys, index) => {
            return <Tab key={index} label={sys?.system?.system_name} />;
          })}
        </Tabs>
        <TabPanel />
      </DialogContent>
    </Dialog>
  );
};

export default UserSetupModal;
