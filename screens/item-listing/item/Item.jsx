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
  setItem,
  setItemData,
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

// import ItemModal from "../../../components/modal/item-listing/ItemModal";
import ImportModal from "../../../components/modal/ImportModal";
import { readExcelItems } from "../../../services/functions/readExcel";
import {
  useArchiveItemMutation,
  useItemQuery,
} from "../../../services/server/api/item-listing/itemAPI";
import ItemModal from "../../../components/modal/item-listing/ItemModal";

const Item = () => {
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
  const { data, isLoading, isError, isFetching } = useItemQuery(params);
  const isTablet = useMediaQuery("(min-width:768px)");

  const itemData = useSelector((state) => state.modal.itemData);
  const archive = useSelector((state) => state.prompt.archive);
  const importData = useSelector((state) => state.modal.importData);

  const [archiveItem, { isLoading: loadingArchive }] = useArchiveItemMutation();

  const header = [
    {
      name: "ID",
      value: "id",
    },
    {
      name: "Code",
      value: "code",
    },
    {
      name: "Description",
      value: "description",
    },
    {
      name: params.status === "inactive" ? "Deleted At" : "Date Modified",
      value: params.status === "inactive" ? "deleted_at" : "updated_at",
      type: "date",
    },
  ];

  const importHeader = [
    { name: "code", value: "Code" },
    { name: "description", value: "Description" },
    { name: "is_integer", value: "Allow Decimal" },
  ];

  const onClickHandler = async () => {
    try {
      const res = await archiveItem(itemData).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {}
  };

  const handleImport = async () => {
    const mapped = readExcelItems(importData, importHeader);
    // try {
    //   const res = await importCharge(mapped).unwrap();
    //   dispatch(resetModal());
    //   enqueueSnackbar(res?.message, {
    //     variant: "success",
    //   });
    // } catch (error) {
    //   dispatch(setImportErrorMessage(error?.data?.errors));
    //   enqueueSnackbar("Something went wrong", {
    //     variant: "error",
    //   });
    // }
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
            Item
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
              dispatch(setItemData(i));
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
              dispatch(setItemData(i));
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

      <ItemModal />

      <ImportModal
        title="Item"
        importDataHandler={handleImport}
        importHeader={importHeader}
        // loading={loadingImport}
      />

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setItem(true));
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
          dispatch(setItem(true));
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
        title={`${params?.status === "active" ? "Archive" : "Restore"} uom?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this uom?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchive}
      />
    </Stack>
  );
};

export default Item;
