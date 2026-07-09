import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
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

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useGenerateOTPMutation } from "../../../services/server/api/usersAPI";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";

const GenerateOTP = ({ open, handleClose, userId }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [generatedCode, setGeneratedCode] = useState();

  const generateOTP = useSelector((state) => state.modal.generateOTP);
  const userData = useSelector((state) => state.modal.userData);

  const defaultTheme = createTheme();

  const theme = useTheme();
  const isTablet = useMediaQuery("(min-width:768px)");

  const [generateOTPMutation, { isLoading: loadingGenerate }] =
    useGenerateOTPMutation();

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
      user_id: userData?.id,
      expires_at: data?.expires_at?.toISOString(),
    };

    try {
      const res = await generateOTPMutation(payload).unwrap();
      setGeneratedCode(res?.data?.access_code);
      enqueueSnackbar("OTP generated successfully!", { variant: "success" });
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

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

                <Controller
                  control={control}
                  name="expires_at"
                  render={({ field }) => (
                    <ThemeProvider theme={defaultTheme}>
                      <DateTimePicker
                        minDateTime={dayjs()}
                        label="OTP Expiration Date"
                        value={field?.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    </ThemeProvider>
                  )}
                />
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
