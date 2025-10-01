import {
  Button,
  Dialog,
  Stack,
  useMediaQuery,
  DialogContentText,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../../services/server/slice/modalSlice";
import categoryImage from "../../../assets/svg/category.svg";
import "react-tabs/style/react-tabs.css";
import "../../styles/Modal.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";

import {
  resetSync,
  setProgressDialog,
  setProgressPercent,
} from "../../../services/server/slice/syncSlice";
import {
  useAddSynChargingMutation,
  useLazyApplySynChargingQuery,
  useSynChargingQuery,
  useUpdateSynChargingMutation,
} from "../../../services/server/api/syncingAPI";
import { useTestConnectionMutation } from "../../../services/server/request/systemAPI";
import syncDataSchema from "../../schema/syncDataSchema";
import Progress from "../../custom/Progress";
import { singleError } from "../../../services/functions/errorResponse";

const SyncOneChargingModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.sync.syncOneCharging);
  const progressPercent = useSelector((state) => state.sync.progressPercent);

  const syncOneChargingData = useSelector(
    (state) => state.sync.syncOneChargingData
  );

  const isTablet = useMediaQuery("(min-width:768px)");

  const { data: systemsSync } = useSynChargingQuery({
    status: "active",
    pagination: "none",
  });

  const [applySync] = useLazyApplySynChargingQuery();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(syncDataSchema),
    defaultValues: {
      system: [],
    },
  });

  const submitHandler = async (submitData) => {
    dispatch(setProgressDialog(true));
    const systemIds = submitData?.system || [];

    for (let i = 0; i < systemIds.length; i++) {
      try {
        await applySync({
          id: systemIds[i],
        }).unwrap();
        dispatch(
          setProgressPercent(Math.round(((i + 1) / systemIds.length) * 100))
        );
      } catch (err) {
        enqueueSnackbar(
          `Sync failed for system ${systemsSync?.find((sys) => sys?.id === systemIds[i])?.system_name}`,
          {
            variant: "error",
          }
        );
      }
    }

    enqueueSnackbar("Synced Completed!", {
      variant: "success",
    });
    dispatch(resetModal());
    dispatch(resetSync());
  };

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
        Sync One Charging
      </DialogContentText>

      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={2} flexDirection={"column"}>
            <Stack gap={2} flexDirection={"row"}>
              <Controller
                name="system"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    size="small"
                    checked={watch("system")?.length === systemsSync?.length}
                    indeterminate={
                      watch("system")?.length > 0 &&
                      watch("system")?.length < systemsSync?.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue(
                          "system",
                          systemsSync?.map((system) => system?.id)
                        );
                      } else {
                        setValue("system", []);
                      }
                    }}
                    sx={{
                      padding: 0,
                      color: "#000000",
                    }}
                  />
                )}
              />

              <Typography
                sx={{
                  fontSize: "14px",
                }}
                color="#000000"
              >
                Select all
              </Typography>
            </Stack>
            <Stack
              flexDirection="column"
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap={2}
              ml={2}
            >
              {systemsSync?.map((system, index) => {
                return (
                  <Stack
                    gap={1}
                    flexDirection="row"
                    alignItems="center"
                    key={index}
                  >
                    <Checkbox
                      size="small"
                      checked={watch("system")?.includes(system?.id)}
                      onChange={(e) => {
                        if (watch("system")?.includes(system?.id)) {
                          setValue(
                            "system",
                            watch("system").filter((id) => id !== system?.id)
                          );
                        } else {
                          setValue("system", [...watch("system"), system?.id]);
                        }
                      }}
                      sx={{
                        padding: 0,
                        color: "#000000",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                      color="#000000"
                    >
                      {system?.system_name}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack flexDirection={"row"} bottom={0} right={0} padding={2} gap={1}>
            <Button
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
            <Button
              disabled={watch("system")?.length === 0}
              variant="contained"
              loadingPosition="start"
              startIcon={<CheckOutlinedIcon />}
              color="success"
              size="small"
              type="submit"
            >
              Sync
            </Button>
          </Stack>
        </DialogActions>
      </form>
      <Progress />
    </Dialog>
  );
};

export default SyncOneChargingModal;
