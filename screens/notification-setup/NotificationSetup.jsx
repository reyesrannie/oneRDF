import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import StatusFilter from "../../components/custom/StatusFilter";
import AppSearch from "../../components/custom/AppSearch";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setNotificationSetup,
  setUser,
  setUserData,
} from "../../services/server/slice/modalSlice";
import UserModal from "../../components/modal/UserModal";
import CardList from "../../components/custom/CardList";
import useParamsHook from "../../services/hooks/useParamsHook";
import { useUserResetMutation } from "../../services/server/api/usersAPI";
import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import TableGrid from "../../components/custom/TableGrid";
import MenuPopper from "../../components/custom/MenuPopper";
import AppPrompt from "../../components/custom/AppPrompt";
import warning from "../../assets/svg/warning.svg";
import { setArchive, setReset } from "../../services/server/slice/promptSlice";
import CustomPagination from "../../components/custom/CustomPagination";
import { useNotificationQuery } from "../../services/server/api/notificationSetupAPI";
import NotificationSetupModal from "../../components/modal/NotificationSetupModal";

const NotificationSetup = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    params,
    onSearchData,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSelectPage,
  } = useParamsHook();
  const { data, isLoading, isError, isFetching } = useNotificationQuery(params);
  const reset = useSelector((state) => state.prompt.reset);
  const userData = useSelector((state) => state.modal.userData);
  const isTablet = useMediaQuery("(min-width:768px)");

  const [userReset, { isLoading: loadingUserReset }] = useUserResetMutation();

  const header = [
    {
      name: "Employee ID",
      alignHeader: "center",
      value: "id",
      alignValue: "center",
    },
    {
      name: "Name",
      alignHeader: "center",
      value: "name",
      alignValue: "center",
    },
    {
      name: "Username",
      alignHeader: "center",
      value: "username",
      alignValue: "center",
    },
  ];

  return (
    <Box padding={2}>
      <Stack display={"flex"} flexDirection={"column"}>
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
        >
          <Typography color="text.secondary" fontSize={30} fontWeight={600}>
            Notification Setup
          </Typography>
        </Stack>
        <Stack
          display={"flex"}
          flexDirection={"column"}
          justifyContent="space-between"
          gap={2}
        >
          <StatusFilter onStatusChange={onStatusChange} params={params} />

          <Box>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              sx={{ textTransform: "none" }}
              onClick={() => {
                dispatch(setNotificationSetup(true));
              }}
            >
              New
            </Button>
          </Box>
          <Box>
            <AppSearch onSearch={onSearchData} />
          </Box>
        </Stack>
      </Stack>
      <Stack
        minHeight={"45vh"}
        maxHeight={"45vh"}
        overflow={"auto"}
        gap={2}
        marginTop={2}
      >
        {isLoading || isFetching ? (
          <MobileLoading />
        ) : isError ? (
          <NoDataFound />
        ) : !isTablet ? (
          <CardList
            items={data}
            mapFrom={"data"}
            title={"name"}
            sub={"username"}
            status={"deleted_at"}
            avatar
            open={(e, i) => {
              dispatch(setUserData(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
          />
        ) : (
          <TableGrid header={header} items={data} />
        )}
      </Stack>

      {(!isLoading || !isFetching) && !isError && (
        <CustomPagination
          data={data}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowChange}
          onChange={onSelectPage}
        />
      )}

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setUser(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
        reset={() => {
          setAnchorEl(null);
          dispatch(setReset(true));
        }}
      />
      {/* <AppPrompt
        open={reset}
        image={warning}
        title={`Reset password?`}
        message={`Are you sure you want to reset the password?`}
        confirmButton={`Yes, Reset it!`}
        cancelButton={` No, Keep it! `}
        confirmOnClick={onResetHandler}
        isLoading={loadingUserReset}
      /> */}
      <NotificationSetupModal />
    </Box>
  );
};

export default NotificationSetup;
