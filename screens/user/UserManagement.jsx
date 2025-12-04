import {
  Box,
  Button,
  Checkbox,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import AppSearch from "../../components/custom/AppSearch";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setUser,
  setUserData,
} from "../../services/server/slice/modalSlice";
import UserModal from "../../components/modal/UserModal";
import CardList from "../../components/custom/CardList";
import useParamsHook from "../../services/hooks/useParamsHook";
import {
  useResetAllSystemMutation,
  useUserQuery,
  useUserResetMutation,
} from "../../services/server/api/usersAPI";
import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import TableGrid from "../../components/custom/TableGrid";
import MenuPopper from "../../components/custom/MenuPopper";
import AppPrompt from "../../components/custom/AppPrompt";
import warning from "../../assets/svg/warning.svg";
import { singleError } from "../../services/functions/errorResponse";
import { enqueueSnackbar } from "notistack";
import {
  resetPrompt,
  setArchive,
  setReset,
} from "../../services/server/slice/promptSlice";
import CustomPagination from "../../components/custom/CustomPagination";
import BreadCrumbs from "../../components/custom/BreadCrumbs";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MenuOptions from "../../components/custom/MenuOptions";
import { checkObject } from "../../services/functions/checkValues";
import { useSystemsQuery } from "../../services/server/api/systemAPI";
import {
  resetSync,
  setProgressDialog,
  setProgressPercent,
} from "../../services/server/slice/syncSlice";
import Progress from "../../components/custom/Progress";

const UserManagement = () => {
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
  const { data, isLoading, isError, isFetching } = useUserQuery(params);
  const {
    data: systemData,
    isLoading: loadingSystem,
    isError: erroSystem,
    isFetching: fetchingSystem,
  } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const reset = useSelector((state) => state.prompt.reset);
  const userData = useSelector((state) => state.modal.userData);
  const isTablet = useMediaQuery("(min-width:768px)");

  const [userReset, { isLoading: loadingUserReset }] = useUserResetMutation();
  const [userResetAll, { isLoading: loadingUserResetAll }] =
    useResetAllSystemMutation();

  const onResetHandler = async () => {
    dispatch(setProgressDialog(true));

    const getSystem = userData?.user_system?.map((us) =>
      systemData?.find((s) => us?.system_id?.toString() === s?.id?.toString())
    );
    try {
      const res = await userReset({ id: userData?.id }).unwrap();

      for (let i = 0; i < getSystem.length; i++) {
        const payloadSystems = {
          id_prefix: userData?.id_prefix,
          id_no: userData?.id_no,
          endpoint: {
            id: getSystem[i]?.id,
            name: getSystem[i]?.system_name,
            url: checkObject(getSystem[i]?.slice)?.reset,
            token: getSystem[i]?.token,
          },
        };
        const resAll = await userResetAll(payloadSystems).unwrap();
        dispatch(
          setProgressPercent(Math.round(((i + 1) / getSystem.length) * 100))
        );
      }

      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetSync());
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
      dispatch(resetSync());
    }
  };

  const header = [
    {
      name: "User ID",
      alignHeader: "center",
      value: "id",
      alignValue: "center",
    },
    {
      name: "Employee ID",
      alignHeader: "center",
      value: ["id_prefix", "id_no"],
      alignValue: "center",
      type: "concat",
    },
    {
      name: "Name",
      alignHeader: "center",
      value: ["first_name", "middle_name", "last_name", "suffix"],
      alignValue: "center",
      type: "concat",
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
        <BreadCrumbs />
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
        >
          <Typography fontSize={"24px"} fontWeight={600}>
            User Management
          </Typography>
        </Stack>
      </Stack>
      <Stack display={"flex"} flexDirection={"column"} mt={5}>
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography color="primary" fontSize={"20px"} fontWeight={600}>
            Users
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ArrowBackIosIcon />}
              sx={{
                textTransform: "capitalize",
                fontSize: "10px",
                maxHeight: "30px",
                "& .MuiSvgIcon-root": {
                  fontSize: "14px",
                },
              }}
              onClick={(e) => {
                dispatch(resetSync());
                dispatch(resetModal());
                dispatch(resetPrompt());
                setAnchorE2({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
            >
              Add
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
      <AppPrompt
        open={reset}
        image={warning}
        title={`Reset password?`}
        message={`Are you sure you want to reset the password?`}
        confirmButton={`Yes, Reset it!`}
        cancelButton={` No, Keep it! `}
        confirmOnClick={onResetHandler}
        isLoading={loadingUserReset || loadingUserResetAll}
      />
      <UserModal />
      <Progress />
    </Box>
  );
};

export default UserManagement;
