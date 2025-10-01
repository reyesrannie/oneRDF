import {
  Box,
  Button,
  Dialog,
  useMediaQuery,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
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

import {
  useAddLocationMutation,
  useUpdateLocationMutation,
} from "../../services/server/api/locationAPI";
import icnSchema from "../schema/icnSchema";

const LocationModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.location);
  const view = useSelector((state) => state.modal.multipleView);
  const locationData = useSelector((state) => state.modal.locationData);
  const isTablet = useMediaQuery("(min-width:768px)");

  const [addLocation, { isLoading: loadingLocationAdd }] =
    useAddLocationMutation();
  const [updateLocation, { isLoading: loadingLocationUpdate }] =
    useUpdateLocationMutation();

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
      id: locationData?.id,
      code: submitData?.code,
      name: submitData?.name,
    };
    const createPayload = {
      name: submitData?.name,
      code: submitData?.code,
    };

    try {
      const res =
        locationData !== null
          ? await updateLocation(updatePayload).unwrap()
          : await addLocation(createPayload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (locationData && (open || view)) {
      Object.entries(locationData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [locationData, setValue, open, view]);

  return (
    <Dialog
      open={open || view}
      onClose={() => {
        dispatch(setCategory(false));
        locationData && dispatch(resetModal());
        locationData && reset();
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
              loading={loadingLocationAdd || loadingLocationUpdate}
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

export default LocationModal;
