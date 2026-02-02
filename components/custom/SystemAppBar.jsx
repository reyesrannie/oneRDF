import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import moment from "moment";

import { Collapse, Dialog, Menu, MenuItem, Stack } from "@mui/material";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAuth,
  setChangePass,
} from "../../services/server/slice/authSlice";
import { useLogoutMutation } from "../../services/server/api/authAPI";

import "../styles/AppBar.scss";
import ChangePassword from "../modal/ChangePassword";
import SystemNavigation from "../../services/constant/SystemNavigation";
import logoDrawer from "../../assets/png/logoDrawer.png";
import {
  resetDrawer,
  setIsDrawerOpen,
} from "../../services/server/slice/drawerSlice";
import { resetTheme } from "../../services/server/slice/themeSlice";
import { decodeUser } from "../../services/functions/saveUser";
import { hasAccess } from "../../services/functions/access";
import { resetModal } from "../../services/server/slice/modalSlice";
import { resetPrompt } from "../../services/server/slice/promptSlice";
import { resetSync } from "../../services/server/slice/syncSlice";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: `calc(100% - 65px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const SystemAppBar = () => {
  const [open, setOpen] = useState(true);
  const [currentDisplay, setCurrentDisplay] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { navigation } = SystemNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentLocation = location?.pathname?.split("/");
  const isDrawerOpen = useSelector((state) => state.drawer.isDrawerOpen);
  const hiddenNavigation = useSelector(
    (state) => state.drawer.hiddenNavigation,
  );
  const isButtomNavActivate = useSelector(
    (state) => state.drawer.isButtomNavActivate,
  );
  const userData = useSelector((state) => state.auth.userData);
  const changePass = useSelector((state) => state.auth.changePass);
  const background = useSelector((state) => state.theme.background);

  const [logout, { isLoading }] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      const res = await logout().unwrap();
    } catch (error) {}
    sessionStorage.clear("oneRDF");
    dispatch(resetAuth());
    dispatch(resetDrawer());
    dispatch(resetTheme());
    dispatch(resetModal());
    dispatch(resetPrompt());
    dispatch(resetSync());
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background:
          location?.pathname === "/"
            ? `url(${background}) no-repeat center center / cover`
            : "rgba(247, 154, 46, 0.05)",
      }}
    >
      <AppBar position="fixed" open={open} elevation={0}>
        <Stack
          alignItems={"center"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          width={"100%"}
          padding={0.5}
        >
          <Stack flexDirection={"row"} alignItems={"center"}>
            <IconButton
              onClick={() => {
                setOpen(!open);
                dispatch(setIsDrawerOpen(!isDrawerOpen));
              }}
              sx={[
                {
                  marginRight: 1,
                },
              ]}
            >
              <MenuIcon sx={{ fontSize: "20px", color: "#FFFFFF" }} />
            </IconButton>
            <Typography color="#FFFFFF" fontSize={"14px"}>
              {moment(new Date()).format("MMMM DD, YYYY").toUpperCase()}
            </Typography>
          </Stack>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <Typography
              fontSize={"14px"}
              color="#FFFFFF"
              textTransform={"capitalize"}
            >
              {userData?.username?.toLowerCase()}
            </Typography>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AccountCircleOutlinedIcon
                sx={{ fontSize: "20px", color: "#FFFFFF" }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          minHeight={"120px"}
        >
          <img
            src={logoDrawer}
            style={{
              width: open ? "120px" : "60px",
              transition: "width 0.3s ease",
            }}
          />
        </Stack>

        <Divider />
        <List>
          {navigation?.map((nav, index) => {
            if (!hasAccess(nav?.permission)) return null;
            return (
              <Stack key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(nav?.route);
                      setCurrentDisplay(index);
                    }}
                    sx={{
                      bgcolor:
                        currentLocation[1] === nav?.route.slice(1)
                          ? "#1761BB"
                          : "#FFFFFF",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color:
                          currentLocation[1] === nav?.route.slice(1)
                            ? "#FFFFFF"
                            : "#17619A",
                      }}
                    >
                      {nav?.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={nav?.title}
                      sx={{
                        color:
                          currentLocation[1] === nav?.route.slice(1)
                            ? "#FFFFFF"
                            : "#17619A",
                        "& .MuiTypography-root": {
                          fontSize: "12px",
                        },
                        opacity: open ? 1 : 0,
                      }}
                    />
                    {open && Array.isArray(nav?.children) && (
                      <ListItemIcon
                        sx={{
                          minWidth: "unset",
                          marginLeft: "110px",
                          color:
                            location?.pathname === nav?.route
                              ? "#FFFFFF"
                              : "#17619A",
                        }}
                      >
                        <KeyboardArrowDownOutlinedIcon />
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                </ListItem>
                {open && Array.isArray(nav?.children) && (
                  <Collapse
                    in={currentDisplay === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    {nav?.children.map((child, i) => {
                      if (!hasAccess(child?.permission)) return null;
                      return (
                        <ListItem disablePadding key={i}>
                          <ListItemButton
                            onClick={() => navigate(child?.route)}
                            sx={{
                              ml: "30px",
                              bgcolor:
                                location?.pathname === child?.route
                                  ? "#17619A"
                                  : "#FFFFFF",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color:
                                  location?.pathname === child?.route
                                    ? "#FFFFFF"
                                    : "#17619A",
                              }}
                            >
                              {child?.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child?.title}
                              sx={{
                                color:
                                  location?.pathname === child?.route
                                    ? "#FFFFFF"
                                    : "#17619A",
                                "& .MuiTypography-root": {
                                  fontSize: "12px",
                                },
                                opacity: open ? 1 : 0,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </Collapse>
                )}
              </Stack>
            );
          })}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 2, width: "100vw", bgcolor: "#D9D9D9" }}>
        <DrawerHeader />

        <Outlet />
      </Box>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={(e) => setAnchorEl(null)}
        className="app-bar-menu-account"
      >
        <MenuItem
          onClick={() => dispatch(setChangePass(true))}
          disabled={isLoading}
        >
          <ListItemIcon>
            <VpnKeyOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={logoutHandler} disabled={isLoading}>
          <ListItemIcon>
            <PowerSettingsNewOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={changePass}>
        <ChangePassword />
      </Dialog>
    </Box>
  );
};

export default SystemAppBar;
