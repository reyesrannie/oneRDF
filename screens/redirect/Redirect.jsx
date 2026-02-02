import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";
import { useLoginAllMutation } from "../../services/server/api/authAPI";
import { checkObject } from "../../services/functions/checkValues";

const Redirect = () => {
  const { search } = useLocation();
  const [hasError, setHasError] = useState(false);
  const [countdown, setCountdown] = useState(false);

  const hasRun = useSelector((state) => state.modal.hasRun);
  const query = new URLSearchParams(search);
  const data = query.get("data");
  const userData = useSelector((state) => state.auth.userData);
  const hasCalled = useRef(false);

  const [login, { isError }] = useLoginAllMutation();

  const handleLogin = async (data) => {
    try {
      const payload = {
        username: userData?.username,
        password: userData?.password,
        id_prefix: userData?.id_prefix,
        id_no: userData?.id_no,
        endpoint: {
          id: data?.id,
          name: data?.system_name,
          url: checkObject(data?.slice)?.login,
          token: data?.token,
        },
      };
      const res = await login(payload).unwrap();

      const encoded = encodeURIComponent(JSON.stringify(res?.data));
      window.location.href = `${data?.url_holder}redirect?data=${encoded}`;
    } catch (error) {
      console.log(error);
      setHasError(true);
      singleError(error, enqueueSnackbar);
      closePage();
    }
  };

  const closePage = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          window.close();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!data || hasCalled.current) return;
    hasCalled.current = true;
    try {
      const parsed = JSON.parse(decodeURIComponent(data));
      handleLogin(parsed);
    } catch (err) {
      console.error("Invalid data passed", err);
    }
  }, [data]);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={3}
    >
      <Stack spacing={2} alignItems="center">
        {isError || hasError ? (
          <>
            <Typography variant="h5" color="error">
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1">
              Closing in {countdown} second{countdown !== 1 ? "s" : ""}...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress />
            <Typography variant="h6">Redirecting ...</Typography>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Redirect;
