import {
  Box,
  Button,
  Checkbox,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import AppSearch from "../../../components/custom/AppSearch";
import useParamsHook from "../../../services/hooks/useParamsHook";
import { useSystemsQuery } from "../../../services/server/api/systemAPI";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import {
  setSystem,
  setSystemData,
} from "../../../services/server/slice/modalSlice";
import SystemModal from "../../../components/modal/SystemModal";
import { useDispatch } from "react-redux";
import CardList from "../../../components/custom/CardList";
import TableGrid from "../../../components/custom/TableGrid";
import MenuPopper from "../../../components/custom/MenuPopper";
import CustomPagination from "../../../components/custom/CustomPagination";

const Systems = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const {
    params,
    onSearchData,
    onPageChange,
    onRowChange,
    onSelectPage,
    onStatusChange,
  } = useParamsHook();
  const { data, isLoading, isError, isFetching } = useSystemsQuery(params);
  const isTablet = useMediaQuery("(min-width:768px)");

  const header = [
    { name: "Name", value: "system_name" },
    {
      name: "Url",
      value: "url_holder",
      type: "multimedia",
      image: "system_image",
    },
    { name: "Last Modified", value: "updated_at", type: "date" },
  ];

  return (
    <Stack mt={3}>
      <Stack display={"flex"} flexDirection={"column"}>
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography color="primary" fontSize={"20px"} fontWeight={600}>
            Systems
          </Typography>

          <Stack flexDirection={"row"} gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              sx={{
                textTransform: "capitalize",
                fontSize: "10px",
                maxHeight: "30px",
                "& .MuiSvgIcon-root": {
                  fontSize: "14px",
                },
              }}
              onClick={() => {
                dispatch(setSystem(true));
              }}
            >
              Add System
            </Button>
            <AppSearch onSearch={onSearchData} />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        minHeight={"45vh"}
        marginTop={1}
        paddingX={3} // left and right
        paddingBottom={3}
        sx={{
          background: "#FFFFFF",
          border: "1px solid #1A75BB",
        }}
      >
        <Stack flexDirection={"row"} m={2} gap={1} alignItems={"center"}>
          <Checkbox
            size="small"
            checked={params?.status === "inactive"}
            onChange={() => {
              onStatusChange(
                params?.status === "active" ? "inactive" : "active"
              );
            }}
            sx={{
              padding: 0,
              color: "#000000",
            }}
          />
          <Typography
            sx={{
              fontSize: "14px",
            }}
          >
            Archived
          </Typography>
        </Stack>
        {isLoading || isFetching ? (
          <MobileLoading />
        ) : isError ? (
          <NoDataFound />
        ) : !isTablet ? (
          <CardList
            mapFrom={"data"}
            items={data}
            title={"system_name"}
            sub={"url_holder"}
            image={"system_image"}
            avatar
            open={(e, i) => {
              dispatch(setSystemData(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
          />
        ) : (
          <TableGrid
            header={header}
            items={data}
            onSelect={(e, i) => {
              dispatch(setSystemData(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
          />
        )}
      </Stack>
      {(!isLoading || !isFetching) && !isError && (
        <CustomPagination
          data={data}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onChange={onSelectPage}
        />
      )}

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setSystem(true));
        }}
      />

      <SystemModal />
    </Stack>
  );
};

export default Systems;
