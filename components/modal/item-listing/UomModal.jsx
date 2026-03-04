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
} from "../../../services/server/slice/modalSlice";
import "react-tabs/style/react-tabs.css";
import "../../styles/Modal.scss";
import { useForm } from "react-hook-form";

import AppTextBox from "../../custom/AppTextBox";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import {
  useAddUomMutation,
  useUpdateUomMutation,
} from "../../../services/server/api/item-listing/bufferAPI";

const UomModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.uom);
  const uomData = useSelector((state) => state.modal.uomData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const theme = useTheme();

  const [addUom, { isLoading: loadingAddType }] = useAddUomMutation();
  const [updateUom, { isLoading: loadingUpdateType }] = useUpdateUomMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      description: "",
      is_integer: false,
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: uomData?.id,
      code: submitData?.code,
      description: submitData?.description,
      is_integer: submitData?.is_integer,
    };
    try {
      const res =
        uomData !== null
          ? await updateUom(updatePayload).unwrap()
          : await addUom(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (uomData && open) {
      Object.entries(uomData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      reset();
    }
  }, [uomData, setValue, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        dispatch(resetModal());
      }}
      slotProps={{
        paper: {
          sx: {
            border: `2px solid ${theme.palette.primary.main}`,
          },
        },
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
            Uom
          </Typography>

          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            onClick={() => {
              reset();
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
              <AppTextBox
                control={control}
                name={"code"}
                label="Code"
                error={Boolean(errors?.code)}
                helperText={errors?.code?.message}
              />
              <AppTextBox
                control={control}
                name={"description"}
                label="Description"
                error={Boolean(errors?.description)}
                helperText={errors?.description?.message}
              />
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            loading={loadingAddType || loadingUpdateType}
            variant="contained"
            loadingPosition="start"
            type="submit"
            disabled={
              watch("code") === "" ||
              watch("description") ||
              loadingAddType ||
              loadingUpdateType
            }
            color="info"
            sx={{
              color: "#ffffff",
              fontWeight: 410,
              fontSize: 16,
              minWidth: 300,
            }}
          >
            {uomData ? "Update" : "Register"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UomModal;
