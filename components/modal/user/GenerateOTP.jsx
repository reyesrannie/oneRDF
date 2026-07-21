import React, { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField as MuiTextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Stack,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../../services/server/slice/modalSlice";
import { Controller, useForm } from "react-hook-form";

import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import {
  useGenerateOTPMutation,
  useUserQuery,
} from "../../../services/server/api/usersAPI";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import Autocomplete from "../../custom/AutoComplete";
import useParamsHook from "../../../services/hooks/useParamsHook";
import { handleScroll } from "../../../services/functions/reusableFunction";

const GenerateOTP = ({ open, handleClose, userId }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [generatedCode, setGeneratedCode] = useState();
  const [isPickerOpen, setIsPickerOpen] = useState();

  const generateOTP = useSelector((state) => state.modal.generateOTP);
  const userData = useSelector((state) => state.modal.userData);
  const usersData = useSelector((state) => state.values.usersData);

  const defaultTheme = createTheme();

  const debounceTimeout = useRef(null);

  const theme = useTheme();
  const isTablet = useMediaQuery("(min-width:768px)");

  const {
    params,
    onSearchData,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSelectPage,
    onSort,
    onReset,
  } = useParamsHook();

  const [generateOTPMutation, { isLoading: loadingGenerate }] =
    useGenerateOTPMutation();

  const {
    data: allData,
    isLoading: loadingUsers,
    isError: errorAll,
  } = useUserQuery(params);

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
      requested_by_id: null,
      user_id: "",
      expires_at: null,
    },
  });

  const handleCopy = async () => {
    if (!generatedCode) return;

    try {
      await navigator?.clipboard?.writeText(generatedCode);
      enqueueSnackbar(`OTP copied to clipboard!`, {
        variant: "success",
      });
      setGeneratedCode();
      dispatch(resetModal());
    } catch (error) {
      enqueueSnackbar("Failed to copy OTP to clipboard.", {
        variant: "error",
      });
    }
  };

  const handleGenerateOTP = async (data) => {
    const payload = {
      requested_by_id: data?.requested_by_id?.id,
      user_id: userData?.id,
      expires_at: data?.expires_at?.format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      const res = await generateOTPMutation(payload).unwrap();
      setGeneratedCode(res?.data?.access_code);
      enqueueSnackbar("OTP generated successfully!", { variant: "success" });
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const getValue = useCallback((e, func) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      func(e.target.value);
    }, 500);
  }, []);

  return (
    <Dialog
      open={generateOTP}
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
            One-Time Password
          </Typography>

          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            onClick={() => {
              reset();
              setGeneratedCode();
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
        <form onSubmit={handleSubmit(handleGenerateOTP)}>
          {generatedCode && (
            <DialogContent sx={{ textAlign: "center", pb: 1 }}>
              <Stack>
                <DialogContentText>
                  Your One-Time Password is:
                </DialogContentText>
                <DialogContentText variant="h6" fontWeight={600}>
                  {generatedCode}
                </DialogContentText>
                <DialogContentText>
                  Copy this OTP and use it to securely access the account. It
                  will expire at the specified time. It will not be shown again
                  for security reasons.
                </DialogContentText>
              </Stack>
            </DialogContent>
          )}
          {!generatedCode && (
            <DialogContent sx={{ textAlign: "center", pb: 1 }}>
              <Stack>
                <DialogContentText>
                  Generate a One-Time Password to securely access this account.
                </DialogContentText>
                <DialogContentText color="warning" fontWeight={600}>
                  {`${userData?.id_prefix}-${userData?.id_no} - ${userData?.first_name} ${userData?.last_name}`}
                </DialogContentText>
                <Stack gap={2}>
                  <Autocomplete
                    control={control}
                    name={"requested_by_id"}
                    options={usersData || []}
                    getOptionLabel={(option) =>
                      `${option?.id_prefix}-${option?.id_no} - ${option?.first_name} ${option?.last_name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    loading={loadingUsers}
                    scrollChange={(e) =>
                      handleScroll(e, () => onSelectPage(params?.page + 1))
                    }
                    onKeyUp={(e) => {
                      console.log(e);

                      if (e?.target?.value === "") {
                        onReset();
                      } else {
                        getValue(e, onSearchData);
                      }
                    }}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        label="Requested By"
                        size="small"
                        variant="outlined"
                        error={Boolean(errors?.requested_by_id)}
                        helperText={errors?.requested_by_id?.message}
                      />
                    )}
                    minWidth={"100%"}
                  />

                  <Controller
                    control={control}
                    name="expires_at"
                    render={({ field }) => (
                      <MobileDateTimePicker
                        {...field}
                        label="OTP Expiration Date"
                        minDateTime={dayjs()}
                        referenceDate={dayjs().add(5, "minute")}
                        slotProps={{
                          textField: {
                            sx: {
                              input: { color: "#FF5722", fontSize: ".8rem" },
                              "& .MuiInputBase-root": {
                                height: "46px",
                              },
                            },
                          },
                          mobilePaper: {
                            sx: {
                              color: "#000000",
                              "& .MuiPickersDay-root": {
                                color: "#000000",
                              },
                              "& .MuiPickersDay-root.Mui-selected": {
                                color: "#000000",
                              },
                              "& .MuiClockNumber-root": {
                                color: "#000000",
                              },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
              </Stack>
            </DialogContent>
          )}

          <DialogActions
            sx={{
              justifyContent: "center",
            }}
          >
            {!generatedCode && (
              <Button
                loading={loadingGenerate}
                variant="contained"
                loadingPosition="start"
                type="submit"
                disabled={watch("expires_at") === null}
                color="info"
                sx={{
                  color: "#ffffff",
                  fontWeight: 410,
                  fontSize: 16,
                  minWidth: 300,
                }}
              >
                {loadingGenerate ? "Generating..." : "Generate"}
              </Button>
            )}
            {generatedCode && (
              <Button
                loading={loadingGenerate}
                variant="contained"
                loadingPosition="start"
                onClick={() => handleCopy()}
                color="info"
                sx={{
                  color: "#ffffff",
                  fontWeight: 410,
                  fontSize: 16,
                  minWidth: 300,
                }}
              >
                Copy OTP
              </Button>
            )}
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
};

export default GenerateOTP;
