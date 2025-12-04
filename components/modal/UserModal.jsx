import {
  Box,
  Button,
  Dialog,
  Stack,
  Typography,
  useMediaQuery,
  TextField as MuiTextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  IconButton,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import "react-tabs/style/react-tabs.css";
import "../styles/Modal.scss";
import AppTextBox from "../custom/AppTextBox";
import { useForm } from "react-hook-form";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { userRoles } from "../../services/constant/systemConstants";
import { enqueueSnackbar } from "notistack";
import Autocomplete from "../custom/AutoComplete";
import {
  useStoreFileMutation,
  useSystemsQuery,
} from "../../services/server/api/systemAPI";
import {
  useCreateUserMutation,
  useCreateUserSystemsMutation,
  useUpdateUserMutation,
} from "../../services/server/api/usersAPI";
import { objectError } from "../../services/functions/errorResponse";
import { useEmployeeQuery } from "../../services/server/request/sedarAPI";
import SignatureBox from "../custom/SignatureBox";
import { base64ToFile } from "../../services/functions/saveUser";
import { checkObject } from "../../services/functions/checkValues";
import Progress from "../custom/Progress";
import MobileLoading from "../custom/MobileLoading";
import {
  resetSync,
  setProgressDialog,
  setProgressPercent,
} from "../../services/server/slice/syncSlice";

const UserModal = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const open = useSelector((state) => state.modal.user);
  const userData = useSelector((state) => state.modal.userData);
  const signatureRef = useRef(null);

  const hasRun = useRef(false);
  const isTablet = useMediaQuery("(min-width:768px)");

  const allAccess = userRoles.flatMap((role) => role.child);

  const { data: systemData, isLoading: loadingSystems } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const { data: sedarData, isLoading: loadingSedar } = useEmployeeQuery();

  const [storeFile, { isLoading: loadingStoreFile }] = useStoreFileMutation();
  const [createUser, { isLoading: loadingCreate }] = useCreateUserMutation();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const [createUserSystem, { isLoading: loadingCreateSystems }] =
    useCreateUserSystemsMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeID: null,
      id_prefix: "",
      id_no: "",
      username: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      access_permission: [],
      systems: [],
      signature: "",
    },
  });

  useEffect(() => {
    if (userData && sedarData) {
      const userAccess = userData?.access_permission?.map((item) =>
        allAccess?.find((access) => access?.value === item)
      );

      const newData = {
        ...userData,
        employeeID: sedarData?.data?.find(
          (emp) =>
            userData?.id_prefix === emp?.general_info?.prefix_id &&
            userData?.id_no === emp?.general_info?.id_number
        ),
        access_permission: userAccess,
        systems:
          userData?.user_system?.map((us) =>
            systemData?.find(
              (s) => s?.id?.toString() === us?.system_id?.toString()
            )
          ) || [],
      };

      Object.entries(newData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      reset();
    }
  }, [userData, sedarData]);

  const generateUsername = (name) => {
    if (!name) setValue("username", "");

    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return;

    const last_name = parts[parts.length - 1];
    const initials = parts
      .slice(0, -1)
      .map((n) => n[0])
      .join("");

    const username = (initials + last_name).toLowerCase();
    clearErrors();
    return username;
  };

  const checkHasChanged = () => {
    const original = userData?.user_system || [];
    const current = watch("systems") || [];
    const removed = current.filter(
      (item) =>
        !original.some((u) => u?.system_id?.toString() === item?.id?.toString())
    );
    return removed;
  };

  const submitHandler = async (data) => {
    dispatch(setProgressDialog(true));

    const image = handleSave();
    const signatureFile = image
      ? base64ToFile(
          image,
          `${data?.employeeID?.general_info?.prefix_id}_${data?.employeeID?.general_info?.id_number}_${data?.username}.png`
        )
      : "";
    const formData = new FormData();
    formData.append("file", signatureFile);

    try {
      const imageRes = image ? await storeFile(formData).unwrap() : "";

      const payload = {
        id_prefix: data?.id_prefix || "",
        id_no: data?.id_no || "",
        username: data?.username || "",
        first_name: data?.first_name || "",
        middle_name: data?.middle_name || "",
        last_name: data?.last_name || "",
        suffix: data?.suffix || "",
        id: userData?.id,
        password: userData ? null : data?.username,
        systems: data?.systems?.map((item) => ({ system_id: item?.id })) || [],
        signature: imageRes ? imageRes?.data : "",
        access_permission: data?.access_permission?.map(
          (access) => access?.value
        ),
      };
      const res = userData
        ? await updateUser(payload).unwrap()
        : await createUser(payload).unwrap();

      const systems = userData ? checkHasChanged() : data?.systems;

      for (let i = 0; i < systems.length; i++) {
        const payloadSystems = {
          id_prefix: data?.id_prefix || "",
          id_no: data?.id_no || "",
          username: data?.username || "",
          first_name: data?.first_name || "",
          middle_name: data?.middle_name || undefined,
          last_name: data?.last_name || "",
          suffix: data?.suffix || undefined,
          password: data?.username || "",
          endpoint: {
            id: systems[i]?.id,
            name: systems[i]?.system_name,
            url: checkObject(systems[i]?.slice)?.pending,
            token: systems[i]?.token,
          },
        };

        const resAll = await createUserSystem(payloadSystems).unwrap();

        dispatch(
          setProgressPercent(Math.round(((i + 1) / systems.length) * 100))
        );
      }

      enqueueSnackbar(res?.message, {
        variant: "success",
      });

      reset();
      dispatch(resetSync());
      dispatch(resetModal());
    } catch (error) {
      dispatch(resetSync());
      objectError(error, setError, enqueueSnackbar);
      dispatch(resetSync());
    }
  };

  const handleSave = () => {
    if (!signatureRef.current) return;
    if (signatureRef?.current?.isEmpty()) return null;
    const img = signatureRef?.current?.getImage();
    return img;
  };

  const handleAutoFill = () => {
    const employee = watch("employeeID");
    const newData = {
      username: generateUsername(
        `${employee?.general_info?.first_name} ${employee?.general_info?.last_name}`
      ),
      id_prefix: employee?.general_info?.prefix_id,
      id_no: employee?.general_info?.id_number,
      first_name: employee?.general_info?.first_name,
      middle_name: employee?.general_info?.middle_name,
      last_name: employee?.general_info?.last_name,
      suffix: employee?.general_info?.suffix,
    };
    Object.entries(newData)?.forEach(([key, value]) => {
      setValue(key, value);
    });
  };

  return (
    <Dialog
      open={open}
      slotProps={{
        paper: {
          sx: {
            border: `2px solid ${theme.palette.primary.main}`,
            minWidth: isTablet ? 700 : 350,
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
            Create User Account
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

        {sedarData ? (
          <form onSubmit={handleSubmit(submitHandler)}>
            <DialogContent>
              <Stack gap={2}>
                <Stack>
                  <Typography
                    color={theme.palette.secondary.dark}
                    fontWeight={600}
                  >
                    Employee ID
                  </Typography>
                  <Stack flexDirection={"row"} gap={2}>
                    <Autocomplete
                      loading={loadingSedar}
                      control={control}
                      name={"employeeID"}
                      options={sedarData?.data || []}
                      getOptionLabel={(option) =>
                        `${option?.general_info?.full_id_number} - ${option?.general_info?.first_name} ${option?.general_info?.last_name} `
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.general_info?.full_id_number ===
                        value?.general_info?.full_id_number
                      }
                      onClose={handleAutoFill}
                      componentsProps={{
                        clearIndicator: {
                          onClick: (event) => {
                            reset();
                          },
                        },
                      }}
                      minWidth={320}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label="Employee ID"
                          size="small"
                          variant="outlined"
                          error={Boolean(errors.account_code)}
                          helperText={errors.account_code?.message}
                        />
                      )}
                    />

                    <AppTextBox
                      control={control}
                      name={"username"}
                      label="Username"
                      error={Boolean(errors?.username)}
                      helperText={errors?.username?.message}
                      fullWidth
                    />
                  </Stack>
                </Stack>

                <Stack>
                  <Typography
                    color={theme.palette.secondary.dark}
                    fontWeight={600}
                  >
                    Full Name
                  </Typography>
                  <Stack flexDirection={"row"} gap={2}>
                    <AppTextBox
                      control={control}
                      name={"first_name"}
                      label="First Name"
                      error={Boolean(errors?.first_name)}
                      helperText={errors?.first_name?.message}
                      fullWidth
                      disabled
                    />
                    <AppTextBox
                      control={control}
                      name={"middle_name"}
                      label="Middle Name"
                      error={Boolean(errors?.middle_name)}
                      helperText={errors?.middle_name?.message}
                      fullWidth
                      disabled
                    />
                    <AppTextBox
                      control={control}
                      name={"last_name"}
                      label="Last Name"
                      error={Boolean(errors?.last_name)}
                      helperText={errors?.last_name?.message}
                      fullWidth
                      disabled
                    />
                    <AppTextBox
                      control={control}
                      name={"suffix"}
                      label="Suffix"
                      error={Boolean(errors?.suffix)}
                      helperText={errors?.suffix?.message}
                      disabled
                    />
                  </Stack>
                </Stack>

                <Stack>
                  <Typography
                    color={theme.palette.secondary.dark}
                    fontWeight={600}
                  >
                    All System
                  </Typography>
                  <Stack flexDirection={"row"} gap={2}>
                    <Autocomplete
                      multiple
                      control={control}
                      name={"systems"}
                      options={systemData || []}
                      getOptionLabel={(option) => `${option?.system_name}`}
                      isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                      }
                      loading={loadingSystems}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label="Systems"
                          size="small"
                          variant="outlined"
                          error={Boolean(errors?.systems)}
                          helperText={errors?.systems?.message}
                        />
                      )}
                      minWidth={"100%"}
                    />
                  </Stack>
                </Stack>

                <Stack>
                  <Typography
                    color={theme.palette.secondary.dark}
                    fontWeight={600}
                  >
                    One RDF Access
                  </Typography>
                  <Stack flexDirection={"row"} gap={2}>
                    <Autocomplete
                      multiple
                      control={control}
                      name={"access_permission"}
                      options={allAccess || []}
                      getOptionLabel={(option) => `${option?.name}`}
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      getOptionDisabled={(option) => {
                        return watch("access_permission").some(
                          (item) => item === option.value
                        );
                      }}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label="Select Access"
                          size="small"
                          variant="outlined"
                          error={Boolean(errors?.access_permission)}
                          helperText={errors?.access_permission?.message}
                        />
                      )}
                      minWidth={"100%"}
                    />
                  </Stack>
                </Stack>

                <Stack width="100%">
                  <Typography
                    color={theme.palette.secondary.dark}
                    fontWeight={600}
                  >
                    Signature
                  </Typography>

                  <Stack
                    flexDirection="row"
                    gap={2}
                    mt={1}
                    alignItems="center"
                    width="100%"
                  >
                    <SignatureBox ref={signatureRef} />
                  </Stack>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
              }}
            >
              <Button
                loading={
                  loadingCreate ||
                  loadingStoreFile ||
                  loadingSystems ||
                  loadingCreateSystems ||
                  loadingUpdate
                }
                variant="contained"
                loadingPosition="start"
                type="submit"
                disabled={
                  watch("employeeID") === null ||
                  watch("first_name") === "" ||
                  watch("last_name") === "" ||
                  watch("username") === "" ||
                  watch("id_prefix") === "" ||
                  watch("id_no") === "" ||
                  watch("systems")?.length === 0 ||
                  loadingCreate ||
                  loadingStoreFile ||
                  loadingSystems ||
                  loadingCreateSystems ||
                  loadingUpdate
                }
                color="info"
                sx={{
                  color: "#ffffff",
                  fontWeight: 410,
                  fontSize: 16,
                  minWidth: 300,
                }}
              >
                {userData ? "Update" : "Register"}
              </Button>
            </DialogActions>
          </form>
        ) : (
          <MobileLoading />
        )}
      </Box>

      <Progress />
    </Dialog>
  );
};

export default UserModal;
