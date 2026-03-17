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
  setColumn,
} from "../../../services/server/slice/modalSlice";
import "react-tabs/style/react-tabs.css";
import "../../styles/Modal.scss";
import { useForm } from "react-hook-form";

import AppTextBox from "../../custom/AppTextBox";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import {
  useAddColumnMutation,
  useUpdateColumnMutation,
} from "../../../services/server/api/masterlist/columnAPI";

const ColumnModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.column);
  const columnData = useSelector((state) => state.modal.columnData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const theme = useTheme();

  const [addColumn, { isLoading: loadingColumn }] = useAddColumnMutation();
  const [updateColumn, { isLoading: loadingUpdateColumn }] =
    useUpdateColumnMutation();

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
      name: "",
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: columnData?.id,
      name: submitData?.name,
    };

    try {
      const res =
        columnData !== null
          ? await updateColumn(updatePayload).unwrap()
          : await addColumn(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (columnData && open) {
      setValue("name", columnData?.name);
    } else {
      reset();
    }
  }, [columnData, setValue, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setColumn(false));
        columnData && dispatch(resetModal());
        columnData && reset();
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
            Column
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
            <Stack>
              <AppTextBox
                control={control}
                name={"name"}
                label="Name"
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
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
            loading={loadingColumn || loadingUpdateColumn}
            variant="contained"
            loadingPosition="start"
            type="submit"
            disabled={
              watch("name") === "" || loadingColumn || loadingUpdateColumn
            }
            color="info"
            sx={{
              color: "#ffffff",
              fontWeight: 410,
              fontSize: 16,
              minWidth: 300,
            }}
          >
            {columnData ? "Update" : "Register"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ColumnModal;
