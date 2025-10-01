import {
  Box,
  Button,
  Dialog,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import userImage from "../../assets/svg/add-user.svg";
import "react-tabs/style/react-tabs.css";
import "../styles/Modal.scss";
import AppTextBox from "../custom/AppTextBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { enqueueSnackbar } from "notistack";
import { useSystemsQuery } from "../../services/server/api/systemAPI";
import { notificationSetupAPI } from "../../services/server/api/notificationSetupAPI";
import notificationSetupSchema from "../schema/notificationSetupSchema";

const NotificationSetupModal = () => {
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const open = useSelector((state) => state.modal.notificationSetup);
  const mode = useSelector((state) => state.theme.mode);
  const isTablet = useMediaQuery("(min-width:768px)");

  const { data: systemData, isLoading: loadingSystems } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(notificationSetupSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      footer: "",
      memo_file: null,
    },
  });

  const submitHandler = async (data) => {
    if (watch("access_permission").length === 0) {
      enqueueSnackbar("Please select at least one permission", {
        variant: "error",
      });
    }

    // try {
    // } catch (error) {}
  };

  return (
    <Dialog open={open}>
      <Box minWidth={isTablet ? 600 : 350} height={700} padding={2}>
        <Stack display="flex" alignItems="center" gap={1}>
          <img
            src={userImage}
            alt="Password"
            draggable="false"
            className="user-modal-image"
          />
        </Stack>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack gap={2} flexDirection={"column"}>
            <Stack>
              <Typography color={mode === "light" ? "#000000" : "textPrimary"}>
                Notification
              </Typography>
              <Divider />
            </Stack>
            <Stack gap={2} height={"auto"}>
              <AppTextBox
                control={control}
                name={"title"}
                label="Title"
                error={Boolean(errors?.title)}
                helperText={errors?.title?.message}
                fullWidth
              />
              <AppTextBox
                control={control}
                name={"subtitle"}
                label="Subtitle"
                error={Boolean(errors?.subtitle)}
                helperText={errors?.subtitle?.message}
                fullWidth
              />
              <AppTextBox
                control={control}
                name={"footer"}
                label="Footer"
                error={Boolean(errors?.footer)}
                helperText={errors?.footer?.message}
                fullWidth
              />
              <Stack marginBottom={9}>
                <AppTextBox
                  multiline
                  maxRows={4}
                  minRows={4}
                  control={control}
                  name={"content"}
                  label="Content"
                  error={Boolean(errors?.content)}
                  helperText={errors?.content?.message}
                  fullWidth
                />
              </Stack>
              <AppTextBox
                control={control}
                name={"memo_file"}
                label="Content"
                error={Boolean(errors?.memo_file)}
                helperText={errors?.memo_file?.message}
                fullWidth
              />
            </Stack>

            <Stack
              position={"absolute"}
              flexDirection={"row"}
              bottom={0}
              right={0}
              padding={2}
              gap={1}
            >
              <Button
                variant="contained"
                color="error"
                startIcon={<ClearOutlinedIcon />}
                onClick={() => {
                  reset();
                  dispatch(resetModal());
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                loadingPosition="start"
                startIcon={<CheckOutlinedIcon />}
                color="success"
                type="submit"
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};

export default NotificationSetupModal;
