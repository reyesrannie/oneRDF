import {
  Box,
  Button,
  Dialog,
  Stack,
  useMediaQuery,
  TextField as MuiTextField,
  DialogTitle,
  Typography,
  IconButton,
  useTheme,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setCategory,
} from "../../services/server/slice/modalSlice";
import categoryImage from "../../assets/svg/category.svg";
import "react-tabs/style/react-tabs.css";
import "../styles/Modal.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "../custom/AppTextBox";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

import Autocomplete from "../custom/AutoComplete";
import { useLazyBusinessUnitQuery } from "../../services/server/api/businessUnitAPI";
import { useLazyDepartmentQuery } from "../../services/server/api/departmentAPI";
import {
  useCompanyQuery,
  useLazyCompanyQuery,
} from "../../services/server/api/companyAPI";
import { useLazyDepartmentUnitQuery } from "../../services/server/api/departmentUnitAPI";
import { useLazySubUnitQuery } from "../../services/server/api/SubUnitAPI";
import { useLazyLocationQuery } from "../../services/server/api/locationAPI";

import {
  useAddCoaMutation,
  useUpdateCoaMutation,
} from "../../services/server/api/coaAPI";
import coaSchema from "../schema/coaSchema";

const CoaModal = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.coa);
  const coaData = useSelector((state) => state.modal.coaData);
  const hasExecuted = useRef();

  const companyList = useSelector((state) => state.values.companyData);
  const businessList = useSelector((state) => state.values.businessData);
  const departmentList = useSelector((state) => state.values.departmentData);
  const unitList = useSelector((state) => state.values.unitData);
  const subUnitList = useSelector((state) => state.values.subUnitData);
  const locationList = useSelector((state) => state.values.locationData);

  const [addCoa, { isLoading: loadingCoaAdd }] = useAddCoaMutation();
  const [updateCoa, { isLoading: loadingCoaUpdate }] = useUpdateCoaMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(coaSchema),
    defaultValues: {
      company: null,
      business_unit: null,
      department: null,
      unit: null,
      sub_unit: null,
      location: null,
      name: "",
      code: "",
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: coaData?.id,
      code: submitData?.code,
      name: submitData?.name,
      company_id: submitData?.company?.id,
      business_unit_id: submitData?.business_unit?.id,
      department_id: submitData?.department?.id,
      department_unit_id: submitData?.unit?.id,
      sub_unit_id: submitData?.sub_unit?.id,
      location_id: submitData?.location?.id,
    };
    const createPayload = {
      name: submitData?.name,
      code: submitData?.code,
      company_id: submitData?.company?.id,
      business_unit_id: submitData?.business_unit?.id,
      department_id: submitData?.department?.id,
      department_unit_id: submitData?.unit?.id,
      sub_unit_id: submitData?.sub_unit?.id,
      location_id: submitData?.location?.id,
    };
    try {
      coaData !== null
        ? await updateCoa(updatePayload).unwrap()
        : await addCoa(createPayload).unwrap();
      enqueueSnackbar(
        coaData !== null
          ? "Successfully updated the data"
          : "Successfully created data",
        { variant: "success" },
      );
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (coaData && open) {
      const newValue = {
        code: coaData?.code,
        name: coaData?.name,
        company: companyList?.find(
          (item) => item?.code === coaData?.company_code,
        ),
        business_unit: businessList?.find(
          (item) => item?.code === coaData?.business_unit_code,
        ),
        department: departmentList?.find(
          (item) => item?.code === coaData?.department_code,
        ),
        unit: unitList?.find((item) => item?.code === coaData?.unit_code),
        sub_unit: subUnitList?.find(
          (item) => item?.code === coaData?.sub_unit_code,
        ),
        location: locationList?.find(
          (item) => item?.code === coaData?.location_code,
        ),
      };

      Object.entries(newValue)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [coaData, open]);

  return (
    <Dialog
      open={open}
      slotProps={{
        paper: {
          sx: {
            border: `2px solid ${theme.palette.primary.main}`,
            minWidth: { sx: "unset", md: 400 },
          },
        },
      }}
      onClose={() => {
        dispatch(setCategory(false));
        hasExecuted.current = false;
        coaData && dispatch(resetModal());
        coaData && reset();
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
            fontSize: 18,
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
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={2}>
            <Stack gap={2} flexDirection={"column"}>
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
              <Autocomplete
                control={control}
                name={"company"}
                options={companyList || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Company"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.company)}
                    helperText={errors.company?.message}
                  />
                )}
              />
              <Autocomplete
                control={control}
                name={"business_unit"}
                options={businessList || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Business Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.business_unit)}
                    helperText={errors.business_unit?.message}
                  />
                )}
              />
              <Autocomplete
                control={control}
                name={"department"}
                options={departmentList || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Department"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.department)}
                    helperText={errors.department?.message}
                  />
                )}
              />
              <Autocomplete
                control={control}
                name={"unit"}
                options={unitList || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.unit)}
                    helperText={errors.unit?.message}
                  />
                )}
              />
              <Autocomplete
                control={control}
                name={"sub_unit"}
                options={subUnitList || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Sub Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.sub_unit)}
                    helperText={errors.sub_unit?.message}
                  />
                )}
              />
              <Autocomplete
                control={control}
                name={"location"}
                options={locationList || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Location"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.location)}
                    helperText={errors.location?.message}
                  />
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
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
            loading={loadingCoaAdd || loadingCoaUpdate}
            disabled={
              watch("name") === "" ||
              watch("code") === "" ||
              watch("company") === null ||
              watch("business_unit") === null ||
              watch("department") === null ||
              watch("unit") === null ||
              watch("sub_unit") === null ||
              watch("location") === null
            }
            variant="contained"
            loadingPosition="start"
            startIcon={<CheckOutlinedIcon />}
            color="success"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CoaModal;
