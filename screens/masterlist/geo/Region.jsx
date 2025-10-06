import {
  Box,
  Button,
  Checkbox,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import StatusFilter from "../../../components/custom/StatusFilter";
import AppSearch from "../../../components/custom/AppSearch";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setCategory,
  setCategoryData,
} from "../../../services/server/slice/modalSlice";
import CardList from "../../../components/custom/CardList";
import useParamsHook from "../../../services/hooks/useParamsHook";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import TableGrid from "../../../components/custom/TableGrid";
import {
  useArchiveCategoryMutation,
  useCategoryQuery,
} from "../../../services/server/api/categoryAPI";
import CategoryModal from "../../../components/modal/CategoryModal";
import MenuPopper from "../../../components/custom/MenuPopper";
import AppPrompt from "../../../components/custom/AppPrompt";
import warning from "../../../assets/svg/warning.svg";
import { enqueueSnackbar } from "notistack";
import { setArchive } from "../../../services/server/slice/promptSlice";
import CustomPagination from "../../../components/custom/CustomPagination";
import { useRegionQuery } from "../../../services/server/api/geoAPI";

const Region = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    params,
    onSearchData,
    onPageChange,
    onRowChange,
    onSelectPage,
    onStatusChange,
  } = useParamsHook();
  const { data, isLoading, isError, isFetching } = useRegionQuery(params);
  const isTablet = useMediaQuery("(min-width:768px)");
  const categoryData = useSelector((state) => state.modal.categoryData);

  const [archiveCategory, { isLoading: loadingArchive }] =
    useArchiveCategoryMutation();

  const header = [
    {
      name: "Name",
      alignHeader: "center",
      value: "name",
      alignValue: "center",
    },
  ];

  const onClickHandler = async () => {
    try {
      const res = await archiveCategory(categoryData).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetModal());
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
            Region
          </Typography>

          <Stack flexDirection={"row"} gap={2}>
            {/* <Button
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
                dispatch(setCategory(true));
              }}
            >
              Add
            </Button> */}
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
          border: "1px solid #1A75BB",
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
            // open={(e, i) => {
            //   dispatch(setCategoryData(i));
            //   setAnchorEl({
            //     mouseX: e.clientX,
            //     mouseY: e.clientY,
            //   });
            // }}
          />
        ) : (
          <TableGrid
            header={header}
            items={data}
            // onSelect={(e, i) => {
            //   dispatch(setCategoryData(i));
            //   setAnchorEl({
            //     mouseX: e.clientX,
            //     mouseY: e.clientY,
            //   });
            // }}
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

      <CategoryModal />
      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setCategory(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />
      <AppPrompt
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} category?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this category?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={onClickHandler}
        isLoading={loadingArchive}
      />
    </Stack>
  );
};

export default Region;
