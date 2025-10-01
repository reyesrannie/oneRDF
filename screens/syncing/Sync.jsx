import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SystemNavigation from "../../services/constant/SystemNavigation";
import CardList from "../../components/custom/CardList";
import BreadCrumbs from "../../components/custom/BreadCrumbs";

const Sync = () => {
  const location = useLocation();
  const { navigation } = SystemNavigation();
  const sync = navigation?.find((nav) => nav.segment === "sync");

  return (
    <Box ml={5}>
      <Stack gap={1} display={"flex"} flexDirection={"column"}>
        <BreadCrumbs />
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
        >
          <Typography fontSize={"24px"} fontWeight={600}>
            Sync
          </Typography>
        </Stack>
        {location?.pathname === "/sync" && (
          <Stack
            gap={1}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            <CardList
              mapFrom={"children"}
              items={sync}
              title={"title"}
              sub={"url_holder"}
              image={"icon"}
              routing
              routes={"route"}
            />
          </Stack>
        )}
      </Stack>
      <Outlet />
    </Box>
  );
};

export default Sync;
