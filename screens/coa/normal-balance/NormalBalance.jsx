import {
  Button,
  Checkbox,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import AppSearch from "../../../components/custom/AppSearch";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setNormalBalance,
  setNormalBalanceData,
  setImport,
  setImportErrorMessage,
} from "../../../services/server/slice/modalSlice";
import CardList from "../../../components/custom/CardList";
import useParamsHook from "../../../services/hooks/useParamsHook";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import TableGrid from "../../../components/custom/TableGrid";
import CompanyModal from "../../../components/modal/CompanyModal";
import MenuPopper from "../../../components/custom/MenuPopper";
import AppPrompt from "../../../components/custom/AppPrompt";
import warning from "../../../assets/svg/warning.svg";
import { enqueueSnackbar } from "notistack";

import {
  resetPrompt,
  setArchive,
} from "../../../services/server/slice/promptSlice";
import CustomPagination from "../../../components/custom/CustomPagination";
import MenuOptions from "../../../components/custom/MenuOptions";
import ImportModal from "../../../components/modal/ImportModal";
import { cnHeader } from "../../../services/constant/headers";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { readExcelItems } from "../../../services/functions/readExcel";

import {
  useArchiveNormalBalanceMutation,
  useImportNormalBalanceMutation,
  useNormalBalanceQuery,
} from "../../../services/server/api/normalBalanceAPI";
import NormalBalanceModal from "../../../components/modal/NormalBalanceModal";

const NormalBalance = () => {
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
  const { data, isLoading, isError, isFetching } =
    useNormalBalanceQuery(params);
  const isTablet = useMediaQuery("(min-width:768px)");

  const archive = useSelector((state) => state.prompt.archive);
  const normalBalanceData = useSelector(
    (state) => state.modal.normalBalanceData
  );
  const importData = useSelector((state) => state.modal.importData);

  const importHeader = [{ name: "name", value: "Name" }];

  const [archiveNormalBalance, { isLoading: loadingArchive }] =
    useArchiveNormalBalanceMutation();

  const [importNormalBalance, { isLoading: loadingImport }] =
    useImportNormalBalanceMutation();

  const onClickHandler = async () => {
    try {
      await archiveNormalBalance(normalBalanceData).unwrap();
      enqueueSnackbar(
        `Data has been ${params?.status === "active" ? "archived" : "restored"}!`,
        {
          variant: "success",
        }
      );
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  const handleImport = async () => {
    const mapped = readExcelItems(importData, importHeader);
    try {
      const res = await importNormalBalance(mapped).unwrap();
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

  const mapped = readExcelItems(importData, importHeader);

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
            Normal Balance
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
            sub={"code"}
            open={(e, i) => {
              dispatch(setNormalBalanceData(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
          />
        ) : (
          <TableGrid
            header={[{ type: "box", alignHeader: "center" }, ...cnHeader]}
            items={data}
            onSelect={(e, i) => {
              dispatch(setNormalBalanceData(i));
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

      <NormalBalanceModal />
      <ImportModal
        title="Normal Balance"
        importDataHandler={handleImport}
        loading={loadingImport}
      />

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setNormalBalance(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />

      <MenuOptions
        anchorEl={anchorE2}
        setAnchorEl={setAnchorE2}
        addOption={() => {
          dispatch(setNormalBalance(true));
          setAnchorE2(null);
        }}
        importOption={() => {
          dispatch(setImport(true));
          setAnchorE2(null);
        }}
      />

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} normal balance?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this normal balance?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchive}
      />
    </Stack>
  );
};

export default NormalBalance;
