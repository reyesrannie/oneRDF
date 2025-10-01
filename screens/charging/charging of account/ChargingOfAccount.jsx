import {
  Box,
  Button,
  Checkbox,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import AppSearch from "../../../components/custom/AppSearch";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";

import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setCoa,
  setCoaData,
  setImport,
  setImportErrorMessage,
} from "../../../services/server/slice/modalSlice";
import CardList from "../../../components/custom/CardList";
import useParamsHook from "../../../services/hooks/useParamsHook";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import TableGrid from "../../../components/custom/TableGrid";
import MenuPopper from "../../../components/custom/MenuPopper";
import AppPrompt from "../../../components/custom/AppPrompt";
import warning from "../../../assets/svg/warning.svg";
import { enqueueSnackbar } from "notistack";
import {
  resetPrompt,
  setArchive,
} from "../../../services/server/slice/promptSlice";
import CustomPagination from "../../../components/custom/CustomPagination";
import { useDepartmentQuery } from "../../../services/server/api/departmentAPI";
import {
  useArchiveCoaMutation,
  useCoaQuery,
  useImportCoaMutation,
} from "../../../services/server/api/coaAPI";
import CoaModal from "../../../components/modal/CoaModal";
import { useCompanyQuery } from "../../../services/server/api/companyAPI";
import { readOneChargingExcel } from "../../../services/functions/readExcel";
import ImportModal from "../../../components/modal/ImportModal";
import MenuOptions from "../../../components/custom/MenuOptions";
import { useBusinessUnitQuery } from "../../../services/server/api/businessUnitAPI";
import { useDepartmentUnitQuery } from "../../../services/server/api/departmentUnitAPI";
import { useSubUnitQuery } from "../../../services/server/api/SubUnitAPI";
import { useLocationQuery } from "../../../services/server/api/locationAPI";
import ImportErrorModal from "../../../components/modal/ImportErrorModal";
import {
  errorHeaderOC,
  oneChargingHeader,
} from "../../../services/constant/headers";
import { setSyncOneCharging } from "../../../services/server/slice/syncSlice";
import SyncOneChargingModal from "../../../components/modal/syncing/SyncOneChargingModal";

const ChargingOfAccount = () => {
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
  } = useParamsHook();
  const { data, isLoading, isError, isFetching } = useCoaQuery(params);

  const isTablet = useMediaQuery("(min-width:768px)");

  const archive = useSelector((state) => state.prompt.archive);
  const coaData = useSelector((state) => state.modal.coaData);
  const importData = useSelector((state) => state.modal.importData);

  const [archiveCoa, { isLoading: loadingArchive }] = useArchiveCoaMutation();

  const [importOneCharging, { isLoading: loadingImport }] =
    useImportCoaMutation();

  const { data: company } = useCompanyQuery({
    status: "active",
    pagination: "none",
  });

  const { data: business } = useBusinessUnitQuery({
    status: "active",
    pagination: "none",
  });

  const { data: department } = useDepartmentQuery({
    status: "active",
    pagination: "none",
  });

  const { data: unit } = useDepartmentUnitQuery({
    status: "active",
    pagination: "none",
  });

  const { data: subUnit } = useSubUnitQuery({
    status: "active",
    pagination: "none",
  });

  const { data: location } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const onClickHandler = async () => {
    try {
      await archiveCoa(coaData).unwrap();
      enqueueSnackbar(
        `Data has been ${params?.status === "active" ? "archived" : "restored"}!`,
        {
          variant: "success",
        }
      );
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  const handleImport = async () => {
    const mapped = readOneChargingExcel(
      importData,
      company,
      business,
      department,
      unit,
      subUnit,
      location
    );

    try {
      const res = await importOneCharging(mapped).unwrap();
      dispatch(resetModal());
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
    } catch (error) {
      dispatch(setImportErrorMessage(error?.data?.errors));
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  const mapped = readOneChargingExcel(
    importData,
    company,
    business,
    department,
    unit,
    subUnit,
    location
  );

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
            One Charging
          </Typography>
          <Stack flexDirection={"row"} gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              sx={{
                textTransform: "uppercase",
                fontSize: "10px",
                maxHeight: "30px",
                "& .MuiSvgIcon-root": {
                  fontSize: "14px",
                },
              }}
              onClick={(e) => {
                setAnchorE2({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
            >
              New
            </Button>
            <AppSearch onSearch={onSearchData} />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        minHeight={"45vh"}
        marginTop={1}
        paddingX={3}
        paddingBottom={3}
        sx={{
          background: "#FFFFFF",
          border: "1px solid #1A75BB",
        }}
      >
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
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
          <Stack flexDirection={"row"} m={2} gap={1} alignItems={"center"}>
            <Button
              onClick={() => {
                dispatch(setSyncOneCharging(true));
              }}
              variant="contained"
              color="success"
              startIcon={<CloudSyncOutlinedIcon />}
              size="small"
            >
              Sync
            </Button>
          </Stack>
        </Stack>
        {isLoading || isFetching ? (
          <MobileLoading />
        ) : isError ? (
          <NoDataFound />
        ) : !isTablet ? (
          <CardList
            coa
            items={data}
            mapFrom={"data"}
            title={"name"}
            sub={"code"}
            open={(e, i) => {
              dispatch(setCoaData(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
          />
        ) : (
          <TableGrid
            header={oneChargingHeader}
            items={data}
            onSelect={(e, i) => {
              dispatch(setCoaData(i));
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

      <CoaModal />

      <ImportModal
        title="One Charging"
        importDataHandler={handleImport}
        loading={loadingImport}
      />

      <ImportErrorModal items={mapped} header={errorHeaderOC} />
      <SyncOneChargingModal />

      <MenuOptions
        anchorEl={anchorE2}
        setAnchorEl={setAnchorE2}
        addOption={() => {
          dispatch(setCoa(true));
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
          dispatch(setCoa(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />
      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} COA?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this COA?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchive}
      />
    </Stack>
  );
};

export default ChargingOfAccount;
