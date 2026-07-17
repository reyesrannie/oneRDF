import { Box, Checkbox, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import AppSearch from "../../../components/custom/AppSearch";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setUser,
  setUserData,
} from "../../../services/server/slice/modalSlice";
import CardList from "../../../components/custom/CardList";
import useParamsHook from "../../../services/hooks/useParamsHook";
import { useUserResetMutation } from "../../../services/server/api/usersAPI";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import TableGrid from "../../../components/custom/TableGrid";
import MenuPopper from "../../../components/custom/MenuPopper";
import AppPrompt from "../../../components/custom/AppPrompt";
import warning from "../../../assets/svg/warning.svg";
import { singleError } from "../../../services/functions/errorResponse";
import { enqueueSnackbar } from "notistack";
import {
  resetPrompt,
  setArchive,
  setReset,
} from "../../../services/server/slice/promptSlice";
import CustomPagination from "../../../components/custom/CustomPagination";
import BreadCrumbs from "../../../components/custom/BreadCrumbs";

import MenuOptions from "../../../components/custom/MenuOptions";

import {
  useArchiveAuditMutation,
  useAuditQuery,
} from "../../../services/server/api/auditTrail";
import UserModal from "../../../components/modal/user/UserModal";

const AuditUser = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const {
    params,
    onSearchData,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSelectPage,
    onSort,
  } = useParamsHook();
  const { data, isLoading, isError, isFetching } = useAuditQuery(params);

  const reset = useSelector((state) => state.prompt.reset);
  const userData = useSelector((state) => state.modal.userData);
  const isTablet = useMediaQuery("(min-width:768px)");

  const [archive, { isLoading: loadingArchive }] = useArchiveAuditMutation();

  const onArchiveHandler = async () => {
    try {
      const res = await archive({ id: userData?.id }).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const header = [
    {
      name: "Id",
      alignHeader: "center",
      value: "id",
      alignValue: "center",
    },

    {
      name: "System",
      alignHeader: "center",
      value: "system",
      alignValue: "center",
      child: "system_name",
      type: "parent",
    },
    {
      name: "Action",
      alignHeader: "center",
      value: "action",
      alignValue: "center",
    },
    {
      name: "Module",
      alignHeader: "center",
      value: "module",
      alignValue: "center",
    },
    {
      name: "Details",
      alignHeader: "center",
      value: "details",
      alignValue: "center",
    },
    {
      name: "Date Occured",
      alignHeader: "center",
      value: "created_at",
      alignValue: "center",
      type: "date",
    },
  ];

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
            User
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
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
            Completed
          </Typography>
        </Stack>

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
          <TableGrid
            header={header}
            items={data}
            params={params}
            onSort={onSort}
            onSelect={(e, i) => {
              dispatch(setUserData(i));
              params?.status === "active" &&
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

      <MenuOptions
        anchorEl={anchorE2}
        setAnchorEl={setAnchorE2}
        addOption={() => {
          dispatch(setUser(true));
          setAnchorE2(null);
        }}
        importOption={() => {
          dispatch(setImport(true));
          setAnchorE2(null);
        }}
      />

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        complete={() => {
          setAnchorEl(null);
          onArchiveHandler();
        }}
      />
      {/* <AppPrompt
        open={reset}
        image={warning}
        title={`Reset password?`}
        message={`Are you sure you want to reset the password?`}
        confirmButton={`Yes, Reset it!`}
        cancelButton={` No, Keep it! `}
        confirmOnClick={onArchiveHandler}
        isLoading={loadingArchive}
      /> */}
      <UserModal />
    </Stack>
  );
};

export default AuditUser;
