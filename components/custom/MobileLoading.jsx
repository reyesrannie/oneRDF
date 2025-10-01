import { Skeleton, Stack } from "@mui/material";
import React from "react";

const MobileLoading = () => {
  return [...Array(5)].map((_, index) => (
    <Stack flexDirection={"row"} gap={1} key={index}>
      <Stack gap={1} width={"100%"}>
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{
            bgcolor: "#ccc",
            "&::after": {
              background: "linear-gradient(90deg, #ccc, #ddd, #ccc)",
            },
          }}
        />
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{
            bgcolor: "#ccc",
            "&::after": {
              background: "linear-gradient(90deg, #ccc, #ddd, #ccc)",
            },
          }}
        />
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{
            bgcolor: "#ccc",
            "&::after": {
              background: "linear-gradient(90deg, #ccc, #ddd, #ccc)",
            },
          }}
        />
      </Stack>
    </Stack>
  ));
};

export default MobileLoading;
