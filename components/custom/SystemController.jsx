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
              gap={2}
              flexDirection={"column"}
              sx={{
                mb: 7,
              }}
            >
              <AppTextBox
                control={control}
                name={"login"}
                label="Login"
                placeholder="e.g., http://sample.com/api/login"
                error={Boolean(errors?.login)}
                helperText={errors?.login?.message}
              />
              <AppTextBox
                control={control}
                name={"roles"}
                label="Access Permission"
                placeholder="e.g., http://sample.com/api/roles"
                error={Boolean(errors?.roles)}
                helperText={errors?.roles?.message}
              />

              <AppTextBox
                control={control}
                name={"user"}
                label="Users"
                placeholder="e.g., http://sample.com/api/users"
                error={Boolean(errors?.user)}
                helperText={errors?.user?.message}
              />

              <AppTextBox
                control={control}
                name={"pending"}
                label="Pending Request"
                placeholder="e.g., http://sample.com/api/pending"
                error={Boolean(errors?.pending)}
                helperText={errors?.pending?.message}
              />
              <AppTextBox
                control={control}
                name={"changePassword"}
                label="Password Change"
                placeholder="e.g., http://sample.com/api/changePassword"
                error={Boolean(errors?.changePassword)}
                helperText={errors?.changePassword?.message}
              />
              <AppTextBox
                control={control}
                name={"reset"}
                label="Reset Password"
                placeholder="e.g., http://sample.com/api/reset"
                error={Boolean(errors?.reset)}
                helperText={errors?.reset?.message}
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
