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
  setImport,
  setIsLoading,
  setUser,
  setUserData,
} from "../../services/server/slice/modalSlice";
import UserModal from "../../components/modal/UserModal";
import CardList from "../../components/custom/CardList";
import useParamsHook from "../../services/hooks/useParamsHook";
import {
  useArchiveUserMutation,
  useCheckUsersImportMutation,
  useCreateUserSystemsMutation,
  useLazyUserQuery,
  useResetAllSystemMutation,
  useUpdateUserMutation,
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
import {
  checkObject,
  generateUserPayload,
} from "../../services/functions/checkValues";
import { useSystemsQuery } from "../../services/server/api/systemAPI";
import {
  resetSync,
  setProgressDialog,
  setProgressPercent,
  setRegistering,
} from "../../services/server/slice/syncSlice";
import Progress from "../../components/custom/Progress";
import ImportModal from "../../components/modal/ImportModal";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import { hasAccess } from "../../services/functions/access";
import {
  exportFlatArrayToExcel,
  exportToExcel,
} from "../../services/functions/exportExcel";
import { useColumnQuery } from "../../services/server/api/masterlist/columnAPI";

const UserManagement = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const importData = useSelector((state) => state.modal.importData);

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
  const [getAll, { data: allData, isLoading: loadingAll, isError: errorAll }] =
    useLazyUserQuery();

  const {
    data: columnData,
    isLoading: loadingColumn,
    isError: erroColumn,
    isFetching: fetchingColumn,
  } = useColumnQuery({
    status: "active",
    pagination: "none",
  });

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
  const archive = useSelector((state) => state.prompt.archive);

  const isTablet = useMediaQuery("(min-width:768px)");

  const [createUserSystem, { isLoading: loadingCreateSystems }] =
    useCreateUserSystemsMutation();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const [userReset, { isLoading: loadingUserReset }] = useUserResetMutation();
  const [userResetAll, { isLoading: loadingUserResetAll }] =
    useResetAllSystemMutation();
  const [userCheck, { isLoading: loadingUserCheck }] =
    useCheckUsersImportMutation();

  const [archiveUser, { isLoading: loadingArchive }] = useArchiveUserMutation();

  const onClickHandler = async () => {
    try {
      const res = await archiveUser(userData).unwrap();
      dispatch(resetPrompt());
      dispatch(resetModal());
      enqueueSnackbar(
        res !== null ? res?.message : "Data has been archived successfully",
        {
          variant: "success",
        },
      );
    } catch (error) {}
  };

  const onResetHandler = async () => {
    dispatch(setProgressDialog(true));

    const getSystem = userData?.user_system?.map((us) =>
      systemData?.find((s) => us?.system_id?.toString() === s?.id?.toString()),
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
            url: `${getSystem[i]?.backend_url}${checkObject(getSystem[i]?.slice)?.reset}`,
            token: getSystem[i]?.token,
          },
        };
        const resAll = await userResetAll(payloadSystems).unwrap();
        dispatch(
          setProgressPercent(Math.round(((i + 1) / getSystem.length) * 100)),
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
      sort: "id_no",
    },
    {
      name: "Name",
      alignHeader: "center",
      value: ["first_name", "middle_name", "last_name", "suffix"],
      alignValue: "center",
      sort: "first_name",
      type: "concat",
    },
    {
      name: "Username",
      alignHeader: "center",
      value: "username",
      alignValue: "center",
    },
  ];

  const excelColumns = [
    { header: "ID No", key: "id_no", width: 15 },
    { header: "ID Prefix", key: "id_prefix", width: 15 },
    { header: "First Name", key: "first_name", width: 20 },
    { header: "Middle Name", key: "middle_name", width: 20 },
    { header: "Last Name", key: "last_name", width: 20 },
    { header: "Suffix", key: "suffix", width: 15 },
    { header: "Username", key: "username", width: 15 },
  ];

  const exportData = async () => {
    try {
      const res = await getAll({
        status: "active",
        pagination: "none",
      }).unwrap();

      await exportToExcel(res, excelColumns, "User_Export.xlsx");
    } catch (error) {
      console.log(error);
    }
  };

  const importHandler = async () => {
    dispatch(setIsLoading(true));
    dispatch(setProgressDialog(true));
    dispatch(setRegistering(true));
    const payload = generateUserPayload(importData, columnData);
    const CHUNK_SIZE = 100;

    let allExistingUsers = [];
    let allNewUsers = [];

    try {
      const chunks = [];
      for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
        chunks.push(payload.slice(i, i + CHUNK_SIZE));
      }
      const totalChunks = chunks.length;

      for (let i = 0; i < totalChunks; i++) {
        const chunk = chunks[i];
        const res = await userCheck(chunk).unwrap();

        if (res?.data?.existing_users) {
          allExistingUsers.push(...res.data.existing_users);
        }
        if (res?.data?.new_users) {
          allNewUsers.push(...res.data.new_users);
        }
        const progressPercentage = Math.round(((i + 1) / totalChunks) * 100);
        dispatch(setProgressPercent(progressPercentage));

        // exportFlatArrayToExcel(res);
        // console.log(res);
      }
      dispatch(setRegistering(false));
      dispatch(setProgressPercent(0));
      await processSyncing([...allExistingUsers, ...allNewUsers], systemData);
    } catch (error) {}

    dispatch(setIsLoading(false));
    dispatch(setProgressDialog(false));
    dispatch(resetSync());
    dispatch(resetModal());
  };

  const processSyncing = async (usersData, allAvailableSystems) => {
    let totalOperations = 0;
    usersData.forEach((user) => {
      totalOperations += user.systems.length;
    });

    let completedOperations = 0;

    for (let i = 0; i < usersData.length; i++) {
      const user = usersData[i];

      const hasAvailableSystem = user?.systems?.some((systemId) =>
        allAvailableSystems.some((sys) => sys.id === systemId),
      );

      if (hasAvailableSystem) {
        const payloadUsers = {
          ...user,
          systems: user?.updated_system?.map((item) => ({ system_id: item })),
        };

        try {
          await updateUser(payloadUsers).unwrap();
        } catch (error) {
          singleError(error, enqueueSnackbar);
        }
      }

      for (let j = 0; j < user.systems.length; j++) {
        const systemId = user.systems[j];
        const targetSystem = allAvailableSystems.find(
          (sys) => sys.id === systemId,
        );
        if (!targetSystem) continue;
        const payloadSystems = {
          id_prefix: user?.id_prefix || "",
          id_no: user?.id_no || "",
          username: user?.username || "",
          first_name: user?.first_name || "",
          middle_name: user?.middle_name || undefined,
          last_name: user?.last_name || "",
          suffix: user?.suffix || undefined,
          password: user?.username || "",
          endpoint: {
            id: targetSystem.id,
            name: targetSystem.system_name,
            url: `${targetSystem.backend_url}${checkObject(targetSystem.slice)?.pending}`,
            token: targetSystem.token,
          },
        };
        try {
          const resAll = await createUserSystem(payloadSystems).unwrap();

          completedOperations++;
          const progressPercentage = Math.round(
            (completedOperations / totalOperations) * 100,
          );
          dispatch(setProgressPercent(progressPercentage));
        } catch (error) {
          console.error(
            `Failed to sync user ${user.username} to ${targetSystem.system_name}`,
            error,
          );
        }
      }
    }
  };

  return (
    <Box padding={2}>
      <Stack display={"flex"} flexDirection={"column"}>
        <BreadCrumbs />
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
        >
          <Typography fontSize={"18px"} fontWeight={600}>
            User Management
          </Typography>
        </Stack>
      </Stack>
      <Stack display={"flex"} flexDirection={"column"}>
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography color="primary" fontSize={"18px"} fontWeight={600}>
            Users
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
            {hasAccess(["dataExport"]) && (
              <Button
                variant="contained"
                color="success"
                size="small"
                loading={loadingAll}
                startIcon={<SimCardDownloadOutlinedIcon />}
                sx={{
                  textTransform: "capitalize",
                  fontSize: "10px",
                  maxHeight: "30px",
                  "& .MuiSvgIcon-root": {
                    fontSize: "14px",
                  },
                }}
                onClick={(e) => {
                  exportData();
                }}
              >
                Export
              </Button>
            )}
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
              fontSize: "12px",
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

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} user?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this user?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchive}
      />
      <UserModal />
      <Progress />

      <ImportModal
        importDataHandler={() => importHandler()}
        title={"User"}
        loading={loadingUserCheck || loadingCreateSystems}
        importHeader={[
          { name: "id_no", value: "ID No" },
          { name: "id_prefix", value: "ID Prefix" },
          { name: "first_name", value: "First Name" },
          { name: "middle_name", value: "Middle Name" },
          { name: "last_name", value: "Last Name" },
          { name: "suffix", value: "Suffix" },
          { name: "username", value: "Username" },
          ...(systemData?.map((system) => ({
            name: system.id,
            value: system.system_name,
          })) || []),
        ]}
      />
    </Box>
  );
};

export default UserManagement;
