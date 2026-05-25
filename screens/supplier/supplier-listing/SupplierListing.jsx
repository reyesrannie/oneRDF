import {
  Button,
  Checkbox,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import AppSearch from "../../../components/custom/AppSearch";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setImport,
  setImportErrorMessage,
  setSupplier,
  setSupplierData,
} from "../../../services/server/slice/modalSlice";

import { enqueueSnackbar } from "notistack";
import {
  resetPrompt,
  setArchive,
} from "../../../services/server/slice/promptSlice";

import MenuPopper from "../../../components/custom/MenuPopper";
import AppPrompt from "../../../components/custom/AppPrompt";
import warning from "../../../assets/svg/warning.svg";
import CardList from "../../../components/custom/CardList";
import useParamsHook from "../../../services/hooks/useParamsHook";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import TableGrid from "../../../components/custom/TableGrid";
import CustomPagination from "../../../components/custom/CustomPagination";
import MenuOptions from "../../../components/custom/MenuOptions";
import {
  useArchiveSuppliersMutation,
  useImportSupplierMutation,
  useSuppliersQuery,
} from "../../../services/server/api/supplier/supplierAPI";
import SupplierModal from "../../../components/modal/supplier/SupplierModal";
import ImportModal from "../../../components/modal/ImportModal";
import { readExcelItems } from "../../../services/functions/readExcel";
import { generateSupplierPayload } from "../../../services/functions/checkValues";
import { useColumnQuery } from "../../../services/server/api/masterlist/columnAPI";
import { useSystemsQuery } from "../../../services/server/api/systemAPI";

const SupplierListing = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const {
    params,
    onSearchData,
    onPageChange,
    onRowChange,
    onSelectPage,
    onStatusChange,
    onSort,
  } = useParamsHook();

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

  const { data, isLoading, isError, isFetching } = useSuppliersQuery(params);
  const isTablet = useMediaQuery("(min-width:768px)");

  const supplierData = useSelector((state) => state.modal.supplierData);
  const archive = useSelector((state) => state.prompt.archive);
  const importData = useSelector((state) => state.modal.importData);

  const [archiveBuffer, { isLoading: loadingArchiveBuffer }] =
    useArchiveSuppliersMutation();

  const [importSupplier, { isLoading: loadingImport }] =
    useImportSupplierMutation();
  const header = [
    {
      name: "ID",
      value: "id",
    },
    {
      name: "Supplier Code",
      value: "code",
    },
    {
      name: "Supplier Name",
      value: "name",
    },
    {
      name: "Term",
      value: "terms",
      type: "days",
    },
    {
      name: "Type",
      value: "supplier_type",
      type: "parent",
      child: "name",
    },
    {
      name: "Buffer Severity",
      value: "supplier_buffer",
      type: "parent",
      child: "name",
    },

    {
      name: "Reference",
      value: "supplier_reference",
      type: "parent",
      child: "name",
    },
    {
      name: params.status === "inactive" ? "Deleted At" : "Date Modified",
      value: params.status === "inactive" ? "deleted_at" : "updated_at",
      type: "date",
    },
  ];

  const importHeader = [
    { name: "Supplier Code", value: "code" },
    { name: "Supplier Name", value: "name" },
    { name: "Term", value: "terms" },
    { name: "Type", value: "supplier_type" },
    { name: "Buffer Severity", value: "supplier_buffer" },
    { name: "Reference", value: "supplier_reference" },
  ];

  const onClickHandler = async () => {
    try {
      const res = await archiveBuffer(supplierData).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {}
  };

  const importHandler = async () => {
    const payload = generateSupplierPayload(importData, columnData);
    try {
      const res = await importSupplier(payload).unwrap();
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

    console.log(payload);
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
            Supplier Listing
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
                dispatch(resetModal());
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
        paddingX={3}
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
            items={data}
            mapFrom={"data"}
            title={"name"}
            open={(e, i) => {
              dispatch(setSupplierData(i));
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
              dispatch(setSupplierData(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
            params={params}
            onSort={onSort}
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

      <SupplierModal />
      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setSupplier(true));
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
          dispatch(setSupplier(true));
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
        title={`${params?.status === "active" ? "Archive" : "Restore"} supplier?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this supplier?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchiveBuffer}
      />

      <ImportModal
        importDataHandler={importHandler}
        title={"Supplier"}
        loading={loadingImport}
        importHeader={[
          { name: "code", value: "Supplier Code" },
          { name: "name", value: "Supplier Name" },
          { name: "address", value: "Supplier Address" },
          { name: "terms", value: "Term" },
          { name: "supplier_type", value: "Type" },
          { name: "buffer", value: "Buffer Severity" },
          { name: "reference", value: "Reference" },
          ...(systemData?.map((system) => ({
            name: system.id,
            value: system.system_name,
          })) || []),
        ]}
      />
    </Stack>
  );
};

export default SupplierListing;
