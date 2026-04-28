import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SystemNavigation from "../../services/constant/SystemNavigation";
import CardList from "../../components/custom/CardList";
import BreadCrumbs from "../../components/custom/BreadCrumbs";

const ItemListing = () => {
  const location = useLocation();
  const { navigation } = SystemNavigation();
  const item = navigation?.find((nav) => nav.segment === "item");

  return (
    <Box padding={2}>
      <Stack gap={1} display={"flex"} flexDirection={"column"}>
        <BreadCrumbs />

        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
        >
          <Typography fontSize={"18px"} fontWeight={600}>
            Item Listing
          </Typography>
        </Stack>
        {location?.pathname === "/item" && (
          <Stack
            gap={1}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            <CardList
              mapFrom={"children"}
              items={item}
              title={"title"}
              sub={"url_holder"}
              image={"icon"}
              routing
              routes={"route"}
            />
          </Stack>
        )}
      </Stack>
      <Stack>
        <Outlet />
      </Stack>
    </Box>
  );
};

export default ItemListing;
