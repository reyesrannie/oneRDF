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

import Autocomplete from "../../custom/AutoComplete";
import { useSystemsQuery } from "../../../services/server/api/systemAPI";
import {
  useAddItemMutation,
  useSyncItemMutation,
  useUpdateItemMutation,
} from "../../../services/server/api/item-listing/itemAPI";
import { useUomQuery } from "../../../services/server/api/item-listing/uomAPI";
import { useAccountTitleQuery } from "../../../services/server/api/accountTitleAPI";
import {
  resetSync,
  setProgressDialog,
  setProgressPercent,
} from "../../../services/server/slice/syncSlice";
import { checkObject } from "../../../services/functions/checkValues";
import Progress from "../../custom/Progress";

const ItemModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.item);
  const itemData = useSelector((state) => state.modal.itemData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const theme = useTheme();

  const [addItem, { isLoading: loadingAddType }] = useAddItemMutation();
  const [updateItem, { isLoading: loadingUpdateType }] =
    useUpdateItemMutation();
  const [syncItem, { isLoading: loadingSyncItem }] = useSyncItemMutation();

  const { data: systemData } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const { data: uomData } = useUomQuery({
    status: "active",
    pagination: "none",
  });

  const { data: accounTitleData } = useAccountTitleQuery({
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
      account_title: [],
    },
  });

  const checkHasChanged = (items) => {
    const original = itemData?.systems || [];
    const current = watch("systems") || [];

    const removed = current.filter(
      (item) =>
        !original.some((u) => u?.id?.toString() === item?.id?.toString()),
    );

    return current;
  };

  const submitHandler = async (submitData) => {
    dispatch(setProgressDialog(true));
    dispatch(setProgressPercent(0));

    const updatePayload = {
      id: itemData?.id,
      code: submitData?.code,
      description: submitData?.description,
      uom_id: submitData?.uom?.id,
      systems: submitData?.systems?.map((system) => system.id),
      account_title: submitData?.account_title?.map((acct) => acct.id),
    };

    try {
      const res =
        itemData !== null
          ? await updateItem(updatePayload).unwrap()
          : await addItem(updatePayload).unwrap();

      const systems = checkHasChanged();

      for (let i = 0; i < systems.length; i++) {
        const payloadSystems = {
          code: submitData?.code,
          description: submitData?.description,
          uom_code: submitData?.uom?.code,
          account_title: submitData?.account_title?.map((acct) => ({
            code: acct?.code,
            name: acct?.name,
          })),
          endpoint: {
            id: systems[i]?.id,
            name: systems[i]?.system_name,
            url: `${systems[i]?.backend_url}${checkObject(systems[i]?.slice)?.item}`,
            token: systems[i]?.token,
          },
        };

        const resAll = await syncItem(payloadSystems).unwrap();

        dispatch(
          setProgressPercent(Math.round(((i + 1) / systems.length) * 100)),
        );
      }

      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetSync());
      dispatch(resetModal());
    } catch (error) {
      dispatch(resetSync());
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (itemData && open) {
      const newData = {
        ...itemData,
        systems:
          itemData?.systems?.map((sys) =>
            systemData?.find((sysData) => sys?.id === sysData?.id),
          ) || [],
        account_title:
          itemData?.account_title?.map((acct) =>
            accounTitleData?.find((accData) => acct?.id === accData?.id),
          ) || [],
      };

      Object.entries(newData)?.forEach(([key, value]) => {
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
              <AppTextBox
                control={control}
                name={"code"}
                label="Code"
                error={Boolean(errors?.code)}
                helperText={errors?.code?.message}
              />
              <AppTextBox
                multiline
                control={control}
                name={"description"}
                label="Description"
                error={Boolean(errors?.description)}
                helperText={errors?.description?.message}
              />
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
                  name={"account_title"}
                  options={accounTitleData || []}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      label="Account Title"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors.account_title)}
                      helperText={errors.account_title?.message}
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
      <Progress />
    </Dialog>
  );
};

export default ItemModal;
