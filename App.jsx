import React, { lazy, Suspense, useEffect } from "react";
import "./App.scss";
import { IconButton, ThemeProvider } from "@mui/material";
import { Themes } from "./components/styles/Themes";
import LoadingRender from "./components/custom/LoadingRender";
import { useDispatch, useSelector } from "react-redux";
import { setFadeOut, setRenderLogo } from "./services/server/slice/renderSlice";
import { closeSnackbar, SnackbarProvider } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

const Routing = lazy(() => import("./services/routes/Routing"));

function App() {
  const renderLogo = useSelector((state) => state.render.renderLogo);
  const dispatch = useDispatch();

  useEffect(() => {
    const sessionTheme = localStorage?.getItem("theme");

    if (!sessionTheme) {
      localStorage.setItem("theme", "light");
    }

    const timer = setTimeout(() => {
      dispatch(setFadeOut(true));
      setTimeout(() => dispatch(setRenderLogo(false)), 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const { theme } = Themes();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={(key) => (
          <IconButton onClick={() => closeSnackbar(key)}>
            <CloseIcon className="icon-properties" />
          </IconButton>
        )}
      >
        {renderLogo && <LoadingRender />}
        {!renderLogo && (
          <Suspense fallback={<LoadingRender />}>
            <Routing />
          </Suspense>
        )}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
