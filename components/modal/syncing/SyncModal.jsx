import {
  Button,
  Dialog,
  Stack,
  useMediaQuery,
  DialogContentText,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setHasRun,
} from "../../../services/server/slice/modalSlice";
import categoryImage from "../../../assets/svg/category.svg";
import "react-tabs/style/react-tabs.css";
import "../../styles/Modal.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "../../custom/AppTextBox";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";

import syncSchema from "../../schema/syncSchema";
import {
  resetSync,
  setCanConnect,
} from "../../../services/server/slice/syncSlice";
import { useSystemsQuery } from "../../../services/server/api/systemAPI";
import Autocomplete from "../../custom/AutoComplete";
import {
  useAddSynChargingMutation,
  useUpdateSynChargingMutation,
} from "../../../services/server/api/syncingAPI";
import { singleError } from "../../../services/functions/errorResponse";
import { useTestConnectionMutation } from "../../../services/server/request/systemAPI";

const SyncModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.sync.syncModal);
  const syncModalData = useSelector((state) => state.sync.syncModalData);

  const canConnect = useSelector((state) => state.sync.canConnect);
  const hasRun = useSelector((state) => state.modal.hasRun);
  const isTablet = useMediaQuery("(min-width:768px)");

  const { data: systems, isLoading: loadingSystems } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const [addSync, { isLoading: loadingAdd }] = useAddSynChargingMutation();
  const [updateSync, { isLoading: loadingUpdate }] =
    useUpdateSynChargingMutation();

  const [test, { isLoading: loadingConnection }] = useTestConnectionMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(syncSchema),
    defaultValues: {
      system_name: null,
      url_holder: "",
      token: "",
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      ...submitData,
      system_name: submitData?.system_name?.system_name,
      id: syncModalData?.id || "",
    };

    try {
      const res = syncModalData
        ? await updateSync(payload).unwrap()
        : await addSync(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      reset();
      dispatch(resetModal());
      dispatch(resetSync());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const mapSystem = () => {
    if (hasRun) return;
    const newData = {
      system_name: systems?.find(
        (sys) =>
          sys?.system_name?.toLowerCase() ===
          syncModalData?.system_name?.toLowerCase()
      ),
      url_holder: syncModalData?.url_holder || "",
      token: syncModalData?.token || "",
    };
    Object.entries(newData).forEach(([key, value]) => {
      setValue(key, value);
    });
    dispatch(setHasRun(true));
  };

  const testConnection = async () => {
    const data = getValues();
    const payload = {
      baseUrl: data?.url_holder,
      apiKey: data?.token,
    };
    try {
      const res = await test(payload).unwrap();
      dispatch(setCanConnect(true));
      enqueueSnackbar("Connected", { variant: "success" });
    } catch (error) {
      singleError("Unable to connect ", enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (syncModalData !== null) {
      mapSystem();
    } else {
      reset();
    }
  }, [syncModalData]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(resetModal());
        dispatch(resetSync());
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
              <Autocomplete
                loading={loadingSystems}
                control={control}
                name={"system_name"}
                options={systems || []}
                getOptionLabel={(option) => `${option?.system_name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="System"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.system_name)}
                    helperText={errors.system_name?.message}
                  />
                )}
              />
              <AppTextBox
                control={control}
                name={"url_holder"}
                label="API"
                error={Boolean(errors?.url_holder)}
                helperText={errors?.url_holder?.message}
              />
              <AppTextBox
                secure={watch("token") !== ""}
                type="password"
                control={control}
                name={"token"}
                label="API KEY"
                error={Boolean(errors?.token)}
                helperText={errors?.token?.message}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack flexDirection={"row"} bottom={0} right={0} padding={2} gap={1}>
            <Button
              disabled={loadingAdd || loadingUpdate || loadingConnection}
              variant="contained"
              color="error"
              size="small"
              startIcon={<ClearOutlinedIcon />}
              onClick={() => {
                reset();
                dispatch(resetModal());
                dispatch(resetSync());
              }}
            >
              Close
            </Button>
            {canConnect ? (
              <Button
                loading={loadingUpdate || loadingAdd}
                disabled={
                  watch("system_name") === null ||
                  watch("url_holder") === "" ||
                  watch("token") === ""
                }
                variant="contained"
                loadingPosition="start"
                startIcon={<CheckOutlinedIcon />}
                color="success"
                size="small"
                type="submit"
              >
                Submit
              </Button>
            ) : (
              <Button
                loading={loadingConnection}
                disabled={
                  watch("system_name") === null ||
                  watch("url_holder") === "" ||
                  watch("token") === ""
                }
                variant="contained"
                loadingPosition="start"
                startIcon={<CheckOutlinedIcon />}
                color="success"
                size="small"
                onClick={() => {
                  testConnection();
                }}
              >
                Test
              </Button>
            )}
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SyncModal;
