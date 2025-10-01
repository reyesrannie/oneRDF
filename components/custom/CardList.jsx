import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

import "../styles/Modal.scss";
import { useNavigate } from "react-router-dom";

const CardList = ({
  items = [],
  coa = false,
  title,
  sub,
  tagged,
  image,
  avatar = false,
  mapFrom,
  routing = false,
  onView,
  routes,
  open,
}) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const theme = useTheme();
  const navigate = useNavigate();

  return items[mapFrom]?.map((i, index) => {
    return (
      <Box key={index}>
        <Card
          variant="outlined"
          onClick={(e) => (routing ? navigate(i[routes]) : open(e, i))}
          sx={{
            maxWidth: "25vw",
            maxHeight: "10vh",
            bgcolor: "#1A75BB",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center">
              {avatar ? (
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    mr: 2,
                    width: 70,
                    height: 70,
                    alignSelf: "flex-start",
                  }}
                >
                  {image ? (
                    <img
                      src={`${baseURL}/storage/app/${i[image]}`}
                      className="system-modal-image-backend"
                    />
                  ) : (
                    <PersonOutlinedIcon
                      sx={{
                        fontSize: "20px",
                      }}
                    />
                  )}
                </Avatar>
              ) : (
                <Stack mr={2}>{i[image]}</Stack>
              )}
              <Stack alignItems={"flex-start"}>
                <Stack flexDirection={"column"}>
                  <Typography
                    fontSize={"14px"}
                    fontWeight="bold"
                    sx={{
                      textWrap: "nowrap",
                    }}
                  >
                    {i[title]}
                  </Typography>
                  <Typography fontSize={12}>
                    {typeof tagged === "function" ? tagged(i) : i[tagged]}
                  </Typography>
                  <Typography fontSize={12}>{i[sub]}</Typography>
                </Stack>
                {onView && (
                  <Stack>
                    <Chip
                      label="Sub-Unit"
                      variant="outlined"
                      sx={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(i);
                      }}
                    />
                  </Stack>
                )}

                {coa && (
                  <Stack flexDirection={"row"} gap={1} flexWrap={"wrap"}>
                    <Chip
                      label={i?.company_name}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={i?.business_unit_name}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={i?.department_name}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={i?.unit_name}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={i?.sub_unit_name}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={i?.location_name}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                )}
                {/* <Stack flexDirection={"row"} gap={1} flexWrap={"wrap"}>
                  <Chip
                    label="Genus"
                    variant="outlined"
                    sx={{ fontSize: "0.75rem", height: 20, padding: "0 6px" }}
                  />
                  <Chip
                    label="Genus"
                    variant="outlined"
                    sx={{ fontSize: "0.75rem", height: 20, padding: "0 6px" }}
                  />
                </Stack> */}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  });
};

export default CardList;
