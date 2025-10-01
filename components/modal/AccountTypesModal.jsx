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
  useAddAccountTypeMutation,
  useUpdateAccountTypeMutation,
} from "../../services/server/api/accountTypeAPI";

const AccountTypesModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.accountType);
  const accounTypeData = useSelector((state) => state.modal.accounTypeData);
  const hasRun = useSelector((state) => state.modal.hasRun);

  const isTablet = useMediaQuery("(min-width:768px)");

  const [addAccountType, { isLoading: loadingAdd }] =
    useAddAccountTypeMutation();
  const [updateAccountType, { isLoading: loadingUpdate }] =
    useUpdateAccountTypeMutation();

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
      id: accounTypeData?.id || undefined,
    };

    try {
      const res =
        accounTypeData !== null
          ? await updateAccountType(payload).unwrap()
          : await addAccountType(payload).unwrap();
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
      name: accounTypeData?.name || "",
    };

    Object.entries(newData)?.forEach(([key, value]) => {
      setValue(key, value);
    });
    dispatch(setHasRun(true));
  };

  useEffect(() => {
    if (accounTypeData !== null) {
      mapAccountTitle();
    } else {
      reset();
    }
  }, [accounTypeData]);

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

export default AccountTypesModal;
