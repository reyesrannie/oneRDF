import { Box, Button, Dialog, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "../../services/server/api/authAPI";
import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setChangePass,
  setToken,
  setUserData,
} from "../../services/server/slice/authSlice";
import { loginUser } from "../../services/functions/loginServices";

import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import loginSchema from "../../components/schema/loginSchema";
import AppTextBox from "../../components/custom/AppTextBox";
import React, { useMemo } from "react";
import background from "../../assets/png/background.png";
import secondLayer from "../../assets/png/secondLayer.png";
import logo from "../../assets/png/logo.png";
import misLogo from "../../assets/png/misLogo.png";

import "../../components/styles/Login.scss";
import ChangePassword from "../../components/modal/ChangePassword";
import SystemNavigation from "../../services/constant/SystemNavigation";

const Login = () => {
  const changePass = useSelector((state) => state.auth.changePass);
  const navigate = useNavigate();
  const { navigation, getFirstAccessibleRoute } = SystemNavigation();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitHandler = async (submitData) => {
    try {
      const res = await login(submitData).unwrap();
      dispatch(setToken(res?.data?.token));
      dispatch(setUserData({ ...res?.data, password: submitData?.password }));

      if (res?.data?.username === submitData?.password) {
        dispatch(setChangePass(true));
      } else {
        enqueueSnackbar(res?.message, { variant: "success" });
        loginUser(res?.data, submitData?.password);
        const defaultRoute = getFirstAccessibleRoute(
          navigation,
          res?.data?.access_permission
        );
        navigate(defaultRoute);
      }
    } catch (error) {
      if (error?.status === 403) {
        enqueueSnackbar("Invalid Credentials", { variant: "error" });
      } else {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          flexShrink: 0,
          background: `url(${background}) lightgray 50% / cover no-repeat`,
          zIndex: -1,
        }}
      />
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack
          alignItems={"center"}
          gap={2}
          sx={{
            width: "580px",
            height: "600px",
            flexShrink: 0,
            borderRadius: "15px 0px 0px 15px",
            backgroundColor: "#FFFFFFBF",
          }}
        >
          <Stack marginTop={"35px"} alignItems={"center"}>
            <Typography
              sx={{
                fontSize: "35px",
                fontWeight: "500",
              }}
            >
              Log In
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              Welcome back! Please enter your details.
            </Typography>
          </Stack>
          <Stack
            marginTop={"35px"}
            gap={1}
            sx={{
              minWidth: "60%",
            }}
          >
            <Stack>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Username
              </Typography>
              <AppTextBox
                control={control}
                name={"username"}
                size="small"
                placeholder={"Please type your username"}
                error={Boolean(errors?.username)}
                helperText={errors?.username?.message}
              />
            </Stack>
            <Stack>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Password
              </Typography>
              <AppTextBox
                secure={watch("password") !== ""}
                type="password"
                control={control}
                name={"password"}
                size="small"
                placeholder={"Please type your password"}
                error={Boolean(errors?.password)}
                helperText={errors?.password?.message}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                forgot password?
              </Typography>
            </Stack>
            <Stack>
              <Button
                type="submit"
                loading={isLoading}
                variant="contained"
                sx={{
                  color: "white",
                }}
              >
                Log In
              </Button>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Don’t have account?
              </Typography>
              <Button
                sx={{
                  color: "#1677FB",
                  padding: 0,
                }}
                size="small"
              >
                Sign up
              </Button>
            </Stack>
          </Stack>
          <Stack marginTop={"40px"} gap={1} alignItems={"center"}>
            <img
              src={misLogo}
              style={{
                width: "50px",
              }}
            />
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              Powered By MIS All rights reserved
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              Copyrights © 2021
            </Typography>
          </Stack>
        </Stack>
      </form>
      <Stack
        sx={{
          width: "580px",
          height: "600px",
          flexShrink: 0,
          background: `url(${secondLayer}) lightgray 50% / cover no-repeat`,
          borderRadius: "0px 15px 15px 0px",
        }}
        justifyContent={"center"}
      >
        <Stack
          alignSelf={"center"}
          sx={{
            flexShrink: 0,
          }}
        >
          <img
            src={logo}
            style={{
              width: "290px",
              boxShadow: `
        0 0 70px rgba(255, 255, 255, 0.9),   /* outer glow */
        inset 0 0 40px rgba(255, 255, 255, 0.9) /* inner glow */
      `,
              borderRadius: "50%",
            }}
          />
        </Stack>
      </Stack>

      <Dialog open={changePass}>
        <ChangePassword />
      </Dialog>
    </Box>
  );
};

export default Login;
