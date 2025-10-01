import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SystemNavigation from "../../services/constant/SystemNavigation";
import CardList from "../../components/custom/CardList";
import BreadCrumbs from "../../components/custom/BreadCrumbs";

const Coa = () => {
  const location = useLocation();
  const { navigation } = SystemNavigation();
  const coa = navigation?.find((nav) => nav.segment === "coa");

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
            Chart of Account
          </Typography>
        </Stack>
        {location?.pathname === "/coa" && (
          <Stack
            gap={1}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            <CardList
              mapFrom={"children"}
              items={coa}
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

export default Coa;
