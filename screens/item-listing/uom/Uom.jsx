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
  setUom,
  setUomData,
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
  useArchiveUomMutation,
  useUomQuery,
} from "../../../services/server/api/item-listing/bufferAPI";
import UomModal from "../../../components/modal/item-listing/UomModal";

const Uom = () => {
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
  const { data, isLoading, isError, isFetching } = useUomQuery(params);
  const isTablet = useMediaQuery("(min-width:768px)");

  const uomData = useSelector((state) => state.modal.uomData);
  const archive = useSelector((state) => state.prompt.archive);

  const [archiveUom, { isLoading: loadingArchive }] = useArchiveUomMutation();

  const header = [
    {
      name: "ID",
      value: "id",
    },
    {
      name: "Name",
      value: "name",
    },
    {
      name: params.status === "inactive" ? "Deleted At" : "Date Modified",
      value: params.status === "inactive" ? "deleted_at" : "updated_at",
      uom: "date",
    },
  ];

  const onClickHandler = async () => {
    try {
      const res = await archiveUom(uomData).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {}
  };

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
            Uom
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
                dispatch(setUom(true));
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
              dispatch(setUomData(i));
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
              dispatch(setUomData(i));
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

      <UomModal />
      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setUom(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
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

export default Uom;
