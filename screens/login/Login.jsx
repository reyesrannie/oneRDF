import React from "react";
import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
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

import loginSchema from "../../components/schema/loginSchema";
import AppTextBox from "../../components/custom/AppTextBox";
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
          res?.data?.access_permission,
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
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      {/* Background Image Layer */}
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

      <Box
        sx={{
          display: "flex",
          width: { xs: "300px", md: "580px", lg: "1160px" },
          justifyContent: "center",
        }}
      >
        {/* LEFT SIDE: Form Area */}
        <form
          onSubmit={handleSubmit(submitHandler)}
          style={{ zIndex: 2, width: "100%", maxWidth: "580px" }} // Ensure form doesn't stretch too wide on mobile
        >
          <Stack
            alignItems={"center"}
            gap={2}
            sx={{
              width: "100%",
              maxWidth: { xs: "240px", md: "580px" },
              minHeight: "auto",
              padding: { xs: "30px 20px", md: "0" }, // Add padding inside box on mobile

              // Responsive Border Radius & Color
              borderRadius: { xs: "15px", md: "15px", lg: "15px 0px 0px 15px" },
              backgroundColor: "#FFFFFFBF",
              backdropFilter: "blur(5px)", // Nice touch for mobile transparency
            }}
          >
            <Stack
              marginTop={{ xs: "0", md: "35px" }}
              alignItems={"center"}
              textAlign="center"
            >
              <Typography
                sx={{
                  fontSize: { xs: "28px", md: "35px" }, // Smaller font on mobile
                  fontWeight: "600",
                }}
              >
                Log In
              </Typography>
              <Typography sx={{ fontSize: "16px", px: 2 }}>
                Welcome back! Please enter your details.
              </Typography>
            </Stack>

            <Stack
              marginTop={{ xs: "25px", md: "35px" }}
              gap={3}
              sx={{
                width: "100%",
                maxWidth: "350px", // Limit form width internally
              }}
            >
              <Stack gap={1}>
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
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
              <Stack gap={1}>
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
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
                    cursor: "pointer", // UX improvement
                    alignSelf: "flex-end",
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
                  color="info"
                  sx={{ color: "white", py: 1.2 }}
                >
                  Log In
                </Button>
              </Stack>
              {/* <Stack
                flexDirection={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                  Don’t have account?
                </Typography>
                <Button
                  sx={{
                    color: "#1677FB",
                    padding: 0,
                    ml: 1,
                    minWidth: "auto",
                  }}
                  size="small"
                >
                  Sign up
                </Button>
              </Stack> */}
            </Stack>

            <Stack marginTop={{ xs: "30px", md: "40px" }} alignItems={"center"}>
              <img src={misLogo} style={{ width: "50px" }} alt="MIS Logo" />
              <Typography sx={{ fontSize: "12px", fontWeight: "500", mt: 1 }}>
                Powered By MIS All rights reserved
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                Copyrights © 2021
              </Typography>
            </Stack>
          </Stack>
        </form>

        {/* RIGHT SIDE: Image Area (Hidden on Mobile) */}
        <Stack
          sx={{
            display: { xs: "none", md: "none", lg: "flex" },
            width: "580px",
            height: "auto",
            flexShrink: 0,
            background: `url(${secondLayer}) lightgray 50% / cover no-repeat`,
            borderRadius: "0px 15px 15px 0px",
          }}
          justifyContent={"center"}
        >
          <Stack alignSelf={"center"} sx={{ flexShrink: 0 }}>
            <img
              src={logo}
              style={{
                width: "290px",
                boxShadow: `
                  0 0 70px rgba(255, 255, 255, 0.9),
                  inset 0 0 40px rgba(255, 255, 255, 0.9)
                `,
                borderRadius: "50%",
              }}
              alt="Logo"
            />
          </Stack>
        </Stack>
      </Box>

      <Dialog open={changePass}>
        <ChangePassword />
      </Dialog>
    </Box>
  );
};

export default Login;
