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
import {
  useArchiveSystemMutation,
  useSystemsQuery,
} from "../../../services/server/api/systemAPI";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import {
  resetModal,
  setSystem,
  setSystemData,
} from "../../../services/server/slice/modalSlice";
import SystemModal from "../../../components/modal/systems/SystemModal";
import { useDispatch, useSelector } from "react-redux";
import CardList from "../../../components/custom/CardList";
import TableGrid from "../../../components/custom/TableGrid";
import MenuPopper from "../../../components/custom/MenuPopper";
import CustomPagination from "../../../components/custom/CustomPagination";
import {
  resetPrompt,
  setArchive,
} from "../../../services/server/slice/promptSlice";
import AppPrompt from "../../../components/custom/AppPrompt";
import warning from "../../../assets/svg/warning.svg";

const Systems = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const systemData = useSelector((state) => state.modal.systemData);
  const archive = useSelector((state) => state.prompt.archive);

  const {
    params,
    onSearchData,
    onPageChange,
    onRowChange,
    onSelectPage,
    onStatusChange,
    onSort,
  } = useParamsHook();
  const { data, isLoading, isError, isFetching } = useSystemsQuery(params);

  const isTablet = useMediaQuery("(min-width:768px)");

  const [archiveSystem, { isLoading: loadingArchive }] =
    useArchiveSystemMutation();

  const header = [
    { name: "Id", value: "id" },
    { name: "Name", value: "system_name" },
    {
      name: "Url",
      value: "url_holder",
      type: "multimedia",
      image: "system_image",
    },
    { name: "Last Modified", value: "updated_at", type: "date" },
  ];

  const onClickHandler = async () => {
    try {
      const res = await archiveSystem(systemData).unwrap();
      dispatch(resetPrompt());
      dispatch(resetModal());
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
    } catch (error) {}
  };

  return (
    <Stack>
      <Stack display={"flex"} flexDirection={"column"}>
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography color="primary" fontSize={"18px"} fontWeight={600}>
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
          border: "2px solid #1A75BB",
        }}
      >
        <Stack flexDirection={"row"} m={2} gap={1} alignItems={"center"}>
          <Checkbox
            size="small"
            checked={params?.status === "inactive"}
            onChange={() => {
              onStatusChange(
                params?.status === "active" ? "inactive" : "active",
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
            onSort={onSort}
            params={params}
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
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />

      <SystemModal />

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} system?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this system?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchive}
      />
    </Stack>
  );
};

export default Systems;
