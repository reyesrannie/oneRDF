import {
  TextField as MuiTextField,
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import AppTextBox from "./AppTextBox";
import Autocomplete from "./AutoComplete";
import SignatureBox from "./SignatureBox";
import { useRef } from "react";

const TabPanel = () => {
  const theme = useTheme();
  const signatureRef = useRef();

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

  return (
    <Stack gap={2}>
      <Stack>
        <Typography color={theme.palette.secondary.dark} fontWeight={600}>
          Employee ID
        </Typography>
        <Stack flexDirection={"row"} gap={2}>
          <Autocomplete
            // loading={loadingSedar}
            control={control}
            name={"employeeID"}
            options={[]}
            getOptionLabel={(option) => option?.general_info?.full_id_number}
            isOptionEqualToValue={(option, value) =>
              option?.general_info?.full_id_number ===
              value?.general_info?.full_id_number
            }
            // onClose={handleAutoFill}
            // componentsProps={{
            //   clearIndicator: {
            //     onClick: (event) => {
            //       reset();
            //     },
            //   },
            // }}
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
        <Typography color={theme.palette.secondary.dark} fontWeight={600}>
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

      <Stack width="100%">
        <Typography color={theme.palette.secondary.dark} fontWeight={600}>
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
  );
};

export default TabPanel;
