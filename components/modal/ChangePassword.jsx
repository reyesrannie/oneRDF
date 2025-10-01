import React from "react";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { setChangePass } from "../../services/server/slice/authSlice";
import { usePasswordChangeMutation } from "../../services/server/api/authAPI";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import changePasswordSchema from "../schema/changePasswordSchema";
import AppTextBox from "../custom/AppTextBox";
import password from "../../assets/svg/password.svg";
import "../styles/ChangePassword.scss";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";
import { loginUser } from "../../services/functions/loginServices";
import { useNavigate } from "react-router-dom";
import { decodeUser } from "../../services/functions/saveUser";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasData = decodeUser();
  const { enqueueSnackbar } = useSnackbar();
  const userData = useSelector((state) => state.auth.userData);

  const [passwordChange, { isLoading }] = usePasswordChangeMutation();
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const changePasswordHandler = async (submitData) => {
    const payload = {
      ...submitData,
      id: userData?.id,
    };

    try {
      const res = await passwordChange(payload).unwrap();
      if (hasData === undefined) {
        loginUser(userData);
      }
      dispatch(setChangePass(false));
      navigate("/");
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Box className="change-password-modal-box-container">
      <Stack
        display="flex"
        alignItems="center"
        className="change-password-modal-stack"
        gap={1}
      >
        <img
          src={password}
          alt="Password"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700"> Change Password</Typography>
        <form
          className="change-password-modal-form"
          onSubmit={handleSubmit(changePasswordHandler)}
        >
          <Stack gap={2.5} display="flex" alignItems="center">
            <AppTextBox
              secure={watch("old_password") !== ""}
              type="password"
              control={control}
              name="old_password"
              className="change-password-modal-textField"
              label="Old Password"
              icon={<LockOutlinedIcon />}
              error={Boolean(errors?.old_password)}
              helperText={errors?.old_password?.message}
            />
            <AppTextBox
              secure={watch("password") !== ""}
              type="password"
              control={control}
              name="password"
              className="change-password-modal-textField"
              label="Password"
              icon={<LockOpenOutlinedIcon />}
              error={Boolean(errors?.password)}
              helperText={errors?.password?.message}
            />
            <AppTextBox
              secure={watch("password_confirmation") !== ""}
              type="password"
              control={control}
              name="password_confirmation"
              className="change-password-modal-textField"
              label="Confirm Password"
              icon={<VerifiedOutlinedIcon />}
              error={Boolean(errors?.password_confirmation)}
              helperText={errors?.password_confirmation?.message}
            />
            <Stack
              display="flex"
              flexDirection="row"
              gap={1}
              alignSelf={"flex-end"}
            >
              <Button
                className="change-password-button"
                disabled={isLoading}
                onClick={() => dispatch(setChangePass(false))}
                loadingPosition="start"
                startIcon={<DoDisturbAltOutlinedIcon />}
                variant="contained"
                size="small"
                color="error"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="change-password-button"
                loading={isLoading}
                loadingPosition="start"
                startIcon={<SwapHorizontalCircleOutlinedIcon />}
                variant="contained"
                size="small"
                color="success"
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default ChangePassword;
