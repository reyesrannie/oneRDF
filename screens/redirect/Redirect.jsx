import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setHasRun } from "../../services/server/slice/modalSlice";
import { useSystemLoginMutation } from "../../services/server/request/systemAPI";
import { enqueueSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";

const Redirect = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const [countdown, setCountdown] = useState(false);

  const hasRun = useSelector((state) => state.modal.hasRun);
  const query = new URLSearchParams(search);
  const data = query.get("data");
  const userData = useSelector((state) => state.auth.userData);
  const hasCalled = useRef(false);

  const [login, { isError }] = useSystemLoginMutation();

  const handleLogin = async (data) => {
    const parsedSlice = JSON.parse(data?.slice);
    try {
      const res = await login({
        baseUrl: parsedSlice[0]?.login,
        credentials: {
          username: userData?.username,
          password: userData?.password,
        },
      }).unwrap();

      const encoded = encodeURIComponent(JSON.stringify(res));
      window.location.href = `${data?.url_holder}redirect?data=${encoded}`;
    } catch (error) {
      setHasError(true);
      singleError(error, enqueueSnackbar);
      closePage();
    }
  };

  const closePage = () => {
    setCountdown(3); // Start countdown at 3 seconds

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
    <Box padding={2}>
      {isError || hasError
        ? `Error encountered closing in ${countdown} second/s...`
        : "Redirecting..."}
    </Box>
  );
};

export default Redirect;
