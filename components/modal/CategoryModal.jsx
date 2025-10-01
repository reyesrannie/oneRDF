import { Box, Button, Dialog, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setCategory,
} from "../../services/server/slice/modalSlice";
import categoryImage from "../../assets/svg/category.svg";
import "react-tabs/style/react-tabs.css";
import "../styles/Modal.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import categorySchema from "../schema/categorySchema";
import AppTextBox from "../custom/AppTextBox";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../services/server/api/categoryAPI";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

const CategoryModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.category);
  const categoryData = useSelector((state) => state.modal.categoryData);
  const isTablet = useMediaQuery("(min-width:768px)");

  const [addCategory, { isLoading: loadingAddCategory }] =
    useAddCategoryMutation();
  const [updateCategory, { isLoading: loadingUpdateCategory }] =
    useUpdateCategoryMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: categoryData?.id,
      name: submitData?.name,
    };
    try {
      const res =
        categoryData !== null
          ? await updateCategory(updatePayload).unwrap()
          : await addCategory(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (categoryData && open) {
      setValue("name", categoryData?.name);
    }
  }, [categoryData, setValue, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setCategory(false));
        categoryData && dispatch(resetModal());
        categoryData && reset();
      }}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <Box minWidth={isTablet ? 400 : 300} minHeight={100} padding={2}>
          <Stack gap={2} mb={3}>
            <Stack display="flex" alignItems="center" gap={1}>
              <img
                src={categoryImage}
                alt="Password"
                draggable="false"
                className="user-modal-image"
              />
            </Stack>
            <Stack
              gap={2}
              flexDirection={"column"}
              sx={{
                mb: 5,
              }}
            >
              <AppTextBox
                control={control}
                name={"name"}
                label="Category Name"
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
            </Stack>
          </Stack>
          <Stack
            position={"absolute"}
            flexDirection={"row"}
            bottom={0}
            right={0}
            padding={2}
            gap={1}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<ClearOutlinedIcon />}
              onClick={() => {
                reset();
                dispatch(resetModal());
              }}
            >
              Close
            </Button>
            <Button
              loading={loadingAddCategory || loadingUpdateCategory}
              disabled={watch("name") === ""}
              variant="contained"
              loadingPosition="start"
              startIcon={<CheckOutlinedIcon />}
              color="success"
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </form>
    </Dialog>
  );
};

export default CategoryModal;
