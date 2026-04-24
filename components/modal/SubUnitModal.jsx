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
import AppTextBox from "../custom/AppTextBox";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

import Autocomplete from "../custom/AutoComplete";
import {
  useAddSubUnitMutation,
  useUpdateSubUnitMutation,
} from "../../services/server/api/SubUnitAPI";
import icnSchema from "../schema/icnSchema";

const SubUnitModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.subUnit);
  const subUnitData = useSelector((state) => state.modal.subUnitData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const theme = useTheme();

  const [addSubUnit, { isLoading: loadingSubUnitAdd }] =
    useAddSubUnitMutation();
  const [updateSubUnit, { isLoading: loadingSubUnitUpdate }] =
    useUpdateSubUnitMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(icnSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: subUnitData?.id,
      code: submitData?.code,
      name: submitData?.name,
      department_unit_id: submitData?.department_unit?.id,
    };
    const createPayload = {
      name: submitData?.name,
      code: submitData?.code,
      department_unit_id: submitData?.department_unit?.id,
    };

    try {
      const res =
        subUnitData !== null
          ? await updateSubUnit(updatePayload).unwrap()
          : await addSubUnit(createPayload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (subUnitData && open) {
      Object.entries(subUnitData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [subUnitData, setValue, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setCategory(false));
        subUnitData && dispatch(resetModal());
        subUnitData && reset();
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
            Sub Unit
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
            <Stack gap={2}>
              <Stack gap={2} flexDirection={"column"}>
                <AppTextBox
                  control={control}
                  name={"code"}
                  label="Code"
                  error={Boolean(errors?.code)}
                  helperText={errors?.code?.message}
                />
                <AppTextBox
                  control={control}
                  name={"name"}
                  label="Name"
                  error={Boolean(errors?.name)}
                  helperText={errors?.name?.message}
                />
              </Stack>
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
            loading={loadingSubUnitAdd || loadingSubUnitUpdate}
            disabled={watch("name") === "" || watch("code") === ""}
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

export default SubUnitModal;
