import { Box, Grid2, Stack, Typography } from "@mui/material";
import "../../styles/ListDisplay.scss";
import { useSelector } from "react-redux";

const ListDisplay = ({ data }) => {
  const systemImage = useSelector((state) => state.modal.systemImage);

  return (
    <Grid2 container spacing={3} padding={2}>
      {data?.map((items, index) => {
        return (
          <Grid2 xs={5} key={index}>
            <Stack
              key={index}
              display="flex"
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <Box
                component="img"
                src={systemImage[items?.id]}
                sx={{
                  width: "30px", // set size as needed
                  height: "auto",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  "&:hover": {
                    opacity: 0.8,
                    transform: "scale(1.2)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => window.open(items?.url_holder, "_blank")}
              />
              <Typography
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => window.open(items?.url_holder, "_blank")}
              >
                {items?.system_name}
              </Typography>
            </Stack>
          </Grid2>
        );
      })}
    </Grid2>
  );
};

export default ListDisplay;
