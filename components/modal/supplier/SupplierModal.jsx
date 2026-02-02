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
import { useForm } from "react-hook-form";

import AppTextBox from "../../custom/AppTextBox";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import {
  useAddSuppliersMutation,
  useUpdateSuppliersMutation,
} from "../../../services/server/api/supplier/supplierAPI";
import Autocomplete from "../../custom/AutoComplete";
import { useTypeQuery } from "../../../services/server/api/supplier/typeAPI";
import { useBufferQuery } from "../../../services/server/api/supplier/bufferAPI";
import { useReferenceQuery } from "../../../services/server/api/supplier/referenceAPI";
import { useSystemsQuery } from "../../../services/server/api/systemAPI";

const SupplierModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.supplier);
  const supplierData = useSelector((state) => state.modal.supplierData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const theme = useTheme();

  const [addSupplier, { isLoading: loadingAddSupplier }] =
    useAddSuppliersMutation();
  const [updateSupplier, { isLoading: loadingUpdateSupplier }] =
    useUpdateSuppliersMutation();

  const { data: typeData, isLoading: loadingType } = useTypeQuery({
    status: "active",
    pagination: "none",
  });
  const { data: bufferData, isLoading: loadingBuffer } = useBufferQuery({
    status: "active",
    pagination: "none",
  });
  const { data: referenceData, isLoading: loadingReference } =
    useReferenceQuery({
      status: "active",
      pagination: "none",
    });

  const { data: systemsData, isLoading: loadingSystems } = useSystemsQuery({
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
      name: "",
      address: "",
      terms: "",
      supplier_type: null,
      supplier_buffer: null,
      supplier_reference: null,
      system: [],
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: supplierData?.id,
      code: submitData?.code,
      name: submitData?.name,
      address: submitData?.address,
      terms: submitData?.terms,
      supplier_type_id: submitData?.supplier_type?.id,
      supplier_buffer_id: submitData?.supplier_buffer?.id,
      supplier_reference_id: submitData?.supplier_reference?.id,
      system: submitData?.system?.map((sys) => sys.id),
    };

    try {
      const res =
        supplierData !== null
          ? await updateSupplier(updatePayload).unwrap()
          : await addSupplier(updatePayload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (supplierData && open) {
      const newData = {
        ...supplierData,
        system:
          supplierData?.supplier_system?.map((us) =>
            systemsData?.find(
              (s) => s?.id?.toString() === us?.system_id?.toString(),
            ),
          ) || [],
      };

      Object.entries(newData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [supplierData, setValue, open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setCategory(false));
        supplierData && dispatch(resetModal());
        supplierData && reset();
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
            Supplier
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
          <Box
            minWidth={isTablet ? 400 : 300}
            sx={{
              gap: 2,
            }}
            display={"flex"}
            flexDirection={"column"}
          >
            <Stack flexDirection={"row"} gap={2}>
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
            <Stack>
              <AppTextBox
                multiline
                rows={2}
                control={control}
                name={"address"}
                label="Address"
                error={Boolean(errors?.address)}
                helperText={errors?.address?.message}
              />
            </Stack>

            <Stack flexDirection={"row"} gap={2}>
              <AppTextBox
                control={control}
                name={"terms"}
                label="Terms"
                error={Boolean(errors?.terms)}
                helperText={errors?.terms?.message}
                type="number"
                onKeyUp={(e) => {
                  if (e.key.toLowerCase() === "e") {
                    e.preventDefault();
                  }
                  if (e.target.value > 365) {
                    enqueueSnackbar("Terms cannot be more than 365 days", {
                      variant: "warning",
                    });
                  }
                }}
              />
              <Autocomplete
                control={control}
                name={"supplier_type"}
                options={typeData || []}
                getOptionLabel={(option) => `${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                loading={loadingType}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Supplier Type"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors?.supplier_type)}
                    helperText={errors?.supplier_type?.message}
                  />
                )}
                minWidth={231}
              />
            </Stack>
            <Stack flexDirection={"row"} gap={2}>
              <Autocomplete
                control={control}
                name={"supplier_buffer"}
                options={bufferData || []}
                getOptionLabel={(option) => `${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                loading={loadingBuffer}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Buffer Severity"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors?.supplier_buffer)}
                    helperText={errors?.supplier_buffer?.message}
                  />
                )}
                minWidth={231}
              />
              <Autocomplete
                control={control}
                name={"supplier_reference"}
                options={referenceData || []}
                getOptionLabel={(option) => `${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                loading={loadingReference}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Reference"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors?.supplier_reference)}
                    helperText={errors?.supplier_reference?.message}
                  />
                )}
                minWidth={231}
              />
            </Stack>
            <Stack flexDirection={"row"} gap={2}>
              <Autocomplete
                multiple
                control={control}
                name={"system"}
                options={systemsData || []}
                getOptionLabel={(option) => `${option?.system_name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                loading={loadingSystems}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="System"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors?.system)}
                    helperText={errors?.system?.message}
                  />
                )}
                minWidth={"100%"}
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
            loading={loadingAddSupplier || loadingUpdateSupplier}
            variant="contained"
            loadingPosition="start"
            type="submit"
            disabled={
              watch("code") === "" ||
              watch("name") === "" ||
              watch("system")?.length === 0 ||
              watch("terms") === "" ||
              watch("terms") > 365 ||
              watch("supplier_reference") === null ||
              watch("supplier_type") === null ||
              loadingAddSupplier ||
              loadingUpdateSupplier
            }
            color="info"
            sx={{
              color: "#ffffff",
              fontWeight: 410,
              fontSize: 16,
              minWidth: 300,
            }}
          >
            {supplierData ? "Update" : "Register"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierModal;
