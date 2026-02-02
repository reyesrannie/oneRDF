import { Box, Button, Dialog, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSystemEndpoint,
  setSystemSlicer,
} from "../../services/server/slice/modalSlice";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import "react-tabs/style/react-tabs.css";

import "../styles/Modal.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "../custom/AppTextBox";
import { useSnackbar } from "notistack";

import systemControllerSchema from "../schema/systemControllerSchema";
import { singleError } from "../../services/functions/errorResponse";

const SystemController = () => {
  const dispatch = useDispatch();
  const systemEndpoint = useSelector((state) => state.modal.systemEndpoint);
  const systemSlicer = useSelector((state) => state.modal.systemSlicer);
  const { enqueueSnackbar } = useSnackbar();

  const isTablet = useMediaQuery("(min-width:768px)");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      roles: "",
      user: "",
      pending: "",
      changePassword: "",
      reset: "",
    },
  });

  const submitHandler = async (submitData) => {
    const endpointMapped = {
      login: submitData?.login,
      roles: submitData?.roles,
      user: submitData?.user,
      pending: submitData?.pending,
      changePassword: submitData?.changePassword,
      reset: submitData?.reset,
    };

    try {
      dispatch(setSystemSlicer(endpointMapped));
      dispatch(setSystemEndpoint(false));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (systemSlicer) {
      Object.entries(systemSlicer)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [systemSlicer]);

  return (
    <Dialog open={systemEndpoint}>
      <Box p={2} minWidth={isTablet ? 500 : 300}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack flexDirection={"column"}>
            <Stack
              direction="row" // Shorthand for flexDirection
              useFlexGap // Enables gap support for wrapped items
              flexWrap="wrap"
              gap={2}
              sx={{ mb: 7 }}
            >
              {[
                { name: "login", label: "Login" },
                { name: "roles", label: "Access Permission" },
                { name: "user", label: "Users" },
                { name: "pending", label: "Pending Request" },
                { name: "changePassword", label: "Password Change" },
                { name: "reset", label: "Reset Password" },
              ].map((field) => (
                <AppTextBox
                  key={field.name}
                  control={control}
                  name={field.name}
                  label={field.label}
                  placeholder={`e.g., http://sample.com/api/${field.name}`}
                  error={Boolean(errors?.[field.name])}
                  helperText={errors?.[field.name]?.message}
                  sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}
                />
              ))}
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
                onClick={() => dispatch(setSystemEndpoint(false))}
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
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};

export default SystemController;
