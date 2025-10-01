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
import AppTextBox from "../custom/AppTextBox";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

import {
  useAddDepartmentUnitMutation,
  useUpdateDeparmentUnitMutation,
} from "../../services/server/api/departmentUnitAPI";
import icnSchema from "../schema/icnSchema";

const DepartmentUnitModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.departmentUnit);
  const departmentUnitData = useSelector(
    (state) => state.modal.departmentUnitData
  );
  const isTablet = useMediaQuery("(min-width:768px)");

  const [addDepartmentUnit, { isLoading: loadingDepartmentAdd }] =
    useAddDepartmentUnitMutation();
  const [updateDepartmentUnit, { isLoading: loadingDepartmentUpdate }] =
    useUpdateDeparmentUnitMutation();

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
      id: departmentUnitData?.id,
      code: submitData?.code,
      name: submitData?.name,
    };
    const createPayload = {
      name: submitData?.name,
      code: submitData?.code,
    };

    try {
      const res =
        departmentUnitData !== null
          ? await updateDepartmentUnit(updatePayload).unwrap()
          : await addDepartmentUnit(createPayload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (departmentUnitData && open) {
      Object.entries(departmentUnitData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [departmentUnitData, setValue, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setCategory(false));
        departmentUnitData && dispatch(resetModal());
        departmentUnitData && reset();
      }}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <Box minWidth={isTablet ? 400 : 300} padding={2}>
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
              loading={loadingDepartmentAdd || loadingDepartmentUpdate}
              disabled={watch("name") === "" || watch("code") === ""}
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

export default DepartmentUnitModal;
