import {
  Button,
  Dialog,
  Stack,
  useMediaQuery,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal, setHasRun } from "../../services/server/slice/modalSlice";
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

import categorySchema from "../schema/categorySchema";

import {
  useAddChargeMutation,
  useUpdateChargeMutation,
} from "../../services/server/api/accountChargingAPI";

const ChargeModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.charge);
  const chargeData = useSelector((state) => state.modal.chargeData);
  const hasRun = useSelector((state) => state.modal.hasRun);

  const isTablet = useMediaQuery("(min-width:768px)");

  const [addCharge, { isLoading: loadingAdd }] = useAddChargeMutation();
  const [updateCharge, { isLoading: loadingUpdate }] =
    useUpdateChargeMutation();

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
    const payload = {
      ...submitData,
      id: chargeData?.id || undefined,
    };

    try {
      const res =
        chargeData !== null
          ? await updateCharge(payload).unwrap()
          : await addCharge(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const mapAccountTitle = () => {
    if (hasRun) return;
    const newData = {
      name: chargeData?.name || "",
    };

    Object.entries(newData)?.forEach(([key, value]) => {
      setValue(key, value);
    });
    dispatch(setHasRun(true));
  };

  useEffect(() => {
    if (chargeData !== null) {
      mapAccountTitle();
    } else {
      reset();
    }
  }, [chargeData]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(resetModal());
      }}
    >
      <DialogContentText
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "450px",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <img
          src={categoryImage}
          alt="Password"
          draggable="false"
          className="user-modal-image"
        />
      </DialogContentText>

      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack>
            <Stack gap={2} flexDirection={"column"}>
              <AppTextBox
                control={control}
                name={"name"}
                label="Name"
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack flexDirection={"row"} bottom={0} right={0} padding={2} gap={1}>
            <Button
              disabled={loadingAdd || loadingUpdate}
              variant="contained"
              color="error"
              size="small"
              startIcon={<ClearOutlinedIcon />}
              onClick={() => {
                reset();
                dispatch(resetModal());
              }}
            >
              Close
            </Button>
            <Button
              loading={loadingAdd || loadingUpdate}
              disabled={watch("name") === ""}
              variant="contained"
              loadingPosition="start"
              startIcon={<CheckOutlinedIcon />}
              color="success"
              size="small"
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChargeModal;
