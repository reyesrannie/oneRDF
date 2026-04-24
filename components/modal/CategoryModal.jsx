import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme?.palette?.primary?.main,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Systems
          </Typography>

          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            onClick={() => {
              dispatch(resetModal());
            }}
          >
            <ClearOutlinedIcon
              fontSize="small"
              sx={{
                color: "#ffffff",
              }}
            />
          </IconButton>
        </DialogTitle>
      </Box>

      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Box minWidth={isTablet ? 400 : 300}>
            <Stack>
              <AppTextBox
                control={control}
                name={"name"}
                label="Category Name"
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryModal;
