import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  TextField as MuiTextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import userImage from "../../assets/svg/add-user.svg";
import "react-tabs/style/react-tabs.css";
import "../styles/Modal.scss";
import AppTextBox from "../custom/AppTextBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import accountSchema from "../schema/accountSchema";
import { userRoles } from "../../services/constant/systemConstants";
import { enqueueSnackbar } from "notistack";
import Autocomplete from "../custom/AutoComplete";
import { useSystemsQuery } from "../../services/server/api/systemAPI";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../services/server/api/usersAPI";
import { objectError } from "../../services/functions/errorResponse";

const UserModal = () => {
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const open = useSelector((state) => state.modal.user);
  const mode = useSelector((state) => state.theme.mode);
  const userData = useSelector((state) => state.modal.userData);

  const hasRun = useRef(false);
  const isTablet = useMediaQuery("(min-width:768px)");

  const { data: systemData, isLoading: loadingSystems } = useSystemsQuery({
    status: "active",
    pagination: "none",
  });

  const [createUser, { isLoading: loadingCreate }] = useCreateUserMutation();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

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
    resolver: yupResolver(accountSchema),
    defaultValues: {
      name: "",
      username: "",
      access_permission: [],
      systems: [],
    },
  });

  useEffect(() => {
    if (userData) {
      const validAccessValues = userRoles?.flatMap((role) =>
        role?.child?.map((child) => child.value.trim())
      );
      const filteredAccess = userData?.access_permission
        .map((item) => item.trim())
        .filter((item) => validAccessValues.includes(item));

      const newData = {
        ...userData,
        access_permission: filteredAccess,
        systems: systemData?.filter((item) =>
          userData?.access_permission?.includes(item?.system_name)
        ),
      };

      Object.entries(newData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [hasRun, userData, setValue]);

  const generateUsername = () => {
    const name = watch("name");
    if (!name) setValue("username", "");

    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return;

    const lastName = parts[parts.length - 1];
    const initials = parts
      .slice(0, -1)
      .map((n) => n[0])
      .join("");

    const username = (initials + lastName).toLowerCase();
    clearErrors();
    setValue("username", username);
  };

  const handleCheckBox = (value) => {
    const currentValue = watch("access_permission") || [];
    if (currentValue.includes(value)) {
      setValue(
        "access_permission",
        currentValue.filter((v) => v !== value)
      );
    } else {
      setValue("access_permission", [...currentValue, value]);
    }
  };

  const handleCheckBoxAll = (values) => {
    const currentValue = watch("access_permission") || [];
    const checkValue = values?.every((access) =>
      currentValue.includes(access?.value)
    );
    const allValues = values?.map((access) => access?.value);
    if (checkValue) {
      const newValue = currentValue.filter(
        (v) => !values?.some((access) => access?.value === v)
      );
      setValue("access_permission", newValue);
    } else {
      setValue(
        "access_permission",
        Array.from(new Set([...currentValue, ...allValues]))
      );
    }
  };

  const submitHandler = async (data) => {
    if (watch("access_permission").length === 0) {
      enqueueSnackbar("Please select at least one permission", {
        variant: "error",
      });
    }
    const combinedPermissions = [
      ...(data?.access_permission || []),
      ...(data?.systems?.map((item) => item?.system_name) || []),
    ];

    const payload = {
      id: userData?.id,
      full_name: data?.name,
      access_permission: data?.access_permission,
      username: data?.username,
      systems: data?.systems?.map((item) => ({ system_id: item?.id })) || [],
      password: userData ? null : data?.username,
    };

    try {
      const res = userData
        ? await updateUser(payload).unwrap()
        : await createUser(payload).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Dialog open={open}>
      <Box minWidth={isTablet ? 600 : 350} height={800} padding={2}>
        <DialogTitle>
          <Stack display="flex" alignItems="center">
            <img
              src={userImage}
              alt="Password"
              draggable="false"
              className="user-modal-image"
            />
          </Stack>
        </DialogTitle>

        <form onSubmit={handleSubmit(submitHandler)}>
          <DialogContent>
            <Stack gap={1}>
              <Stack>
                <Typography
                  color={mode === "light" ? "#000000" : "textPrimary"}
                >
                  Profile
                </Typography>
                <Divider />
              </Stack>
              <Stack gap={2} flexDirection={"row"} width={"100%"}>
                <AppTextBox
                  control={control}
                  name={"name"}
                  label="Name"
                  onKeyUp={() => {
                    generateUsername();
                  }}
                  fullWidth
                  error={Boolean(errors?.name)}
                  helperText={errors?.name?.message}
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
              <Stack>
                <Typography
                  color={mode === "light" ? "#000000" : "textPrimary"}
                >
                  Access
                </Typography>
                <Divider />
              </Stack>
              <Stack gap={1}>
                {userRoles?.map((roles, index) => {
                  return (
                    <Accordion
                      expanded={expandedIndex === index}
                      key={index}
                      onChange={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      <AccordionSummary>
                        <Stack flexDirection={"row"} alignItems="center">
                          <Checkbox
                            checked={roles?.child?.every((access) =>
                              watch("access_permission")?.includes(
                                access?.value
                              )
                            )}
                            indeterminate={
                              roles?.child?.some((access) =>
                                watch("access_permission")?.includes(
                                  access?.value
                                )
                              ) &&
                              !roles?.child?.every((access) =>
                                watch("access_permission")?.includes(
                                  access?.value
                                )
                              )
                            }
                            onChange={() => handleCheckBoxAll(roles?.child)}
                          />
                          <Typography
                            color={mode === "light" ? "#ffffff" : "textPrimary"}
                          >
                            {roles?.name}
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          ml={2}
                          display="grid"
                          gridTemplateColumns="repeat(2, minmax(150px, 1fr))"
                          rowGap={1}
                          columnGap={2}
                        >
                          {roles?.child?.map((permissions, i) => {
                            return (
                              <Box key={i} display="flex" alignItems="center">
                                <Checkbox
                                  checked={watch("access_permission")?.includes(
                                    permissions?.value
                                  )}
                                  onChange={() =>
                                    handleCheckBox(permissions?.value)
                                  }
                                />
                                <Typography
                                  color={
                                    mode === "light" ? "#ffffff" : "textPrimary"
                                  }
                                >
                                  {permissions?.name}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
                {errors?.access_permission && (
                  <Typography color="error" sx={{ fontSize: 12 }}>
                    {errors?.access_permission?.message}
                  </Typography>
                )}
              </Stack>
              <Stack>
                <Typography
                  color={mode === "light" ? "#000000" : "textPrimary"}
                >
                  Systems
                </Typography>
                <Divider />
              </Stack>
              <Stack>
                <Autocomplete
                  multiple
                  control={control}
                  name={"systems"}
                  options={systemData || []}
                  getOptionLabel={(option) => `${option.system_name}`}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  getOptionDisabled={(option) => {
                    const selected = control._formValues?.systems || [];
                    return selected.some((item) => item.id === option.id);
                  }}
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
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack flexDirection={"row"} padding={2} gap={1}>
              <Button
                variant="contained"
                color="error"
                startIcon={<ClearOutlinedIcon />}
                onClick={() => {
                  reset();
                  dispatch(resetModal());
                }}
              >
                Close
              </Button>
              <Button
                loading={loadingCreate || loadingUpdate}
                variant="contained"
                loadingPosition="start"
                startIcon={<CheckOutlinedIcon />}
                color="success"
                type="submit"
              >
                {userData ? "Update" : "Create"}
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
};

export default UserModal;
