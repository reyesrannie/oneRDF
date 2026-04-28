import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setCategory,
} from "../../../services/server/slice/modalSlice";
import "react-tabs/style/react-tabs.css";
import "../../styles/Modal.scss";
import { Controller, useForm } from "react-hook-form";

import AppTextBox from "../../custom/AppTextBox";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import {
  useAddUomMutation,
  useUomQuery,
  useUpdateUomMutation,
} from "../../../services/server/api/item-listing/bufferAPI";
import Autocomplete from "../../custom/AutoComplete";
import { useSystemsQuery } from "../../../services/server/api/systemAPI";

const ItemModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.item);
  const itemData = useSelector((state) => state.modal.itemData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const theme = useTheme();

  const [addUom, { isLoading: loadingAddType }] = useAddUomMutation();
  const [updateUom, { isLoading: loadingUpdateType }] = useUpdateUomMutation();

  const { data: systemData } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const { data: uomData } = useUomQuery({
    status: "active",
    pagination: "none",
  });

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
      uom: null,
      systems: [],
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: itemData?.id,
      code: submitData?.code,
      description: submitData?.description,
      is_integer: submitData?.is_integer,
    };

    try {
      const res =
        itemData !== null
          ? await updateUom(updatePayload).unwrap()
          : await addUom(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (itemData && open) {
      Object.entries(itemData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      reset();
    }
  }, [itemData, setValue, open]);

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
            Item
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
              <Stack gap={2} flexDirection={"row"}>
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
              <Stack gap={2} flexDirection={"row"}>
                <Box flex={1}>
                  <Autocomplete
                    loading={true}
                    control={control}
                    name={"uom"}
                    options={uomData || []}
                    getOptionLabel={(option) =>
                      `${option.code} - ${option.description}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        label="Uom"
                        size="small"
                        variant="outlined"
                        error={Boolean(errors.uom)}
                        helperText={errors.uom?.message}
                      />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Autocomplete
                    loading={true}
                    multiple
                    control={control}
                    name={"systems"}
                    options={systemData || []}
                    getOptionLabel={(option) => `${option.system_name}`}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        label="System"
                        size="small"
                        variant="outlined"
                        error={Boolean(errors.systems)}
                        helperText={errors.systems?.message}
                      />
                    )}
                  />
                </Box>
              </Stack>
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
              watch("description") === "" ||
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
            {itemData ? "Update" : "Register"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ItemModal;
